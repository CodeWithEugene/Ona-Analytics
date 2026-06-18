import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/db"

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    if (campName.length > 255 || location.length > 255 || name.length > 255) {
      return NextResponse.json(
        { error: "Fields exceed maximum length" },
        { status: 400 }
      )
    }

    const existingUser = await query(
      "SELECT id FROM camp_users WHERE email = $1 LIMIT 1",
      [email]
    )
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Registration failed" },
        { status: 409 }
      )
    }

    const orgResult = await query<{ id: string }>(
      `INSERT INTO org_profiles (name, location, timezone)
       VALUES ($1, $2, 'Africa/Nairobi')
       RETURNING id`,
      [campName, location]
    )
    const orgId = orgResult[0].id

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
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
