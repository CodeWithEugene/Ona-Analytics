"use client"

import React from "react"
import { TrendingUp, AlertTriangle, TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OccupancyChart } from "./occupancy-chart"
import { ProcurementTable } from "./procurement-table"

export function MainContent() {
  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Demand Radar</h1>
        <p className="text-muted-foreground mt-2">Real-time supply chain monitoring and forecasting</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Occupancy */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Current Occupancy
              <TrendingDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">41%</div>
            <p className="text-xs text-muted-foreground mt-1">Steady occupancy trend</p>
          </CardContent>
        </Card>

        {/* Weekend Forecast */}
        <Card className="border-rose-200 dark:border-rose-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Weekend Forecast
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">95%</div>
            <Badge variant="destructive" className="mt-2">High Alert</Badge>
          </CardContent>
        </Card>

        {/* Supply Chain Risk */}
        <Card className="border-rose-200 dark:border-rose-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Supply Chain Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">Critical</div>
            <p className="text-xs text-muted-foreground mt-1">Truck dispatch in 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Occupancy Trend (14 Days + Forecast)</CardTitle>
          <CardDescription>Historical data with projected weekend spike</CardDescription>
        </CardHeader>
        <CardContent>
          <OccupancyChart />
        </CardContent>
      </Card>

      {/* Procurement Table */}
      <Card>
        <CardHeader>
          <CardTitle>Procurement Action List</CardTitle>
          <CardDescription>Items required for weekend surge and forecasted demand</CardDescription>
        </CardHeader>
        <CardContent>
          <ProcurementTable />
        </CardContent>
      </Card>
    </div>
  )
}
