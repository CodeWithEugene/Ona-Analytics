"use client"

import React, { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, TrendingUp, Truck, Calendar, Settings, Sparkles, Menu, X } from "lucide-react"

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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1] flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 rounded-lg"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
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
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-display italic mb-1">Operations Command Center</h1>
            <p className="text-sm text-white/40">Real-time demand intelligence</p>
          </div>
          {activeTab === "overview" && <Overview />}
          {activeTab === "demand" && <Demand />}
          {activeTab === "procurement" && <Procurement />}
          {activeTab === "forecasting" && <Forecasting />}
          {activeTab === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  )
}

function Overview() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/40">Current Occupancy</span>
            <TrendingUp className="w-4 h-4 text-[#E67E22]" />
          </div>
          <div className="text-3xl font-bold mb-1">67%</div>
          <p className="text-xs text-white/30">32 of 48 rooms</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/40">Weekend Forecast</span>
            <TrendingUp className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400 mb-1">94%</div>
          <p className="text-xs text-white/30">High demand alert</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/40">Supply Chain</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mb-1">Normal</div>
          <p className="text-xs text-white/30">Truck in 3 days</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <h3 className="text-lg font-display italic mb-6">14-Day Demand Forecast</h3>
            <div className="h-64 flex items-end gap-2">
              {[40,55,45,70,60,85,75,90,65,80,70,95,85,100].map((h,i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-[#E67E22]/30 to-[#E67E22]/10 rounded-t-sm" style={{height: h+"%"}} />
              ))}
            </div>
          </Card>
        </div>
        <div>
          <Card>
            <h3 className="text-lg font-display italic mb-6">Action Items</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-sm">Order diesel fuel</span>
                <span className="text-xs text-red-400">High</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-sm">Restock fresh produce</span>
                <span className="text-xs text-[#E67E22]">Medium</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-sm">Generator maintenance</span>
                <span className="text-xs text-emerald-400">Low</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm">Confirm arrivals</span>
                <span className="text-xs text-red-400">High</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

function Demand() {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-display italic mb-4">Demand Radar</h3>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-sm text-white/40 mb-1">Today</div>
            <div className="text-2xl font-bold">67%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-sm text-white/40 mb-1">+3 Days</div>
            <div className="text-2xl font-bold text-[#E67E22]">85%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="text-sm text-white/40 mb-1">+7 Days</div>
            <div className="text-2xl font-bold text-red-400">94%</div>
          </div>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-display italic mb-4">Booking Velocity</h3>
        <div className="h-32 flex items-end gap-2">
          {[30,45,35,60,50,75,65,80,55,70,60,85,75,90].map((h,i) => (
            <div key={i} className="flex-1 bg-[#E67E22]/20 rounded-sm" style={{height: h+"%"}} />
          ))}
        </div>
      </Card>
    </div>
  )
}

function Procurement() {
  return (
    <Card>
      <h3 className="text-lg font-display italic mb-4">Procurement List</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-white/40">
              <th className="text-left py-3 px-4">Item</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Qty</th>
              <th className="text-left py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { item: "Diesel Fuel", cat: "Energy", qty: "200L", status: "Urgent" },
              { item: "Fresh Vegetables", cat: "Food", qty: "50kg", status: "Pending" },
              { item: "Linen Set", cat: "Housekeeping", qty: "20", status: "Ordered" },
              { item: "Borehole Parts", cat: "Maintenance", qty: "1 set", status: "In Transit" },
              { item: "Generator Oil", cat: "Energy", qty: "10L", status: "Pending" },
              { item: "Medical Supplies", cat: "First Aid", qty: "Box", status: "Normal" },
            ].map((item, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="py-3 px-4">{item.item}</td>
                <td className="py-3 px-4 text-white/50">{item.cat}</td>
                <td className="py-3 px-4 text-white/50">{item.qty}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === "Urgent" ? "bg-red-400/10 text-red-400" :
                    item.status === "Pending" ? "bg-[#E67E22]/10 text-[#E67E22]" :
                    item.status === "Ordered" ? "bg-blue-400/10 text-blue-400" :
                    "bg-emerald-400/10 text-emerald-400"
                  }`}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function Forecasting() {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-display italic mb-4">14-Day Forecast</h3>
        <div className="h-64 flex items-end gap-2">
          {[40,55,45,70,60,85,75,90,65,80,70,95,85,100].map((h,i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-[#E67E22]/40 to-[#E67E22]/10 rounded-t-sm" style={{height: h+"%"}} />
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-display italic mb-4">AI-Generated Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <Sparkles className="w-5 h-5 text-[#E67E22] mt-0.5" />
            <div>
              <p className="text-sm font-medium">Spike Detected</p>
              <p className="text-xs text-white/40">Weekend demand will peak at 94% occupancy.</p>
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