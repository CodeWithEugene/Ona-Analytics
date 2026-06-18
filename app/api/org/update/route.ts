import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { orgId, name, location, timezone } = await request.json()

    if (!orgId) {
      return NextResponse.json(
        { error: "orgId is required" },
        { status: 400 }
      )
    }

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (name) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name)
    }
    if (location) {
      updates.push(`location = $${paramIndex++}`)
      values.push(location)
    }
    if (timezone) {
      updates.push(`timezone = $${paramIndex++}`)
      values.push(timezone)
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      )
    }

    updates.push(`updated_at = NOW()`)
    values.push(orgId)

    await query(
      `UPDATE org_profiles SET ${updates.join(", ")} WHERE id = $${paramIndex}`,
      values
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Org update error:", error)
    return NextResponse.json(
      { error: error.message || "Update failed" },
      { status: 500 }
    )
  }
}
