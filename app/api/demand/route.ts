import { query } from "@/lib/db"
import { NextResponse } from "next/server"
import { requireAuth, unauthorized, forbidden, getOrgId } from "@/lib/api-auth"

const ALLOWED_METRICS = ["occupancy_rate", "arrivals", "departures", "revpar", "adr"]

export async function GET(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return unauthorized()

    const sessionOrgId = getOrgId(session)
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get("orgId")

    if (!orgId || orgId !== sessionOrgId) return forbidden()

    const days = Math.min(Math.max(parseInt(searchParams.get("days") || "30"), 1), 365)
    const metricType = searchParams.get("metric") || "occupancy_rate"

    if (!ALLOWED_METRICS.includes(metricType)) {
      return NextResponse.json(
        { error: "Invalid metric type" },
        { status: 400 }
      )
    }

    const rows = await query<any>(
      `SELECT
        id, org_id, log_date, metric_type,
        actual_value, predicted_value, created_at
      FROM demand_logs
      WHERE org_id = $1
        AND metric_type = $2
        AND log_date >= CURRENT_DATE - ($3::int || ' days')::INTERVAL
      ORDER BY log_date ASC`,
      [orgId, metricType, days]
    )

    return NextResponse.json({ data: rows })
  } catch (error) {
    console.error("Error fetching demand data:", error)
    return NextResponse.json(
      { error: "Failed to fetch demand data" },
      { status: 500 }
    )
  }
}
