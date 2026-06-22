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
          <h2 className="text-xl font-display italic mb-2">Account created</h2>
          <p className="text-sm text-foreground/45">Redirecting to sign in...</p>
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
              ✦ REGISTER NEW LODGE OR CAMP
            </div>
            <h2 className="text-4xl md:text-5xl font-display italic tracking-tight leading-[1.05] text-[#F4EDE2]">
              Bring demand intelligence to the wild.
            </h2>
            <p className="text-sm text-[#F4EDE2]/60 leading-relaxed max-w-sm font-body">
              Empower your camp operations with AI-native demand radar, automatic logistics dispatch buffers, and custom context retrieval of localized Standard Operating Procedures.
            </p>
          </div>
        </div>

        {/* Dynamic visual representation: HUD simulation card */}
        <div className="relative z-10 my-8 p-1.5 rounded-[1.5rem] bg-white/5 border border-white/10 shadow-xl max-w-sm">
          <div className="bg-[#0A0A0A] rounded-[calc(1.5rem-0.375rem)] p-5 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-white/40 font-mono tracking-wider">SYSTEM CONFIG</span>
              </div>
              <span className="text-[8px] font-mono text-white/30">NEMOTRON CORE v3</span>
            </div>
            <div className="space-y-1.5 text-[10px] font-mono text-white/60">
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

        <div className="relative z-10 text-[10px] font-mono text-[#F4EDE2]/30">
          &copy; 2026 Ona Analytics • Secure off-grid supply integration.
        </div>
      </div>

      {/* Right Column: Form fields */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md my-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Mobile Only Header */}
          <div className="text-center mb-8 flex flex-col items-center lg:hidden">
            <Link href="/" className="hover:opacity-85 transition-opacity mb-2 block">
              <img src="/logo.svg" alt="Ona Logo" className="h-10 w-auto dark:brightness-0 dark:invert" />
            </Link>
            <p className="text-sm text-foreground/40 mt-1">Set up your camp</p>
          </div>

          <div className="p-1.5 rounded-[2rem] bg-foreground/5 ring-1 ring-foreground/5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8">
              {/* Desktop Header */}
              <div className="hidden lg:block mb-8">
                <h3 className="text-2xl font-display italic mb-1 text-foreground">Create your account</h3>
                <p className="text-sm text-foreground/45">Set up your camp operations portal</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="campName" className="text-sm text-foreground/50">Camp Name</label>
                  <input
                    id="campName"
                    type="text"
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    placeholder="e.g. Olare Orok Eco-Lodge"
                    autoComplete="organization"
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-foreground/20"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm text-foreground/50">Location</label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Maasai Mara, Kenya"
                    autoComplete="country-name"
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-foreground/20"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-foreground/50">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Chen"
                    autoComplete="name"
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-foreground/20"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-foreground/50">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@camp.com"
                    autoComplete="email"
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-foreground/20"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm text-foreground/50">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-foreground/20"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm text-foreground/50">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    required
                    minLength={8}
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
                    Create Account <ArrowUpRight className="w-4 h-4" />
                  </>}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-foreground/40">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#E67E22] hover:underline font-semibold">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
