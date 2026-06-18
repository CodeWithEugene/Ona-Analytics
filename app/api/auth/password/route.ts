import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query, querySingle } from "@/lib/db"
import { requireAuth, unauthorized, getUserId } from "@/lib/api-auth"

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return unauthorized()

    const userId = getUserId(session)
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "currentPassword and newPassword are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const user = await querySingle<any>(
      "SELECT id, password_hash FROM camp_users WHERE id = $1",
      [userId]
    )

    if (!user) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      )
    }

    const isValid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 403 }
      )
    }

    const newHash = await bcrypt.hash(newPassword, 12)
    await query(
      "UPDATE camp_users SET password_hash = $1 WHERE id = $2",
      [newHash, userId]
    )

    return NextResponse.json({ success: true, message: "Password updated" })
  } catch (error: any) {
    console.error("Password change error:", error)
    return NextResponse.json(
      { error: "Password change failed" },
      { status: 500 }
    )
  }
}
