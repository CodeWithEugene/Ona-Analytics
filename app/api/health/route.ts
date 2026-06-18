import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db"

export async function GET() {
  try {
    const dbOk = await testConnection()
    const health = {
      status: dbOk ? "ok" : "degraded",
      database: dbOk ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    }
    const statusCode = dbOk ? 200 : 503
    return NextResponse.json(health, { status: statusCode })
  } catch {
    return NextResponse.json(
      { status: "error", database: "unreachable", timestamp: new Date().toISOString() },
      { status: 503 }
    )
  }
}

export async function POST() {
  return GET()
}
