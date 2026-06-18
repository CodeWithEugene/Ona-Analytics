import { query } from "@/lib/db"
import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const isConnected = await testConnection()
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database not reachable" },
        { status: 503 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const orgId = body.orgId

    if (!orgId) {
      return NextResponse.json(
        { error: "orgId is required" },
        { status: 400 }
      )
    }

    await query("DELETE FROM procurement_items WHERE org_id = $1", [orgId])

    const items = [
      {
        item_name: "Fresh Produce",
        required_amount: 40,
        unit: "kg",
        urgency: "high",
        reason:
          "Weekend surge to 95% occupancy requires +40kg additional fresh produce",
      },
      {
        item_name: "Gas Cylinders",
        required_amount: 10,
        unit: "units",
        urgency: "high",
        reason:
          "Occupancy spike above 80% triggers 50% increase in propane supply",
      },
      {
        item_name: "Linens & Bedding",
        required_amount: 25,
        unit: "sets",
        urgency: "medium",
        reason:
          "Additional 25 linen sets needed for 3-set rotation at peak occupancy",
      },
    ]

    for (const item of items) {
      await query(
        `INSERT INTO procurement_items (org_id, item_name, required_amount, unit, urgency, reason)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orgId,
          item.item_name,
          item.required_amount,
          item.unit,
          item.urgency,
          item.reason,
        ]
      )
    }

    return NextResponse.json({
      success: true,
      message: "Procurement recommendations generated",
    })
  } catch (error) {
    console.error("Error generating procurement:", error)
    return NextResponse.json(
      { error: "Failed to generate procurement recommendations" },
      { status: 500 }
    )
  }
}
