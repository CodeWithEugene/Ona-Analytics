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
import { Plus, Loader2, X } from "lucide-react"

export function Demand({
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
  const [showEntry, setShowEntry] = useState(false)
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0])
  const [entryValue, setEntryValue] = useState("")
  const [entryMetric, setEntryMetric] = useState("occupancy_rate")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const last =
    demandData.length > 0 ? demandData[demandData.length - 1] : null
  const today = last
    ? Math.round(last.actual_value ?? last.predicted_value ?? 0)
    : null
  const threeDaysAgo =
    demandData.length > 3
      ? Math.round(
          demandData[demandData.length - 3]?.actual_value ??
            demandData[demandData.length - 3]?.predicted_value ??
            0
        )
      : null
  const sevenDaysAgo =
    demandData.length > 7
      ? Math.round(
          demandData[demandData.length - 7]?.actual_value ??
            demandData[demandData.length - 7]?.predicted_value ??
            0
        )
      : null

  const chartData = demandData.slice(-14).map((d: any) => {
    const dateObj = new Date(d.log_date)
    return {
      date: dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      occupancy:
        d.actual_value !== null
          ? Math.round(parseFloat(d.actual_value))
          : Math.round(parseFloat(d.predicted_value || "0")),
    }
  })

  async function handleSubmitEntry(e: React.FormEvent) {
    e.preventDefault()
    if (!entryDate || !entryValue) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/demand/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          log_date: entryDate,
          metric_type: entryMetric,
          actual_value: parseFloat(entryValue),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to add entry")
      if (showToast) showToast(`Added ${entryValue}% for ${entryDate}`)
      setShowEntry(false)
      setEntryValue("")
      onRefresh()
    } catch (err: any) {
      if (showToast) showToast(err.message || "Failed to add entry", "error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Demand Radar</h3>
          <button
            onClick={() => setShowEntry(!showEntry)}
            className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold ring-1 ring-primary/20 hover:bg-primary/20 transition-all"
          >
            {showEntry ? (
              <>
                <X className="w-3 h-3" /> Close
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" /> Add Data
              </>
            )}
          </button>
        </div>

        {showEntry && (
          <form
            onSubmit={handleSubmitEntry}
            className="mb-6 p-4 bg-foreground/5 rounded-xl border border-border"
          >
            <p className="text-xs font-medium text-foreground/60 mb-3">
              Manually add an occupancy data point
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-foreground/40 mb-1 font-mono uppercase tracking-wider">
                  Date
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-foreground/40 mb-1 font-mono uppercase tracking-wider">
                  Occupancy %
                </label>
                <input
                  type="number"
                  value={entryValue}
                  onChange={(e) => setEntryValue(e.target.value)}
                  required
                  min={0}
                  max={100}
                  placeholder="e.g. 42"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-foreground/20"
                />
              </div>
              <div>
                <label className="block text-[10px] text-foreground/40 mb-1 font-mono uppercase tracking-wider">
                  Metric
                </label>
                <select
                  value={entryMetric}
                  onChange={(e) => setEntryMetric(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="occupancy_rate">Occupancy Rate</option>
                  <option value="arrivals">Arrivals</option>
                  <option value="departures">Departures</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || !entryValue}
              className="mt-3 flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-2 rounded-lg text-xs font-semibold ring-1 ring-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
              Add Entry
            </button>
          </form>
        )}

        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-foreground/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-foreground/5 rounded-xl p-4">
              <div className="text-sm text-foreground/40 mb-1">Today</div>
              <div className="text-2xl font-bold">
                {today !== null ? `${today}%` : "\u2014"}
              </div>
            </div>
            <div className="bg-foreground/5 rounded-xl p-4">
              <div className="text-sm text-foreground/40 mb-1">3 Days Ago</div>
              <div className="text-2xl font-bold text-primary">
                {threeDaysAgo !== null ? `${threeDaysAgo}%` : "\u2014"}
              </div>
            </div>
            <div className="bg-foreground/5 rounded-xl p-4">
              <div className="text-sm text-foreground/40 mb-1">7 Days Ago</div>
              <div className={`text-2xl font-bold ${sevenDaysAgo !== null && sevenDaysAgo > 85 ? "text-destructive" : "text-primary"}`}>
                {sevenDaysAgo !== null ? `${sevenDaysAgo}%` : "\u2014"}
              </div>
            </div>
          </div>
        )}
      </Card>
      <Card>
        <h3 className="text-base font-semibold text-foreground mb-4">
          Booking Velocity
        </h3>
        {loading ? (
          <div className="h-32 bg-foreground/5 rounded animate-pulse" />
        ) : demandData.length > 0 && mounted ? (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorOccupancy"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
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
          <div className="flex items-center justify-center h-32 text-foreground/20 text-sm">
            No data available. Click &ldquo;Add Data&rdquo; to enter occupancy readings.
          </div>
        )}
      </Card>
    </div>
  )
}
