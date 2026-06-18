"use client"

import { TrendingUp, Truck, RefreshCw } from "lucide-react"
import { Card } from "./Card"

export function Overview({ demandData, procurementData, loading, occupancy, peak, change, onRefresh }: {
  demandData: any[]; procurementData: any[]; loading: boolean;
  occupancy: number | null; peak: number | null; change: number | null;
  onRefresh: () => void;
}) {
  const urgentCount = procurementData.filter((p: any) => p.urgency === "High" || p.urgency === "high").length

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/40">Current Occupancy</span>
            <TrendingUp className="w-4 h-4 text-[#E67E22]" />
          </div>
          {loading ? (
            <div className="h-10 w-16 bg-white/5 rounded animate-pulse" />
          ) : occupancy !== null ? (
            <>
              <div className="text-3xl font-bold mb-1">{occupancy}%</div>
              {change !== null && (
                <p className="text-xs text-white/30">{change > 0 ? `+${change}% vs last week` : `${change}% vs last week`}</p>
              )}
            </>
          ) : (
            <div className="text-sm text-white/20">No data</div>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/40">Peak Forecast (14d)</span>
            <TrendingUp className="w-4 h-4 text-red-400" />
          </div>
          {loading ? (
            <div className="h-10 w-16 bg-white/5 rounded animate-pulse" />
          ) : peak !== null ? (
            <>
              <div className={`text-3xl font-bold mb-1 ${peak > 85 ? 'text-red-400' : 'text-[#E67E22]'}`}>{peak}%</div>
              <p className="text-xs text-white/30">{peak > 85 ? 'High demand alert' : 'Normal range'}</p>
            </>
          ) : (
            <div className="text-sm text-white/20">No forecast data</div>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/40">Urgent Procurement</span>
            <Truck className="w-4 h-4 text-[#E67E22]" />
          </div>
          {loading ? (
            <div className="h-10 w-16 bg-white/5 rounded animate-pulse" />
          ) : (
            <>
              <div className={`text-3xl font-bold mb-1 ${urgentCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{urgentCount > 0 ? urgentCount : 0}</div>
              <p className="text-xs text-white/30">{urgentCount > 0 ? 'Requires immediate action' : 'All items fulfilled'}</p>
            </>
          )}
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display italic">14-Day Demand Forecast</h3>
              <button onClick={onRefresh} className="text-xs text-white/30 hover:text-white p-1">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            {loading ? (
              <div className="h-64 bg-white/5 rounded animate-pulse" />
            ) : (
              <div className="h-64 flex items-end gap-2">
                {demandData.length > 0 ? demandData.slice(-14).map((d: any, i: number) => {
                  const val = d.actual_value || d.predicted_value || 0
                  return (
                    <div key={i} className="flex-1 relative group cursor-pointer">
                      <div
                        className="bg-gradient-to-t from-[#E67E22]/30 to-[#E67E22]/10 rounded-t-sm transition-all duration-200 hover:from-[#E67E22]/50 hover:to-[#E67E22]/20"
                        style={{ height: val + "%" }}
                      />
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
                        {Math.round(val)}%
                      </div>
                    </div>
                  )
                }) : (
                  <div className="flex items-center justify-center w-full h-full text-white/20 text-sm">No demand data available</div>
                )}
              </div>
            )}
          </Card>
        </div>
        <div>
          <Card>
            <h3 className="text-lg font-display italic mb-6">Action Items</h3>
            {loading ? (
              <div className="space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />)}
              </div>
            ) : procurementData.length > 0 ? (
              <div className="space-y-4">
                {procurementData.slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between py-3 border-b border-white/5 last:border-0">
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
              <div className="text-sm text-white/20 text-center py-8">No action items</div>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
