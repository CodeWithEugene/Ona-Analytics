"use client"

import { useEffect } from "react"

export function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-2 flex items-center gap-3 ${
      type === "success" ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30" : "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
    }`}>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="p-0.5 hover:opacity-70 transition-opacity text-current">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="2" y1="2" x2="12" y2="12" />
          <line x1="12" y1="2" x2="2" y2="12" />
        </svg>
      </button>
    </div>
  )
}
