import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { requireAuth, unauthorized, forbidden, getOrgId, getUserId, logAudit } from "@/lib/api-auth"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"
import { logger } from "@/lib/log"

const orgUpdateLimiter = createRateLimiter({ interval: 60000, maxRequests: 10 })

const VALID_TIMEZONES = [
  "Africa/Nairobi",
  "Africa/Dar_es_Salaam",
  "Africa/Kampala",
  "Africa/Addis_Ababa",
  "Africa/Johannesburg",
  "Africa/Cairo",
  "UTC",
]

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return unauthorized()

    const rl = orgUpdateLimiter(rateLimitKey(request, `org:${getUserId(session)}`))
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: rateLimitHeaders(rl, 10) }
      )
    }

    const sessionOrgId = getOrgId(session)
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    const { orgId, name, location, timezone } = body

    if (!orgId || orgId !== sessionOrgId) return forbidden()

    if (timezone && !VALID_TIMEZONES.includes(timezone)) {
      return NextResponse.json(
        { error: "Invalid timezone" },
        { status: 400 }
      )
    }

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (name && name.length <= 255) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name)
    }
    if (location && location.length <= 255) {
      updates.push(`location = $${paramIndex++}`)
      values.push(location)
    }
    if (timezone) {
      updates.push(`timezone = $${paramIndex++}`)
      values.push(timezone)
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      )
    }

    updates.push(`updated_at = NOW()`)
    values.push(orgId)

    await query(
      `UPDATE org_profiles SET ${updates.join(", ")} WHERE id = $${paramIndex}`,
      values
    )

    await logAudit("org_update", { orgId, fields: updates.map(u => u.split(" = ")[0]) }, request, sessionOrgId, getUserId(session))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    logger.error("org_update_failed", { error: String(error) })
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    )
  }
}
