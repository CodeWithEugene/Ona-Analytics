"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ArrowUpRight, Loader2, CheckCircle, Sun, Moon } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold font-sans mb-2">Invalid reset link</h2>
          <p className="text-sm text-foreground/45 mb-6">
            This password reset link is missing a token.
          </p>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-sans mb-2">Password reset</h2>
          <p className="text-sm text-foreground/45">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative">
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all border border-border"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-primary" />}
        </button>
      )}

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="p-1.5 rounded-[2rem] bg-foreground/5 ring-1 ring-foreground/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8 border border-border">
            <div className="text-center mb-8 flex flex-col items-center">
              <Link href="/" className="hover:opacity-85 transition-opacity mb-2 block">
                <img src="/logo.svg" alt="Ona Logo" className="h-8 w-auto dark:brightness-0 dark:invert" />
              </Link>
              <p className="text-xs text-muted-foreground mt-1 font-mono">Choose a new password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground/40 transition-all font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground/40 transition-all font-sans"
                />
              </div>

              {error && <p role="alert" className="text-sm text-destructive font-medium bg-destructive/10 p-2.5 rounded border border-destructive/20">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/95 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                  Reset Password <ArrowUpRight className="w-4 h-4" />
                </>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold">Sign in</Link>
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-foreground/40 animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
