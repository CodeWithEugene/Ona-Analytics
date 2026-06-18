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
        (token as any).orgId = (user as any).orgId
      }
      return token
    },
    async session({ session, token }) {
      (session.user as any).orgId = (token as any).orgId
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
}
