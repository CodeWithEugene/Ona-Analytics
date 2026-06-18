import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { Session, DefaultSession } from "next-auth"
import { logger } from "./log"

export interface AuthSession extends Session {
  user: {
    id: string
    orgId: string
    mustChangePassword?: boolean
  } & DefaultSession["user"]
}

export async function requireAuth(): Promise<AuthSession | null> {
  const session = await auth()
  if (!session?.user) return null
  return session as AuthSession
}

export async function requireAuthOrThrow(): Promise<AuthSession> {
  const session = await requireAuth()
  if (!session) throw new Error("Unauthorized")
  if ((session.user as any).mustChangePassword) {
    throw new Error("Password change required")
  }
  return session
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function getUserId(session: AuthSession): string | null {
  return session.user?.id || null
}

export function getOrgId(session: AuthSession): string | null {
  return session.user?.orgId || null
}

export async function logAudit(
  action: string,
  details: Record<string, unknown>,
  request?: Request,
  orgId?: string | null,
  userId?: string | null
) {
  const { query } = await import("./db")
  const ip = request
    ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null
    : null

  try {
    await query(
      `INSERT INTO audit_log (org_id, user_id, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [orgId || null, userId || null, action, JSON.stringify(details), ip]
    )
  } catch (err) {
    logger.error("audit_log_failed", { action, error: String(err) })
  }
}
