import { query } from "@/lib/db"
import { NextResponse } from "next/server"
import { requireAuth, unauthorized, forbidden, getOrgId, getUserId, logAudit } from "@/lib/api-auth"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"
import { logger } from "@/lib/log"

const ingestLimiter = createRateLimiter({ interval: 60000, maxRequests: 10 })

const ALLOWED_METRICS = ["occupancy_rate", "arrivals", "departures", "revpar", "adr"]

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return unauthorized()
    if (session.user.mustChangePassword) {
      return forbidden("Password change required")
    }

    const rl = ingestLimiter(rateLimitKey(request, `ingest:${getUserId(session)}`))
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: rateLimitHeaders(rl, 10) }
      )
    }

    const orgId = getOrgId(session)
    if (!orgId) {
      return NextResponse.json({ error: "Account not associated with an organization" }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    // Support both single entry and batch
    const entries = Array.isArray(body) ? body : [body]

    if (entries.length === 0) {
      return NextResponse.json({ error: "No entries provided" }, { status: 400 })
    }

    if (entries.length > 100) {
      return NextResponse.json({ error: "Maximum 100 entries per request" }, { status: 400 })
    }

    const results: { date: string; metric: string; status: "inserted" | "skipped" | "error"; error?: string }[] = []

    for (const entry of entries) {
      const { log_date, metric_type, actual_value, predicted_value } = entry

      if (!log_date || !metric_type) {
        results.push({
          date: log_date || "?",
          metric: metric_type || "?",
          status: "error",
          error: "log_date and metric_type are required",
        })
        continue
      }

      if (!ALLOWED_METRICS.includes(metric_type)) {
        results.push({
          date: log_date,
          metric: metric_type,
          status: "error",
          error: `Invalid metric_type. Must be one of: ${ALLOWED_METRICS.join(", ")}`,
        })
        continue
      }

      // Validate date format
      const dateObj = new Date(log_date)
      if (isNaN(dateObj.getTime())) {
        results.push({
          date: log_date,
          metric: metric_type,
          status: "error",
          error: "Invalid date format. Use YYYY-MM-DD.",
        })
        continue
      }

      const actualVal = actual_value !== null && actual_value !== undefined ? parseFloat(actual_value) : null
      const predictedVal = predicted_value !== null && predicted_value !== undefined ? parseFloat(predicted_value) : null

      if (actualVal !== null && (isNaN(actualVal) || actualVal < 0 || actualVal > 1000)) {
        results.push({
          date: log_date,
          metric: metric_type,
          status: "error",
          error: "actual_value must be between 0 and 1000",
        })
        continue
      }

      const dateStr = dateObj.toISOString().split("T")[0]

      try {
        await query(
          `INSERT INTO demand_logs (org_id, log_date, metric_type, actual_value, predicted_value)
           VALUES ($1, $2::date, $3, $4, $5)
           ON CONFLICT (org_id, log_date, metric_type)
           DO UPDATE SET
             actual_value = COALESCE(EXCLUDED.actual_value, demand_logs.actual_value),
             predicted_value = COALESCE(EXCLUDED.predicted_value, demand_logs.predicted_value)`,
          [orgId, dateStr, metric_type, actualVal, predictedVal]
        )
        results.push({ date: dateStr, metric: metric_type, status: "inserted" })
      } catch (err: any) {
        logger.error("demand_ingest_failed", { date: dateStr, error: err.message })
        results.push({ date: dateStr, metric: metric_type, status: "error", error: err.message })
      }
    }

    const inserted = results.filter((r) => r.status === "inserted").length
    const errors = results.filter((r) => r.status === "error").length

    await logAudit("demand_data_ingested", {
      total: entries.length,
      inserted,
      errors,
    }, request, orgId, getUserId(session))

    return NextResponse.json({
      success: true,
      message: `Ingested ${inserted} data point${inserted !== 1 ? "s" : ""}${errors > 0 ? ` (${errors} error${errors !== 1 ? "s" : ""})` : ""}`,
      results,
      summary: { total: entries.length, inserted, errors },
    })
  } catch (error: any) {
    logger.error("demand_ingest_failed", { error: String(error) })
    return NextResponse.json(
      { error: "Failed to ingest demand data" },
      { status: 500 }
    )
  }
}
