"use client"

import React from "react"
import { LayoutDashboard, Truck, Calendar, Settings, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface SidebarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#" },
  { icon: Truck, label: "Supply Chain", href: "#" },
  { icon: Calendar, label: "Forecasting", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
]

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Ona Analytics Logo"
            className="h-8 w-auto dark:brightness-0 dark:invert transition-all duration-200"
          />
          <span className="font-semibold text-lg hidden sm:inline">Ona</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-3 text-base"
              asChild
            >
              <a href={item.href}>
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </Button>
          )
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground">
        <p>Ona Analytics v0.1.0</p>
        <p>AI-Native Demand Radar</p>
      </div>
    </div>
  )

  // Desktop sidebar
  const desktopSidebar = (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-background">
      {sidebarContent}
    </aside>
  )

  // Mobile sheet
  const mobileSidebar = (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        {sidebarContent}
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  )
}
