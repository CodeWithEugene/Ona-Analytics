import { query } from "@/lib/db"
import { NextResponse } from "next/server"
import { requireAuth, unauthorized, forbidden, getOrgId, getUserId, logAudit } from "@/lib/api-auth"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"
import { logger } from "@/lib/log"

const predictLimiter = createRateLimiter({ interval: 60000, maxRequests: 5 })

/**
 * Simple exponential smoothing forecast.
 * Uses historical actual_values to generate predicted_values for future dates.
 *
 * Algorithm: Holt-Winters-like with level + trend components
 * - alpha (level): 0.3 — responsive to recent changes
 * - beta (trend): 0.1 — gentle trend adjustment
 */
function exponentialSmoothing(
  historicalValues: number[],
  forecastDays: number
): number[] {
  if (historicalValues.length === 0) return []
  if (historicalValues.length === 1) {
    return Array(forecastDays).fill(historicalValues[0])
  }

  const alpha = 0.3
  const beta = 0.1

  // Initialize level and trend
  let level = historicalValues[0]
  let trend = historicalValues.length > 1
    ? (historicalValues[historicalValues.length - 1] - historicalValues[0]) /
      Math.max(historicalValues.length - 1, 1)
    : 0

  // Smooth over historical data
  for (let i = 1; i < historicalValues.length; i++) {
    const lastLevel = level
    level = alpha * historicalValues[i] + (1 - alpha) * (level + trend)
    trend = beta * (level - lastLevel) + (1 - beta) * trend
  }

  // Generate forecasts
  const forecasts: number[] = []
  for (let i = 1; i <= forecastDays; i++) {
    const forecast = Math.max(0, Math.min(100, level + i * trend))
    forecasts.push(Math.round(forecast * 10) / 10)
  }

  return forecasts
}

/**
 * Simple moving average baseline for comparison.
 */
function movingAverage(
  historicalValues: number[],
  forecastDays: number,
  windowSize: number = 7
): number[] {
  if (historicalValues.length === 0) return []

  const recent = historicalValues.slice(-windowSize)
  const avg = recent.reduce((s, v) => s + v, 0) / recent.length

  return Array(forecastDays).fill(Math.round(avg * 10) / 10)
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return unauthorized()
    if (session.user.mustChangePassword) {
      return forbidden("Password change required")
    }

    const rl = predictLimiter(rateLimitKey(request, `predict:${getUserId(session)}`))
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: rateLimitHeaders(rl, 5) }
      )
    }

    const orgId = getOrgId(session)
    if (!orgId) {
      return NextResponse.json({ error: "Account not associated with an organization" }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const forecastDays = Math.min(Math.max(parseInt(body.days || "5"), 1), 30)
    const method = body.method || "exponential" // 'exponential' or 'moving_average'

    // Fetch historical data
    const historicalData = await query<any>(
      `SELECT log_date, actual_value, predicted_value
       FROM demand_logs
       WHERE org_id = $1
         AND metric_type = 'occupancy_rate'
         AND actual_value IS NOT NULL
       ORDER BY log_date ASC`,
      [orgId]
    )

    if (historicalData.length < 2) {
      return NextResponse.json({
        success: false,
        message: "Need at least 2 historical data points to generate forecast. Current count: " + historicalData.length,
        data: [],
        historicalCount: historicalData.length,
      })
    }

    const historicalValues = historicalData.map((r: any) => parseFloat(r.actual_value))
    const lastDate = new Date(historicalData[historicalData.length - 1].log_date)

    // Generate forecasts
    let forecasts: number[]
    if (method === "moving_average") {
      forecasts = movingAverage(historicalValues, forecastDays)
    } else {
      forecasts = exponentialSmoothing(historicalValues, forecastDays)
    }

    // Check existing predicted values to avoid overwriting manual entries
    const existingPredictions = await query<any>(
      `SELECT log_date FROM demand_logs
       WHERE org_id = $1
         AND metric_type = 'occupancy_rate'
         AND predicted_value IS NOT NULL
         AND log_date > CURRENT_DATE`,
      [orgId]
    )
    const existingPredictionDates = new Set(
      existingPredictions.map((r: any) => r.log_date.toISOString().split("T")[0])
    )

    // Insert forecast predictions
    const inserted: { date: string; value: number; skipped: boolean }[] = []

    for (let i = 0; i < forecasts.length; i++) {
      const forecastDate = new Date(lastDate)
      forecastDate.setDate(forecastDate.getDate() + i + 1)
      const dateStr = forecastDate.toISOString().split("T")[0]

      if (existingPredictionDates.has(dateStr)) {
        inserted.push({ date: dateStr, value: forecasts[i], skipped: true })
        continue
      }

      try {
        await query(
          `INSERT INTO demand_logs (org_id, log_date, metric_type, predicted_value)
           VALUES ($1, $2::date, 'occupancy_rate', $3)
           ON CONFLICT (org_id, log_date, metric_type)
           DO UPDATE SET predicted_value = EXCLUDED.predicted_value`,
          [orgId, dateStr, forecasts[i]]
        )
        inserted.push({ date: dateStr, value: forecasts[i], skipped: false })
      } catch (err: any) {
        logger.error("forecast_insert_failed", {
          date: dateStr,
          error: err.message,
        })
        inserted.push({ date: dateStr, value: forecasts[i], skipped: true })
      }
    }

    const newCount = inserted.filter((i) => !i.skipped).length
    const skippedCount = inserted.filter((i) => i.skipped).length

    await logAudit("forecast_generated", {
      method,
      days: forecastDays,
      historicalPoints: historicalData.length,
      newPredictions: newCount,
      skipped: skippedCount,
    }, request, orgId, getUserId(session))

    return NextResponse.json({
      success: true,
      message: `Generated ${newCount} forecast predictions${skippedCount > 0 ? ` (${skippedCount} already existed, skipped)` : ""}`,
      method,
      forecastDays,
      historicalPoints: historicalData.length,
      lastHistoricalDate: lastDate.toISOString().split("T")[0],
      forecasts: inserted,
      summary: {
        min: Math.min(...forecasts),
        max: Math.max(...forecasts),
        avg: Math.round((forecasts.reduce((s, v) => s + v, 0) / forecasts.length) * 10) / 10,
      },
    })
  } catch (error: any) {
    logger.error("forecast_predict_failed", { error: String(error) })
    return NextResponse.json(
      { error: "Failed to generate forecast" },
      { status: 500 }
    )
  }
}
