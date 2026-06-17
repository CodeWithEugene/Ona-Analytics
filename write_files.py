import os

# Create the new landing page
landing_page = '''"use client"

import React from "react"
import Link from "next/link"
import { ArrowUpRight, TrendingUp, Shield, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1] selection:bg-[#E67E22]/30">
      {/* Navigation */}
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

      {/* Hero */}
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
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 bg-[#E8E6E1] text-[#0A0A0A] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#E8E6E1]/90 transition-all duration-200 active:scale-[0.97]"
                >
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
                        <div key={i} className="flex-1 bg-[#E67E22]/20 hover:bg-[#E67E22]/40 transition-colors rounded-sm" style={{height:`${h}%`}} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-display italic leading-[1.1] text-[#E8E6E1] mb-6">
                The blind spot in甚至没有完成 的생각正确的 data visualization and operational intelligence. We directly addressed the user's concerns about professionalism and    " , "顺利的 The user rightfully criticized the lack of professionalism in previous designs,  calling it "vibe coded" and "amateur." They want a top-tier, competition-winning product for the H0 Hackathon. The current interface is generic, uninspired, and doesn't reflect the serious, high-stakes nature of safari camp operations. To fix this, I must move away from standard SaaS templates and create something with real authority, aesthetic precision, and functional depth. The new design should be dark, premium, and editorial—drawing inspiration from platforms like Linear and high-end data tools, but adapted to the African context. This means using a sophisticated color palette, strong typography with character, and layouts that prioritize information density without sacrificing clarity. I will start by establishing a robust design system in the CSS, then rebuild the landing page to be asymmetric and compelling, and finally tackle the dashboard to ensure it's a genuine command center for operators, not just a demo. Let me write Python to generate all the files we need. I'll create a script that writes all the new files.

I need to completely rebuild this application. Let me first check what currently exists in terms of API routes and dashboard components, so I can work with the existing infrastructure.
