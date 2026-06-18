"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import {
  LayoutDashboard, TrendingUp, Truck, Calendar, Settings,
  Sparkles, Menu, X, Send, Loader2, MapPin, Clock, User,
  LogOut, ChevronDown, CheckCircle, RefreshCw, Save, Eye, EyeOff,
} from "lucide-react"

const navItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "demand", icon: TrendingUp, label: "Demand Radar" },
  { id: "procurement", icon: Truck, label: "Procurement" },
  { id: "forecasting", icon: Calendar, label: "Forecasting" },
  { id: "settings", icon: Settings, label: "Settings" },
]

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5 ${className || ''}`}>
      <div className="rounded-[calc(2rem-0.375rem)] bg-[#111] p-6">
        {children}
      </div>
    </div>
  )
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-2 ${
      type === "success" ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30" : "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
    }`}>
      {message}
    </div>
  )
}

function calcOccupancy(data: any[]) {
  if (!data || data.length === 0) return null
  const last = data[data.length - 1]
  return last.actual_value !== null ? Math.round(last.actual_value) : Math.round(last.predicted_value)
}

function calcForecastPeak(data: any[]) {
  if (!data || data.length === 0) return null
  const peaks = data.map(d => d.predicted_value || d.actual_value || 0)
  return Math.round(Math.max(...peaks))
}

function calcChange(data: any[]) {
  if (!data || data.length < 14) return null
  const recent = data.slice(-7)
  const old = data.slice(-14, -7)
  if (old.length === 0) return null
  const avgRecent = recent.reduce((s, d) => s + (d.actual_value || d.predicted_value || 0), 0) / recent.length
  const avgOld = old.reduce((s, d) => s + (d.actual_value || d.predicted_value || 0), 0) / old.length
  return Math.round(((avgRecent - avgOld) / avgOld) * 100)
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const orgId = (session?.user as any)?.orgId
  const userId = session?.user?.id
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

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
  }, [])

  const fetchDashboard = useCallback(async () => {
    if (!orgId) return
    try {
      const [demandRes, procRes] = await Promise.all([
        fetch(`/api/demand?orgId=${orgId}&days=30`),
        fetch(`/api/procurement?orgId=${orgId}`),
      ])
      const [demandJson, procJson] = await Promise.all([
        demandRes.json(),
        procRes.json(),
      ])
      setDemandData(demandJson.data || [])
      setProcurementData(procJson.data || [])
    } catch (err) {
      console.error("Failed to fetch dashboard data", err)
    } finally {
      setLoading(false)
    }
  }, [orgId])

  const fetchOrg = useCallback(async () => {
    if (!orgId) return
    try {
      const res = await fetch(`/api/org?orgId=${orgId}`)
      const json = await res.json()
      setOrgData(json.data || null)
    } catch (err) {
      console.error("Failed to fetch org data", err)
    }
  }, [orgId])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])
  useEffect(() => { fetchOrg() }, [fetchOrg])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const occupancy = calcOccupancy(demandData)
  const peak = calcForecastPeak(demandData)
  const change = calcChange(demandData)
  const isAuthReady = status !== "loading" && !!orgId

  async function sendChatMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || chatLoading || !orgId) return
    const userMsg = chatInput.trim()
    setChatInput("")
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }])
    setChatLoading(true)
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, orgId }),
      })
      const json = await res.json()
      setChatMessages(prev => [...prev, { role: "assistant", content: json.response || "Agent unavailable." }])
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Agent unavailable." }])
    } finally {
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
              userId={userId}
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
                      onClick={() => setChatInput(suggestion)}
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

function Overview({ demandData, procurementData, loading, occupancy, peak, change, onRefresh }: {
  demandData: any[]; procurementData: any[]; loading: boolean;
  occupancy: number | null; peak: number | null; change: number | null;
  onRefresh: () => void;
}) {
  const urgentCount = procurementData.filter((p: any) => p.urgency === "High" || p.urgency === "high").length

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/40">Current Occupancy</span>
            <TrendingUp className="w-4 h-4 text-[#E67E22]" />
          </div>
          {loading ? (
            <div className="h-10 w-16 bg-white/5 rounded animate-pulse" />
          ) : occupancy !== null ? (
            <>
              <div className="text-3xl font-bold mb-1">{occupancy}%</div>
              {change !== null && (
                <p className="text-xs text-white/30">{change > 0 ? `+${change}% vs last week` : `${change}% vs last week`}</p>
              )}
            </>
          ) : (
            <div className="text-sm text-white/20">No data</div>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/40">Peak Forecast (14d)</span>
            <TrendingUp className="w-4 h-4 text-red-400" />
          </div>
          {loading ? (
            <div className="h-10 w-16 bg-white/5 rounded animate-pulse" />
          ) : peak !== null ? (
            <>
              <div className={`text-3xl font-bold mb-1 ${peak > 85 ? 'text-red-400' : 'text-[#E67E22]'}`}>{peak}%</div>
              <p className="text-xs text-white/30">{peak > 85 ? 'High demand alert' : 'Normal range'}</p>
            </>
          ) : (
            <div className="text-sm text-white/20">No forecast data</div>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/40">Urgent Procurement</span>
            <Truck className="w-4 h-4 text-[#E67E22]" />
          </div>
          {loading ? (
            <div className="h-10 w-16 bg-white/5 rounded animate-pulse" />
          ) : (
            <>
              <div className={`text-3xl font-bold mb-1 ${urgentCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{urgentCount > 0 ? urgentCount : 0}</div>
              <p className="text-xs text-white/30">{urgentCount > 0 ? 'Requires immediate action' : 'All items fulfilled'}</p>
            </>
          )}
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display italic">14-Day Demand Forecast</h3>
              <button onClick={onRefresh} className="text-xs text-white/30 hover:text-white p-1">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            {loading ? (
              <div className="h-64 bg-white/5 rounded animate-pulse" />
            ) : (
              <div className="h-64 flex items-end gap-2">
                {demandData.length > 0 ? demandData.slice(-14).map((d: any, i: number) => {
                  const val = d.actual_value || d.predicted_value || 0
                  return (
                    <div key={i} className="flex-1 relative group cursor-pointer">
                      <div
                        className="bg-gradient-to-t from-[#E67E22]/30 to-[#E67E22]/10 rounded-t-sm transition-all duration-200 hover:from-[#E67E22]/50 hover:to-[#E67E22]/20"
                        style={{ height: val + "%" }}
                      />
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                        {Math.round(val)}%
                      </div>
                    </div>
                  )
                }) : (
                  <div className="flex items-center justify-center w-full h-full text-white/20 text-sm">No demand data available</div>
                )}
              </div>
            )}
          </Card>
        </div>
        <div>
          <Card>
            <h3 className="text-lg font-display italic mb-6">Action Items</h3>
            {loading ? (
              <div className="space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />)}
              </div>
            ) : procurementData.length > 0 ? (
              <div className="space-y-4">
                {procurementData.slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between py-3 border-b border-white/5 last:border-0">
                    <span className="text-sm">{item.item}</span>
                    <span className={`text-xs ${
                      item.urgency === "High" || item.urgency === "high" ? "text-red-400" :
                      item.urgency === "Medium" || item.urgency === "medium" ? "text-[#E67E22]" :
                      "text-emerald-400"
                    }`}>{item.urgency}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-white/20 text-center py-8">No action items</div>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}

function Demand({ demandData, loading }: { demandData: any[]; loading: boolean }) {
  const last = demandData.length > 0 ? demandData[demandData.length - 1] : null
  const today = last ? Math.round(last.actual_value || last.predicted_value || 0) : null
  const plus3 = demandData.length > 3 ? Math.round(demandData[demandData.length - 3]?.predicted_value || 0) : null
  const plus7 = demandData.length > 7 ? Math.round(demandData[demandData.length - 7]?.predicted_value || 0) : null

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-display italic mb-4">Demand Radar</h3>
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-sm text-white/40 mb-1">Today</div>
              <div className="text-2xl font-bold">{today !== null ? `${today}%` : '—'}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-sm text-white/40 mb-1">+3 Days</div>
              <div className="text-2xl font-bold text-[#E67E22]">{plus3 !== null ? `${plus3}%` : '—'}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-sm text-white/40 mb-1">+7 Days</div>
              <div className={`text-2xl font-bold ${plus7 !== null && plus7 > 85 ? 'text-red-400' : 'text-[#E67E22]'}`}>{plus7 !== null ? `${plus7}%` : '—'}</div>
            </div>
          </div>
        )}
      </Card>
      <Card>
        <h3 className="text-lg font-display italic mb-4">Booking Velocity</h3>
        {loading ? (
          <div className="h-32 bg-white/5 rounded animate-pulse" />
        ) : (
          <div className="h-32 flex items-end gap-2">
            {demandData.length > 0 ? demandData.slice(-14).map((d: any, i: number) => {
              const val = d.actual_value || d.predicted_value || 0
              return (
                <div key={i} className="flex-1 bg-[#E67E22]/20 rounded-sm hover:bg-[#E67E22]/40 transition-colors" style={{ height: val + "%" }} />
              )
            }) : (
              <div className="flex items-center justify-center w-full h-full text-white/20 text-sm">No data</div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

function ProcurementView({ procurementData, loading, onGenerate, onFulfill }: {
  procurementData: any[]; loading: boolean;
  onGenerate: () => void; onFulfill: (id: string) => void;
}) {
  const [fulfilling, setFulfilling] = useState<string | null>(null)

  async function handleFulfill(id: string) {
    setFulfilling(id)
    await onFulfill(id)
    setFulfilling(null)
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display italic">Procurement List</h3>
        <button
          onClick={onGenerate}
          className="text-xs bg-[#E67E22]/10 text-[#E67E22] px-3 py-1.5 rounded-full ring-1 ring-[#E67E22]/20 hover:bg-[#E67E22]/20 transition-all"
        >
          Generate from Forecast
        </button>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />)}
        </div>
      ) : procurementData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40">
                <th className="text-left py-3 px-4">Item</th>
                <th className="text-left py-3 px-4">Required</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Fulfill</th>
              </tr>
            </thead>
            <tbody>
              {procurementData.map((item: any) => (
                <tr key={item.id} className="border-b border-white/5 last:border-0">
                  <td className="py-3 px-4">{item.item}</td>
                  <td className="py-3 px-4 text-white/50">{item.requiredAmount}</td>
                  <td className="py-3 px-4 text-white/50">{item.action}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.urgency === "High" || item.urgency === "high" ? "bg-red-400/10 text-red-400" :
                      item.urgency === "Medium" || item.urgency === "medium" ? "bg-[#E67E22]/10 text-[#E67E22]" :
                      "bg-emerald-400/10 text-emerald-400"
                    }`}>{item.urgency}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleFulfill(item.id)}
                      disabled={fulfilling === item.id}
                      className="text-xs bg-emerald-400/10 text-emerald-400 px-2.5 py-1 rounded-full ring-1 ring-emerald-400/20 hover:bg-emerald-400/20 transition-all disabled:opacity-50"
                    >
                      {fulfilling === item.id ? <Loader2 className="w-3 h-3 animate-spin inline" /> : <CheckCircle className="w-3 h-3 inline" />}
                      <span className="ml-1">Mark done</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-white/20 text-center py-12">
          <p>No pending procurement items</p>
          <p className="text-xs mt-2">Use the Ona Agent or Generate from Forecast to create procurement recommendations.</p>
        </div>
      )}
    </Card>
  )
}

function Forecasting({ demandData, loading }: { demandData: any[]; loading: boolean }) {
  const peakVal = demandData.length > 0 ? Math.round(Math.max(...demandData.map(d => d.predicted_value || 0))) : null

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-display italic mb-4">14-Day Forecast</h3>
        {loading ? (
          <div className="h-64 bg-white/5 rounded animate-pulse" />
        ) : (
          <div className="h-64 flex items-end gap-2">
            {demandData.length > 0 ? demandData.slice(-14).map((d: any, i: number) => {
              const val = d.predicted_value || d.actual_value || 0
              return (
                <div key={i} className="flex-1 relative group cursor-pointer">
                  <div
                    className="bg-gradient-to-t from-[#E67E22]/40 to-[#E67E22]/10 rounded-t-sm transition-all duration-200 hover:from-[#E67E22]/60 hover:to-[#E67E22]/20"
                    style={{ height: val + "%" }}
                  />
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                    {Math.round(val)}%
                  </div>
                </div>
              )
            }) : (
              <div className="flex items-center justify-center w-full h-full text-white/20 text-sm">No forecast data</div>
            )}
          </div>
        )}
      </Card>
      <Card>
        <h3 className="text-lg font-display italic mb-4">AI-Generated Insights</h3>
        <div className="space-y-3">
          {peakVal !== null ? (
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#E67E22] mt-0.5" />
              <div>
                <p className="text-sm font-medium">Spike Detected</p>
                <p className="text-xs text-white/40">
                  Peak demand forecast at {peakVal}% in the next 14 days.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#E67E22] mt-0.5" />
              <div>
                <p className="text-sm font-medium">Insufficient Data</p>
                <p className="text-xs text-white/40">Collect more demand data to generate AI insights.</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function SettingsView({ orgData, userName, userEmail, userId, onSaved, onOrgUpdated }: {
  orgData: any; userName: string; userEmail?: string | null; userId?: string | null;
  onSaved: (msg: string, type?: "success" | "error") => void;
  onOrgUpdated: () => void;
}) {
  const [campName, setCampName] = useState("")
  const [location, setLocation] = useState("")
  const [timezone, setTimezone] = useState("")
  const [savingOrg, setSavingOrg] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (orgData) {
      setCampName(orgData.name || "")
      setLocation(orgData.location || "")
      setTimezone(orgData.timezone || "Africa/Nairobi")
    }
  }, [orgData])

  async function handleSaveOrg(e: React.FormEvent) {
    e.preventDefault()
    if (!orgData?.id) return
    setSavingOrg(true)
    try {
      const res = await fetch("/api/org/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: orgData.id, name: campName, location, timezone }),
      })
      if (!res.ok) throw new Error("Failed to save")
      onSaved("Camp settings saved")
      onOrgUpdated()
    } catch {
      onSaved("Failed to save settings", "error")
    } finally {
      setSavingOrg(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      onSaved("Passwords do not match", "error")
      return
    }
    if (newPassword.length < 8) {
      onSaved("Password must be at least 8 characters", "error")
      return
    }
    setSavingPassword(true)
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, currentPassword, newPassword }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || "Failed to change password")
      }
      onSaved("Password changed")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } catch (err: any) {
      onSaved(err.message || "Failed to change password", "error")
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <h3 className="text-lg font-display italic mb-6">Camp Profile</h3>
        <form onSubmit={handleSaveOrg} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm text-white/40">Camp Name</label>
            <input
              type="text"
              value={campName}
              onChange={e => setCampName(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none placeholder:text-white/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/40">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none placeholder:text-white/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/40">Timezone</label>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none"
            >
              <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
              <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam (EAT)</option>
              <option value="Africa/Kampala">Africa/Kampala (EAT)</option>
              <option value="Africa/Addis_Ababa">Africa/Addis Ababa (EAT)</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
              <option value="Africa/Cairo">Africa/Cairo (EET)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={savingOrg}
            className="flex items-center gap-2 bg-[#E67E22]/10 text-[#E67E22] px-5 py-2.5 rounded-full text-sm font-medium ring-1 ring-[#E67E22]/20 hover:bg-[#E67E22]/20 transition-all disabled:opacity-50"
          >
            {savingOrg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save changes
          </button>
        </form>
      </Card>

      <Card>
        <h3 className="text-lg font-display italic mb-6">Profile</h3>
        <div className="space-y-4">
          <div className="py-3 border-b border-white/5">
            <p className="text-xs text-white/40 mb-1">Name</p>
            <p className="text-sm">{userName}</p>
          </div>
          <div className="py-3">
            <p className="text-xs text-white/40 mb-1">Email</p>
            <p className="text-sm">{userEmail || '—'}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-display italic mb-6">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm text-white/40">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 pr-10 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/40">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none placeholder:text-white/20"
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/40">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-[#E67E22]/50 outline-none placeholder:text-white/20"
            />
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 bg-[#E67E22]/10 text-[#E67E22] px-5 py-2.5 rounded-full text-sm font-medium ring-1 ring-[#E67E22]/20 hover:bg-[#E67E22]/20 transition-all disabled:opacity-50"
          >
            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Update password
          </button>
        </form>
      </Card>

      <Card>
        <h3 className="text-lg font-display italic mb-4">Organization</h3>
        <div className="space-y-3">
          <div className="py-3 border-b border-white/5">
            <p className="text-xs text-white/40 mb-1">Organization ID</p>
            <p className="text-sm font-mono text-white/30 text-xs">{orgData?.id || '—'}</p>
          </div>
          <div className="py-3">
            <p className="text-xs text-white/40 mb-1">Camp Since</p>
            <p className="text-sm">
              {orgData?.created_at
                ? new Date(orgData.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                : '—'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
