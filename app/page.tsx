"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { 
  ArrowUpRight, 
  TrendingUp, 
  Truck, 
  Sparkles, 
  Shield, 
  Zap, 
  Workflow, 
  CloudRain, 
  Database, 
  Search, 
  Terminal,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react"

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
  const [ref, inView] = useInView(0.05)
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`transition-all duration-1000 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Simulation steps for interactive command center
  const [simStep, setSimStep] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 4)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-background text-foreground font-body min-h-[100dvh] selection:bg-primary/20 selection:text-primary">
      
      {/* Dynamic Nav Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <Link href="/" className="hover:opacity-85 transition-opacity">
            <img src="/logo.svg" alt="Ona Analytics Logo" className="h-10 w-auto dark:brightness-0 dark:invert" />
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#radar" className="hover:text-foreground transition-colors">Demand Radar</a>
            <a href="#problem" className="hover:text-foreground transition-colors">The Challenge</a>
            <a href="#architecture" className="hover:text-foreground transition-colors">Split-Brain AI</a>
            <a href="#bento" className="hover:text-foreground transition-colors">System Capabilities</a>
          </div>

          <div className="flex items-center gap-5">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors border border-border"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-primary" />}
              </button>
            )}
            <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-primary/95 active:scale-[0.97] transition-all shadow-sm"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-36 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7">
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary mb-8 font-mono">
                  ✦ SECURING REMOTE SUPPLY CHAINS
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-sans tracking-tight leading-[1.05] mb-8 text-foreground">
                  See what is coming <br />
                  <span className="text-primary relative inline-block">
                    before
                    <span className="absolute left-0 bottom-1 w-full h-[3px] bg-primary/30 rounded" />
                  </span> it arrives
                </h1>
                <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-12 font-body">
                  Ona Analytics is a serverless, AI-native demand radar built specifically for remote safari camps and eco-lodges to predict occupancy surges, prevent kitchen stockouts, and optimize isolated supply trucks days in advance.
                </p>
                <div className="flex flex-wrap items-center gap-5">
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-7 py-3.5 rounded-lg font-semibold hover:bg-primary/95 active:scale-[0.97] transition-all duration-150 text-sm shadow-sm"
                  >
                    Start 14-Day Trial 
                    <span className="w-5 h-5 rounded-full bg-primary-foreground/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      <ArrowUpRight className="w-3.5 h-3.5 text-primary-foreground" />
                    </span>
                  </Link>
                  <a 
                    href="#problem" 
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2 px-4"
                  >
                    Explore the logistics loop &darr;
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Active Supply Radar HUD Card */}
            <div className="lg:col-span-5 w-full">
              <FadeIn delay={200}>
                <div className="rounded-[2.5rem] p-1.5 bg-foreground/5 ring-1 ring-foreground/5 shadow-sm">
                  <div className="bg-card text-card-foreground rounded-[calc(2.5rem-0.375rem)] shadow-sm p-6 border border-border">
                    <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Live Supply Radar HUD</span>
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground">MAASAI MARA • REGION 1</span>
                    </div>

                    <div className="space-y-4">
                      {/* Transit Operations */}
                      <div>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Transit Operations</span>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
                            <div className="flex items-center gap-2.5">
                              <Truck className="w-3.5 h-3.5 text-emerald-500" />
                              <div>
                                <div className="text-xs font-semibold text-foreground/95">Truck A (Fresh Produce)</div>
                                <span className="text-[10px] text-muted-foreground block">Transit via Sekenani Gate bypass</span>
                              </div>
                            </div>
                            <span className="text-[10px] bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-medium">140km left</span>
                          </div>

                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border">
                            <div className="flex items-center gap-2.5">
                              <Truck className="w-3.5 h-3.5 text-amber-500" />
                              <div>
                                <div className="text-xs font-semibold text-foreground/95">Truck B (Propane Cylinders)</div>
                                <span className="text-[10px] text-muted-foreground block">Awaiting dispatch confirmation</span>
                              </div>
                            </div>
                            <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-medium">Standby</span>
                          </div>
                        </div>
                      </div>

                      {/* Contingency Monitor */}
                      <div>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Contingency Monitor</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-lg bg-muted/40 border border-border">
                            <div className="flex items-center gap-2 text-amber-500 mb-1">
                              <CloudRain className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-mono uppercase font-bold">Rain Alert</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground leading-tight block">Dispatch moved -12h to beat mud roads.</span>
                          </div>
                          
                          <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/15">
                            <div className="flex items-center gap-2 text-primary mb-1">
                              <Zap className="w-3.5 h-3.5 animate-pulse" />
                              <span className="text-[10px] font-mono uppercase font-bold">Low Stocks</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground leading-tight block">Kitchen fresh produce down to 22%.</span>
                          </div>
                        </div>
                      </div>

                      {/* Reserve Gauges */}
                      <div>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Camp Reserve Gauges</span>
                        <div className="space-y-2 bg-muted/30 p-3 rounded-lg border border-border">
                          {[
                            { name: "Generator Fuel", val: 84, color: "bg-emerald-500" },
                            { name: "Fresh Produce Reserves", val: 22, color: "bg-destructive" },
                            { name: "Linen Rotations", val: 100, color: "bg-emerald-500" }
                          ].map((gauge, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-foreground/70">{gauge.name}</span>
                                <span className="font-mono text-muted-foreground">{gauge.val}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className={`h-full ${gauge.color} rounded-full`} style={{ width: `${gauge.val}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

          </div>

          {/* Interactive Command Center Mockup (Theme-aware Dashboard template layout) */}
          <FadeIn delay={200}>
            <div id="radar" className="rounded-[2rem] p-2 bg-foreground/5 ring-1 ring-foreground/5 shadow-sm">
              <div className="rounded-[calc(2rem-0.375rem)] bg-card text-foreground overflow-hidden border border-border">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-xs text-muted-foreground font-mono ml-3">Ona Control Tower — Actively Syncing</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span>HOST: AURORA-PG-CLUSTER</span>
                    <span>PING: 14ms</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-0">
                  {/* Left Column: Live Agent Simulation (5 cols) */}
                  <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border p-6 bg-muted/10 flex flex-col justify-between min-h-[380px]">
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Ona Agent Trace</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="text-xs">
                          <span className="text-primary font-mono font-semibold">User: </span>
                          <span className="text-foreground/90">Analyze supply status for the upcoming weekend.</span>
                        </div>

                        {simStep >= 1 && (
                          <div className="p-3 rounded-lg bg-card border border-border animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono uppercase font-semibold">Tool</span>
                              <span className="text-[10px] text-muted-foreground font-mono">query_demand_data</span>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">Executing SQL query against demand_logs table...</span>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">&gt; Found surge: +54.1% occupancy predicted.</div>
                          </div>
                        )}

                        {simStep >= 2 && (
                          <div className="p-3 rounded-lg bg-card border border-border animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono uppercase font-semibold">RAG</span>
                              <span className="text-[10px] text-muted-foreground font-mono">search_context_knowledge</span>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">Vector cosine-similarity lookup similarity &gt;= 0.88</span>
                            <div className="text-[10px] text-primary font-mono mt-1">&gt; Match: Fresh Supply SOP &quot;Occupied suite requires 4kg produce...&quot;</div>
                          </div>
                        )}

                        {simStep >= 3 && (
                          <div className="p-3 rounded-lg bg-card border border-border animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono uppercase font-semibold">Write</span>
                              <span className="text-[10px] text-muted-foreground font-mono">generate_procurement</span>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">Writing 3 items to procurement_items table...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border text-xs text-muted-foreground font-mono flex items-center justify-between">
                      <span>Loop Iterations: 3/5</span>
                      <span>Model: Nemotron-3-550B</span>
                    </div>
                  </div>

                  {/* Right Column: Predictive Graph (7 cols) */}
                  <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h4 className="text-lg font-bold font-sans">Weekend Demand Projection</h4>
                          <p className="text-xs text-muted-foreground">Olare Orok Eco-Lodge • Live occupancy rates</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded bg-primary/30 border border-primary" />
                            <span className="text-muted-foreground">Actual</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500" />
                            <span className="text-muted-foreground">Forecast</span>
                          </div>
                        </div>
                      </div>

                      {/* Bar Graph */}
                      <div className="h-44 flex items-end gap-2.5 border-b border-border pb-2">
                        {[40, 42, 39, 41, 43, 38, 40, 41, 42, 39, 41, 40, 41, 48, 75, 95, 93, 65].map((val, i) => (
                          <div key={i} className="flex-1 h-full flex flex-col justify-end group relative cursor-pointer">
                            <div 
                              className={`rounded-t-sm transition-all duration-300 relative ${
                                i >= 13 
                                  ? 'bg-emerald-500/30 group-hover:bg-emerald-500/50' 
                                  : 'bg-primary/30 group-hover:bg-primary/50'
                              }`}
                              style={{ height: `${val}%` }}
                            >
                              {i === 15 && (
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-ping" />
                              )}
                            </div>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-muted text-[10px] font-mono px-1.5 py-0.5 rounded border border-border whitespace-nowrap z-10">
                              {val}%
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Timeline labels */}
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-3">
                        <span>14 Days Ago</span>
                        <span>Today</span>
                        <span className="text-emerald-500 font-semibold">Forecasted Spike</span>
                        <span>+5 Days</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                        <span className="text-[10px] text-muted-foreground font-mono block mb-1">Peak Occupancy</span>
                        <span className="text-xl font-bold text-emerald-500">95.0%</span>
                        <span className="text-[9px] text-muted-foreground block mt-0.5">In 3 days</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                        <span className="text-[10px] text-muted-foreground font-mono block mb-1">Weekly Delta</span>
                        <span className="text-xl font-bold text-emerald-500">+54.0%</span>
                        <span className="text-[9px] text-muted-foreground block mt-0.5">vs prior avg</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
                        <span className="text-[10px] text-muted-foreground font-mono block mb-1">Supply Actions</span>
                        <span className="text-xl font-bold text-primary font-sans">3 Pending</span>
                        <span className="text-[9px] text-muted-foreground block mt-0.5">Urgency: High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          </div>
        </section>

      {/* Social Proof Banner */}
      <FadeIn className="py-14 px-6 border-t border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground text-center mb-8 font-mono">
            Securing supply lines across East African operations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            {[
              { name: "Olare Orok Eco-Lodge", path: "/logos/olare-orok.svg" },
              { name: "Serengeti Migration Camp", path: "/logos/serengeti.png" },
              { name: "Samburu Intrepids Lodge", path: "/logos/samburu.png" },
              { name: "Selous Riverside Camp", path: "/logos/selous.png" },
              { name: "Okavango Delta Lodge", path: "/logos/okavango.svg" },
              { name: "Ruaha Wilderness Camp", path: "/logos/ruaha.png" }
            ].map((camp, i) => (
              <img
                key={i}
                src={camp.path}
                alt={camp.name}
                title={camp.name}
                className="h-8 max-w-[140px] w-auto object-contain opacity-55 grayscale brightness-0 dark:brightness-0 dark:invert hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Section: The Logistical Isolation Problem */}
      <section id="problem" className="py-24 md:py-32 px-6 bg-muted/30 border-b border-border relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6">
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6 font-mono">
                  THE HIGH-STAKES SUPPLY GAP
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-sans tracking-tight leading-[1.1] mb-8">
                  Zero local supermarkets. <br />
                  Five hours from town.
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  Luxury safari camps of 10 to 25 tented suites operate in total logistical isolation. If an unexpected 40% occupancy surge occurs for the weekend, you cannot simply make a grocery run. 
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
                  Supplies must be dispatched from hubs (like Nairobi or Arusha) days in advance. Under-forecasting translates to running out of clean linen and fresh produce mid-stay. Ona resolves this risk by coupling occupancy predictions with automatic procurement triggers.
                </p>
                <div className="grid grid-cols-2 gap-6 border-t border-border pt-8">
                  <div>
                    <span className="text-xs text-muted-foreground font-mono block mb-1">AVERAGE LEAD TIME</span>
                    <span className="text-2xl font-bold font-sans text-primary">3 Days Minimum</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-mono block mb-1">EMERGENCY DISPATCH COST</span>
                    <span className="text-2xl font-bold font-sans text-destructive">4.5x Premium</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Left Column: Timeline list */}
            <div className="lg:col-span-6">
              <FadeIn delay={150}>
                <div className="rounded-[2.5rem] p-1.5 bg-foreground/5 ring-1 ring-foreground/5">
                  <div className="bg-card shadow-2xl p-8 border border-border rounded-[calc(2.5rem-0.375rem)]">
                    <div className="flex items-center justify-between border-b border-border pb-5 mb-8">
                      <span className="text-xs text-muted-foreground font-mono">SOP Playbook: The 5-Day Supply Loop</span>
                      <span className="text-xs text-emerald-500 font-mono">Active Model</span>
                    </div>

                    <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
                      {[
                        { 
                          day: "Day -5", 
                          title: "Radar Prediction & Verification", 
                          desc: "Ona's ML models flags a 30%+ booking surge for the weekend, querying historical logs.", 
                          color: "bg-emerald-500" 
                        },
                        { 
                          day: "Day -3", 
                          title: "Automated Procurement & Assembly", 
                          desc: "Ona Agent automatically aggregates demand rules from standard SOPs and generates a truck procurement dispatch sheet.", 
                          color: "bg-amber-500" 
                        },
                        { 
                          day: "Day -2", 
                          title: "Mud Buffer Warning (Weather RAG)", 
                          desc: "RAG checks weather database. Heavy rain warning triggers dispatch shift 12 hours earlier for the Sekenani Gate bypass road.", 
                          color: "bg-destructive" 
                        },
                        { 
                          day: "Day 0", 
                          title: "Lodge Peak Occupancy Begins", 
                          desc: "Supplies are arrived, organized, and prepared before guests check-in.", 
                          color: "bg-muted" 
                        }
                      ].map((step, idx) => (
                        <div key={idx} className="flex gap-6 relative group">
                          <div className={`w-6 h-6 rounded-full ${step.color} border border-border flex items-center justify-center text-[10px] font-bold z-10 shrink-0 ${step.color === "bg-muted" ? "text-muted-foreground" : "text-primary-foreground"}`}>
                            {idx + 1}
                          </div>
                          <div>
                            <div className="flex items-baseline gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                              <span className="text-[9px] font-mono text-muted-foreground">({step.day})</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* Section: The Split-Brain AI Architecture */}
      <section id="architecture" className="py-24 md:py-32 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-xs uppercase tracking-widest text-primary font-mono font-bold block mb-4">THE DUAL-ENGINE BLUEPRINT</span>
              <h2 className="text-4xl md:text-6xl font-bold font-sans tracking-tight leading-[1.1] mb-6">
                Split-Brain AI Architecture
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                By coupling deterministic database structures with high-dimensional vector embeddings, Ona reads exact metrics while maintaining context knowledge of operations SOPs.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: "Deterministic SQL Node",
                tech: "Aurora PostgreSQL Core",
                desc: "Queries real-time logs against demand_logs table to extract accurate metrics (occupancy ratios, check-ins, ADR, RevPAR) without LLM text hallucinations.",
                queries: "SELECT actual_value, predicted_value FROM demand_logs WHERE org_id = $1..."
              },
              {
                icon: Search,
                title: "pgvector Semantic RAG",
                tech: "pgvector (HNSW Indexing)",
                desc: "Harnesses high-speed cosine vector calculations (<=>) on 1536-dimensional embeddings. Converts queries to semantic vectors to extract procedural details from camp SOPs.",
                queries: "ORDER BY embedding <=> $1::vector LIMIT 5..."
              },
              {
                icon: Workflow,
                title: "Procurement Dispatch Engine",
                tech: "Autonomous Write Loop",
                desc: "Checks forecasted spikes. When demand exceeds 60%, the engine executes a rule-based write loop to commit items directly to procurement_items table.",
                queries: "INSERT INTO procurement_items (org_id, item_name, required_amount)..."
              }
            ].map((node, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="rounded-[2rem] p-1.5 bg-foreground/5 ring-1 ring-foreground/5 h-full">
                  <div className="bg-card rounded-[calc(2rem-0.375rem)] shadow-sm p-8 h-full flex flex-col justify-between border border-border">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                        <node.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-foreground">{node.title}</h3>
                      <span className="text-[10px] font-mono text-primary block mb-4 uppercase tracking-wider font-semibold">{node.tech}</span>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{node.desc}</p>
                    </div>
                    
                    <div className="rounded-lg bg-muted p-4 text-[11px] font-mono text-foreground/80 border border-border select-all">
                      <span className="text-primary block mb-1 font-semibold">SQL_EXECUTE:</span>
                      <code className="break-all">{node.queries}</code>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Bento Grid Features */}
      <section id="bento" className="py-24 md:py-32 px-6 bg-muted/20 border-t border-b border-border">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-16">
              <span className="text-xs uppercase tracking-widest text-primary font-mono font-bold block mb-3">SYSTEM CAPABILITIES</span>
              <h2 className="text-4xl md:text-5xl font-bold font-sans tracking-tight mb-4">Precision tools for the wild</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Four tightly coupled nodes built to secure supply chains, eliminate manual inventory spreadsheets, and log field protocols.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-6 gap-6">
            
            {/* Bento 1: 14-Day Demand Radar */}
            <FadeIn className="md:col-span-4" delay={100}>
              <div className="rounded-[2rem] p-1.5 bg-foreground/5 ring-1 ring-foreground/5 h-full">
                <div className="bg-card rounded-[calc(2rem-0.375rem)] shadow-sm p-8 h-full flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold mb-3">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>DEMAND RADAR</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Predictive Demand Dashboard</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                      Analyze forward seasonality, historical occupancy delta, and weather checks to forecast camp demands 14 days in advance.
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end justify-center pt-6 sm:pt-0 border-t sm:border-t-0 sm:border-l border-border sm:pl-8 min-w-[155px]">
                    <span className="text-4xl font-bold text-primary">94.2%</span>
                    <span className="text-xs text-muted-foreground">Verified Accuracy</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Bento 2: Auto Procurement */}
            <FadeIn className="md:col-span-2" delay={200}>
              <div className="rounded-[2rem] p-1.5 bg-foreground/5 ring-1 ring-foreground/5 h-full">
                <div className="bg-card rounded-[calc(2rem-0.375rem)] shadow-sm p-8 h-full flex flex-col justify-between border border-border">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold mb-3">
                      <Truck className="w-3.5 h-3.5" />
                      <span>LOGISTICS WRITE</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Auto Procurement</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      Trigger procurement recommendations directly into the database system based on demand rules.
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1.5 pt-6 border-t border-border">
                    <span className="text-3xl font-bold text-primary">73%</span>
                    <span className="text-xs text-muted-foreground">Fewer Stockouts</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Bento 3: AI Operations Agent */}
            <FadeIn className="md:col-span-3" delay={300}>
              <div className="rounded-[2rem] p-1.5 bg-foreground/5 ring-1 ring-foreground/5 h-full">
                <div className="bg-card rounded-[calc(2rem-0.375rem)] shadow-sm p-8 h-full flex flex-col justify-between gap-6 border border-border">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>OPERATIONS INTELLIGENCE</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">The Ona Agent</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Converse directly with your camp. Query fuel inventories, request linen orders, and search local playbooks via plain English.
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1.5 pt-6 border-t border-border">
                    <span className="text-3xl font-bold text-primary">&lt;2s</span>
                    <span className="text-xs text-muted-foreground">Response Latency</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Bento 4: Weather & Mud Warnings */}
            <FadeIn className="md:col-span-3" delay={400}>
              <div className="rounded-[2rem] p-1.5 bg-foreground/5 ring-1 ring-foreground/5 h-full">
                <div className="bg-card rounded-[calc(2rem-0.375rem)] shadow-sm p-8 h-full flex flex-col justify-between gap-6 border border-border">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold mb-3">
                      <CloudRain className="w-3.5 h-3.5" />
                      <span>WEATHER INTELLIGENCE</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Weather Contingency RAG</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Cross-checks local forecast data with camp SOP rules to automatically dispatch trucks earlier during heavy rain warning states.
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1.5 pt-6 border-t border-border">
                    <span className="text-3xl font-bold text-primary">12 Hours</span>
                    <span className="text-xs text-muted-foreground">Early Dispatch Window</span>
                  </div>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* Section: Testimonials & Case Studies */}
      <section className="py-24 md:py-32 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-16 text-center md:text-left">
              <span className="text-xs uppercase tracking-widest text-primary font-mono font-bold block mb-3">TESTIMONIALS</span>
              <h2 className="text-4xl md:text-5xl font-bold font-sans tracking-tight">Voices from the bush</h2>
            </div>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "We caught a 95% occupancy spike 5 days out. Ona automatically ordered 40kg extra produce and 10 gas cylinders before we even knew we needed them. It saved the weekend.",
                name: "Sarah Chen",
                role: "Camp Manager, Olare Orok Eco-Lodge",
                initials: "SC"
              },
              {
                quote: "The generator went down at 2AM. I asked Ona what to do and it immediately pulled the fuel contingency SOP in under two seconds. Worth it for that alone.",
                name: "James Omondi",
                role: "Operations Director, Serengeti Migration Camp",
                initials: "JO"
              }
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 150}>
                <div className="rounded-[2rem] p-1.5 bg-foreground/5 ring-1 ring-foreground/5 h-full">
                  <div className="bg-card rounded-[calc(2rem-0.375rem)] shadow-sm p-8 md:p-10 h-full flex flex-col justify-between border border-border">
                    <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-8">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary font-mono">
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Section: CTA / Trial Request */}
      <section className="py-28 md:py-36 px-6 bg-muted/30 border-t border-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeIn>
            <span className="text-xs uppercase tracking-widest text-primary font-mono font-bold block mb-4">START MONITORING</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-sans tracking-tight leading-[1.1] mb-8">
              Ready to secure your camp?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
              Equip your camp with 14-day booking alerts, automate your supply chain sheets, and get operational context.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-sm hover:bg-primary/95 active:scale-[0.97] transition-all shadow-sm"
              >
                Create Account <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground px-8 py-4 rounded-lg font-semibold text-sm hover:bg-muted/80 active:scale-[0.97] transition-all border border-border"
              >
                Access Command Center
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-background text-muted-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-border pb-8 mb-8">
            <div>
              <Link href="/">
                <img src="/logo.svg" alt="Ona Analytics Logo" className="h-10 w-auto dark:brightness-0 dark:invert" />
              </Link>
              <p className="text-xs text-muted-foreground mt-2 font-mono">Securing isolated camps since 2026</p>
            </div>
            
            <div className="flex flex-wrap gap-8 text-xs text-muted-foreground font-mono font-semibold">
              <a href="#radar" className="hover:text-foreground transition-colors">Radar</a>
              <a href="#problem" className="hover:text-foreground transition-colors">The Loop</a>
              <a href="#architecture" className="hover:text-foreground transition-colors">Core API</a>
              <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
              <Link href="/register" className="hover:text-foreground transition-colors">Register</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-muted-foreground font-mono">
            <span>&copy; 2026 Ona Analytics. Built for Hack the Zero Stack (Vercel + AWS).</span>
            <span>Security • Terms of Operations • Local Playbook v1.2</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
