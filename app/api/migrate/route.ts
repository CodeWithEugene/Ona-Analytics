import { NextResponse } from "next/server"
import { withConnection } from "@/lib/db"
import { requireAuth, unauthorized, getUserId, getOrgId, logAudit } from "@/lib/api-auth"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"
import fs from "fs"
import path from "path"
import { logger } from "@/lib/log"

const migrateLimiter = createRateLimiter({ interval: 60000, maxRequests: 2 })

function stripComments(sql: string): string {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .trim()
}

export async function POST() {
  try {
    const session = await requireAuth()
    if (!session) return unauthorized()

    const request = new Request("http://localhost")
    const rl = migrateLimiter(rateLimitKey(request, `migrate:${getUserId(session)}`))
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: rateLimitHeaders(rl, 2) }
      )
    }

    const userEmail = session.user?.email || ""
    const allowedEmails = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean)

    if (allowedEmails.length === 0 || !allowedEmails.includes(userEmail)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const results: string[] = []

    const schemaPath = path.join(process.cwd(), "lib/db/schema.sql")
    const seedPath = path.join(process.cwd(), "lib/db/seed.sql")

    const schemaSQL = fs.readFileSync(schemaPath, "utf-8")
    const seedSQL = fs.readFileSync(seedPath, "utf-8")

    await withConnection(async (client) => {
      const schemaStatements = schemaSQL
        .split(";")
        .map((s) => stripComments(s))
        .filter((s) => s.length > 0)

      for (const stmt of schemaStatements) {
        try {
          await client.query(stmt + ";")
          results.push(`OK: ${stmt.substring(0, 80)}`)
        } catch (err: any) {
          if (err.code === "42710") {
            results.push(`SKIP (exists): ${stmt.substring(0, 80)}`)
          } else {
            logger.error("migration_statement_error", { error: String(err), statement: stmt.substring(0, 80) })
            results.push(`ERR: ${stmt.substring(0, 80)}`)
          }
        }
      }

      try {
        await client.query(`ALTER TABLE demand_logs ALTER COLUMN actual_value DROP NOT NULL;`)
        results.push("OK: ALTER TABLE demand_logs ALTER actual_value DROP NOT NULL")
      } catch (err: any) {
        results.push(`NOTE: ALTER actual_value`)
      }

      const seedStatements = seedSQL
        .split(";")
        .map((s) => stripComments(s))
        .filter((s) => s.length > 0)

      for (const stmt of seedStatements) {
        try {
          await client.query(stmt + ";")
          results.push(`OK: ${stmt.substring(0, 80)}`)
        } catch (err: any) {
          if (err.code === "42710" || err.code === "23505") {
            results.push(`SKIP (exists): ${stmt.substring(0, 80)}`)
          } else {
            logger.error("migration_seed_error", { error: String(err), statement: stmt.substring(0, 80) })
            results.push(`ERR: ${stmt.substring(0, 80)}`)
          }
        }
      }
    })

    const orgId = getOrgId(session)
    await logAudit("migration", { resultCount: results.length }, request, orgId, getUserId(session))

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    logger.error("migration_failed", { error: String(error) })
    return NextResponse.json({
      success: false,
      error: "Migration failed",
    })
  }
}
