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
          {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-primary" /> : <Moon className="w-4.5 h-4.5 text-primary" />}
        </button>
      )}

      {/* Left Column: MUI Gradient & Visual Storytelling */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#0B0F19] dark:bg-[#070A13] text-white p-12 flex-col justify-between relative overflow-hidden border-r border-border/10">
        {/* MUI Inspired Radial Glow */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="hover:opacity-85 transition-opacity inline-block mb-12">
            <img src="/logo.svg" alt="Ona Logo" className="h-9 w-auto dark:brightness-0 dark:invert" />
          </Link>
          
          <div className="space-y-6 mt-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary font-mono">
              ✦ DEMAND RADAR & LOGISTICS CONTROL
            </div>
            <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
              Securing supply lines in the wild.
            </h2>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm font-sans">
              Ona Analytics connects occupancy forecasts with automatic procurement triggers. Prevent kitchen stockouts and optimize isolated supply trucks days before check-in.
            </p>
          </div>
        </div>

        {/* Dynamic visual representation: HUD simulation card */}
        <div className="relative z-10 my-8 p-4 rounded-xl bg-white/5 border border-white/10 shadow-xl max-w-sm">
          <div className="rounded-lg p-2 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] text-white/50 font-mono tracking-wider">SUPPLY ROUTE ACTIVE</span>
              </div>
              <span className="text-[8px] font-mono text-white/40">SEKENANI GATE BYPASS</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] bg-white/[0.03] p-2.5 rounded border border-white/[0.04]">
                <span className="text-white/70">Truck A (Produce)</span>
                <span className="text-primary font-mono">140km left</span>
              </div>
              <div className="flex items-center justify-between text-[10px] bg-white/[0.03] p-2.5 rounded border border-white/[0.04]">
                <span className="text-white/70">Rain Alert Buffer</span>
                <span className="text-red-400 font-mono">-12h Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] font-mono text-white/30">
          &copy; 2026 Ona Analytics • Active operations across East Africa.
        </div>
      </div>

      {/* Right Column: Form fields */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Mobile Only Header */}
          <div className="text-center mb-8 flex flex-col items-center lg:hidden">
            <Link href="/" className="hover:opacity-85 transition-opacity mb-2 block">
              <img src="/logo.svg" alt="Ona Logo" className="h-9 w-auto dark:brightness-0 dark:invert" />
            </Link>
            <p className="text-xs text-foreground/50 mt-1">Operations Command Center</p>
          </div>

          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg p-8">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h3 className="text-2xl font-sans font-bold tracking-tight mb-1 text-foreground">Welcome back</h3>
              <p className="text-sm text-foreground/50">Operations Command Center</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-foreground/60">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="camp@ona-analytics.com"
                  autoComplete="email"
                  required
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none placeholder:text-foreground/30 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-semibold text-foreground/60">Password</label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline transition-colors font-medium">
                    Forgot Password?
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
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none placeholder:text-foreground/30 transition-all"
                />
              </div>

              {error && <p role="alert" className="text-sm text-destructive font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                  Sign In <ArrowUpRight className="w-4 h-4" />
                </>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-foreground/50">
                {"Don't have an account? "}
                <Link href="/register" className="text-primary hover:underline font-semibold">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
