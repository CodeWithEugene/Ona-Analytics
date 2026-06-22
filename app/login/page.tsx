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
    <div className="min-h-screen bg-background text-foreground grid lg:grid-cols-12 relative overflow-hidden">
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-[#E67E22]" /> : <Moon className="w-4.5 h-4.5 text-[#C0392B]" />}
        </button>
      )}

      {/* Left Column: Rich visual storytelling (hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#171514] text-[#F4EDE2] p-12 flex-col justify-between relative overflow-hidden border-r border-[#1C1816]/10 dark:border-white/5">
        {/* Glow effect */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#C0392B]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="hover:opacity-85 transition-opacity inline-block mb-12">
            <img src="/logo.svg" alt="Ona Logo" className="h-10 w-auto brightness-0 invert" />
          </Link>
          
          <div className="space-y-6 mt-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C0392B]/30 bg-[#C0392B]/10 px-3.5 py-1 text-xs font-semibold text-[#C0392B] font-mono">
              ✦ DEMAND RADAR & LOGISTICS CONTROL
            </div>
            <h2 className="text-4xl md:text-5xl font-display italic tracking-tight leading-[1.05] text-[#F4EDE2]">
              Securing supply lines in the wild.
            </h2>
            <p className="text-sm text-[#F4EDE2]/60 leading-relaxed max-w-sm font-body">
              Ona Analytics connects occupancy forecasts with automatic procurement triggers. Prevent kitchen stockouts and optimize isolated supply trucks days before check-in.
            </p>
          </div>
        </div>

        {/* Dynamic visual representation: HUD simulation card */}
        <div className="relative z-10 my-8 p-1.5 rounded-[1.5rem] bg-white/5 border border-white/10 shadow-xl max-w-sm">
          <div className="bg-[#0A0A0A] rounded-[calc(1.5rem-0.375rem)] p-5 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E67E22] animate-pulse" />
                <span className="text-[9px] text-white/40 font-mono tracking-wider">SUPPLY ROUTE ACTIVE</span>
              </div>
              <span className="text-[8px] font-mono text-white/30">SEKENANI GATE BYPASS</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] bg-white/[0.02] p-2.5 rounded border border-white/[0.03]">
                <span className="text-white/60">Truck A (Produce)</span>
                <span className="text-emerald-400 font-mono">140km left</span>
              </div>
              <div className="flex items-center justify-between text-[10px] bg-white/[0.02] p-2.5 rounded border border-white/[0.03]">
                <span className="text-white/60">Rain Alert Buffer</span>
                <span className="text-[#C0392B] font-mono">-12h Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] font-mono text-[#F4EDE2]/30">
          &copy; 2026 Ona Analytics • Active operations across East Africa.
        </div>
      </div>

      {/* Right Column: Form fields */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Mobile Only Header */}
          <div className="text-center mb-8 flex flex-col items-center lg:hidden">
            <Link href="/" className="hover:opacity-85 transition-opacity mb-2 block">
              <img src="/logo.svg" alt="Ona Logo" className="h-10 w-auto dark:brightness-0 dark:invert" />
            </Link>
            <p className="text-sm text-foreground/45 mt-1">Operations Command Center</p>
          </div>

          <div className="p-1.5 rounded-[2rem] bg-foreground/5 ring-1 ring-foreground/5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8">
              {/* Desktop Header */}
              <div className="hidden lg:block mb-8">
                <h3 className="text-2xl font-display italic mb-1 text-foreground">Welcome back</h3>
                <p className="text-sm text-foreground/45">Operations Command Center</p>
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
                  className="w-full bg-primary text-primary-foreground py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.97] transition-all duration-150 disabled:opacity-50 animate-pulse-subtle"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                    Sign In <ArrowUpRight className="w-4 h-4" />
                  </>}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-foreground/40">
                  {"Don't have an account? "}
                  <Link href="/register" className="text-[#E67E22] hover:underline font-semibold">Create one</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
