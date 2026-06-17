const fs = require('fs');
const path = require('path');

// 1. globals.css - dark theme
const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 4%;
    --foreground: 30 10% 90%;
    --card: 0 0% 8%;
    --card-foreground: 30 10% 90%;
    --popover: 0 0% 8%;
    --popover-foreground: 30 10% 90%;
    --primary: 28 91% 52%;
    --primary-foreground: 0 0% 4%;
    --secondary: 160 30% 20%;
    --secondary-foreground: 30 10% 90%;
    --muted: 0 0% 15%;
    --muted-foreground: 30 5% 60%;
    --accent: 28 91% 52%;
    --accent-foreground: 0 0% 4%;
    --destructive: 0 70% 50%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 20%;
    --input: 0 0% 20%;
    --ring: 28 91% 52%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body), system-ui, sans-serif;
  }
}`;

// 2. Landing page
const landingPage = `"use client"

import React from "react"
import Link from "next/link"
import { ArrowUpRight, TrendingUp, Shield, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1] selection:bg-[#E67E22]/30">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-display italic tracking-tight text-[#E8E6E1]">
            Ona
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/login" className="text-sm text-[#E8E6E1]/60 hover:text-[#E8E6E1] transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="text-sm bg-[#E8E6E1] text-[#0A0A0A] px-5 py-2 rounded-full hover:bg-[#E8E6E1]/90 transition-colors font-medium">
              Access Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E6E1]/10 bg-[#E8E6E1]/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-[#E8E6E1]/60 mb-8">
                AI Operations Intelligence
              </div>
              <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-display italic leading-[1.05] tracking-tight text-[#E8E6E1] mb-6">
                See what is coming
                <br />
                <span className="text-[#E67E22]">before</span> it arrives
              </h1>
              <p className="text-lg text-[#E8E6E1]/60 leading-relaxed max-w-lg mb-8">
                Predictive demand radar and supply chain intelligence for remote safari camps and eco-lodges across East Africa.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="group inline-flex items-center gap-2 bg-[#E8E6E1] text-[#0A0A0A] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#E8E6E1]/90 transition-all duration-200 active:scale-[0.97]">
                  Explore Dashboard
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0A0A0A]/10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#0A0A0A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#E8E6E1]/40">Next 14 Days</span>
                      <span className="text-xs text-[#E67E22] bg-[#E67E22]/10 px-2 py-1 rounded-full">+23%</span>
                    </div>
                    <div className="h-32 flex items-end gap-1">
                      {[40,55,45,70,60,85,75,90,65,80,70,95,85,100].map((h,i) => (
                        <div key={i} className="flex-1 bg-[#E67E22]/20 hover:bg-[#E67E22]/40 transition-colors rounded-sm" style={{height: h + '%'}} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-display italic leading-[1.1] text-[#E8E6E1] mb-6">
                The blind spot in camp operations
              </h2>
              <p className="text-lg text-[#E8E6E1]/60 leading-relaxed mb-6">
                When the last diesel truck left Mombasa 6 days ago and the generator just went down, you have 4 hours of frozen stores left. Your WhatsApp is blowing up.
              </p>
              <p className="text-lg text-[#E8E6E1]/60 leading-relaxed">
                This is not a technology problem. This is an intelligence problem. And it costs camps an average of $12,400 per preventable stockout event.
              </p>
            </div>
            <div className="space-y-0">
              {[
                { label: "Forecast Accuracy (Current)", value: "±42325%" },
                { label: "Avg. Reaction Time", value: "3.2 days" },
                { label: "Stockout Incidents", value: "1 in 4 weeks" },
                { label: "Cost Per Stockout", value: "$12,400" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-white/5">
                  <span className="text-sm text-[#E8E6E1]/40">{stat.label}</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E6E1]/10 bg-[#E8E6E1]/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-[#E8E6E1]/60 mb-6">
              Platform Intelligence
            </div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-display italic leading-[1.1] text-[#E8E6E1] max-w-lg">
              Built for the realities of remote operations
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: "Demand Radar", desc: "14-day predictive horizon with 87% accuracy. See spike events 5 days before they hit." },
              { icon: Shield, title: "Auto Procurement", desc: "Purchase orders generated automatically from forecast curves. No more emergency runs." },
              { icon: Zap, title: "SOP Intelligence", desc: "Natural language queries about standard procedures. Ask what to do if the borehole pump fails." },
            ].map((f, i) => (
              <div key={i} className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5 hover:ring-white/10 transition-all duration-300 group">
                <div className="rounded-[calc(2rem-0.375rem)] bg-[#0A0A0A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-8 h-full">
                  <f.icon className="w-6 h-6 text-[#E67E22] mb-6" />
                  <h3 className="text-xl font-display italic text-[#E8E6E1] mb-3">{f.title}</h3>
                  <p className="text-sm text-[#E8E6E1]/50 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-display italic leading-[1.1] text-[#E8E6E1] mb-6">
            Ready to see what is coming?
          </h2>
          <p className="text-lg text-[#E8E6E1]/60 leading-relaxed mb-8 max-w-lg mx-auto">
            Ona is in private beta with select camps across East Africa.
          </p>
          <Link href="/login" className="group inline-flex items-center gap-2 bg-[#E8E6E1] text-[#0A0A0A] px-8 py-4 rounded-full text-sm font-medium hover:bg-[#E8E6E1]/90 transition-all duration-200 active:scale-[0.97]">
            Access Dashboard
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-display italic text-[#E8E6E1]/40">Ona</span>
          <span className="text-xs text-[#E8E6E1]/20">2026 Ona Analytics. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}`;

fs.writeFileSync(path.join(__dirname, 'app', 'globals.css'), globalsCss);
console.log('globals.css written');

fs.writeFileSync(path.join(__dirname, 'app', 'page.tsx'), landingPage);
console.log('landing page written');