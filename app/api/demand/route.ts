import { query, querySingle } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get("orgId") || "11111111-1111-1111-1111-111111111111"
    const days = parseInt(searchParams.get("days") || "30")
    const metricType = searchParams.get("metric") || "occupancy_rate"

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
