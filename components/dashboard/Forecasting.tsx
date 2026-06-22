"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sparkles } from "lucide-react"
import { Card } from "./Card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

export function Forecasting({ demandData, loading }: { demandData: any[]; loading: boolean }) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const peakVal = demandData.length > 0 ? Math.round(Math.max(...demandData.map(d => d.predicted_value ?? 0))) : null

  const chartData = demandData.slice(-14).map((d: any) => {
    const dateObj = new Date(d.log_date)
    return {
      date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      forecast: d.predicted_value !== null ? Math.round(parseFloat(d.predicted_value)) : 0,
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-base font-semibold text-foreground mb-4">14-Day Forecast</h3>
        {loading ? (
          <div className="h-64 bg-foreground/5 rounded animate-pulse" />
        ) : demandData.length > 0 && mounted ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar
                  dataKey="forecast"
                  name="Forecasted Occupancy"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-foreground/20 text-sm">No forecast data available</div>
        )}
      </Card>
      <Card>
        <h3 className="text-base font-semibold text-foreground mb-4">AI-Generated Insights</h3>
        <div className="space-y-3">
          {peakVal !== null && peakVal > 0 ? (
            <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Spike Detected</p>
                <p className="text-xs text-foreground/40">
                  Peak demand forecast at {peakVal}% in the next 14 days.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
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
