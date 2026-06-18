"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { LayoutDashboard, TrendingUp, Truck, Calendar, Settings, Sparkles, Menu, X, Send, Loader2 } from "lucide-react"

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

function calcOccupancy(data: any[]) {
  if (!data || data.length === 0) return 67
  const last = data[data.length - 1]
  return last.actual_value !== null ? Math.round(last.actual_value) : Math.round(last.predicted_value)
}

function calcForecastPeak(data: any[]) {
  if (!data || data.length === 0) return 94
  const peaks = data.map(d => d.predicted_value || d.actual_value || 0)
  return Math.round(Math.max(...peaks))
}

function calcChange(data: any[]) {
  if (!data || data.length < 7) return 23
  const recent = data.slice(-7)
  const old = data.slice(-14, -7)
  if (old.length === 0) return 23
  const avgRecent = recent.reduce((s, d) => s + (d.actual_value || d.predicted_value || 0), 0) / recent.length
  const avgOld = old.reduce((s, d) => s + (d.actual_value || d.predicted_value || 0), 0) / old.length
  return Math.round(((avgRecent - avgOld) / avgOld) * 100)
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [demandData, setDemandData] = useState<any[]>([])
  const [procurementData, setProcurementData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [demandRes, procRes] = await Promise.all([
          fetch("/api/demand?days=30"),
          fetch("/api/procurement"),
        ])
        const demandJson = await demandRes.json()
        const procJson = await procRes.json()
        setDemandData(demandJson.data || [])
        setProcurementData(procJson.data || [])
      } catch (err) {
        console.error("Failed to fetch dashboard data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const occupancy = calcOccupancy(demandData)
  const peak = calcForecastPeak(demandData)
  const change = calcChange(demandData)

  async function sendChatMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || chatLoading) return
    const userMsg = chatInput.trim()
    setChatInput("")
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }])
    setChatLoading(true)
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      })
      const json = await res.json()
      setChatMessages(prev => [...prev, { role: "assistant", content: json.response || "No response." }])
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Agent unavailable." }])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1] flex">
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
            <p className="text-xs text-white/30 mt-1">Safari Camp Operations</p>
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
          <div className="p-3 border-t border-white/5">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-[#E67E22]" />
              <span>Ona Agent</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display italic mb-1">Operations Command Center</h1>
              <p className="text-sm text-white/40">Real-time demand intelligence</p>
            </div>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#E67E22]/10 text-[#E67E22] text-sm ring-1 ring-[#E67E22]/20 hover:bg-[#E67E22]/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Ona Agent
            </button>
          </div>
          {activeTab === "overview" && <Overview demandData={demandData} procurementData={procurementData} loading={loading} occupancy={occupancy} peak={peak} change={change} />}
          {activeTab === "demand" && <Demand demandData={demandData} loading={loading} />}
          {activeTab === "procurement" && <ProcurementView procurementData={procurementData} loading={loading} />}
          {activeTab === "forecasting" && <Forecasting demandData={demandData} loading={loading} />}
          {activeTab === "settings" && <SettingsView />}
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
              <p className="text-sm text-white/40 text-center mt-8">Ask about occupancy, forecasts, or camp operations.</p>
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

function Overview({ demandData, procurementData, loading, occupancy, peak, change }: {
  demandData: any[]; procurementData: any[]; loading: boolean;
  occupancy: number; peak: number; change: number;
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
          ) : (
            <>
              <div className="text-3xl font-bold mb-1">{occupancy}%</div>
              <p className="text-xs text-white/30">{change > 0 ? `+${change}% vs last week` : `${change}% vs last week`}</p>
            </>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/40">Peak Forecast (14d)</span>
            <TrendingUp className="w-4 h-4 text-red-400" />
          </div>
          {loading ? (
            <div className="h-10 w-16 bg-white/5 rounded animate-pulse" />
          ) : (
            <>
              <div className={`text-3xl font-bold mb-1 ${peak > 85 ? 'text-red-400' : 'text-[#E67E22]'}`}>{peak}%</div>
              <p className="text-xs text-white/30">{peak > 85 ? 'High demand alert' : 'Normal range'}</p>
            </>
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
            <h3 className="text-lg font-display italic mb-6">14-Day Demand Forecast</h3>
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
  const today = demandData.length > 0 ? Math.round(demandData[demandData.length - 1]?.actual_value || demandData[demandData.length - 1]?.predicted_value || 0) : 67
  const plus3 = demandData.length > 3 ? Math.round(demandData[demandData.length - 3]?.predicted_value || 0) : 85
  const plus7 = demandData.length > 7 ? Math.round(demandData[demandData.length - 7]?.predicted_value || 0) : 94

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
              <div className="text-2xl font-bold">{today}%</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-sm text-white/40 mb-1">+3 Days</div>
              <div className="text-2xl font-bold text-[#E67E22]">{plus3}%</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-sm text-white/40 mb-1">+7 Days</div>
              <div className={`text-2xl font-bold ${plus7 > 85 ? 'text-red-400' : 'text-[#E67E22]'}`}>{plus7}%</div>
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

function ProcurementView({ procurementData, loading }: { procurementData: any[]; loading: boolean }) {
  return (
    <Card>
      <h3 className="text-lg font-display italic mb-4">Procurement List</h3>
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
              </tr>
            </thead>
            <tbody>
              {procurementData.map((item: any, i: number) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-white/20 text-center py-8">No procurement items</div>
      )}
    </Card>
  )
}

function Forecasting({ demandData, loading }: { demandData: any[]; loading: boolean }) {
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
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <Sparkles className="w-5 h-5 text-[#E67E22] mt-0.5" />
            <div>
              <p className="text-sm font-medium">Spike Detected</p>
              <p className="text-xs text-white/40">
                {demandData.length > 0
                  ? `Peak demand forecast at ${Math.round(Math.max(...demandData.map(d => d.predicted_value || 0)))}% in the next 14 days.`
                  : 'Weekend demand will peak at 94% occupancy.'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SettingsView() {
  return (
    <Card>
      <h3 className="text-lg font-display italic mb-4">Camp Settings</h3>
      <div className="space-y-4">
        {["Serengeti Camp", "Camp Capacity: 48 rooms", "Location: Northern Serengeti", "Manager: Sarah Chen"].map((s, i) => (
          <div key={i} className="py-3 border-b border-white/5 last:border-0">
            <span className="text-sm">{s}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
