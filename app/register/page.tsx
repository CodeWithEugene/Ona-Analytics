"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ArrowUpRight, Loader2, CheckCircle, Sun, Moon } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [campName, setCampName] = useState("")
  const [location, setLocation] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const redirectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    return () => {
      if (redirectTimeout.current) clearTimeout(redirectTimeout.current)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password.trim() !== confirmPassword.trim()) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campName: campName.trim(),
          location: location.trim(),
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || "Registration failed")
      } else {
        setSuccess(true)
        redirectTimeout.current = setTimeout(() => router.push("/login"), 2000)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-sans font-bold mb-2">Account created</h2>
          <p className="text-sm text-foreground/50">Redirecting to sign in...</p>
        </div>
      </div>
    )
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
              ✦ REGISTER NEW LODGE OR CAMP
            </div>
            <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-white leading-tight">
              Bring demand intelligence to the wild.
            </h2>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm font-sans">
              Empower your camp operations with AI-native demand radar, automatic logistics dispatch buffers, and custom context retrieval of localized Standard Operating Procedures.
            </p>
          </div>
        </div>

        {/* Dynamic visual representation: HUD simulation card */}
        <div className="relative z-10 my-8 p-4 rounded-xl bg-white/5 border border-white/10 shadow-xl max-w-sm">
          <div className="rounded-lg p-2 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-white/50 font-mono tracking-wider">SYSTEM CONFIG</span>
              </div>
              <span className="text-[8px] font-mono text-white/40">NEMOTRON CORE v3</span>
            </div>
            <div className="space-y-1.5 text-[10px] font-mono text-white/70">
              <div className="flex justify-between">
                <span>Active Suites:</span>
                <span className="text-white">10-25 Tents</span>
              </div>
              <div className="flex justify-between">
                <span>Default Timezone:</span>
                <span className="text-white">Africa/Nairobi</span>
              </div>
              <div className="flex justify-between">
                <span>Database Node:</span>
                <span className="text-white">Aurora Serverless</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] font-mono text-white/30">
          &copy; 2026 Ona Analytics • Secure off-grid supply integration.
        </div>
      </div>

      {/* Right Column: Form fields */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12 overflow-y-auto bg-background">
        <div className="w-full max-w-md my-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Mobile Only Header */}
          <div className="text-center mb-8 flex flex-col items-center lg:hidden">
            <Link href="/" className="hover:opacity-85 transition-opacity mb-2 block">
              <img src="/logo.svg" alt="Ona Logo" className="h-9 w-auto dark:brightness-0 dark:invert" />
            </Link>
            <p className="text-xs text-foreground/50 mt-1">Set up your camp</p>
          </div>

          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg p-8">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h3 className="text-2xl font-sans font-bold tracking-tight mb-1 text-foreground">Create your account</h3>
              <p className="text-sm text-foreground/50">Set up your camp operations portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="campName" className="text-xs font-semibold text-foreground/60">Camp Name</label>
                <input
                  id="campName"
                  type="text"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="e.g. Olare Orok Eco-Lodge"
                  autoComplete="organization"
                  required
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none placeholder:text-foreground/30 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="location" className="text-xs font-semibold text-foreground/60">Location</label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Maasai Mara, Kenya"
                  autoComplete="country-name"
                  required
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none placeholder:text-foreground/30 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-foreground/60">Your Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  autoComplete="name"
                  required
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none placeholder:text-foreground/30 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-foreground/60">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@camp.com"
                  autoComplete="email"
                  required
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none placeholder:text-foreground/30 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-foreground/60">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none placeholder:text-foreground/30 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-foreground/60">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/25 outline-none placeholder:text-foreground/30 transition-all"
                />
              </div>

              {error && <p role="alert" className="text-sm text-destructive font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                  Create Account <ArrowUpRight className="w-4 h-4" />
                </>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-foreground/50">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
