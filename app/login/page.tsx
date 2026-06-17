"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("manager@ona-analytics.com")
  const [password, setPassword] = useState("ona-demo-2026")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
      setError("Invalid credentials. Try demo@ona-analytics.com / demo1234")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF8F4] dark:bg-[#1C1816] p-4">
      <div className="w-full max-w-md">
        <div className="p-1.5 rounded-[2rem] bg-[#1C1816]/5 dark:bg-[#FBF8F4]/5 ring-1 ring-[#1C1816]/5 dark:ring-[#FBF8F4]/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF8F4] dark:bg-[#1C1816] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-display italic tracking-tight">
                Ona
                <span className="block not-italic text-sm font-body font-normal text-[#1C1816]/40 dark:text-[#FBF8F4]/40 mt-1">
                  Sign in to your dashboard
                </span>
              </h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#1C1816]/70 dark:text-[#FBF8F4]/70">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@ona-analytics.com"
                  required
                  className="bg-[#FBF8F4] dark:bg-[#1C1816] border-[#1C1816]/10 dark:border-[#FBF8F4]/10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[#1C1816]/70 dark:text-[#FBF8F4]/70">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-[#FBF8F4] dark:bg-[#1C1816] border-[#1C1816]/10 dark:border-[#FBF8F4]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1C1816]/40 hover:text-[#1C1816]/70 dark:text-[#FBF8F4]/40"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-sm text-[#C44]">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1816] dark:bg-[#D4A853] px-7 py-3 text-sm font-medium text-[#FBF8F4] dark:text-[#1C1816] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#1C1816]/90 dark:hover:bg-[#D4A853]/90 active:scale-[0.97] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            <p className="text-xs text-[#1C1816]/30 dark:text-[#FBF8F4]/30 text-center mt-6">
              Demo: manager@ona-analytics.com / ona-demo-2026
            </p>
          </div>
        </div>
        <div className="text-center mt-6">
          <a href="/" className="text-xs text-[#1C1816]/30 dark:text-[#FBF8F4]/30 hover:text-[#1C1816]/60 dark:hover:text-[#FBF8F4]/60 transition-colors">
            Back to home
          </a>
        </div>
      </div>
    </div>
  )
}
