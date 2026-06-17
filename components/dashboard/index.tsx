"use client"

import React, { useState } from "react"

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [agentOpen, setAgentOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="flex-1">
        <h1 className="text-3xl font-bold p-8">Ona Analytics Dashboard</h1>
        <p className="p-8 text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  )
}
