import { query, withConnection } from "@/lib/db"
import { NextResponse } from "next/server"
import { requireAuth, unauthorized, forbidden, getOrgId } from "@/lib/api-auth"

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return unauthorized()

    const sessionOrgId = getOrgId(session)
    const body = await request.json().catch(() => ({}))
    const orgId = body.orgId

    if (!orgId || orgId !== sessionOrgId) return forbidden()

    const latest = await query<any>(
      `SELECT predicted_value, log_date
       FROM demand_logs
       WHERE org_id = $1
         AND metric_type = 'occupancy_rate'
         AND predicted_value IS NOT NULL
       ORDER BY log_date DESC
       LIMIT 1`,
      [orgId]
    )

    const peakPrediction = latest.length > 0 ? parseFloat(latest[0].predicted_value) : 0

    const items: any[] = []

    if (peakPrediction > 60) {
      items.push({
        item_name: "Fresh Produce",
        required_amount: Math.round(peakPrediction * 0.42),
        unit: "kg",
        urgency: peakPrediction > 80 ? "high" : "medium",
        reason: `${peakPrediction}% forecast occupancy requires additional fresh produce`,
      })
      items.push({
        item_name: "Gas Cylinders",
        required_amount: Math.ceil(peakPrediction / 10),
        unit: "units",
        urgency: peakPrediction > 80 ? "high" : "medium",
        reason: `Occupancy at ${peakPrediction}% triggers increased propane supply`,
      })
      items.push({
        item_name: "Linens & Bedding",
        required_amount: Math.round(peakPrediction * 0.26),
        unit: "sets",
        urgency: "medium",
        reason: `Additional linen sets for ${peakPrediction}% rotation at peak occupancy`,
      })
    } else {
      items.push({
        item_name: "Fresh Produce",
        required_amount: 20,
        unit: "kg",
        urgency: "low",
        reason: "Routine replenishment for normal occupancy levels",
      })
      items.push({
        item_name: "Gas Cylinders",
        required_amount: 4,
        unit: "units",
        urgency: "low",
        reason: "Standard propane restock",
      })
    }

    await withConnection(async (client) => {
      await client.query("BEGIN")
      try {
        await client.query("DELETE FROM procurement_items WHERE org_id = $1", [orgId])
        for (const item of items) {
          await client.query(
            `INSERT INTO procurement_items (org_id, item_name, required_amount, unit, urgency, reason)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [orgId, item.item_name, item.required_amount, item.unit, item.urgency, item.reason]
          )
        }
        await client.query("COMMIT")
      } catch (e) {
        await client.query("ROLLBACK")
        throw e
      }
    })

    return NextResponse.json({
      success: true,
      message: `Generated ${items.length} procurement recommendations`,
      items,
    })
  } catch (error) {
    console.error("Error generating procurement:", error)
    return NextResponse.json(
      { error: "Failed to generate procurement recommendations" },
      { status: 500 }
    )
  }
}
