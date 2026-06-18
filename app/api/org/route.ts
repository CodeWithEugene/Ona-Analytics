import { querySingle } from "@/lib/db"
import { NextResponse } from "next/server"
import { requireAuth, unauthorized, forbidden, getOrgId } from "@/lib/api-auth"

export async function GET(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return unauthorized()

    const sessionOrgId = getOrgId(session)
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get("orgId")

    if (!orgId || orgId !== sessionOrgId) return forbidden()

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
