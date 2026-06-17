import type { NextAuthConfig } from "next-auth"

const AUTH_USER = {
  id: "1",
  name: "Camp Manager",
  email: "manager@ona-analytics.com",
  password: "ona-demo-2026",
}

export const authConfig: NextAuthConfig = {
  providers: [],  // filled in by lib/auth.ts
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth: session }) {
      return !!session?.user
    },
  },
  session: {
    strategy: "jwt",
  },
}

export { AUTH_USER }
