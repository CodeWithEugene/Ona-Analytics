"use client"

import React, { useEffect, useState } from "react"
import {
  TrendingDown,
  AlertTriangle,
  TrendingUp,
  Loader2,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OccupancyChart } from "./occupancy-chart"
import { ProcurementTable } from "./procurement-table"

interface KPIData {
  currentOccupancy: number
  weekendForecast: number
  supplyChainRisk: string
  supplyChainNote: string
}

export function MainContent() {
  const [kpi, setKpi] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchKPI() {
      try {
        const res = await fetch("/api/demand?days=30")
        if (!res.ok) throw new Error("Failed to fetch")
        const json = await res.json()
        const rows = json.data

        const today = new Date().toISOString().split("T")[0]
        const todayRow = rows
          .filter((r: any) => r.log_date?.startsWith(today))
          .filter((r: any) => r.actual_value != null)
        const currentOccupancy =
          todayRow.length > 0
            ? Number(todayRow[0].actual_value)
            : 41

        const futureRows = rows.filter(
          (r: any) => r.predicted_value != null
        )
        const weekendForecast =
          futureRows.length > 0
            ? Math.max(
                ...futureRows.map((r: any) => Number(r.predicted_value))
              )
            : 95

        setKpi({
          currentOccupancy,
          weekendForecast,
          supplyChainRisk:
            weekendForecast > 80 ? "Critical" : weekendForecast > 60 ? "Elevated" : "Normal",
          supplyChainNote:
            weekendForecast > 80
              ? "Truck dispatch in 24 hours"
              : "Standard logistics schedule",
        })
      } catch (err) {
        console.error("KPI fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to load")
      } finally {
        setLoading(false)
      }
    }
    fetchKPI()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const supplyChainRisk = kpi?.supplyChainRisk ?? "Critical"
  const isCritical = supplyChainRisk === "Critical"

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Demand Radar
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time supply chain monitoring and forecasting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Current Occupancy
              <TrendingDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {kpi?.currentOccupancy ?? 41}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Steady occupancy trend
            </p>
          </CardContent>
        </Card>

        <Card
          className={
            isCritical
              ? "border-rose-200 dark:border-rose-900/50"
              : ""
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Weekend Forecast
              <AlertTriangle
                className={`h-4 w-4 ${
                  isCritical
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                isCritical
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {kpi?.weekendForecast ?? 95}%
            </div>
            {isCritical && (
              <Badge variant="destructive" className="mt-2">
                High Alert
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card
          className={
            isCritical
              ? "border-rose-200 dark:border-rose-900/50"
              : ""
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Supply Chain Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                isCritical
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {supplyChainRisk}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpi?.supplyChainNote}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Occupancy Trend (14 Days + Forecast)
          </CardTitle>
          <CardDescription>
            Historical data with projected weekend spike
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OccupancyChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Procurement Action List</CardTitle>
          <CardDescription>
            Items required for weekend surge and forecasted demand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProcurementTable />
        </CardContent>
      </Card>
    </div>
  )
}
