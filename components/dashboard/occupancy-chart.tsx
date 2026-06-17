"use client"

import React, { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
} from "recharts"
import { Loader2 } from "lucide-react"

interface DataPoint {
  date: string
  occupancy: number | null
  predicted: number | null
  isPredicted?: boolean
}

export function OccupancyChart() {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/demand?days=30")
        if (!res.ok) throw new Error("Failed to fetch")
        const json = await res.json()
        const rows = json.data

        const chartData: DataPoint[] = rows.map((r: any, i: number) => {
          const date = new Date(r.log_date)
          const label = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
          return {
            date: i === rows.length - 1 ? `${label} (Today)` : label,
            occupancy: r.actual_value != null ? Number(r.actual_value) : null,
            predicted: r.predicted_value != null ? Number(r.predicted_value) : null,
            isPredicted: r.actual_value == null,
          }
        })

        if (chartData.length === 0) {
          setData([
            { date: "Jun 3", occupancy: 42, predicted: null },
            { date: "Jun 4", occupancy: 40, predicted: null },
            { date: "Jun 5", occupancy: 39, predicted: null },
            { date: "Jun 6", occupancy: 41, predicted: null },
            { date: "Jun 7", occupancy: 43, predicted: null },
            { date: "Jun 8", occupancy: 38, predicted: null },
            { date: "Jun 9", occupancy: 40, predicted: null },
            { date: "Jun 10", occupancy: 41, predicted: null },
            { date: "Jun 11", occupancy: 42, predicted: null },
            { date: "Jun 12", occupancy: 39, predicted: null },
            { date: "Jun 13", occupancy: 41, predicted: null },
            { date: "Jun 14", occupancy: 40, predicted: null },
            { date: "Jun 15", occupancy: 41, predicted: null },
            { date: "Jun 16", occupancy: 41, predicted: null },
            { date: "Jun 17 (Today)", occupancy: 41, predicted: null },
            { date: "Jun 18 (Thu)", occupancy: null, predicted: 48, isPredicted: true },
            { date: "Jun 19 (Fri)", occupancy: null, predicted: 75, isPredicted: true },
            { date: "Jun 20 (Sat)", occupancy: null, predicted: 95, isPredicted: true },
            { date: "Jun 21 (Sun)", occupancy: null, predicted: 93, isPredicted: true },
            { date: "Jun 22 (Mon)", occupancy: null, predicted: 65, isPredicted: true },
          ])
        } else {
          setData(chartData)
        }
      } catch (err) {
        console.error("Chart fetch error:", err)
        setData([
          { date: "Jun 3", occupancy: 42, predicted: null },
          { date: "Jun 4", occupancy: 40, predicted: null },
          { date: "Jun 5", occupancy: 39, predicted: null },
          { date: "Jun 6", occupancy: 41, predicted: null },
          { date: "Jun 7", occupancy: 43, predicted: null },
          { date: "Jun 8", occupancy: 38, predicted: null },
          { date: "Jun 9", occupancy: 40, predicted: null },
          { date: "Jun 10", occupancy: 41, predicted: null },
          { date: "Jun 11", occupancy: 42, predicted: null },
          { date: "Jun 12", occupancy: 39, predicted: null },
          { date: "Jun 13", occupancy: 41, predicted: null },
          { date: "Jun 14", occupancy: 40, predicted: null },
          { date: "Jun 15", occupancy: 41, predicted: null },
          { date: "Jun 16", occupancy: 41, predicted: null },
          { date: "Jun 17 (Today)", occupancy: 41, predicted: null },
          { date: "Jun 18 (Thu)", occupancy: null, predicted: 48, isPredicted: true },
          { date: "Jun 19 (Fri)", occupancy: null, predicted: 75, isPredicted: true },
          { date: "Jun 20 (Sat)", occupancy: null, predicted: 95, isPredicted: true },
          { date: "Jun 21 (Sun)", occupancy: null, predicted: 93, isPredicted: true },
          { date: "Jun 22 (Mon)", occupancy: null, predicted: 65, isPredicted: true },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
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
              stopColor="hsl(270, 100%, 55%)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="hsl(270, 100%, 55%)"
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient
            id="colorPredicted"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="5%"
              stopColor="hsl(0, 84.2%, 60.2%)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="hsl(0, 84.2%, 60.2%)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-border"
        />
        <XAxis
          dataKey="date"
          className="text-xs text-muted-foreground"
          interval={Math.floor(data.length / 5)}
        />
        <YAxis
          domain={[0, 100]}
          label={{
            value: "Occupancy %",
            angle: -90,
            position: "insideLeft",
          }}
          className="text-xs text-muted-foreground"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          formatter={(value: any) => [`${value}%`, "Occupancy"]}
        />
        <Legend />

        <Area
          type="monotone"
          dataKey="occupancy"
          stroke="hsl(270, 100%, 55%)"
          strokeWidth={2}
          fill="url(#colorOccupancy)"
          isAnimationActive={false}
          connectNulls={false}
          name="Historical"
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />

        <Line
          type="monotone"
          dataKey="predicted"
          stroke="hsl(0, 84.2%, 60.2%)"
          strokeWidth={2}
          strokeDasharray="5 5"
          isAnimationActive={false}
          connectNulls={false}
          name="Predicted"
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
