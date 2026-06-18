import { querySingle } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get("orgId")

    if (!orgId) {
      return NextResponse.json(
        { error: "orgId is required" },
        { status: 400 }
      )
    }

    const org = await querySingle<any>(
      `SELECT id, name, location, timezone, created_at, updated_at
       FROM org_profiles
       WHERE id = $1`,
      [orgId]
    )

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: org })
  } catch (error) {
    console.error("Error fetching org:", error)
    return NextResponse.json(
      { error: "Failed to fetch organization data" },
      { status: 500 }
    )
  }
}
