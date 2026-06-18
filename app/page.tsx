"use client"

import React, { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, TrendingUp, Truck, Sparkles, Shield, BarChart3, Clock, Users } from "lucide-react"

function useInView(threshold = 0.15): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [ref, inView] = useInView()
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  )
}

const camps = [
  "Olare Orok Eco-Lodge", "Serengeti Migration Camp", "Samburu Intrepids",
  "Selous Riverside", "Okavango Delta Lodge", "Ruaha Wilderness"
]

const features = [
  {
    icon: TrendingUp,
    title: "14-Day Demand Radar",
    desc: "Predict occupancy spikes 5 days before they hit your supply line. Machine learning models trained on East African safari seasonality.",
    stat: "94%",
    statLabel: "forecast accuracy",
  },
  {
    icon: Truck,
    title: "Auto Procurement",
    desc: "Purchase orders generated automatically from forecast curves. No more emergency runs to Arusha for extra produce.",
    stat: "73%",
    statLabel: "fewer stockout events",
  },
  {
    icon: Sparkles,
    title: "AI Operations Agent",
    desc: "Ask Ona anything in plain English. 'How much diesel for next week?' gets you an answer from live data in under 2 seconds.",
    stat: "<2s",
    statLabel: "average response time",
  },
]

const testimonials = [
  {
    quote: "We caught a 95% occupancy spike 5 days out. Ona automatically ordered 40kg extra produce and 10 gas cylinders before we even knew we needed them.",
    author: "Sarah Chen",
    role: "Camp Manager, Olare Orok Eco-Lodge",
    change: "42% → 94%",
    changeLabel: "forecast accuracy in 30 days",
  },
  {
    quote: "The generator went down at 2AM. I asked Ona what to do and it pulled the fuel contingency SOP in under a second. Worth it for that alone.",
    author: "James Omondi",
    role: "Operations Director, Serengeti Migration Camp",
    change: "$12,400",
    changeLabel: "saved per stockout avoided",
  },
]

export default function LandingPage() {
  return (
    <div className="bg-[#F4EDE2] text-[#1C1816]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F4EDE2]/95 backdrop-blur-sm border-b border-[#1C1816]/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-display italic tracking-tight text-[#1C1816]">Ona</Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-[#1C1816]/60 hover:text-[#1C1816] transition-colors">Sign in</Link>
            <Link
              href="/register"
              className="text-sm bg-[#1C1816] text-[#F4EDE2] px-5 py-2.5 rounded-full font-medium hover:bg-[#1C1816]/90 active:scale-[0.97] transition-all duration-150"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <FadeIn className="pt-36 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-1.5 text-[11px] uppercase tracking-widest text-[#C0392B] mb-8">
              AI Operations Intelligence for Safari Camps
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-8 text-[#1C1816]">
              See what is coming{" "}
              <span className="text-[#C0392B]">before</span>{" "}
              it arrives
            </h1>
            <p className="text-lg md:text-xl text-[#1C1816]/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Predictive demand radar and supply chain intelligence purpose-built for remote safari camps.
              14-day occupancy forecasts, automated procurement, and an AI agent that knows your camp.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#1C1816] text-[#F4EDE2] px-7 py-3.5 rounded-full font-medium hover:bg-[#1C1816]/90 active:scale-[0.97] transition-all duration-150 text-base"
              >
                Start free trial <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-[#1C1816]/60 hover:text-[#1C1816] px-7 py-3.5 rounded-full font-medium transition-colors text-base"
              >
                Sign in <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="max-w-5xl mx-auto">
            <div className="p-2 rounded-[2.5rem] bg-[#1C1816]/10 ring-1 ring-[#1C1816]/10">
              <div className="rounded-[calc(2.5rem-0.5rem)] bg-[#0A0A0A] shadow-2xl p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/50" />
                  </div>
                  <span className="text-xs text-white/20 font-mono">Ona Analytics — Dashboard Preview</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Current Occupancy", value: "41%", change: "+2.5%", color: "text-[#E67E22]" },
                    { label: "Peak Forecast", value: "95%", change: "In 3 days", color: "text-red-400" },
                    { label: "Active Procurement", value: "3", change: "2 urgent", color: "text-red-400" },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white/[0.03] rounded-xl p-4 ring-1 ring-white/[0.05]">
                      <p className="text-xs text-white/30 mb-2">{kpi.label}</p>
                      <p className={`text-2xl md:text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                      <p className="text-xs text-white/20 mt-1">{kpi.change}</p>
                    </div>
                  ))}
                </div>
                <div className="h-36 flex items-end gap-2">
                  {[40,42,39,41,43,38,40,41,42,39,41,40,41,48,75,95,93,65].map((h, i) => {
                    const isPredicted = i >= 13
                    return (
                      <div key={i} className="flex-1 relative group">
                        <div
                          className={`rounded-t-sm transition-all duration-200 group-hover:opacity-80 ${
                            isPredicted
                              ? "bg-gradient-to-t from-[#E67E22]/40 to-[#E67E22]/10"
                              : "bg-gradient-to-t from-[#C0392B]/40 to-[#C0392B]/10"
                          }`}
                          style={{ height: `${h * 0.75}%` }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-white/10 text-[10px] px-1.5 py-0.5 rounded text-white/60 whitespace-nowrap transition-opacity">
                          {h}%
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#C0392B]" />
                    <span className="text-[10px] text-white/20">Actual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#E67E22]" />
                    <span className="text-[10px] text-white/20">Forecast</span>
                  </div>
                  <span className="text-[10px] text-white/20">Spike event detected: +54% in 3 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Social proof */}
      <FadeIn delay={100} className="py-16 px-6 border-y border-[#1C1816]/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#1C1816]/30 text-center mb-8">Trusted by operations teams across East Africa</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {camps.map((camp, i) => (
              <span key={i} className="text-sm font-medium text-[#1C1816]/40 font-display italic">{camp}</span>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Features */}
      <FadeIn delay={200} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#1C1816]">
              Everything a remote camp needs
            </h2>
            <p className="text-lg text-[#1C1816]/60 max-w-2xl mx-auto">
              Three integrated capabilities that turn scattered data into a single operations dashboard.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="group p-[1px] rounded-[2rem] bg-gradient-to-b from-[#1C1816]/10 to-transparent hover:from-[#C0392B]/20 transition-all duration-500">
                  <div className="rounded-[calc(2rem-1px)] bg-[#F4EDE2] p-8 h-full">
                    <div className="w-10 h-10 rounded-xl bg-[#C0392B]/10 flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5 text-[#C0392B]" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[#1C1816]">{f.title}</h3>
                    <p className="text-sm text-[#1C1816]/50 leading-relaxed mb-6">{f.desc}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-[#C0392B]">{f.stat}</span>
                      <span className="text-xs text-[#1C1816]/40">{f.statLabel}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </FadeIn>

      {/* Stats bar */}
      <FadeIn delay={300} className="py-20 px-6 bg-[#1C1816] text-[#F4EDE2]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: BarChart3, value: "94%", label: "Forecast accuracy" },
              { icon: Shield, value: "73%", label: "Fewer stockouts" },
              { icon: Clock, value: "<2s", label: "Agent response time" },
              { icon: Users, value: "12+", label: "Camps on platform" },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="text-center">
                  <Icon className="w-6 h-6 text-[#E67E22] mx-auto mb-4" />
                  <div className="text-4xl md:text-5xl font-bold tracking-tight text-[#F4EDE2] mb-2">{s.value}</div>
                  <div className="text-sm text-[#F4EDE2]/40">{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </FadeIn>

      {/* How it works */}
      <FadeIn delay={400} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#1C1816]">How it works</h2>
            <p className="text-lg text-[#1C1816]/60 max-w-2xl mx-auto">
              From deployment to first insight in under 10 minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Connect your data", desc: "Link your booking system or property management platform. Ona works with any PMS that exports occupancy data." },
              { step: "02", title: "AI starts forecasting", desc: "Our models analyze seasonality, booking velocity, and historical patterns to predict demand 14 days ahead." },
              { step: "03", title: "Operations run themselves", desc: "Procurement is automated, SOPs are searchable, and your AI agent answers questions in real time." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-[#C0392B]/20 mb-4">{s.step}</div>
                <h3 className="text-xl font-bold mb-3 text-[#1C1816]">{s.title}</h3>
                <p className="text-sm text-[#1C1816]/50 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Testimonial */}
      <FadeIn delay={500} className="py-24 px-6 bg-[#E8DDD0]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-[1px] rounded-[2rem] bg-gradient-to-b from-[#1C1816]/10 to-transparent">
                <div className="rounded-[calc(2rem-1px)] bg-[#F4EDE2] p-8">
                  <p className="text-lg italic leading-relaxed text-[#1C1816]/80 mb-8">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#1C1816]">{t.author}</p>
                      <p className="text-xs text-[#1C1816]/40">{t.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#C0392B]">{t.change}</p>
                      <p className="text-[10px] text-[#1C1816]/30 uppercase tracking-wider">{t.changeLabel}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={600} className="py-32 px-6 bg-[#1C1816] text-[#F4EDE2]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.08]">
            Ready to see what is coming?
          </h2>
          <p className="text-lg text-[#F4EDE2]/60 mb-10 max-w-xl mx-auto leading-relaxed">
            Stop running blind. Get 14-day visibility into demand, automate procurement, and respond before the generator goes down.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#C0392B] text-[#F4EDE2] px-8 py-4 rounded-full font-medium text-lg hover:bg-[#C0392B]/90 active:scale-[0.97] transition-all duration-150"
          >
            Start free trial <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </FadeIn>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#1C1816]/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-display italic text-[#1C1816]/30">Ona</span>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/login" className="text-xs text-[#1C1816]/30 hover:text-[#1C1816]/50 transition-colors">Sign in</Link>
              <Link href="/register" className="text-xs text-[#1C1816]/30 hover:text-[#1C1816]/50 transition-colors">Get started</Link>
            </div>
          </div>
          <span className="text-xs text-[#1C1816]/20">&copy; 2026 Ona Analytics</span>
        </div>
      </footer>
    </div>
  )
}
