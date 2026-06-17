import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig, AUTH_USER } from "./auth.config"

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
        if (
          credentials?.email === AUTH_USER.email &&
          credentials?.password === AUTH_USER.password
        ) {
          return {
            id: AUTH_USER.id,
            name: AUTH_USER.name,
            email: AUTH_USER.email,
          }
        }
        return null
      },
    }),
  ],
})
