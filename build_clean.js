const fs = require('fs');
const path = require('path');

console.log("Starting clean build...");

// 1. Clean globals.css
const globals = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 4%;
    --foreground: 30 10% 90%;
    --card: 0 0% 8%;
    --card-foreground: 30 10% 90%;
    --popover: 0 0% 8%;
    --popover-foreground: 30 10% 90%;
    --primary: 28 91% 52%;
    --primary-foreground: 0 0% 4%;
    --secondary: 160 30% 20%;
    --secondary-foreground: 30 10% 90%;
    --muted: 0 0% 15%;
    --muted-foreground: 30 5% 60%;
    --accent: 28 91% 52%;
    --accent-foreground: 0 0% 4%;
    --destructive: 0 70% 50%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 20%;
    --input: 0 0% 20%;
    --ring: 28 91% 52%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body), system-ui, sans-serif;
  }
}`;

fs.writeFileSync(path.join(__dirname, 'app', 'globals.css'), globals);
console.log("globals.css written");

// 2. Clean login page
const login = `"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
      setError("Invalid credentials.")
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
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#111111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display italic tracking-tight text-[#E8E6E1]">
                Ona
              </h1>
              <p className="text-sm text-[#E8E6E1]/40 mt-2">
                Operations Command Center
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-[#E8E6E1]/60">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@camp.com"
                  autoComplete="email"
                  required
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#E8E6E1] placeholder:text-[#E8E6E1]/20 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-[#E8E6E1]/60">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#E8E6E1] placeholder:text-[#E8E6E1]/20 focus:outline-none focus:ring-2 focus:ring-[#E67E22]/50"
                />
              </div>

              {error && (
                <p className="text-sm text-[#C0392B]" role="alert">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E8E6E1] text-[#0A0A0A] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#E8E6E1]/90 transition-all duration-200 active:scale-[0.97] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={fillDemo}
                className="text-sm text-[#E67E22] hover:text-[#E67E22]/80 transition-colors"
              >
                Use demo credentials
              </button>
              <p className="text-xs text-[#E8E6E1]/20 mt-2">
                manager@ona-analytics.com / ona-demo-2026
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-[#E8E6E1]/30 hover:text-[#E8E6E1]/60 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}`;

fs.writeFileSync(path.join(__dirname, 'app', 'login', 'page.tsx'), login);
console.log("Login page written");

// 3. New Dashboard Page
const dashboard = `"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1]">
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-display italic tracking-tight text-[#E8E6E1]">
            Ona
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#E8E6E1]/40 hidden md:inline">Serengeti Camp Operations</span>
            <div className="h-8 w-8 rounded-full bg-[#E67E22]/20 flex items-center justify-center">
              <span className="text-xs font-medium">SC</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-display italic text-[#E8E6E1] mb-2">Operations Command Center</h1>
            <p className="text-sm text-[#E8E6E1]/40">Real-time demand intelligence and supply chain monitoring</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#111111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#E8E6E1]/40">Current Occupancy</span>
                  <TrendingUp className="w-4 h-4 text-[#E67E22]" />
                </div>
                <div className="text-3xl font-bold text-[#E8E6E1] mb-1">67%</div>
                <p className="text-xs text-[#E8E6E1]/40">32 of 48 rooms occupied</p>
              </div>
            </div>

            <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#111111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#E8E6E1]/40">Weekend Forecast</span>
                  <AlertTriangle className="w-4 h-4 text-[#C0392B]" />
                </div>
                <div className="text-3xl font-bold text-[#C0392B] mb-1">94%</div>
                <p className="text-xs text-[#E8E6E1]/40">High demand alert - act now</p>
              </div>
            </div>

            <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#111111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#E8E6E1]/40">Supply Chain Status</span>
                  <CheckCircle className="w-4 h-4 text-[#27AE60]" />
                </div>
                <div className="text-3xl font-bold text-[#27AE60] mb-1">Normal</div>
                <p className="text-xs text-[#E8E6E1]/40">Next truck arrives in 3 days</p>
              </div>
            </div>
          </div>

          {/* Chart and Tables */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Demand Chart */}
            <div className="md:col-span-2 p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#111111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-6">
                <h3 className="text-lg font-display italic mb-6">14-Day Demand Forecast</h3>
                <div className="h-64 flex items-end gap-2">
                  {[40,55,45,70,60,85,75,90,65,80,70,95,85,100].map((h,i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-1">
                      <div 
                        className="w-full bg-[#E67E22]/40 rounded-sm transition-all hover:bg-[#E67E22]/60"
                        style={{height: h + '%'}} 
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-[#E8E6E1]/30">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#111111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-6">
                <h3 className="text-lg font-display italic mb-6">Action Items</h3>
                <div className="space-y-4">
                  {[
                    { item: "Order diesel fuel", urgency: "High", color: "text-[#C0392B]" },
                    { item: "Restock fresh produce", urgency: "Medium", color: "text-[#E67E22]" },
                    { item: "Schedule generator maintenance", urgency: "Low", color: "text-[#27AE60]" },
                    { item: "Confirm Wednesday arrivals", urgency: "High", color: "text-[#C0392B]" },
                  ].map((action, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-sm text-[#E8E6E1]">{action.item}</p>
                        <p className={`text-xs ${action.color}`}>{action.urgency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Procurement Table */}
          <div className="mt-6 p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#111111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-6">
              <h3 className="text-lg font-display italic mb-6">Procurement List</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-xs text-[#E8E6E1]/40 py-3 px-4">Item</th>
                      <th className="text-left text-xs text-[#E8E6E1]/40 py-3 px-4">Category</th>
                      <th className="text-left text-xs text-[#E8E6E1]/40 py-3 px-4">Qty</th>
                      <th className="text-left text-xs text-[#E8E6E1]/40 py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { item: "Diesel Fuel", category: "Energy", qty: "200L", status: "Urgent" },
                      { item: "Fresh Vegetables", category: "Food", qty: "50kg", status: "Pending" },
                      { item: "Linen Set", category: "Housekeeping", qty: "20", status: "Ordered" },
                      { item: "Borehole Parts", category: "Maintenance", qty: "1 set", status: "In Transit" },
                    ].map((item, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0">
                        <td className="py-3 px-4 text-sm text-[#E8E6E1]">{item.item}</td>
                        <td className="py-3 px-4 text-sm text-[#E8E6E1]/60">{item.category}</td>
                        <td className="py-3 px-4 text-sm text-[#E8E6E1]/60">{item.qty}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.status === "Urgent" ? "bg-[#C0392B]/20 text-[#C0392B]" :
                            item.status === "Pending" ? "bg-[#E67E22]/20 text-[#E67E22]" :
                            item.status === "Ordered" ? "bg-[#2980B9]/20 text-[#2980B9]" :
                            "bg-[#27AE60]/20 text-[#27AE60]"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}`;

fs.writeFileSync(path.join(__dirname, 'app', 'dashboard', 'page.tsx'), dashboard);
console.log("Dashboard page written");

console.log("Build complete!");