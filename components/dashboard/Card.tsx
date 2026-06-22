"use client"

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[2rem] p-1.5 bg-[#1C1816]/5 ring-1 ring-[#1C1816]/5 dark:bg-white/5 dark:ring-white/5 ${className || ''}`}>
      <div className="rounded-[calc(2rem-0.375rem)] bg-[#F4EDE2] dark:bg-[#0A0A0A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] p-6">
        {children}
      </div>
    </div>
  )
}

