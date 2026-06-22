"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card } from "./Card"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

export function Demand({ demandData, loading }: { demandData: any[]; loading: boolean }) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const last = demandData.length > 0 ? demandData[demandData.length - 1] : null
  const today = last ? Math.round(last.actual_value ?? last.predicted_value ?? 0) : null
  const threeDaysAgo = demandData.length > 3 ? Math.round(demandData[demandData.length - 3]?.actual_value ?? demandData[demandData.length - 3]?.predicted_value ?? 0) : null
  const sevenDaysAgo = demandData.length > 7 ? Math.round(demandData[demandData.length - 7]?.actual_value ?? demandData[demandData.length - 7]?.predicted_value ?? 0) : null

  const chartData = demandData.slice(-14).map((d: any) => {
    const dateObj = new Date(d.log_date)
    return {
      date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      occupancy: d.actual_value !== null ? Math.round(parseFloat(d.actual_value)) : Math.round(parseFloat(d.predicted_value || "0")),
    }
  })

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
              <div className="text-2xl font-bold text-primary">{threeDaysAgo !== null ? `${threeDaysAgo}%` : '—'}</div>
            </div>
            <div className="bg-foreground/5 rounded-xl p-4">
              <div className="text-sm text-foreground/40 mb-1">7 Days Ago</div>
              <div className={`text-2xl font-bold ${sevenDaysAgo !== null && sevenDaysAgo > 85 ? 'text-destructive' : 'text-primary'}`}>{sevenDaysAgo !== null ? `${sevenDaysAgo}%` : '—'}</div>
            </div>
          </div>
        )}
      </Card>
      <Card>
        <h3 className="text-base font-semibold text-foreground mb-4">Booking Velocity</h3>
        {loading ? (
          <div className="h-32 bg-foreground/5 rounded animate-pulse" />
        ) : demandData.length > 0 && mounted ? (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="rgba(128,128,128,0.5)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(128,128,128,0.5)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#0A0A0A" : "#FFFFFF",
                    borderColor: "rgba(128,128,128,0.2)",
                    borderRadius: "0.75rem",
                    color: "var(--foreground)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="occupancy"
                  name="Occupancy"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOccupancy)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-foreground/20 text-sm">No data available</div>
        )}
      </Card>
    </div>
  )
}
