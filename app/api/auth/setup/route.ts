import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query, querySingle } from "@/lib/db"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"

const SETUP_KEY = process.env.SETUP_API_KEY
const setupLimiter = createRateLimiter({ interval: 60000, maxRequests: 5 })

export async function POST(request: Request) {
  try {
    const rl = setupLimiter(rateLimitKey(request, "setup"))
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: rateLimitHeaders(rl, 5) }
      )
    }

    if (!SETUP_KEY) {
      return NextResponse.json(
        { error: "Service unavailable" },
        { status: 503 }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    const { email, password, name, orgId, setupKey } = body

    if (!setupKey || setupKey !== SETUP_KEY) {
      return NextResponse.json(
        { error: "Invalid setup key" },
        { status: 403 }
      )
    }

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

    if (!orgId) {
      return NextResponse.json(
        { error: "orgId is required" },
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

    const orgExists = await querySingle<any>(
      "SELECT id FROM org_profiles WHERE id = $1",
      [orgId]
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
      [orgId, email, passwordHash, name]
    )

    return NextResponse.json({
      success: true,
      message: "User created successfully. You can now sign in.",
    })
  } catch (error: any) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { error: "Setup failed" },
      { status: 500 }
    )
  }
}
