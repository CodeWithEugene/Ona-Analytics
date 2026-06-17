import { NextResponse } from "next/server"
import { withConnection } from "@/lib/db"
import fs from "fs"
import path from "path"

function stripComments(sql: string): string {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .trim()
}

export async function POST() {
  const results: string[] = []

  try {
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
          if (err.message?.includes("already exists")) {
            results.push(`SKIP (exists): ${stmt.substring(0, 80)}`)
          } else {
            results.push(`ERR: ${err.message} — ${stmt.substring(0, 80)}`)
          }
        }
      }

      // Fix: make actual_value nullable in case schema was previously applied with NOT NULL
      try {
        await client.query(`ALTER TABLE demand_logs ALTER COLUMN actual_value DROP NOT NULL;`)
        results.push("OK: ALTER TABLE demand_logs ALTER actual_value DROP NOT NULL")
      } catch (err: any) {
        results.push(`NOTE: ${err.message} — ALTER actual_value`)
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
          if (err.message?.includes("already exists") || err.message?.includes("duplicate key")) {
            results.push(`SKIP (exists): ${stmt.substring(0, 80)}`)
          } else {
            results.push(`ERR: ${err.message} — ${stmt.substring(0, 80)}`)
          }
        }
      }
    })

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Migration failed",
      results,
    })
  }
}
