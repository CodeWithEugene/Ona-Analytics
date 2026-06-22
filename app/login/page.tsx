"use client"

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ArrowUpRight, Loader2, Sun, Moon } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative">
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-[#E67E22]" /> : <Moon className="w-4.5 h-4.5 text-[#C0392B]" />}
        </button>
      )}

      <div className="w-full max-w-md">
        <div className="p-1.5 rounded-[2rem] bg-foreground/5 ring-1 ring-foreground/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8">
            <div className="text-center mb-8 flex flex-col items-center">
              <Link href="/" className="hover:opacity-85 transition-opacity mb-2 block">
                <img src="/logo.svg" alt="Ona Logo" className="h-10 w-auto dark:brightness-0 dark:invert" />
              </Link>
              <p className="text-sm text-foreground/45 mt-1">Operations Command Center</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-foreground/50">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="camp@ona-analytics.com"
                  autoComplete="email"
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-foreground/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm text-foreground/50">Password</label>
                  <Link href="/forgot-password" className="text-xs text-[#E67E22] hover:underline transition-colors">
                    Forgot?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-foreground/20"
                />
              </div>

              {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.97] transition-all duration-150 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                  Sign In <ArrowUpRight className="w-4 h-4" />
                </>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-foreground/40">
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
