import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query, querySingle } from "@/lib/db"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"
import { logger } from "@/lib/log"

const resetLimiter = createRateLimiter({ interval: 60000, maxRequests: 5 })

export async function POST(request: Request) {
  try {
    const rl = resetLimiter(rateLimitKey(request, "reset-password"))
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: rateLimitHeaders(rl, 5) }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Find all valid, unused tokens
    const tokens = await query<any>(
      `SELECT id, user_id, token_hash, expires_at
       FROM password_reset_tokens
       WHERE used = FALSE AND expires_at > NOW()
       ORDER BY created_at DESC`
    )

    if (tokens.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Find matching token
    let matchedToken: any = null
    for (const t of tokens) {
      const isValid = await bcrypt.compare(token, t.token_hash)
      if (isValid) {
        matchedToken = t
        break
      }
    }

    if (!matchedToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Update password and mark token as used
    const passwordHash = await bcrypt.hash(password, 12)

    await query("BEGIN")
    try {
      await query(
        "UPDATE camp_users SET password_hash = $1, must_change_password = FALSE WHERE id = $2",
        [passwordHash, matchedToken.user_id]
      )
      await query(
        "UPDATE password_reset_tokens SET used = TRUE WHERE id = $1",
        [matchedToken.id]
      )
      await query("COMMIT")
    } catch (e) {
      await query("ROLLBACK")
      throw e
    }

    logger.info("password_reset_completed", { userId: matchedToken.user_id })

    return NextResponse.json({
      success: true,
      message: "Password has been reset. You can now sign in.",
    })
  } catch (error: any) {
    logger.error("reset_password_failed", { error: String(error) })
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}
