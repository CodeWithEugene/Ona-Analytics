import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/db"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"
import { logger } from "@/lib/log"
import { logAudit } from "@/lib/api-auth"

const registerLimiter = createRateLimiter({ interval: 60000, maxRequests: 3 })

export async function POST(request: Request) {
  try {
    const rl = registerLimiter(rateLimitKey(request, "register"))
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: rateLimitHeaders(rl, 3) }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    const rawBodyLength = JSON.stringify(body).length
    if (rawBodyLength > 1024 * 1024) {
      return NextResponse.json(
        { error: "Request body too large" },
        { status: 413 }
      )
    }

    const campName = body.campName?.trim()
    const location = body.location?.trim()
    const name = body.name?.trim()
    const email = body.email?.trim()
    const password = body.password

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
    const userResult = await query<{ id: string }>(
      `INSERT INTO camp_users (org_id, email, password_hash, name, role)
       VALUES ($1, $2, $3, $4, 'manager')
       RETURNING id`,
      [orgId, email, passwordHash, name]
    )
    const userId = userResult[0].id

    await logAudit("registration", { email, campName, location }, request, orgId, userId)

    return NextResponse.json({
      success: true,
      message: "Account created. You can now sign in.",
    })
  } catch (error: any) {
    logger.error("register_failed", { error: String(error) })
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}
