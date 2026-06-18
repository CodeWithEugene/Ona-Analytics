import { NextResponse } from "next/server"

const PUBLIC_PATHS = ["/", "/login", "/register"]
const SESSION_COOKIE = "__Secure-authjs.session-token"
const INSECURE_SESSION_COOKIE = "authjs.session-token"

export default function middleware(request: Request) {
  const { pathname } = new URL(request.url)

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next()
  }

  const hasSession = request.headers.get("cookie")?.split(";").some((c) => {
    const trimmed = c.trim()
    return trimmed.startsWith(SESSION_COOKIE + "=") || trimmed.startsWith(INSECURE_SESSION_COOKIE + "=")
  })

  if (!hasSession) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|favicon.svg|logo.svg).*)"],
}
