"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

function useInView(threshold = 0.1): [React.RefObject<HTMLElement | null>, boolean] {
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
  const [ref, inView] = useInView(0.08)
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`transition-all duration-1000 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="bg-[#F4EDE2] text-[#1C1816] min-h-[100dvh]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center bg-[#F4EDE2]/90 backdrop-blur-md border-b border-[#1C1816]/5">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <Link href="/" className="text-lg font-display italic tracking-tight text-[#1C1816]">Ona</Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-[#1C1816]/50 hover:text-[#1C1816] transition-colors">Sign in</Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-sm bg-[#1C1816] text-[#F4EDE2] px-4 py-1.5 rounded-full font-medium hover:bg-[#1C1816]/90 active:scale-[0.97] transition-all duration-150"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C0392B]/20 bg-[#C0392B]/5 px-3.5 py-1 text-xs font-medium text-[#C0392B] mb-6">
                AI Operations Intelligence for Safari Camps
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.04] mb-6 text-[#1C1816]">
                See what is coming{" "}
                <span className="text-[#C0392B]">before</span>{" "}
                it arrives
              </h1>
              <p className="text-base md:text-lg text-[#1C1816]/50 leading-relaxed max-w-lg mb-10">
                Predictive demand radar and supply chain intelligence purpose-built for remote safari camps. 14-day occupancy forecasts, automated procurement, and an AI agent that knows your camp.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 bg-[#1C1816] text-[#F4EDE2] px-6 py-3 rounded-full font-medium hover:bg-[#1C1816]/90 active:scale-[0.97] transition-all duration-150 text-sm"
                >
                  Start free trial <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
                </Link>
                <Link href="/login" className="text-sm text-[#1C1816]/40 hover:text-[#1C1816] transition-colors">
                  Sign in &rarr;
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Dashboard preview — full width */}
          <FadeIn delay={200}>
            <div className="mt-16 rounded-2xl bg-[#0A0A0A] ring-1 ring-[#1C1816]/10 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.04]">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/50" />
                </div>
                <span className="text-xs text-white/15 font-mono">Ona Analytics — Dashboard</span>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Current Occupancy", value: "41%", change: "+2.5%", color: "text-[#E67E22]" },
                    { label: "Peak Forecast", value: "95%", change: "In 3 days", color: "text-red-400" },
                    { label: "Active Procurement", value: "3", change: "2 urgent", color: "text-red-400" },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white/[0.03] rounded-xl p-4">
                      <p className="text-xs text-white/30 mb-2">{kpi.label}</p>
                      <p className={`text-2xl md:text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                      <p className="text-xs text-white/20 mt-1">{kpi.change}</p>
                    </div>
                  ))}
                </div>
                <div className="h-32 flex items-end gap-2">
                  {[40,42,39,41,43,38,40,41,42,39,41,40,41,48,75,95,93,65].map((h, i) => (
                    <div key={i} className="flex-1 relative group">
                      <div
                        className={`rounded-t-sm transition-all duration-200 group-hover:opacity-80 ${
                          i >= 13
                            ? "bg-gradient-to-t from-[#E67E22]/40 to-[#E67E22]/10"
                            : "bg-gradient-to-t from-[#C0392B]/40 to-[#C0392B]/10"
                        }`}
                        style={{ height: `${h * 0.8}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#C0392B]" />
                    <span className="text-xs text-white/20">Actual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#E67E22]" />
                    <span className="text-xs text-white/20">Forecast</span>
                  </div>
                  <span className="text-xs text-white/20 ml-auto">Spike detected: +54% in 3 days</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Social proof */}
      <FadeIn delay={100} className="py-14 px-6 border-t border-b border-[#1C1816]/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#1C1816]/25 text-center mb-6">Operations teams across East Africa</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {["Olare Orok Eco-Lodge", "Serengeti Migration Camp", "Samburu Intrepids", "Selous Riverside", "Okavango Delta Lodge", "Ruaha Wilderness"].map((camp, i) => (
              <span key={i} className="text-sm text-[#1C1816]/40 font-display italic">{camp}</span>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Features */}
      <section className="py-24 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Everything a remote camp needs</h2>
              <p className="text-base md:text-lg text-[#1C1816]/50 max-w-2xl leading-relaxed">
                Three integrated capabilities that turn scattered data into a single operations dashboard.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "14-Day Demand Radar",
                desc: "Predict occupancy spikes 5 days before they hit your supply line. Machine learning models trained on East African safari seasonality.",
                stat: "94%",
                statLabel: "forecast accuracy",
              },
              {
                title: "Auto Procurement",
                desc: "Purchase orders generated automatically from forecast curves. No more emergency runs to Arusha for extra produce.",
                stat: "73%",
                statLabel: "fewer stockout events",
              },
              {
                title: "AI Operations Agent",
                desc: "Ask Ona anything in plain English. &ldquo;How much diesel for next week?&rdquo; gets you an answer from live data in under 2 seconds.",
                stat: "<2s",
                statLabel: "average response time",
              },
            ].map((f, i) => (
              <FadeIn key={i} delay={100 + i * 100}>
                <div className="rounded-2xl bg-white ring-1 ring-[#1C1816]/5 p-8 h-full flex flex-col">
                  <h3 className="text-lg font-bold mb-3 text-[#1C1816]">{f.title}</h3>
                  <p className="text-sm text-[#1C1816]/50 leading-relaxed mb-8 flex-1">{f.desc}</p>
                  <div className="flex items-baseline gap-1.5 pt-6 border-t border-[#1C1816]/5">
                    <span className="text-2xl font-bold text-[#C0392B]">{f.stat}</span>
                    <span className="text-xs text-[#1C1816]/40">{f.statLabel}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-20 px-6 bg-[#1C1816] text-[#F4EDE2]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "94%", label: "Forecast accuracy" },
              { value: "73%", label: "Fewer stockouts" },
              { value: "<2s", label: "Agent response time" },
              { value: "12+", label: "Camps on platform" },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold tracking-tight text-[#F4EDE2] mb-2">{s.value}</div>
                  <div className="text-sm text-[#F4EDE2]/40">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-16">From camp managers</h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "We caught a 95% occupancy spike 5 days out. Ona automatically ordered 40kg extra produce and 10 gas cylinders before we even knew we needed them.",
                name: "Sarah Chen",
                role: "Camp Manager, Olare Orok Eco-Lodge",
                initials: "SC",
              },
              {
                quote: "The generator went down at 2AM. I asked Ona what to do and it pulled the fuel contingency SOP in under a second. Worth it for that alone.",
                name: "James Omondi",
                role: "Operations Director, Serengeti Migration Camp",
                initials: "JO",
              },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 150}>
                <div className="rounded-2xl bg-white ring-1 ring-[#1C1816]/5 p-8 md:p-10">
                  <p className="text-base md:text-lg leading-relaxed text-[#1C1816]/80 mb-8">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C0392B]/10 flex items-center justify-center text-sm font-bold text-[#C0392B]">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1C1816]">{t.name}</p>
                      <p className="text-xs text-[#1C1816]/40">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations + process */}
      <section className="py-24 md:py-28 px-6 bg-[#1C1816] text-[#F4EDE2]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Works with what you already have</h2>
              <p className="text-base md:text-lg text-[#F4EDE2]/50 leading-relaxed mb-8">
                Links with any PMS that exports occupancy data. No rip-and-replace. Ona sits alongside your existing tools.
              </p>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 bg-[#C0392B] text-[#F4EDE2] px-6 py-3 rounded-full font-medium hover:bg-[#C0392B]/90 active:scale-[0.97] transition-all duration-150 text-sm"
              >
                Get started <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
              </Link>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Connect your booking system", desc: "Link your PMS. Ona works with any system that exports occupancy data." },
                  { step: "02", title: "AI starts forecasting", desc: "Models analyze seasonality, booking velocity, and historical patterns to predict 14 days ahead." },
                  { step: "03", title: "Operations run themselves", desc: "Procurement automates, SOPs become searchable, your agent answers questions in real time." },
                ].map((s, i) => (
                  <div key={i} className="flex gap-5">
                    <span className="text-sm font-bold text-[#C0392B] mt-0.5">{s.step}</span>
                    <div>
                      <h3 className="text-base font-bold mb-1 text-[#F4EDE2]">{s.title}</h3>
                      <p className="text-sm text-[#F4EDE2]/40 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 md:py-36 px-6 bg-[#F4EDE2] text-[#1C1816]">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[1.04] mb-6">
              Ready to see what is coming?
            </h2>
            <p className="text-base md:text-lg text-[#1C1816]/50 mb-10 max-w-md mx-auto leading-relaxed">
              Stop running blind. Get 14-day visibility into demand, automate procurement, and respond before the generator goes down.
            </p>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 bg-[#1C1816] text-[#F4EDE2] px-8 py-4 rounded-full font-medium text-base hover:bg-[#1C1816]/90 active:scale-[0.97] transition-all duration-150"
            >
              Start free trial <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[#1C1816]/10 bg-[#1C1816] text-[#F4EDE2]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-sm font-display italic tracking-tight text-[#F4EDE2]/30">Ona</span>
            <div className="flex items-center gap-5">
              <Link href="/login" className="text-xs text-[#F4EDE2]/25 hover:text-[#F4EDE2]/50 transition-colors">Sign in</Link>
              <Link href="/register" className="text-xs text-[#F4EDE2]/25 hover:text-[#F4EDE2]/50 transition-colors">Get started</Link>
            </div>
          </div>
          <span className="text-xs text-[#F4EDE2]/15">&copy; 2026 Ona Analytics</span>
        </div>
      </footer>
    </div>
  )
}
