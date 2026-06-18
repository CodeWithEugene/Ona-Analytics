import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { Session, DefaultSession } from "next-auth"

export interface AuthSession extends Session {
  user: {
    id: string
    orgId: string
  } & DefaultSession["user"]
}

export async function requireAuth(): Promise<AuthSession | null> {
  const session = await auth()
  if (!session?.user) return null
  return session as AuthSession
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function getUserId(session: AuthSession): string | null {
  return session.user.id || null
}

export function getOrgId(session: AuthSession): string | null {
  return session.user.orgId || null
}
