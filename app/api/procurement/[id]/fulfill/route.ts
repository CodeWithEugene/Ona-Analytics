import { NextResponse } from "next/server"
import { execute } from "@/lib/db"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const result = await execute(
      `UPDATE procurement_items
       SET fulfilled_at = NOW()
       WHERE id = $1 AND fulfilled_at IS NULL`,
      [id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Item not found or already fulfilled" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Fulfill error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fulfill item" },
      { status: 500 }
    )
  }
}
