"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  LayoutDashboard, TrendingUp, Truck, Calendar, Settings,
  Sparkles, Menu, X, Send, Loader2, User,
  LogOut, ChevronDown, RefreshCw, Sun, Moon,
} from "lucide-react"
import { Toast } from "@/components/dashboard/Toast"
import { Card } from "@/components/dashboard/Card"
import { Overview } from "@/components/dashboard/Overview"
import { Demand } from "@/components/dashboard/Demand"
import { ProcurementView } from "@/components/dashboard/ProcurementView"
import { Forecasting } from "@/components/dashboard/Forecasting"
import { SettingsView } from "@/components/dashboard/SettingsView"
import { calcOccupancy, calcForecastPeak, calcChange } from "@/components/dashboard/utils"

const navItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "demand", icon: TrendingUp, label: "Demand Radar" },
  { id: "procurement", icon: Truck, label: "Procurement" },
  { id: "forecasting", icon: Calendar, label: "Forecasting" },
  { id: "settings", icon: Settings, label: "Settings" },
]

const ONBOARDING_STEPS = [
  {
    title: "Safari Operations Command Center",
    description: "Welcome to Ona Analytics. This command center coordinates remote safari camp demand and supply. Let's walk through how to predict occupancy surges and optimize isolated logistics.",
    target: "header",
    targetId: "onboarding-header",
    position: "bottom-center",
  },
  {
    title: "14-Day Demand Forecast",
    description: "This radar displays your camp's predicted occupancy (dotted lines) versus actual check-ins (solid lines) computed by our serverless demand intelligence model. Watch for high-demand spikes to prepare kitchen supplies and staff.",
    target: "chart",
    targetId: "onboarding-chart",
    position: "right-center",
  },
  {
    title: "Automated Procurement Recommendations",
    description: "Here, our AI estimates the diesel, fresh produce, dry ingredients, and linen supplies required to sustain the predicted surges, proposing bulk orders that sync with the next isolated truck schedule.",
    target: "procurement_view",
    targetId: "onboarding-procurement-view",
    position: "top-center",
  },
  {
    title: "Ona Intelligent Field Agent",
    description: "Meet the Ona AI Agent. It is trained on camp operation logs, standard operating procedures, and local supplier lead times. Ask it to generate orders, assess inventory risk, or answer questions directly.",
    target: "agent",
    targetId: "onboarding-agent-drawer",
    position: "left-center",
  },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const mustChangePassword = (session?.user as any)?.mustChangePassword
  const orgId = (session?.user as any)?.orgId
  const userEmail = session?.user?.email
  const userName = session?.user?.name || "Camp Manager"
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const onboardingBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (mounted) {
      const completed = localStorage.getItem("ona_onboarding_completed") === "true"
      if (!completed) {
        setShowOnboarding(true)
      }
    }
  }, [mounted])

  const [activeTab, setActiveTab] = useState("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [demandData, setDemandData] = useState<any[]>([])
  const [procurementData, setProcurementData] = useState<any[]>([])
  const [orgData, setOrgData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const chatAbortRef = useRef<AbortController | null>(null)

  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 50,
  })

  const updateTooltipPosition = useCallback(() => {
    if (!showOnboarding) return

    const step = ONBOARDING_STEPS[onboardingStep]
    if (!step) return

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setTooltipStyle({
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 2rem)",
        maxWidth: "380px",
        zIndex: 50,
      })
      return
    }

    const targetEl = document.getElementById(step.targetId)
    if (!targetEl) {
      setTooltipStyle({
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "380px",
        zIndex: 50,
      })
      return
    }

    const rect = targetEl.getBoundingClientRect()
    const tooltipWidth = 380
    const tooltipHeight = 220

    let top = 0
    let left = 0

    switch (step.position) {
      case "bottom-center":
        top = rect.bottom + 16
        left = rect.left + rect.width / 2 - tooltipWidth / 2
        break
      case "right-center":
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.right + 16
        break
      case "left-center":
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.left - tooltipWidth - 16
        break
      case "top-center":
        top = rect.top - tooltipHeight - 16
        left = rect.left + rect.width / 2 - tooltipWidth / 2
        break
      default:
        top = rect.bottom + 16
        left = rect.left + rect.width / 2 - tooltipWidth / 2
    }

    if (typeof window !== "undefined") {
      left = Math.max(20, Math.min(left, window.innerWidth - tooltipWidth - 20))
      top = Math.max(20, Math.min(top, window.innerHeight - tooltipHeight - 20))
    }

    setTooltipStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
      zIndex: 50,
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    })
  }, [onboardingStep, showOnboarding])

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login"
    }
  }, [status])

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
  }, [])

  useEffect(() => {
    if (mustChangePassword) {
      setActiveTab("settings")
      showToast("Please change your password before continuing.", "error")
    }
  }, [mustChangePassword, showToast])

  useEffect(() => {
    if (!showOnboarding) return

    const step = ONBOARDING_STEPS[onboardingStep]
    if (!step) return

    if (step.target === "procurement_view") {
      setActiveTab("procurement")
    } else {
      setActiveTab("overview")
    }

    if (step.target === "agent") {
      setChatOpen(true)
    } else {
      setChatOpen(false)
    }
  }, [onboardingStep, showOnboarding])

  useEffect(() => {
    updateTooltipPosition()
    const timer = setTimeout(() => {
      updateTooltipPosition()
    }, 200)
    return () => clearTimeout(timer)
  }, [onboardingStep, showOnboarding, activeTab, chatOpen, updateTooltipPosition])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateTooltipPosition)
      window.addEventListener("scroll", updateTooltipPosition, true)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateTooltipPosition)
        window.removeEventListener("scroll", updateTooltipPosition, true)
      }
    }
  }, [updateTooltipPosition])

  useEffect(() => {
    if (showOnboarding) {
      onboardingBtnRef.current?.focus()
    }
  }, [onboardingStep, showOnboarding])

  const fetchDashboard = useCallback(async () => {
    if (!orgId) return
    setLoading(true)
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const [demandRes, procRes] = await Promise.allSettled([
        fetch(`/api/demand?orgId=${orgId}&days=30`, { signal: controller.signal }),
        fetch(`/api/procurement?orgId=${orgId}`, { signal: controller.signal }),
      ])

      if (demandRes.status === "fulfilled" && demandRes.value.ok) {
        const json = await demandRes.value.json()
        setDemandData(json.data || [])
      } else if (demandRes.status === "fulfilled") {
        throw new Error(await demandRes.value.text())
      }

      if (procRes.status === "fulfilled" && procRes.value.ok) {
        const json = await procRes.value.json()
        setProcurementData(json.data || [])
      } else if (procRes.status === "fulfilled") {
        throw new Error(await procRes.value.text())
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to fetch dashboard data", err)
      }
    } finally {
      setLoading(false)
    }
  }, [orgId])

  const fetchOrg = useCallback(async () => {
    if (!orgId) return
    const controller = new AbortController()
    try {
      const res = await fetch(`/api/org?orgId=${orgId}`, { signal: controller.signal })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setOrgData(json.data || null)
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to fetch org data", err)
      }
    }
    return () => controller.abort()
  }, [orgId])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])
  useEffect(() => { fetchOrg() }, [fetchOrg])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const occupancy = calcOccupancy(demandData)
  const peak = calcForecastPeak(demandData)
  const change = calcChange(demandData)

  async function sendChatMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || chatLoading || !orgId) return
    const userMsg = chatInput.trim()
    setChatInput("")
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }])
    setChatLoading(true)

    chatAbortRef.current?.abort()
    const controller = new AbortController()
    chatAbortRef.current = controller
    const timeout = setTimeout(() => controller.abort(), 30000)

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setChatMessages(prev => [...prev, { role: "assistant", content: json.response || "Agent unavailable." }])
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Agent unavailable." }])
    } finally {
      clearTimeout(timeout)
      setChatLoading(false)
    }
  }

  async function handleGenerateProcurement() {
    if (!orgId) return
    try {
      const res = await fetch("/api/procurement/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      })
      if (!res.ok) throw new Error("Failed to generate")
      await fetchDashboard()
      showToast("Procurement recommendations generated")
    } catch {
      showToast("Failed to generate procurement", "error")
    }
  }

  async function handleFulfillItem(itemId: string) {
    try {
      const res = await fetch(`/api/procurement/${itemId}/fulfill`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to fulfill")
      await fetchDashboard()
      showToast("Item marked as fulfilled")
    } catch {
      showToast("Failed to fulfill item", "error")
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-foreground/30" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-foreground/10 rounded-lg text-foreground"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link href="/" className="hover:opacity-85 transition-opacity block mb-1">
              <img src="/logo.svg" alt="Ona Logo" className="h-8 w-auto dark:brightness-0 dark:invert" />
            </Link>
            <p className="text-xs text-foreground/45 mt-2">{orgData?.name || "Safari Camp Operations"}</p>
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                      : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="p-3 border-t border-border space-y-1">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-500 ${
                showOnboarding && ONBOARDING_STEPS[onboardingStep]?.target === "agent"
                  ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-card scale-[1.03] shadow-[0_0_15px_rgba(25,118,210,0.35)] text-primary bg-primary/10"
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Ona Agent</span>
            </button>
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-primary" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            )}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-primary">{initials}</span>
                </div>
                <span className="flex-1 text-left truncate">{userName}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {userMenuOpen && (
                <div className="absolute bottom-full left-3 right-3 mb-1 bg-card border border-border z-50 rounded-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <button
                    onClick={() => { setUserMenuOpen(false); setActiveTab("settings") }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    Profile
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); setActiveTab("settings") }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      setOnboardingStep(0)
                      setShowOnboarding(true)
                      localStorage.setItem("ona_onboarding_completed", "false")
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-primary" />
                    Restart Tour
                  </button>
                  <div className="border-t border-border" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-foreground/5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen p-6 pt-20 md:p-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div id="onboarding-header" className={`mb-8 flex items-center justify-between p-4 rounded-xl transition-all duration-500 ${
            showOnboarding && ONBOARDING_STEPS[onboardingStep]?.target === "header"
              ? "ring-2 ring-primary ring-offset-4 dark:ring-offset-background bg-primary/5 shadow-[0_0_25px_rgba(25,118,210,0.25)] scale-[1.01]"
              : ""
          }`}>
            <div>
              <h1 className="text-2xl font-sans font-bold tracking-tight mb-1 text-foreground">{orgData?.name || "Operations Command Center"}</h1>
              <p className="text-sm text-foreground/50">Real-time demand intelligence</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { fetchDashboard(); fetchOrg() }}
                className="p-2 text-foreground/30 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm ring-1 ring-primary/20 hover:bg-primary/20 transition-all duration-500 ${
                  showOnboarding && ONBOARDING_STEPS[onboardingStep]?.target === "agent"
                    ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-[#0A0A0A] scale-[1.03] shadow-[0_0_15px_rgba(25,118,210,0.35)]"
                    : ""
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Ona Agent
              </button>
            </div>
          </div>
          {activeTab === "overview" && (
            <Overview
              demandData={demandData}
              procurementData={procurementData}
              loading={loading}
              occupancy={occupancy}
              peak={peak}
              change={change}
              onRefresh={fetchDashboard}
              activeOnboardingTarget={showOnboarding ? ONBOARDING_STEPS[onboardingStep]?.target : undefined}
            />
          )}
          {activeTab === "demand" && <Demand demandData={demandData} loading={loading} />}
          {activeTab === "procurement" && (
            <div id="onboarding-procurement-view" className={`transition-all duration-500 rounded-2xl ${
              showOnboarding && ONBOARDING_STEPS[onboardingStep]?.target === "procurement_view"
                ? "ring-2 ring-[#E67E22] ring-offset-4 dark:ring-offset-[#0A0A0A] scale-[1.01] shadow-[0_0_25px_rgba(230,126,34,0.25)] bg-[#E67E22]/5"
                : ""
            }`}>
              <ProcurementView
                procurementData={procurementData}
                loading={loading}
                onGenerate={handleGenerateProcurement}
                onFulfill={handleFulfillItem}
              />
            </div>
          )}
          {activeTab === "forecasting" && <Forecasting demandData={demandData} loading={loading} />}
          {activeTab === "settings" && (
            <SettingsView
              orgData={orgData}
              userName={userName}
              userEmail={userEmail}
              onSaved={showToast}
              onOrgUpdated={fetchOrg}
            />
          )}
        </div>
      </main>

      {chatOpen && (
        <div className={`fixed inset-y-0 right-0 z-50 w-96 bg-card border-l border-border flex flex-col shadow-2xl transition-all duration-500 ${
          showOnboarding && ONBOARDING_STEPS[onboardingStep]?.target === "agent"
            ? "ring-2 ring-[#E67E22] ring-inset"
            : ""
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#E67E22]" />
              <span className="font-medium">Ona Agent</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-foreground/5 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center mt-8">
                <Sparkles className="w-8 h-8 text-[#E67E22]/30 mx-auto mb-3" />
                <p className="text-sm text-foreground/40">Ask about occupancy, forecasts, or camp operations.</p>
                <div className="mt-4 space-y-2">
                  {[
                    "What is the current occupancy?",
                    "How much fresh produce do we need?",
                    "Explain the demand forecast trend",
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => { setChatInput(suggestion); document.querySelector<HTMLInputElement>('input[placeholder="Ask Ona..."]')?.focus() }}
                      className="block w-full text-left text-xs text-foreground/40 hover:text-foreground/70 px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user" ? "bg-[#E67E22]/10 text-[#E67E22] ring-1 ring-[#E67E22]/20" : "bg-foreground/5 text-foreground/80"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-foreground/5 rounded-2xl px-4 py-3 text-sm text-foreground/45 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>
          <form onSubmit={sendChatMessage} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask Ona..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#E67E22]/50 placeholder:text-foreground/20"
              />
              <button type="submit" disabled={chatLoading || !chatInput.trim()} className="p-2 bg-[#E67E22] rounded-xl disabled:opacity-50 text-white">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {showOnboarding && ONBOARDING_STEPS[onboardingStep] && (
        <div 
          role="dialog" 
          aria-labelledby="onboarding-title" 
          style={tooltipStyle}
          className="z-50 bg-card border border-border rounded-xl shadow-2xl p-5 flex flex-col gap-4 text-foreground shadow-[0_4px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-300"
        >
          {ONBOARDING_STEPS[onboardingStep].position === "bottom-center" && (
            <div className="hidden md:block absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-2.5 text-card fill-current drop-shadow-[0_-1px_1px_rgba(0,0,0,0.05)]">
              <svg viewBox="0 0 20 10" className="w-full h-full">
                <path d="M0,10 L10,0 L20,10 Z" />
              </svg>
            </div>
          )}
          {ONBOARDING_STEPS[onboardingStep].position === "top-center" && (
            <div className="hidden md:block absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-2.5 text-card fill-current drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
              <svg viewBox="0 0 20 10" className="w-full h-full">
                <path d="M0,0 L10,10 L20,0 Z" />
              </svg>
            </div>
          )}
          {ONBOARDING_STEPS[onboardingStep].position === "right-center" && (
            <div className="hidden md:block absolute -left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-5 text-card fill-current drop-shadow-[-1px_0_1px_rgba(0,0,0,0.05)]">
              <svg viewBox="0 0 10 20" className="w-full h-full">
                <path d="M10,0 L0,10 L10,20 Z" />
              </svg>
            </div>
          )}
          {ONBOARDING_STEPS[onboardingStep].position === "left-center" && (
            <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-5 text-card fill-current drop-shadow-[1px_0_1px_rgba(0,0,0,0.05)]">
              <svg viewBox="0 0 10 20" className="w-full h-full">
                <path d="M0,0 L10,10 L0,20 Z" />
              </svg>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 id="onboarding-title" className="font-sans font-bold text-base text-foreground">
              {ONBOARDING_STEPS[onboardingStep].title}
            </h2>
            <button 
              onClick={() => {
                setShowOnboarding(false)
                localStorage.setItem("ona_onboarding_completed", "true")
              }}
              className="p-1 hover:bg-foreground/5 rounded text-foreground/45 hover:text-foreground transition-colors"
              aria-label="Close onboarding tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-foreground/70 leading-relaxed font-sans">
            {ONBOARDING_STEPS[onboardingStep].description}
          </p>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5" aria-label={`Step ${onboardingStep + 1} of ${ONBOARDING_STEPS.length}`}>
              {ONBOARDING_STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === onboardingStep ? "bg-primary w-4" : "bg-border dark:bg-white/10"
                  }`} 
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {onboardingStep > 0 ? (
                <button
                  onClick={() => setOnboardingStep(prev => prev - 1)}
                  className="text-xs text-foreground/50 hover:text-foreground font-medium px-3 py-1.5 rounded-lg transition-all"
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowOnboarding(false)
                    localStorage.setItem("ona_onboarding_completed", "true")
                  }}
                  className="text-xs text-foreground/50 hover:text-foreground font-medium px-3 py-1.5 rounded-lg transition-all"
                >
                  Skip
                </button>
              )}
              <button
                ref={onboardingBtnRef}
                onClick={() => {
                  if (onboardingStep < ONBOARDING_STEPS.length - 1) {
                    setOnboardingStep(prev => prev + 1)
                  } else {
                    setShowOnboarding(false)
                    localStorage.setItem("ona_onboarding_completed", "true")
                  }
                }}
                className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-lg font-semibold transition-all shadow-sm"
              >
                {onboardingStep === ONBOARDING_STEPS.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
