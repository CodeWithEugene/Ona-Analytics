"use client"

import React from "react"
import Link from "next/link"
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5 ${className}`}>
      <div className="rounded-[calc(2rem-0.375rem)] bg-[#111] p-6">
        {children}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-display italic">Ona</Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40 hidden md:inline">Serengeti Camp</span>
            <div className="h-8 w-8 rounded-full bg-[#E67E22]/20 flex items-center justify-center text-xs font-medium">SC</div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-display italic mb-1">Operations Command Center</h1>
            <p className="text-sm text-white/40">Real-time demand intelligence</p>
          </div>

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
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-red-400 mb-1">94%</div>
              <p className="text-xs text-white/30">High demand alert</p>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-white/40">Supply Chain</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
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
                    <div key={i} className="flex-1 bg-gradient-to-t from-[#E67E22]/30 to-[#E67E22]/10 rounded-t-sm hover:from-[#E67E22]/50 hover:to-[#E67E22]/20 transition-all" style={{height: h+'%'}} />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-white/20">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
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
        </div>
      </div>
    </div>
  )
}