"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Loader2, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || "Request failed")
      } else {
        setSent(true)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#1C1816] text-[#F4EDE2] flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-display italic mb-2">Check your email</h2>
          <p className="text-sm text-[#F4EDE2]/40 max-w-sm">
            If an account with that email exists, a reset link has been sent.
          </p>
          <Link href="/login" className="inline-block mt-6 text-sm text-[#E67E22] hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1C1816] text-[#F4EDE2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="p-1.5 rounded-[2rem] bg-[#F4EDE2]/5 ring-1 ring-[#F4EDE2]/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#1C1816] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display italic text-[#F4EDE2]">Ona</h1>
              <p className="text-sm text-[#F4EDE2]/40 mt-2">Reset your password</p>
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

              {error && <p role="alert" className="text-sm text-[#C0392B]">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C0392B] text-[#F4EDE2] py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#C0392B]/90 active:scale-[0.97] transition-all duration-150 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                  Send Reset Link <ArrowUpRight className="w-4 h-4" />
                </>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#F4EDE2]/30">
                Remember your password?{" "}
                <Link href="/login" className="text-[#E67E22] hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
