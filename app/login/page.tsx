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
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#111] p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display italic">Ona</h1>
              <p className="text-sm text-white/40 mt-2">Operations Command Center</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-white/40">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@camp.com"
                  required
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#E67E22]/50 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/40">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#E67E22]/50 outline-none"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 rounded-full font-medium flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                  Sign In <ArrowUpRight className="w-4 h-4" />
                </>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button onClick={fillDemo} className="text-sm text-[#E67E22]">
                Use demo credentials
              </button>
              <p className="text-xs text-white/20 mt-2">manager@ona-analytics.com / ona-demo-2026</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-white/20 hover:text-white/40">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
