"use client"

import { Suspense, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight, Loader2, CheckCircle } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!token) {
      setError("Invalid reset link. Missing token.")
      setLoading(false)
      return
    }

    if (password.trim() !== confirmPassword.trim()) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: password.trim() }),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || "Failed to reset password")
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/login"), 2000)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [token, password, confirmPassword, router])

  if (!token) {
    return (
      <div className="min-h-screen bg-[#1C1816] text-[#F4EDE2] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-display italic mb-2">Invalid reset link</h2>
          <p className="text-sm text-[#F4EDE2]/40 mb-6">
            This password reset link is missing a token.
          </p>
          <Link href="/forgot-password" className="text-sm text-[#E67E22] hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#1C1816] text-[#F4EDE2] flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-display italic mb-2">Password reset</h2>
          <p className="text-sm text-[#F4EDE2]/40">Redirecting to sign in...</p>
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
              <p className="text-sm text-[#F4EDE2]/40 mt-2">Choose a new password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-[#F4EDE2]/40">New Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full bg-[#0A0A0A] border border-[#F4EDE2]/10 rounded-lg px-4 py-3 text-sm text-[#F4EDE2] focus:ring-2 focus:ring-[#C0392B]/50 outline-none placeholder:text-[#F4EDE2]/20"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm text-[#F4EDE2]/40">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                  minLength={8}
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
                  Reset Password <ArrowUpRight className="w-4 h-4" />
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1C1816] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#F4EDE2]/40 animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
