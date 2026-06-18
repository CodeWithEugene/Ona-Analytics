import { query } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get("orgId") || "11111111-1111-1111-1111-111111111111"

    const rows = await query<any>(
      `SELECT
        id, item_name, required_amount, unit,
        urgency, reason, created_at, fulfilled_at
      FROM procurement_items
      WHERE org_id = $1
        AND fulfilled_at IS NULL
      ORDER BY
        CASE urgency
          WHEN 'high' THEN 0
          WHEN 'medium' THEN 1
          WHEN 'low' THEN 2
        END,
        created_at DESC`,
      [orgId]
    )

    const items = rows.map((r: any) => ({
      id: r.id,
      item: r.item_name,
      requiredAmount:
        r.unit === "kg" || r.unit === "units"
          ? `+${r.required_amount}${r.unit === "kg" ? "kg" : " units"}`
          : `+${r.required_amount} ${r.unit}`,
      urgency: r.urgency.charAt(0).toUpperCase() + r.urgency.slice(1) as "High" | "Medium" | "Low",
      action: "Dispatch Truck",
    }))

    return NextResponse.json({ data: items })
  } catch (error) {
    console.error("Error fetching procurement data:", error)
    return NextResponse.json(
      { error: "Failed to fetch procurement data" },
      { status: 500 }
    )
  }
}
