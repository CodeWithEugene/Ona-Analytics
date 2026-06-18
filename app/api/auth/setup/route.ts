import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query, querySingle } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { email, password, name, orgId, setupKey } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "email, password, and name are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const existing = await querySingle<any>(
      "SELECT id FROM camp_users WHERE email = $1",
      [email]
    )

    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      )
    }

    const resolvedOrgId = orgId || "11111111-1111-1111-1111-111111111111"

    const orgExists = await querySingle<any>(
      "SELECT id FROM org_profiles WHERE id = $1",
      [resolvedOrgId]
    )

    if (!orgExists) {
      return NextResponse.json(
        { error: "Organization not found. Run database migration first." },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await query(
      `INSERT INTO camp_users (org_id, email, password_hash, name, role)
       VALUES ($1, $2, $3, $4, 'manager')`,
      [resolvedOrgId, email, passwordHash, name]
    )

    return NextResponse.json({
      success: true,
      message: "User created successfully. You can now sign in.",
    })
  } catch (error: any) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { error: error.message || "Setup failed" },
      { status: 500 }
    )
  }
}
