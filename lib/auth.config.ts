import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth: session }) {
      return !!session?.user
    },
    async jwt({ token, user }) {
      if (user) {
        token.orgId = (user as any).orgId
        token.mustChangePassword = (user as any).mustChangePassword
      }
      return token
    },
    async session({ session, token }) {
      (session.user as any).orgId = token.orgId
      ;(session.user as any).mustChangePassword = token.mustChangePassword
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  cookies: {
    sessionToken: {
      options: {
        sameSite: "strict",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
}
