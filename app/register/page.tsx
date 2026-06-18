"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight, Loader2, CheckCircle } from "lucide-react"

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campName, location, name, email, password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Registration failed")
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/login"), 2000)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#1C1816] text-[#F4EDE2] flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-display italic mb-2">Account created</h2>
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
              <Link href="/" className="text-2xl font-display italic text-[#F4EDE2]">Ona</Link>
              <p className="text-sm text-[#F4EDE2]/40 mt-2">Set up your camp</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-[#F4EDE2]/40">Camp Name</label>
                <input
                  type="text"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="e.g. Olare Orok Eco-Lodge"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#F4EDE2]/10 rounded-lg px-4 py-3 text-sm text-[#F4EDE2] focus:ring-2 focus:ring-[#C0392B]/50 outline-none placeholder:text-[#F4EDE2]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#F4EDE2]/40">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Maasai Mara, Kenya"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#F4EDE2]/10 rounded-lg px-4 py-3 text-sm text-[#F4EDE2] focus:ring-2 focus:ring-[#C0392B]/50 outline-none placeholder:text-[#F4EDE2]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#F4EDE2]/40">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#F4EDE2]/10 rounded-lg px-4 py-3 text-sm text-[#F4EDE2] focus:ring-2 focus:ring-[#C0392B]/50 outline-none placeholder:text-[#F4EDE2]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#F4EDE2]/40">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@camp.com"
                  required
                  className="w-full bg-[#0A0A0A] border border-[#F4EDE2]/10 rounded-lg px-4 py-3 text-sm text-[#F4EDE2] focus:ring-2 focus:ring-[#C0392B]/50 outline-none placeholder:text-[#F4EDE2]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#F4EDE2]/40">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full bg-[#0A0A0A] border border-[#F4EDE2]/10 rounded-lg px-4 py-3 text-sm text-[#F4EDE2] focus:ring-2 focus:ring-[#C0392B]/50 outline-none placeholder:text-[#F4EDE2]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#F4EDE2]/40">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  minLength={8}
                  className="w-full bg-[#0A0A0A] border border-[#F4EDE2]/10 rounded-lg px-4 py-3 text-sm text-[#F4EDE2] focus:ring-2 focus:ring-[#C0392B]/50 outline-none placeholder:text-[#F4EDE2]/20"
                />
              </div>

              {error && <p className="text-sm text-[#C0392B]">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C0392B] text-[#F4EDE2] py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#C0392B]/90 active:scale-[0.97] transition-all duration-150 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                  Create Account <ArrowUpRight className="w-4 h-4" />
                </>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#F4EDE2]/30">
                Already have an account?{" "}
                <Link href="/login" className="text-[#E67E22] hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
