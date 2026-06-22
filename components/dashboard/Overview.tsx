import { useState, useEffect } from "react"
import { TrendingUp, Truck, RefreshCw } from "lucide-react"
import { useTheme } from "next-themes"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Card } from "./Card"

export function Overview({ demandData, procurementData, loading, occupancy, peak, change, onRefresh, activeOnboardingTarget }: {
  demandData: any[]; procurementData: any[]; loading: boolean;
  occupancy: number | null; peak: number | null; change: number | null;
  onRefresh: () => void;
  activeOnboardingTarget?: string;
}) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const urgentCount = procurementData.filter((p: any) => p.urgency === "High" || p.urgency === "high").length

  const chartData = demandData.slice(-20).map((d: any) => {
    const dateObj = new Date(d.log_date)
    return {
      date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      actual: d.actual_value !== null ? Math.round(parseFloat(d.actual_value)) : null,
      forecast: d.predicted_value !== null ? Math.round(parseFloat(d.predicted_value)) : null,
    }
  })

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-foreground/40">Current Occupancy</span>
            <TrendingUp className="w-4 h-4 text-[#E67E22]" />
          </div>
          {loading ? (
            <div className="h-10 w-16 bg-foreground/5 rounded animate-pulse" />
          ) : occupancy !== null ? (
            <>
              <div className="text-3xl font-bold mb-1">{occupancy}%</div>
              {change !== null && (
                <p className="text-xs text-foreground/30">{change > 0 ? `+${change}% vs last week` : `${change}% vs last week`}</p>
              )}
            </>
          ) : (
            <div className="text-sm text-foreground/20">No data</div>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-foreground/40">Peak Forecast (14d)</span>
            <TrendingUp className="w-4 h-4 text-red-400" />
          </div>
          {loading ? (
            <div className="h-10 w-16 bg-foreground/5 rounded animate-pulse" />
          ) : peak !== null ? (
            <>
              <div className={`text-3xl font-bold mb-1 ${peak > 85 ? 'text-red-400' : 'text-[#E67E22]'}`}>{peak}%</div>
              <p className="text-xs text-foreground/30">{peak > 85 ? 'High demand alert' : 'Normal range'}</p>
            </>
          ) : (
            <div className="text-sm text-foreground/20">No forecast data</div>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-foreground/40">Urgent Procurement</span>
            <Truck className="w-4 h-4 text-[#E67E22]" />
          </div>
          {loading ? (
            <div className="h-10 w-16 bg-foreground/5 rounded animate-pulse" />
          ) : (
            <>
              <div className={`text-3xl font-bold mb-1 ${urgentCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{urgentCount > 0 ? urgentCount : 0}</div>
              <p className="text-xs text-foreground/30">{urgentCount > 0 ? 'Requires immediate action' : 'All items fulfilled'}</p>
            </>
          )}
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div id="onboarding-chart" className="md:col-span-2">
          <Card className={`transition-all duration-500 ${
            activeOnboardingTarget === "chart"
              ? "ring-2 ring-primary ring-offset-4 dark:ring-offset-background scale-[1.01] shadow-[0_0_25px_rgba(25,118,210,0.25)] bg-primary/5"
              : ""
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-foreground">14-Day Demand Forecast</h3>
              <button onClick={onRefresh} className="text-xs text-foreground/30 hover:text-foreground p-1">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            {loading ? (
              <div className="h-64 bg-foreground/5 rounded animate-pulse" />
            ) : demandData.length > 0 && mounted ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      backgroundColor: theme === "dark" ? "#0A0A0A" : "#F4EDE2",
                      borderColor: "rgba(128,128,128,0.2)",
                      borderRadius: "1rem",
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
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="#C0392B"
                    strokeWidth={3}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    name="Forecast"
                    stroke="#E67E22"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-foreground/20 text-sm">No demand data available</div>
            )}
          </Card>
        </div>
        <div>
          <Card>
            <h3 className="text-base font-bold text-foreground mb-6">Action Items</h3>
            {loading ? (
              <div className="space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-10 bg-foreground/5 rounded animate-pulse" />)}
              </div>
            ) : procurementData.length > 0 ? (
              <div className="space-y-4">
                {procurementData.slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between py-3 border-b border-foreground/5 last:border-0">
                    <span className="text-sm">{item.item}</span>
                    <span className={`text-xs ${
                      item.urgency === "High" || item.urgency === "high" ? "text-red-400" :
                      item.urgency === "Medium" || item.urgency === "medium" ? "text-[#E67E22]" :
                      "text-emerald-400"
                    }`}>{item.urgency}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-foreground/20 text-center py-8">No action items</div>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
