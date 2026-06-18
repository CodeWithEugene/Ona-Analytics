"use client"

import React from "react"

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-display italic mb-2">Something went wrong</h2>
            <p className="text-sm text-white/40 mb-6">An unexpected error occurred. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#E67E22]/10 text-[#E67E22] px-5 py-2.5 rounded-full text-sm font-medium ring-1 ring-[#E67E22]/20 hover:bg-[#E67E22]/20 transition-all"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
