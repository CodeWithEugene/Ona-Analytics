"use client"

import { Card } from "./Card"

export function Demand({ demandData, loading }: { demandData: any[]; loading: boolean }) {
  const last = demandData.length > 0 ? demandData[demandData.length - 1] : null
  const today = last ? Math.round(last.actual_value ?? last.predicted_value ?? 0) : null
  const threeDaysAgo = demandData.length > 3 ? Math.round(demandData[demandData.length - 3]?.actual_value ?? demandData[demandData.length - 3]?.predicted_value ?? 0) : null
  const sevenDaysAgo = demandData.length > 7 ? Math.round(demandData[demandData.length - 7]?.actual_value ?? demandData[demandData.length - 7]?.predicted_value ?? 0) : null

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-base font-semibold text-foreground mb-4">Demand Radar</h3>
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-foreground/5 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-foreground/5 rounded-xl p-4">
              <div className="text-sm text-foreground/40 mb-1">Today</div>
              <div className="text-2xl font-bold">{today !== null ? `${today}%` : '—'}</div>
            </div>
            <div className="bg-foreground/5 rounded-xl p-4">
              <div className="text-sm text-foreground/40 mb-1">3 Days Ago</div>
              <div className="text-2xl font-bold text-[#E67E22]">{threeDaysAgo !== null ? `${threeDaysAgo}%` : '—'}</div>
            </div>
            <div className="bg-foreground/5 rounded-xl p-4">
              <div className="text-sm text-foreground/40 mb-1">7 Days Ago</div>
              <div className={`text-2xl font-bold ${sevenDaysAgo !== null && sevenDaysAgo > 85 ? 'text-red-400' : 'text-[#E67E22]'}`}>{sevenDaysAgo !== null ? `${sevenDaysAgo}%` : '—'}</div>
            </div>
          </div>
        )}
      </Card>
      <Card>
        <h3 className="text-base font-semibold text-foreground mb-4">Booking Velocity</h3>
        {loading ? (
          <div className="h-32 bg-foreground/5 rounded animate-pulse" />
        ) : (
          <div className="h-32 flex items-end gap-2">
            {demandData.length > 0 ? demandData.slice(-14).map((d: any, i: number) => {
              const val = d.actual_value ?? d.predicted_value ?? 0
              return (
                <div key={i} className="flex-1 bg-[#E67E22]/20 rounded-sm hover:bg-[#E67E22]/40 transition-colors" style={{ height: Math.min(val, 100) + "%" }} />
              )
            }) : (
              <div className="flex items-center justify-center w-full h-full text-foreground/20 text-sm">No data</div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
