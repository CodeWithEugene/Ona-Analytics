"use client"

import React from "react"
import Link from "next/link"
import { ArrowUpRight, TrendingUp, Shield, Zap, AlertTriangle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4EDE2] text-[#1C1816]">
      {/* Skip to content */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#C0392B] focus:text-white focus:rounded-lg">
        Skip to content
      </a>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F4EDE2]/90 backdrop-blur-xl border-b border-[#1C1816]/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-display italic tracking-tight text-[#1C1816]">Ona</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/login" className="text-sm text-[#1C1816]/60 hover:text-[#1C1816]">Sign In</Link>
            <Link href="#cta" className="text-sm bg-[#1C1816] text-[#F4EDE2] px-5 py-2 rounded-full font-medium hover:bg-[#1C1816]/90">Get Early Access</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="main-content" className="pt-32 pb-20 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1816]/10 bg-[#1C1816]/5 px-4 py-1.5 text-[11px] uppercase tracking-widest text-[#1C1816]/60 mb-8">
                AI Operations Intelligence
              </div>
              <h1 className="text-5xl md:text-6xl font-display italic leading-tight mb-6 text-[#1C1816]">
                See what is coming<br />
                <span className="text-[#C0392B]">before</span> it arrives
              </h1>
              <p className="text-lg text-[#1C1816]/60 max-w-lg mb-8 leading-relaxed">
                Predictive demand radar and supply chain intelligence for remote safari camps across East Africa.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 bg-[#1C1816] text-[#F4EDE2] px-6 py-3 rounded-full font-medium hover:bg-[#1C1816]/90 active:scale-[0.97] transition-transform duration-150">
                Explore Dashboard <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="md:col-span-5">
              <div className="relative p-1.5 rounded-[2rem] bg-[#1C1816]/5 ring-1 ring-[#1C1816]/5">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#F4EDE2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] p-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#1C1816]/50">Next 14 Days</span>
                      <span className="text-[#C0392B] text-xs bg-[#C0392B]/10 px-2 py-0.5 rounded-full">+23%</span>
                    </div>
                    <div className="h-32 flex items-end gap-1">
                      {[40,55,45,70,60,85,75,90,65,80,70,95,85,100].map((h,i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-[#C0392B]/40 to-[#C0392B]/10 rounded-sm" style={{height: h+'%'}} />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-[#1C1816]/30">
                      <span>Today</span>
                      <span>Day 14</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-24 px-6 bg-[#E8DDD0]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-1.5 text-[11px] uppercase tracking-widest text-[#C0392B] mb-6">
                The Blind Spot
              </div>
              <h2 className="text-4xl font-display italic mb-6 text-[#1C1816]">The last diesel truck left Mombasa 6 days ago</h2>
              <p className="text-lg text-[#1C1816]/60 mb-4 leading-relaxed">
                The generator just went down. You have 4 hours of frozen stores left. The next supply run is in 72 hours.
              </p>
              <p className="text-lg text-[#1C1816]/60 leading-relaxed">
                This is an intelligence problem. And it costs camps an average of <strong className="text-[#C0392B]">$12,400</strong> per preventable stockout event.
              </p>
            </div>
            <div className="space-y-0">
              {[
                { label: "Forecast Accuracy Today", value: "42%" },
                { label: "Average Reaction Time", value: "3.2 days" },
                { label: "Stockout Rate", value: "1 in 4 weeks" },
                { label: "Cost Per Event", value: "$12,400" },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between py-4 border-b border-[#1C1816]/10">
                  <span className="text-sm text-[#1C1816]/40">{stat.label}</span>
                  <span className="text-lg font-medium text-[#C0392B]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1816]/10 bg-[#1C1816]/5 px-4 py-1.5 text-[11px] uppercase tracking-widest text-[#1C1816]/60 mb-6">
              Platform Intelligence
            </div>
            <h2 className="text-3xl font-display italic text-[#1C1816]">Built for the realities of remote operations</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: "Demand Radar", desc: "14-day predictive horizon with 87% accuracy. See spike events 5 days before they hit your supply line." },
              { icon: Shield, title: "Auto Procurement", desc: "Purchase orders generated automatically from forecast curves. No more emergency runs to the nearest hub." },
              { icon: Zap, title: "SOP Intelligence", desc: "Ask what to do if the borehole pump fails. Get answers from your camp's procedures in under 2 seconds." },
            ].map((f, i) => (
              <div key={i} className="group p-1.5 rounded-[2rem] bg-[#1C1816]/5 ring-1 ring-[#1C1816]/5 hover:bg-[#C0392B]/5 hover:ring-[#C0392B]/10 transition-all duration-300">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#F4EDE2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] p-8 h-full">
                  <f.icon className="w-6 h-6 text-[#C0392B] mb-6" />
                  <h3 className="text-xl font-display italic mb-3 text-[#1C1816]">{f.title}</h3>
                  <p className="text-sm text-[#1C1816]/50 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 px-6 bg-[#1C1816] text-[#F4EDE2]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-display italic mb-6">Ready to see what is coming?</h2>
          <p className="text-lg text-[#F4EDE2]/60 mb-8 max-w-xl mx-auto leading-relaxed">
            Stop running blind. Get 14-day visibility into demand, automate procurement, and respond before the generator goes down.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-[#C0392B] text-[#F4EDE2] px-8 py-3 rounded-full font-medium hover:bg-[#C0392B]/90 active:scale-[0.97] transition-transform duration-150">
            Access Dashboard <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#1C1816]/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-display italic text-[#1C1816]/30">Ona</span>
          <span className="text-xs text-[#1C1816]/20">2026 Ona Analytics</span>
        </div>
      </footer>
    </div>
  )
}
