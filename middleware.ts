import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicPaths = [
    "/",
    "/login",
    "/api/auth",
    "/api/migrate",
    "/_next/static",
    "/_next/image",
    "/favicon.ico",
    "/logo.svg",
  ]

  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
  if (isPublic) return NextResponse.next()

  const token =
    request.cookies.get("__Secure-authjs.session-token")?.value ??
    request.cookies.get("authjs.session-token")?.value

  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth|api/migrate|_next/static|_next/image|favicon.ico|logo.svg).*)"],
}
