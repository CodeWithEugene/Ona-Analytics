import { NextResponse } from "next/server"
import { execute, querySingle } from "@/lib/db"
import { requireAuth, unauthorized, forbidden, getOrgId } from "@/lib/api-auth"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    if (!session) return unauthorized()

    const sessionOrgId = getOrgId(session)
    const { id } = await params

    const item = await querySingle<any>(
      "SELECT org_id FROM procurement_items WHERE id = $1",
      [id]
    )

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    if (item.org_id !== sessionOrgId) return forbidden()

    const result = await execute(
      `UPDATE procurement_items
       SET fulfilled_at = NOW()
       WHERE id = $1 AND fulfilled_at IS NULL`,
      [id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Item already fulfilled" },
        { status: 409 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Fulfill error:", error)
    return NextResponse.json(
      { error: "Failed to fulfill item" },
      { status: 500 }
    )
  }
}
