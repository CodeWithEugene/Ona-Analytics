import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query, querySingle } from "@/lib/db"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"
import { logger } from "@/lib/log"

const SETUP_KEY = process.env.SETUP_API_KEY
const fixLimiter = createRateLimiter({ interval: 60000, maxRequests: 3 })

export async function POST(request: Request) {
  try {
    const rl = fixLimiter(rateLimitKey(request, "fix-creds"))
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: rateLimitHeaders(rl, 3) }
      )
    }

    if (!SETUP_KEY) {
      return NextResponse.json({ error: "Setup not configured" }, { status: 503 })
    }

    const body = await request.json().catch(() => ({}))
    if (body.setupKey !== SETUP_KEY) {
      return NextResponse.json({ error: "Invalid setup key" }, { status: 403 })
    }

    const org = await querySingle<any>("SELECT id FROM org_profiles LIMIT 1")
    if (!org) {
      return NextResponse.json({ error: "No organization found. Run migration first." }, { status: 400 })
    }

    const orgId = org.id
    const results: string[] = []

    // Fix admin password
    const adminHash = bcrypt.hashSync("admin123", 12)
    const adminResult = await query(
      `UPDATE camp_users SET password_hash = $1, must_change_password = FALSE WHERE email = 'admin@ona-analytics.com' RETURNING email`,
      [adminHash]
    )
    results.push(adminResult.length > 0 ? "admin password updated" : "admin user not found (will be created)")

    if (adminResult.length === 0) {
      await query(
        `INSERT INTO camp_users (org_id, email, password_hash, name, role, must_change_password) VALUES ($1, 'admin@ona-analytics.com', $2, 'Admin User', 'admin', FALSE) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
        [orgId, adminHash]
      )
      results.push("admin user created")
    }

    // Upsert manager
    const mgrHash = bcrypt.hashSync("ona-demo-2026", 12)
    await query(
      `INSERT INTO camp_users (org_id, email, password_hash, name, role, must_change_password) VALUES ($1, 'manager@ona-analytics.com', $2, 'Demo Manager', 'manager', FALSE) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, role = EXCLUDED.role`,
      [orgId, mgrHash]
    )
    results.push("manager user upserted")

    await query(
      `INSERT INTO agent_conversations (org_id, user_message, agent_response, tool_calls) VALUES ($1, 'system', 'Credentials fixed: ' || $2::text, '[]'::jsonb)`,
      [orgId, results.join("; ")]
    )

    return NextResponse.json({
      success: true,
      message: "Demo credentials fixed",
      results,
      credentials: {
        manager: { email: "manager@ona-analytics.com", password: "ona-demo-2026" },
        admin: { email: "admin@ona-analytics.com", password: "admin123" },
      },
    })
  } catch (error: any) {
    const msg = error?.message || String(error)
    logger.error("fix-creds failed", { error: msg, stack: error?.stack })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
