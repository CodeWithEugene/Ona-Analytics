import { NextResponse } from "next/server"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { query, querySingle } from "@/lib/db"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"
import { logger } from "@/lib/log"

const forgotLimiter = createRateLimiter({ interval: 60000, maxRequests: 3 })

export async function POST(request: Request) {
  try {
    const rl = forgotLimiter(rateLimitKey(request, "forgot-password"))
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: rateLimitHeaders(rl, 3) }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const { email } = body
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Always return success to prevent email enumeration
    const user = await querySingle<any>(
      "SELECT id FROM camp_users WHERE email = $1",
      [email.trim().toLowerCase()]
    )

    if (user) {
      const token = crypto.randomBytes(32).toString("hex")
      const tokenHash = await bcrypt.hash(token, 10)

      // Expire in 1 hour
      await query(
        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
        [user.id, tokenHash]
      )

      logger.info("password_reset_token_created", { userId: user.id })

      // In production, send email with: ${appUrl}/reset-password?token=${token}
      // For now, log the token (dev-only convenience)
      if (process.env.NODE_ENV !== "production") {
        logger.info("password_reset_token_dev", { token, email: email.trim().toLowerCase() })
      }
    }

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
    })
  } catch (error: any) {
    logger.error("forgot_password_failed", { error: String(error) })
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
