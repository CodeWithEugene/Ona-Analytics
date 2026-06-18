"use client"

import { useEffect } from "react"

export function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-2 ${
      type === "success" ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30" : "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
    }`}>
      {message}
    </div>
  )
}
