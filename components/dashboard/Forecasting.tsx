"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sparkles, Loader2, RefreshCw, TrendingUp, BarChart3 } from "lucide-react"
import { Card } from "./Card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts"

export function Forecasting({
  demandData,
  loading,
  onRefresh,
  showToast,
}: {
  demandData: any[]
  loading: boolean
  onRefresh: () => void
  showToast?: (message: string, type?: "success" | "error") => void
}) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [method, setMethod] = useState<"exponential" | "moving_average">("exponential")
  const [forecastResult, setForecastResult] = useState<{
    message: string
    summary?: { min: number; max: number; avg: number }
  } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const peakVal =
    demandData.length > 0
      ? Math.round(Math.max(...demandData.map((d) => d.predicted_value ?? 0)))
      : null

  const chartData = demandData.slice(-14).map((d: any) => {
    const dateObj = new Date(d.log_date)
    return {
      date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      forecast:
        d.predicted_value !== null
          ? Math.round(parseFloat(d.predicted_value))
          : null,
      actual:
        d.actual_value !== null
          ? Math.round(parseFloat(d.actual_value))
          : null,
    }
  })

  async function handleGenerateForecast() {
    setGenerating(true)
    setForecastResult(null)
    try {
      const res = await fetch("/api/forecast/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 7, method }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to generate forecast")
      setForecastResult(json)
      if (showToast) showToast(json.message || "Forecast generated")
      // Refresh dashboard data to show new predictions
      onRefresh()
    } catch (err: any) {
      if (showToast) showToast(err.message || "Failed to generate forecast", "error")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">14-Day Forecast</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-0.5">
              <button
                onClick={() => setMethod("exponential")}
                className={`px-2.5 py-1 text-[10px] font-mono rounded-md transition-all ${
                  method === "exponential"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/40 hover:text-foreground"
                }`}
              >
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Smoothing
              </button>
              <button
                onClick={() => setMethod("moving_average")}
                className={`px-2.5 py-1 text-[10px] font-mono rounded-md transition-all ${
                  method === "moving_average"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/40 hover:text-foreground"
                }`}
              >
                <BarChart3 className="w-3 h-3 inline mr-1" />
                Moving Avg
              </button>
            </div>
            <button
              onClick={handleGenerateForecast}
              disabled={generating || loading}
              className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold ring-1 ring-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              Generate
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-64 bg-foreground/5 rounded animate-pulse" />
        ) : demandData.length > 0 && mounted ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(128,128,128,0.15)"
                  vertical={false}
                />
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
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Bar
                  dataKey="forecast"
                  name="Forecast"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={35}
                  opacity={0.7}
                />
                <Bar
                  dataKey="actual"
                  name="Actual"
                  fill="hsl(var(--muted-foreground))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={35}
                  opacity={0.4}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-foreground/20 text-sm">
            No forecast data available. Click &ldquo;Generate&rdquo; to create predictions from historical data.
          </div>
        )}

        {forecastResult?.summary && (
          <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="bg-foreground/5 rounded-lg p-3 text-center">
              <span className="text-[10px] text-foreground/40 block mb-1 font-mono uppercase tracking-wider">
                Peak
              </span>
              <span className="text-lg font-bold text-destructive">
                {forecastResult.summary.max}%
              </span>
            </div>
            <div className="bg-foreground/5 rounded-lg p-3 text-center">
              <span className="text-[10px] text-foreground/40 block mb-1 font-mono uppercase tracking-wider">
                Average
              </span>
              <span className="text-lg font-bold text-foreground">
                {forecastResult.summary.avg}%
              </span>
            </div>
            <div className="bg-foreground/5 rounded-lg p-3 text-center">
              <span className="text-[10px] text-foreground/40 block mb-1 font-mono uppercase tracking-wider">
                Minimum
              </span>
              <span className="text-lg font-bold text-emerald-500">
                {forecastResult.summary.min}%
              </span>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-foreground mb-4">
          AI-Generated Insights
        </h3>
        <div className="space-y-3">
          {peakVal !== null && peakVal > 0 ? (
            <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {peakVal > 80 ? "⚠️ High Demand Spike Detected" : "Forecast Available"}
                </p>
                <p className="text-xs text-foreground/40">
                  {peakVal > 80
                    ? `Peak demand forecast at ${peakVal}% in the next 14 days. Consider generating procurement recommendations.`
                    : `Peak demand forecast at ${peakVal}% in the next 14 days. Normal operating range.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Insufficient Data</p>
                <p className="text-xs text-foreground/40">
                  Collect more demand data to generate AI insights. Click &ldquo;Generate&rdquo; above to create
                  predictions from historical occupancy data.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
