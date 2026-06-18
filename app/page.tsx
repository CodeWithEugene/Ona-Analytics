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

function FadeSlide({ children, className = "", delay = 0, x = false }: { children: React.ReactNode; className?: string; delay?: number; x?: boolean }) {
  const [ref, inView] = useInView(0.08)
  const axis = x ? "translate-x-8" : "translate-y-8"
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`transition-all duration-[900ms] ease-out ${
        inView ? `opacity-100 translate-x-0 translate-y-0` : `opacity-0 ${axis}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${800 + delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  return (
    <>
      {/* Grain overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.035] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <div className="bg-[#F4EDE2] text-[#1C1816] min-h-[100dvh]">
        {/* Floating nav */}
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-max">
          <div className="p-1 rounded-full bg-[#F4EDE2]/80 backdrop-blur-xl ring-1 ring-[#1C1816]/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <div className="rounded-full bg-[#F4EDE2] px-4 md:px-6 h-11 flex items-center gap-6">
              <Link href="/" className="text-base font-display italic tracking-tight text-[#1C1816] pr-4 border-r border-[#1C1816]/10">Ona</Link>
              <Link href="/login" className="text-sm text-[#1C1816]/50 hover:text-[#1C1816] transition-colors hidden sm:inline">Sign in</Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-sm bg-[#1C1816] text-[#F4EDE2] px-4 py-1.5 rounded-full font-medium hover:bg-[#1C1816]/90 active:scale-[0.97] transition-all duration-150"
              >
                Get started <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero — split screen */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <FadeSlide delay={100}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#C0392B] mb-6">
                AI Operations Intelligence
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.04] mb-6 text-[#1C1816]">
                See what is coming{" "}
                <span className="text-[#C0392B]">before</span>{" "}
                it arrives
              </h1>
              <p className="text-base md:text-lg text-[#1C1816]/50 leading-relaxed max-w-md mb-10">
                Predictive demand radar and supply chain intelligence purpose-built for remote safari camps. 14-day occupancy forecasts. Automated procurement. An AI agent that knows your camp.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-3 bg-[#1C1816] text-[#F4EDE2] pl-7 pr-2 py-2 rounded-full font-medium hover:bg-[#1C1816]/90 active:scale-[0.97] transition-all duration-150 text-sm"
                >
                  Start free trial
                  <span className="w-7 h-7 rounded-full bg-[#C0392B] flex items-center justify-center group-hover:bg-[#C0392B]/90 transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
                <Link href="/login" className="text-sm text-[#1C1816]/40 hover:text-[#1C1816] transition-colors">
                  Sign in &rarr;
                </Link>
              </div>
            </FadeSlide>

            <FadeSlide delay={300} x>
              <div className="p-1.5 rounded-[2rem] bg-[#1C1816]/10 ring-1 ring-[#1C1816]/10">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#0A0A0A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/50" />
                    </div>
                    <span className="text-[10px] text-white/15 font-mono tracking-wide">Ona Analytics &mdash; Dashboard Preview</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { label: "Current Occupancy", value: "41%", change: "+2.5%", color: "text-[#E67E22]" },
                      { label: "Peak Forecast", value: "95%", change: "In 3 days", color: "text-red-400" },
                      { label: "Active Procurement", value: "3", change: "2 urgent", color: "text-red-400" },
                    ].map((kpi, i) => (
                      <div key={i} className="bg-white/[0.03] rounded-xl p-4 ring-1 ring-white/[0.05]">
                        <p className="text-[10px] text-white/25 mb-2 tracking-wider uppercase">{kpi.label}</p>
                        <p className={`text-xl md:text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                        <p className="text-[10px] text-white/20 mt-1">{kpi.change}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-28 flex items-end gap-1.5">
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
                            style={{ height: `${h * 0.7}%` }}
                          />
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-white/10 text-[9px] px-1.5 py-0.5 rounded text-white/50 whitespace-nowrap transition-opacity">
                            {h}%
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" />
                      <span className="text-[9px] text-white/15">Actual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E67E22]" />
                      <span className="text-[9px] text-white/15">Forecast</span>
                    </div>
                    <span className="text-[9px] text-white/15">Spike +54% in 3 days</span>
                  </div>
                </div>
              </div>
            </FadeSlide>
          </div>
        </section>

        {/* Camp logos row */}
        <FadeSlide delay={200} className="py-14 px-6 border-y border-[#1C1816]/5">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#1C1816]/25 text-center mb-6">Operations teams across East Africa</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
              {["Olare Orok Eco-Lodge", "Serengeti Migration Camp", "Samburu Intrepids", "Selous Riverside", "Okavango Delta Lodge", "Ruaha Wilderness"].map((camp, i) => (
                <span key={i} className="text-sm text-[#1C1816]/40 font-display italic tracking-tight">{camp}</span>
              ))}
            </div>
          </div>
        </FadeSlide>

        {/* Features — bento grid */}
        <section className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <FadeSlide delay={100}>
              <div className="mb-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C0392B]/20 bg-[#C0392B]/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#C0392B] mb-4">
                  Capabilities
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter max-w-lg">Everything a remote camp needs</h2>
              </div>
            </FadeSlide>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Demand Radar — tall card */}
              <FadeSlide delay={200} className="md:col-span-2">
                <div className="p-[1px] rounded-[2rem] bg-gradient-to-b from-[#C0392B]/15 to-transparent h-full">
                  <div className="rounded-[calc(2rem-1px)] bg-[#F4EDE2] p-8 md:p-10 h-full flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1">
                      <div className="w-10 h-10 rounded-xl bg-[#C0392B]/10 flex items-center justify-center mb-5">
                        <TrendingUpIcon />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-[#1C1816]">14-Day Demand Radar</h3>
                      <p className="text-sm text-[#1C1816]/50 leading-relaxed mb-6 max-w-sm">
                        Predict occupancy spikes 5 days before they hit your supply line. Machine learning models trained on East African safari seasonality.
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold text-[#C0392B]">94%</span>
                        <span className="text-xs text-[#1C1816]/40">forecast accuracy</span>
                      </div>
                    </div>
                    <div className="w-full md:w-48 h-32 md:h-full rounded-2xl bg-[#1C1816]/5 ring-1 ring-[#1C1816]/5 overflow-hidden flex-shrink-0">
                      <div className="p-4 h-full flex flex-col justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[9px] text-[#1C1816]/30 uppercase tracking-wider">Live</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-[#C0392B]">41%</p>
                          <p className="text-[10px] text-[#1C1816]/30">current occupancy</p>
                        </div>
                        <div className="h-12 flex items-end gap-1">
                          {[40,42,39,41,43].map((h, i) => (
                            <div key={i} className="flex-1 bg-[#C0392B]/20 rounded-t-sm transition-all" style={{ height: `${h * 0.35}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeSlide>

              {/* Auto Procurement */}
              <FadeSlide delay={300}>
                <div className="p-[1px] rounded-[2rem] bg-gradient-to-b from-[#C0392B]/15 to-transparent h-full">
                  <div className="rounded-[calc(2rem-1px)] bg-[#F4EDE2] p-8 md:p-10 h-full">
                    <div className="w-10 h-10 rounded-xl bg-[#C0392B]/10 flex items-center justify-center mb-5">
                      <TruckIcon />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[#1C1816]">Auto Procurement</h3>
                    <p className="text-sm text-[#1C1816]/50 leading-relaxed mb-6">
                      Purchase orders generated automatically from forecast curves. No more emergency runs to Arusha for extra produce.
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold text-[#C0392B]">73%</span>
                      <span className="text-xs text-[#1C1816]/40">fewer stockout events</span>
                    </div>
                  </div>
                </div>
              </FadeSlide>

              {/* AI Agent */}
              <FadeSlide delay={400}>
                <div className="p-[1px] rounded-[2rem] bg-gradient-to-b from-[#C0392B]/15 to-transparent h-full">
                  <div className="rounded-[calc(2rem-1px)] bg-[#F4EDE2] p-8 md:p-10 h-full">
                    <div className="w-10 h-10 rounded-xl bg-[#C0392B]/10 flex items-center justify-center mb-5">
                      <AgentIcon />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[#1C1816]">AI Operations Agent</h3>
                    <p className="text-sm text-[#1C1816]/50 leading-relaxed mb-6">
                      Ask Ona anything in plain English. &ldquo;How much diesel for next week?&rdquo; gets you an answer from live data in under 2 seconds.
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold text-[#C0392B]">&lt;2s</span>
                      <span className="text-xs text-[#1C1816]/40">average response time</span>
                    </div>
                  </div>
                </div>
              </FadeSlide>

              {/* Forecasting — wide card */}
              <FadeSlide delay={500} className="md:col-span-2">
                <div className="p-[1px] rounded-[2rem] bg-gradient-to-b from-[#C0392B]/15 to-transparent h-full">
                  <div className="rounded-[calc(2rem-1px)] bg-[#F4EDE2] p-8 md:p-10 h-full flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-[#1C1816]">Forecasting that adapts to the bush</h3>
                      <p className="text-sm text-[#1C1816]/50 leading-relaxed max-w-sm">
                        Rainy season shifts, wildlife migration patterns, last-minute group bookings &mdash; Ona factors in what spreadsheets miss.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[#C0392B]">12+</div>
                      <div className="text-xs text-[#1C1816]/40 mt-1">camps on platform</div>
                    </div>
                  </div>
                </div>
              </FadeSlide>

              {/* Integrations */}
              <FadeSlide delay={600}>
                <div className="p-[1px] rounded-[2rem] bg-gradient-to-b from-[#C0392B]/15 to-transparent h-full">
                  <div className="rounded-[calc(2rem-1px)] bg-[#F4EDE2] p-8 md:p-10 h-full">
                    <div className="w-10 h-10 rounded-xl bg-[#C0392B]/10 flex items-center justify-center mb-5">
                      <PlugIcon />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[#1C1816]">Works with your stack</h3>
                    <p className="text-sm text-[#1C1816]/50 leading-relaxed mb-6">
                      Links with any PMS that exports occupancy data. No rip-and-replace &mdash; Ona sits alongside your existing tools.
                    </p>
                  </div>
                </div>
              </FadeSlide>
            </div>
          </div>
        </section>

        {/* Dark section — testimonial + process */}
        <section className="py-0">
          <div className="bg-[#1C1816] text-[#F4EDE2] px-6 rounded-t-[3rem] md:rounded-t-[4rem]">
            <div className="max-w-7xl mx-auto py-28">
              <FadeSlide delay={100}>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C0392B]/20 bg-[#C0392B]/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#E67E22] mb-4">
                  From the field
                </div>
                <div className="grid md:grid-cols-2 gap-12 md:gap-20">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold tracking-tight leading-[1.15] mb-12">
                      &ldquo;We caught a 95% occupancy spike 5 days out. Ona automatically ordered 40kg extra produce and 10 gas cylinders before we even knew we needed them.&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E67E22]/20 flex items-center justify-center text-sm font-bold text-[#E67E22]">
                        SC
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F4EDE2]">Sarah Chen</p>
                        <p className="text-xs text-[#F4EDE2]/30">Camp Manager, Olare Orok Eco-Lodge</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold tracking-tight leading-[1.15] mb-12">
                      &ldquo;The generator went down at 2AM. I asked Ona what to do and it pulled the fuel contingency SOP in under a second. Worth it for that alone.&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E67E22]/20 flex items-center justify-center text-sm font-bold text-[#E67E22]">
                        JO
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F4EDE2]">James Omondi</p>
                        <p className="text-xs text-[#F4EDE2]/30">Operations Director, Serengeti Migration Camp</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeSlide>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 bg-[#1C1816]">
          <div className="max-w-3xl mx-auto text-center">
            <FadeSlide delay={100}>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[1.04] mb-6 text-[#F4EDE2]">
                Ready to see what is coming?
              </h2>
              <p className="text-base md:text-lg text-[#F4EDE2]/40 mb-10 max-w-lg mx-auto leading-relaxed">
                Stop running blind. Get 14-day visibility into demand, automate procurement, and respond before the generator goes down.
              </p>
              <Link
                href="/register"
                className="group inline-flex items-center gap-3 bg-[#C0392B] text-[#F4EDE2] pl-8 pr-2 py-2.5 rounded-full font-medium hover:bg-[#C0392B]/90 active:scale-[0.97] transition-all duration-150"
              >
                Start free trial
                <span className="w-8 h-8 rounded-full bg-[#1C1816] flex items-center justify-center group-hover:bg-[#1C1816]/90 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </FadeSlide>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-6 border-t border-[#1C1816]/10 bg-[#F4EDE2]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="font-display italic tracking-tight text-[#1C1816]/30 text-sm">Ona</span>
              <div className="flex items-center gap-5">
                <Link href="/login" className="text-[10px] uppercase tracking-wider text-[#1C1816]/25 hover:text-[#1C1816]/50 transition-colors">Sign in</Link>
                <Link href="/register" className="text-[10px] uppercase tracking-wider text-[#1C1816]/25 hover:text-[#1C1816]/50 transition-colors">Get started</Link>
              </div>
            </div>
            <span className="text-[10px] text-[#1C1816]/15">&copy; 2026 Ona Analytics</span>
          </div>
        </footer>
      </div>
    </>
  )
}

function TrendingUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#C0392B]">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#C0392B]">
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function AgentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#C0392B]">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

function PlugIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#C0392B]">
      <path d="M12 22v-5" />
      <path d="M9 8h6" />
      <path d="M3 14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v8z" />
      <path d="M7 14v3a2 2 0 002 2h6a2 2 0 002-2v-3" />
    </svg>
  )
}
