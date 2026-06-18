import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"
import { querySingle } from "./db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await querySingle<any>(
            `SELECT id, org_id, email, password_hash, name
             FROM camp_users
             WHERE email = $1`,
            [credentials.email as string]
          )

          if (!user) return null

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          )

          if (!isValid) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            orgId: user.org_id,
          }
        } catch (error) {
          console.error("Auth DB error:", error)
          return null
        }
      },
    }),
  ],
})
