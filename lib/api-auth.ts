import { auth } from "./auth"
import { NextResponse } from "next/server"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) return null
  return session
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function getUserId(session: any): string | null {
  return session?.user?.id || null
}

export function getOrgId(session: any): string | null {
  return (session?.user as any)?.orgId || null
}
