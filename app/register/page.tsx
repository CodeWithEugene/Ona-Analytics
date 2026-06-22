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
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all border border-border"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-primary" />}
        </button>
      )}

      {/* Left Column: Theme-aware visual dashboard panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-muted/30 dark:bg-muted/10 text-foreground p-12 flex-col justify-between relative overflow-hidden border-r border-border">
        {/* Subtle Brand Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="hover:opacity-85 transition-opacity inline-block mb-12">
            <img src="/logo.svg" alt="Ona Logo" className="h-12 w-auto dark:brightness-0 dark:invert" />
          </Link>
          
          <div className="space-y-6 mt-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary font-mono">
              ✦ REGISTER NEW LODGE OR CAMP
            </div>
            <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-foreground leading-tight">
              Bring demand intelligence to the wild.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-sans">
              Empower your camp operations with AI-native demand radar, automatic logistics dispatch buffers, and custom context retrieval of localized Standard Operating Procedures.
            </p>
          </div>
        </div>

        {/* Dynamic visual representation: Clean Material UI status card */}
        <div className="relative z-10 my-8 p-1.5 rounded-[2rem] bg-foreground/5 ring-1 ring-foreground/5 shadow-sm max-w-sm">
          <div className="bg-card text-card-foreground border border-border rounded-[calc(2rem-0.375rem)] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground font-mono tracking-wider">SYSTEM CONFIG</span>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">NEMOTRON CORE v3</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-foreground/80">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span>Active Suites:</span>
                <span className="font-semibold text-foreground">10-25 Tents</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span>Default Timezone:</span>
                <span className="font-semibold text-foreground">Africa/Nairobi</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Database Node:</span>
                <span className="font-semibold text-foreground">Aurora Serverless</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] font-mono text-muted-foreground">
          &copy; 2026 Ona Analytics • Secure off-grid supply integration.
        </div>
      </div>

      {/* Right Column: Form fields */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12 overflow-y-auto bg-background">
        <div className="w-full max-w-md my-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Mobile Only Header */}
          <div className="text-center mb-8 flex flex-col items-center lg:hidden">
            <Link href="/" className="hover:opacity-85 transition-opacity mb-2 block">
              <img src="/logo.svg" alt="Ona Logo" className="h-12 w-auto dark:brightness-0 dark:invert" />
            </Link>
            <p className="text-xs text-muted-foreground mt-1 font-mono">Set up your camp</p>
          </div>

          <div className="bg-card text-card-foreground border border-border rounded-xl shadow-sm p-8">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h3 className="text-2xl font-sans font-bold tracking-tight mb-1 text-foreground">Create your account</h3>
              <p className="text-sm text-muted-foreground font-mono">Set up your camp operations portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="campName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Camp Name</label>
                <input
                  id="campName"
                  type="text"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="e.g. Olare Orok Eco-Lodge"
                  autoComplete="organization"
                  required
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground/40 transition-all font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="location" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Maasai Mara, Kenya"
                  autoComplete="country-name"
                  required
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground/40 transition-all font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  autoComplete="name"
                  required
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground/40 transition-all font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@camp.com"
                  autoComplete="email"
                  required
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground/40 transition-all font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground/40 transition-all font-sans"
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
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground/40 transition-all font-sans"
                />
              </div>

              {error && <p role="alert" className="text-sm text-destructive font-medium bg-destructive/10 p-2.5 rounded border border-destructive/20">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/95 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                  Create Account <ArrowUpRight className="w-4 h-4" />
                </>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
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
