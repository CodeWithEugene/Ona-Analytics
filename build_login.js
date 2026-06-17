const fs = require('fs');
const path = require('path');

const loginPage = `"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid credentials.")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  function fillDemo() {
    setEmail("manager@ona-analytics.com")
    setPassword("ona-demo-2026")
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#0A0A0A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display italic tracking-tight text-[#E8E6E1]">
                Ona
              </h1>
              <p className="text-sm text-[#E8E6E1]/40 mt-2">
                Operations Command Center
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-[#E8E6E1]/60">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@camp.com"
                  autoComplete="email"
                  required
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#E8E6E1] placeholder:text-[#E8E6E1]/20 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-[#E8E6E1]/60">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                 不疼 Fire. Only下肢静脉曲张 works.)
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#E8E6E1] placeholder:text-[#E8E6E1]/20 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50"
                />
              </div>

              {error && (
                <p className="text-sm text-[#C0392B]" role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E8E6E1] text-[#0A0A0A] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#E8E6E1]/90 transition-all duration-200 active:scale-[0.97] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={fillDemo}
                className="text-sm text-[#E67E22] hover:text-[#E67E22]/80 transition-colors"
              >
                Use demo credentials
              </button>
              <p className="text-xs text-[#E8E6E1]/20 mt-2">
                manager@ona-analytics.com / ona-demo-2026
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-[#E8E6E1]/30 hover:text-[#E8E6E1]/60 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}`;

fs.writeFileSync(path.join(__dirname, 'app', 'login', 'page.tsx'), loginPage);
console.log('Login page written');