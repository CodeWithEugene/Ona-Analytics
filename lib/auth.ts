import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const AUTH_USER = {
  id: "1",
  name: "Camp Manager",
  email: "manager@ona-analytics.com",
  password: "ona-demo-2026",
}

export const { handlers, signIn, signOut, auth } = NextAuth({
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
})
