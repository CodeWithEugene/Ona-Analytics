import { NextResponse } from "next/server"
import { withConnection } from "@/lib/db"
import fs from "fs"
import path from "path"

export async function POST() {
  try {
    const schemaPath = path.join(process.cwd(), "lib/db/schema.sql")
    const seedPath = path.join(process.cwd(), "lib/db/seed.sql")

    const schemaSQL = fs.readFileSync(schemaPath, "utf-8")
    const seedSQL = fs.readFileSync(seedPath, "utf-8")

    const results: string[] = []

    await withConnection(async (client) => {
      // Run schema
      const schemaStatements = schemaSQL
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"))

      for (const stmt of schemaStatements) {
        try {
          await client.query(stmt + ";")
          results.push(`OK: ${stmt.substring(0, 60)}...`)
        } catch (err: any) {
          if (!err.message?.includes("already exists")) {
            throw err
          }
          results.push(`SKIP (exists): ${stmt.substring(0, 60)}...`)
        }
      }

      // Run seed
      const seedStatements = seedSQL
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"))

      for (const stmt of seedStatements) {
        try {
          await client.query(stmt + ";")
          results.push(`OK: ${stmt.substring(0, 60)}...`)
        } catch (err: any) {
          if (err.message?.includes("already exists") || err.message?.includes("duplicate key")) {
            results.push(`SKIP (exists): ${stmt.substring(0, 60)}...`)
          } else {
            throw err
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Migration complete",
      results,
    })
  } catch (error: any) {
    console.error("Migration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Migration failed",
      },
      { status: 500 }
    )
  }
}
