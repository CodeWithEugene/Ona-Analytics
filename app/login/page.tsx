"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
      setError("Invalid email or password. Use manager@ona-analytics.com / ona-demo-2026")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  function fillDemo() {
    setEmail("manager@ona-analytics.com")
    setPassword("ona-demo-2026")
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
            <form onSubmit={handleSubmit} className="space-y-4 mt-8" noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#1C1816]/70 dark:text-[#FBF8F4]/70">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@camp.com"
                  autoComplete="email"
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="bg-[#FBF8F4] dark:bg-[#1C1816] border-[#1C1816]/10 dark:border-[#FBF8F4]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                <p className="text-sm text-[#C44]" role="alert">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1C1816] dark:bg-[#D4A853] px-7 py-3 text-sm font-medium text-[#FBF8F4] dark:text-[#1C1816] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#1C1816]/90 dark:hover:bg-[#D4A853]/90 active:scale-[0.97] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={fillDemo}
                className="text-xs text-[#D4A853] hover:text-[#D4A853]/80 underline underline-offset-2 transition-colors"
              >
                Use demo credentials
              </button>
            </div>
            <p className="text-xs text-[#1C1816]/20 dark:text-[#FBF8F4]/20 text-center mt-2">
              Demo: manager@ona-analytics.com / ona-demo-2026
            </p>
          </div>
        </div>
        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-[#1C1816]/30 dark:text-[#FBF8F4]/30 hover:text-[#1C1816]/60 dark:hover:text-[#FBF8F4]/60 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
