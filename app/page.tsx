"use client"

import React from "react"
import Link from "next/link"
import { ArrowUpRight, TrendingUp, Shield, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-display italic tracking-tight">Ona</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/login" className="text-sm text-[#E8E6E1]/60 hover:text-[#E8E6E1]">Sign In</Link>
            <Link href="/login" className="text-sm bg-[#E8E6E1] text-[#0A0A0A] px-5 py-2 rounded-full font-medium">Access Dashboard</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] uppercase tracking-widest text-white/40 mb-8">
                AI Operations Intelligence
              </div>
              <h1 className="text-5xl md:text-6xl font-display italic leading-tight mb-6">
                See what is coming<br />
                <span className="text-[#E67E22]">before</span> it arrives
              </h1>
              <p className="text-lg text-white/50 max-w-lg mb-8">
                Predictive demand radar and supply chain intelligence for remote safari camps across East Africa.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium">
                Explore Dashboard <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="md:col-span-5">
              <div className="relative p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#111] p-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Next 14 Days</span>
                      <span className="text-[#E67E22] text-xs bg-[#E67E22]/10 px-2 py-0.5 rounded-full">+23%</span>
                    </div>
                    <div className="h-32 flex items-end gap-1">
                      {[40,55,45,70,60,85,75,90,65,80,70,95,85,100].map((h,i) => (
                        <div key={i} className="flex-1 bg-[#E67E22]/30 rounded-sm" style={{height: h+'%'}} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display italic mb-6">The blind spot in camp operations</h2>
              <p className="text-lg text-white/50 mb-4">
                When the last diesel truck left Mombasa 6 days ago and the generator just went down, you have 4 hours of frozen stores left.
              </p>
              <p className="text-lg text-white/50">
                This is an intelligence problem. And it costs camps an average of $12,400 per preventable stockout event.
              </p>
            </div>
            <div className="space-y-0">
              {[
                { label: "Forecast Accuracy", value: "42%" },
                { label: "Reaction Time", value: "3.2 days" },
                { label: "Stockout Incidents", value: "1 in 4 weeks" },
                { label: "Cost Per Event", value: "$12,400" },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between py-4 border-b border-white/5">
                  <span className="text-sm text-white/30">{stat.label}</span>
                  <span className="text-lg font-medium text-[#E67E22]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] uppercase tracking-widest text-white/40 mb-6">
              Platform Intelligence
            </div>
            <h2 className="text-3xl font-display italic">Built for the realities of remote operations</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: "Demand Radar", desc: "14-day predictive horizon with 87% accuracy. See spike events 5 days before they hit." },
              { icon: Shield, title: "Auto Procurement", desc: "Purchase orders generated automatically from forecast curves. No more emergency runs." },
              { icon: Zap, title: "SOP Intelligence", desc: "Ask what to do if the borehole pump fails. Get answers in under 2 seconds." },
            ].map((f, i) => (
              <div key={i} className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#111] p-8 h-full">
                  <f.icon className="w-6 h-6 text-[#E67E22] mb-6" />
                  <h3 className="text-xl font-display italic mb-3">{f.title}</h3>
                  <p className="text-sm text-white/40">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-display italic text-white/30">Ona</span>
          <span className="text-xs text-white/20">2026 Ona Analytics</span>
        </div>
      </footer>
    </div>
  )
}
