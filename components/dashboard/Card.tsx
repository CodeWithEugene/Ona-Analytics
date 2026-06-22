"use client"

import React from "react"

export function Card({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <div 
      id={id}
      className={`bg-card text-card-foreground border border-border rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 ${className || ''}`}
    >
      {children}
    </div>
  )
}

