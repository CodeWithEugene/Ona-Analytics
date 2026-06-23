/**
 * Email sending utility using Resend.
 *
 * Falls back to logging when RESEND_API_KEY is not configured
 * (e.g., during local development without the env var).
 */

import { logger } from "./log"

type SendPasswordResetParams = {
  email: string
  token: string
  appUrl: string
}

/**
 * Send a password reset email via Resend.
 * Falls back to logging the reset link in dev mode.
 */
export async function sendPasswordResetEmail({
  email,
  token,
  appUrl,
}: SendPasswordResetParams): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY
  const resetLink = `${appUrl}/reset-password?token=${token}`
  const isProduction = process.env.NODE_ENV === "production"
  const isVercel = !!process.env.VERCEL

  // In dev mode, always log the token for convenience
  if (!isProduction && !isVercel) {
    logger.info("password_reset_dev", {
      email,
      resetLink,
      note: "RESEND not configured in dev — token logged for testing",
    })
    return true
  }

  if (!resendApiKey) {
    logger.warn("password_reset_no_resend_key", {
      email,
      resetLink,
      action: "logged_only",
    })
    // In production without Resend, log the link so it's still accessible
    logger.info("password_reset_fallback", { email, resetLink })
    return false
  }

  try {
    const { Resend } = await import("resend")
    const resend = new Resend(resendApiKey)

    const { error } = await resend.emails.send({
      from: "Ona Analytics <noreply@ona-analytics.com>",
      to: email,
      subject: "Reset your Ona Analytics password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4ede2; margin: 0; padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4ede2; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden;">
                  <tr>
                    <td style="padding: 48px 40px 32px; text-align: center;">
                      <img src="https://ona-analytics.vercel.app/logo.svg" alt="Ona Analytics" width="160" style="margin-bottom: 32px;" />
                      <h1 style="font-size: 24px; color: #1c1816; margin: 0 0 8px; font-weight: 700;">Reset your password</h1>
                      <p style="font-size: 15px; color: #3d3633; margin: 0 0 32px; line-height: 1.5;">
                        You requested a password reset for your Ona Analytics account.
                        Click the button below to choose a new password.
                      </p>
                      <a href="${resetLink}" style="display: inline-block; background: #1c1816; color: #f4ede2; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-bottom: 32px;">
                        Reset Password
                      </a>
                      <p style="font-size: 13px; color: #3d3633; margin: 0 0 8px; line-height: 1.5;">
                        Or copy this link into your browser:
                      </p>
                      <p style="font-size: 12px; color: #8b7355; word-break: break-all; margin: 0; font-family: monospace;">
                        ${resetLink}
                      </p>
                      <hr style="border: none; border-top: 1px solid #d6cfc5; margin: 32px 0 24px;" />
                      <p style="font-size: 12px; color: #8b7355; margin: 0; line-height: 1.4;">
                        This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
                      </p>
                      <p style="font-size: 11px; color: #8b7355; margin: 16px 0 0; line-height: 1.4;">
                        Ona Analytics — Securing isolated safari camps since 2026
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    if (error) {
      logger.error("password_reset_email_failed", { email, error: String(error) })
      // Fallback: log the reset link
      logger.info("password_reset_fallback", { email, resetLink })
      return false
    }

    logger.info("password_reset_email_sent", { email })
    return true
  } catch (err) {
    logger.error("password_reset_email_error", { email, error: String(err) })
    logger.info("password_reset_fallback", { email, resetLink })
    return false
  }
}
