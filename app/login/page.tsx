"use client"

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
      setError("Invalid email or password.")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1816] text-[#F4EDE2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="p-1.5 rounded-[2rem] bg-[#F4EDE2]/5 ring-1 ring-[#F4EDE2]/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#1C1816] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display italic text-[#F4EDE2]">Ona</h1>
              <p className="text-sm text-[#F4EDE2]/40 mt-2">Operations Command Center</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-[#F4EDE2]/40">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="camp@ona-analytics.com"
                  autoComplete="email"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#F4EDE2]/10 rounded-lg px-4 py-3 text-sm text-[#F4EDE2] focus:ring-2 focus:ring-[#C0392B]/50 outline-none placeholder:text-[#F4EDE2]/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-[#F4EDE2]/40">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#F4EDE2]/10 rounded-lg px-4 py-3 text-sm text-[#F4EDE2] focus:ring-2 focus:ring-[#C0392B]/50 outline-none placeholder:text-[#F4EDE2]/20"
                />
              </div>

              {error && <p role="alert" className="text-sm text-[#C0392B]">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C0392B] text-[#F4EDE2] py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#C0392B]/90 active:scale-[0.97] transition-all duration-150 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                  Sign In <ArrowUpRight className="w-4 h-4" />
                </>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#F4EDE2]/30">
                {"Don't have an account? "}
                <Link href="/register" className="text-[#E67E22] hover:underline">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
