"use client"

import React, { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { MainContent } from "./main-content"
import { OnaAgent } from "./ona-agent"

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [agentOpen, setAgentOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <MainContent />
        </main>
      </div>

      {/* Floating Action Button & Agent */}
      <OnaAgent open={agentOpen} onOpenChange={setAgentOpen} />
    </div>
  )
}
