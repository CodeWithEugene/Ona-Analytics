"use client"

import { Sparkles } from "lucide-react"
import { Card } from "./Card"

export function Forecasting({ demandData, loading }: { demandData: any[]; loading: boolean }) {
  const peakVal = demandData.length > 0 ? Math.round(Math.max(...demandData.map(d => d.predicted_value ?? 0))) : null

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-display italic mb-4">14-Day Forecast</h3>
        {loading ? (
          <div className="h-64 bg-foreground/5 rounded animate-pulse" />
        ) : (
          <div className="h-64 flex items-end gap-2">
            {demandData.length > 0 ? demandData.slice(-14).map((d: any, i: number) => {
              const val = d.predicted_value ?? d.actual_value ?? 0
              return (
                <div key={i} className="flex-1 relative group cursor-pointer">
                  <div
                    className="bg-gradient-to-t from-[#E67E22]/40 to-[#E67E22]/10 rounded-t-sm transition-all duration-200 hover:from-[#E67E22]/60 hover:to-[#E67E22]/20"
                    style={{ height: Math.min(val, 100) + "%" }}
                  />
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground/10 text-foreground text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                    {Math.round(val)}%
                  </div>
                </div>
              )
            }) : (
              <div className="flex items-center justify-center w-full h-full text-foreground/20 text-sm">No forecast data</div>
            )}
          </div>
        )}
      </Card>
      <Card>
        <h3 className="text-lg font-display italic mb-4">AI-Generated Insights</h3>
        <div className="space-y-3">
          {peakVal !== null && peakVal > 0 ? (
            <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#E67E22] mt-0.5" />
              <div>
                <p className="text-sm font-medium">Spike Detected</p>
                <p className="text-xs text-foreground/40">
                  Peak demand forecast at {peakVal}% in the next 14 days.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#E67E22] mt-0.5" />
              <div>
                <p className="text-sm font-medium">Insufficient Data</p>
                <p className="text-xs text-foreground/40">Collect more demand data to generate AI insights.</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
