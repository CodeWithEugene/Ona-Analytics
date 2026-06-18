"use client"

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/5 ${className || ''}`}>
      <div className="rounded-[calc(2rem-0.375rem)] bg-[#111] p-6">
        {children}
      </div>
    </div>
  )
}
