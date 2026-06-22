"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ArrowUpRight, Loader2, CheckCircle, Sun, Moon } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-sans mb-2">Check your email</h2>
          <p className="text-sm text-foreground/45 max-w-sm">
            If an account with that email exists, a reset link has been sent.
          </p>
          <Link href="/login" className="inline-block mt-6 text-sm text-primary hover:underline">
            Back to sign in
          </Link>
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
              <p className="text-xs text-muted-foreground mt-1 font-mono">Reset your password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="camp@ona-analytics.com"
                  autoComplete="email"
                  required
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
                  Send Reset Link <ArrowUpRight className="w-4 h-4" />
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
