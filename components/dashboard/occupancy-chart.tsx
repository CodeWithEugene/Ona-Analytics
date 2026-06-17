"use client"

import React from "react"
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
} from "recharts"

const chartData = [
  { date: "Jun 3", occupancy: 42 },
  { date: "Jun 4", occupancy: 40 },
  { date: "Jun 5", occupancy: 39 },
  { date: "Jun 6", occupancy: 41 },
  { date: "Jun 7", occupancy: 43 },
  { date: "Jun 8", occupancy: 38 },
  { date: "Jun 9", occupancy: 40 },
  { date: "Jun 10", occupancy: 41 },
  { date: "Jun 11", occupancy: 42 },
  { date: "Jun 12", occupancy: 39 },
  { date: "Jun 13", occupancy: 41 },
  { date: "Jun 14", occupancy: 40 },
  { date: "Jun 15", occupancy: 41 },
  { date: "Jun 16", occupancy: 41 },
  { date: "Jun 17 (Today)", occupancy: 41, predicted: null },
  { date: "Jun 18 (Thu)", occupancy: null, predicted: 48, isPredicted: true },
  { date: "Jun 19 (Fri)", occupancy: null, predicted: 75, isPredicted: true },
  { date: "Jun 20 (Sat)", occupancy: null, predicted: 95, isPredicted: true },
  { date: "Jun 21 (Sun)", occupancy: null, predicted: 93, isPredicted: true },
  { date: "Jun 22 (Mon)", occupancy: null, predicted: 65, isPredicted: true },
]

export function OccupancyChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(270, 100%, 55%)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(270, 100%, 55%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(0, 84.2%, 60.2%)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(0, 84.2%, 60.2%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          className="text-xs text-muted-foreground"
          interval={Math.floor(chartData.length / 5)}
        />
        <YAxis
          domain={[0, 100]}
          label={{ value: "Occupancy %", angle: -90, position: "insideLeft" }}
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
        
        {/* Historical data - solid line */}
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
        
        {/* Predicted data - dashed line */}
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
