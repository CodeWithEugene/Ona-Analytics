"use client"

import React, { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight, Menu, X, TrendingUp, Eye, Package, Radio } from "lucide-react"

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#1C1816] overflow-x-hidden">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015] mix-blend-multiply" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} 
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${scrolled ? 'bg-[#FBF8F4]/80 backdrop-blur-2xl shadow-[0_1px_0_rgba(28,24,22,0.06)]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-xl font-display italic tracking-tight">
            Ona
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link href="/login" className="text-sm font-medium text-[#1C1816]/60 hover:text-[#1C1816] transition-colors duration-300">
              Sign in
            </Link>
            <Link
              href="/login"
              className="group relative inline-flex items-center gap-2 rounded-full bg-[#1C1816] px-5 py-2.5 text-sm font-medium text-[#FBF8F4] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#1C1816]/90 active:scale-[0.97]"
            >
              <span>Get early access</span>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FBF8F4]/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
          <button
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-4">
              <span className={`absolute left-0 top-0 w-full h-[1.5px] bg-[#1C1816] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? 'rotate-45 top-[7px]' : ''}`} />
              <span className={`absolute left-0 top-[7px] w-full h-[1.5px] bg-[#1C1816] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 bottom-0 w-full h-[1.5px] bg-[#1C1816] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? '-rotate-45 bottom-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-30 bg-[#FBF8F4]/95 backdrop-blur-3xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <Link href="/login" className="text-2xl font-display" onClick={() => setMenuOpen(false)}>Sign in</Link>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#1C1816] px-6 py-3 text-sm font-medium text-[#FBF8F4]" onClick={() => setMenuOpen(false)}>
            Get early access
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center pt-24 md:pt-0">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#D4A853]/10 via-[#D4A853]/5 to-transparent blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#8B6B4D]/10 via-transparent to-transparent blur-3xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-gradient-to-b from-[#D4A853]/8 to-transparent blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1816]/10 bg-[#1C1816]/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] font-medium text-[#1C1816]/60 animate-fade-in">
              AI-Native Demand Intelligence
            </div>
            <h1 className="mt-8 text-[clamp(3rem,8vw,6.5rem)] font-display italic leading-[1.05] tracking-tight text-[#1C1816] animate-slide-up stagger-1">
              See what&apos;s
              <br />
              <span className="not-italic font-display text-[#D4A853]">coming</span>.
              <br />
              Before it arrives.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#1C1816]/60 animate-slide-up stagger-2">
              Predictive demand radar for remote safari camps and eco-lodges. 
              AI-powered forecasting that turns uncertainty into foresight — 
              so you&apos;re never caught off guard by the unexpected.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-slide-up stagger-3">
              <Link
                href="/login"
                className="group relative inline-flex items-center gap-2 rounded-full bg-[#1C1816] px-7 py-3.5 text-sm font-medium text-[#FBF8F4] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#1C1816]/90 active:scale-[0.97]"
              >
                Explore the dashboard
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FBF8F4]/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[#1C1816]/15 bg-transparent px-7 py-3.5 text-sm font-medium text-[#1C1816]/70 transition-all duration-300 hover:border-[#1C1816]/30 hover:text-[#1C1816] active:scale-[0.97]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Ambient indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border border-[#1C1816]/10 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-[#1C1816]/30 animate-pulse-glow" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 md:py-44">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-6">
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-display italic leading-[1.1] tracking-tight">
                The blind spot
                <br />
                <span className="not-italic">in camp operations</span>
              </h2>
              <p className="text-base leading-relaxed text-[#1C1816]/60">
                Supply chains across remote Africa run on intuition. Forecasts are 
                scattered across WhatsApp messages, whiteboard scribbles, and gut 
                feelings. One unexpected booking surge — one delayed truck — and 
                the entire guest experience fractures.
              </p>
              <p className="text-base leading-relaxed text-[#1C1816]/60">
                Ona Analytics closes that blind spot with predictive intelligence 
                purpose-built for the bush.
              </p>
            </div>
            <div className="relative">
              <div className="relative p-1.5 rounded-[2rem] bg-[#1C1816]/5 ring-1 ring-[#1C1816]/5">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF8F4] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] p-8 md:p-12">
                  <div className="space-y-6">
                    {[
                      { label: "Current method", value: "WhatsApp & intuition", color: "bg-red-200/50 text-red-800" },
                      { label: "Forecast accuracy", value: "±42%", color: "bg-amber-200/50 text-amber-800" },
                      { label: "Avg. reaction time", value: "3.2 days", color: "bg-red-200/50 text-red-800" },
                      { label: "Stockout incidents", value: "1 in 4 weeks", color: "bg-red-200/50 text-red-800" },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-[#1C1816]/5 last:border-0">
                        <span className="text-sm text-[#1C1816]/50">{stat.label}</span>
                        <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-32 md:py-44 bg-[#1C1816] text-[#FBF8F4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FBF8F4]/10 bg-[#FBF8F4]/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] font-medium text-[#FBF8F4]/50">
              The Ona Platform
            </div>
            <h2 className="mt-6 text-[clamp(2rem,4vw,3.5rem)] font-display italic leading-[1.1] tracking-tight">
              Intelligence that
              <br />
              <span className="not-italic text-[#D4A853]">adapts</span> to the bush
            </h2>
          </div>

          <div className="grid md:grid-cols-12 gap-4">
            {/* Large card */}
            <div className="md:col-span-7 row-span-2 p-1.5 rounded-[2rem] bg-[#FBF8F4]/5 ring-1 ring-[#FBF8F4]/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#1C1816] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8 md:p-10 h-full">
                <Eye className="w-8 h-8 text-[#D4A853] mb-6" />
                <h3 className="text-2xl font-display italic mb-3">Demand Radar</h3>
                <p className="text-sm leading-relaxed text-[#FBF8F4]/50 max-w-md">
                  Real-time occupancy tracking with a 14-day predictive horizon. 
                  See spike events days before they hit, not hours.
                </p>
                <div className="mt-8 h-32 md:h-44 rounded-2xl bg-[#FBF8F4]/5 flex items-center justify-center border border-[#FBF8F4]/5">
                  <span className="text-xs text-[#FBF8F4]/30">Live forecast visualization</span>
                </div>
              </div>
            </div>

            {/* Medium card */}
            <div className="md:col-span-5 p-1.5 rounded-[2rem] bg-[#FBF8F4]/5 ring-1 ring-[#FBF8F4]/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#1C1816] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8 md:p-10 h-full">
                <Package className="w-8 h-8 text-[#D4A853] mb-6" />
                <h3 className="text-2xl font-display italic mb-3">Smart Procurement</h3>
                <p className="text-sm leading-relaxed text-[#FBF8F4]/50">
                  Auto-generated purchase orders tied to demand spikes. No more emergency runs for fresh produce.
                </p>
              </div>
            </div>

            {/* Medium card */}
            <div className="md:col-span-5 p-1.5 rounded-[2rem] bg-[#FBF8F4]/5 ring-1 ring-[#FBF8F4]/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#1C1816] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8 md:p-10 h-full">
                <Radio className="w-8 h-8 text-[#D4A853] mb-6" />
                <h3 className="text-2xl font-display italic mb-3">SOP Intelligence</h3>
                <p className="text-sm leading-relaxed text-[#FBF8F4]/50">
                  Ask the Ona Agent natural-language questions about your standard operating procedures.
                </p>
              </div>
            </div>

            {/* Large card */}
            <div className="md:col-span-7 p-1.5 rounded-[2rem] bg-[#FBF8F4]/5 ring-1 ring-[#FBF8F4]/5">
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#1C1816] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8 md:p-10 h-full">
                <TrendingUp className="w-8 h-8 text-[#D4A853] mb-6" />
                <h3 className="text-2xl font-display italic mb-3">Predictive Engine</h3>
                <p className="text-sm leading-relaxed text-[#FBF8F4]/50">
                  Powered by NVIDIA Nemotron. The model learns your camp&apos;s unique patterns — 
                  seasonal trends, weather correlations, booking behaviors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 md:py-44">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1816]/10 bg-[#1C1816]/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] font-medium text-[#1C1816]/60">
              Two minutes to insight
            </div>
            <h2 className="mt-6 text-[clamp(2rem,4vw,3rem)] font-display italic leading-[1.1] tracking-tight">
              Connect. Forecast.
              <br />
              <span className="not-italic">Act.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: "01", title: "Connect your data", desc: "Point Ona at your booking system or enter occupancy numbers manually. Takes five minutes." },
              { step: "02", title: "AI builds the radar", desc: "Our model studies your patterns and generates a 14-day occupancy forecast with confidence bands." },
              { step: "03", title: "Act with foresight", desc: "Procurement lists update automatically. The Ona Agent answers questions. You stay ahead." },
            ].map((s, i) => (
              <div key={i} className="group">
                <div className="text-[4rem] md:text-[5rem] font-display italic leading-none text-[#D4A853]/20 group-hover:text-[#D4A853]/40 transition-colors duration-500">
                  {s.step}
                </div>
                <h3 className="mt-4 text-xl font-display italic">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#1C1816]/50">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 md:py-44 bg-[#1C1816] text-[#FBF8F4]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-display italic leading-[1.1] tracking-tight">
            Ready to see what&apos;s coming?
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[#FBF8F4]/50 max-w-md mx-auto">
            Join the waitlist for early access. Ona Analytics is currently in private beta with select camps across East Africa.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="group relative inline-flex items-center gap-2 rounded-full bg-[#D4A853] px-7 py-3.5 text-sm font-medium text-[#1C1816] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#D4A853]/90 active:scale-[0.97]"
            >
              Get early access
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1C1816]/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-[#FBF8F4]/15 bg-transparent px-7 py-3.5 text-sm font-medium text-[#FBF8F4]/60 transition-all duration-300 hover:border-[#FBF8F4]/30 hover:text-[#FBF8F4] active:scale-[0.97]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-[#1C1816]/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-sm font-display italic tracking-tight text-[#1C1816]/40">
            Ona Analytics
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[#1C1816]/30">&copy; 2026 Ona Analytics. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
