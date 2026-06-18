import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query, querySingle } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { campName, location, name, email, password } = await request.json()

    if (!campName || !location || !name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const existingUser = await querySingle<any>(
      "SELECT id FROM camp_users WHERE email = $1",
      [email]
    )
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      )
    }

    const defaultOrg = await querySingle<any>(
      "SELECT id FROM org_profiles WHERE id = $1",
      ["11111111-1111-1111-1111-111111111111"]
    )

    let orgId: string
    if (defaultOrg) {
      orgId = "11111111-1111-1111-1111-111111111111"
      await query(
        "UPDATE org_profiles SET name = $1, location = $2, updated_at = NOW() WHERE id = $3",
        [campName, location, orgId]
      )
    } else {
      const result = await query<{ id: string }>(
        `INSERT INTO org_profiles (name, location, timezone)
         VALUES ($1, $2, 'Africa/Nairobi')
         RETURNING id`,
        [campName, location]
      )
      orgId = result[0].id
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await query(
      `INSERT INTO camp_users (org_id, email, password_hash, name, role)
       VALUES ($1, $2, $3, $4, 'manager')`,
      [orgId, email, passwordHash, name]
    )

    return NextResponse.json({
      success: true,
      message: "Account created. You can now sign in.",
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    )
  }
}
