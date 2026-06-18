import { NextResponse } from "next/server"

const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/reset-password"]
const SESSION_COOKIE = "__Secure-authjs.session-token"
const INSECURE_SESSION_COOKIE = "authjs.session-token"

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://integrate.api.nvidia.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ")

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("Content-Security-Policy", CSP)
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "0")
  return response
}

export default function middleware(request: Request) {
  const { pathname } = new URL(request.url)

  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return addSecurityHeaders(NextResponse.next())
  }

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return addSecurityHeaders(NextResponse.next())
  }

  const hasSession = request.headers.get("cookie")?.split(";").some((c) => {
    const trimmed = c.trim()
    return trimmed.startsWith(SESSION_COOKIE + "=") || trimmed.startsWith(INSECURE_SESSION_COOKIE + "=")
  })

  if (!hasSession) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return addSecurityHeaders(NextResponse.redirect(url))
  }

  return addSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: ["/((?!favicon.ico|favicon.svg|logo.svg|.*\\.svg$).*)"],
}
