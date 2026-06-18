"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import {
  LayoutDashboard, TrendingUp, Truck, Calendar, Settings,
  Sparkles, Menu, X, Send, Loader2, User,
  LogOut, ChevronDown, RefreshCw,
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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const orgId = (session?.user as any)?.orgId
  const userEmail = session?.user?.email
  const userName = session?.user?.name || "Camp Manager"
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

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

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login"
    }
  }, [status])

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
  }, [])

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
      <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-white/30" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1] flex">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 rounded-lg"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0A0A0A] border-r border-white/5 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link href="/" className="text-xl font-display italic">Ona</Link>
            <p className="text-xs text-white/30 mt-1">{orgData?.name || "Safari Camp Operations"}</p>
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
                      ? "bg-[#E67E22]/10 text-[#E67E22] ring-1 ring-[#E67E22]/20"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="p-3 border-t border-white/5 space-y-1">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-[#E67E22]" />
              <span>Ona Agent</span>
            </button>
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-[#E67E22]/20 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-[#E67E22]">{initials}</span>
                </div>
                <span className="flex-1 text-left truncate">{userName}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {userMenuOpen && (
                <div className="absolute bottom-full left-3 right-3 mb-1 bg-[#1a1a1a] rounded-xl ring-1 ring-white/10 overflow-hidden shadow-2xl">
                  <button
                    onClick={() => { setUserMenuOpen(false); setActiveTab("settings") }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    Profile
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); setActiveTab("settings") }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Settings
                  </button>
                  <div className="border-t border-white/5" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors"
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

      <main className="flex-1 min-h-screen p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display italic mb-1">{orgData?.name || "Operations Command Center"}</h1>
              <p className="text-sm text-white/40">Real-time demand intelligence</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { fetchDashboard(); fetchOrg() }}
                className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#E67E22]/10 text-[#E67E22] text-sm ring-1 ring-[#E67E22]/20 hover:bg-[#E67E22]/20 transition-all"
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
            />
          )}
          {activeTab === "demand" && <Demand demandData={demandData} loading={loading} />}
          {activeTab === "procurement" && (
            <ProcurementView
              procurementData={procurementData}
              loading={loading}
              onGenerate={handleGenerateProcurement}
              onFulfill={handleFulfillItem}
            />
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
        <div className="fixed inset-y-0 right-0 z-50 w-96 bg-[#0A0A0A] border-l border-white/5 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#E67E22]" />
              <span className="font-medium">Ona Agent</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-white/5 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center mt-8">
                <Sparkles className="w-8 h-8 text-[#E67E22]/30 mx-auto mb-3" />
                <p className="text-sm text-white/40">Ask about occupancy, forecasts, or camp operations.</p>
                <div className="mt-4 space-y-2">
                  {[
                    "What is the current occupancy?",
                    "How much fresh produce do we need?",
                    "Explain the demand forecast trend",
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => { setChatInput(suggestion); document.querySelector<HTMLInputElement>('input[placeholder="Ask Ona..."]')?.focus() }}
                      className="block w-full text-left text-xs text-white/30 hover:text-white/60 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
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
                  msg.role === "user" ? "bg-[#E67E22]/10 text-[#E67E22] ring-1 ring-[#E67E22]/20" : "bg-white/5 text-white/80"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 rounded-2xl px-4 py-3 text-sm text-white/40 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>
          <form onSubmit={sendChatMessage} className="p-4 border-t border-white/5">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask Ona..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#E67E22]/50 placeholder:text-white/20"
              />
              <button type="submit" disabled={chatLoading || !chatInput.trim()} className="p-2 bg-[#E67E22] rounded-xl disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
