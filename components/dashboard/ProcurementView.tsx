"use client"

import { useState } from "react"
import { Loader2, CheckCircle } from "lucide-react"
import { Card } from "./Card"

export function ProcurementView({ procurementData, loading, onGenerate, onFulfill }: {
  procurementData: any[]; loading: boolean;
  onGenerate: () => void; onFulfill: (id: string) => void;
}) {
  const [fulfilling, setFulfilling] = useState<string | null>(null)

  async function handleFulfill(id: string) {
    setFulfilling(id)
    await onFulfill(id)
    setFulfilling(null)
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display italic">Procurement List</h3>
        <button
          onClick={onGenerate}
          className="text-xs bg-[#E67E22]/10 text-[#E67E22] px-3 py-1.5 rounded-full ring-1 ring-[#E67E22]/20 hover:bg-[#E67E22]/20 transition-all"
        >
          Generate from Forecast
        </button>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />)}
        </div>
      ) : procurementData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40">
                <th className="text-left py-3 px-4">Item</th>
                <th className="text-left py-3 px-4">Required</th>
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Fulfill</th>
              </tr>
            </thead>
            <tbody>
              {procurementData.map((item: any) => (
                <tr key={item.id} className="border-b border-white/5 last:border-0">
                  <td className="py-3 px-4">{item.item}</td>
                  <td className="py-3 px-4 text-white/50">{item.requiredAmount}</td>
                  <td className="py-3 px-4 text-white/50">{item.action}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.urgency === "High" || item.urgency === "high" ? "bg-red-400/10 text-red-400" :
                      item.urgency === "Medium" || item.urgency === "medium" ? "bg-[#E67E22]/10 text-[#E67E22]" :
                      "bg-emerald-400/10 text-emerald-400"
                    }`}>{item.urgency}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleFulfill(item.id)}
                      disabled={fulfilling === item.id}
                      className="text-xs bg-emerald-400/10 text-emerald-400 px-2.5 py-1 rounded-full ring-1 ring-emerald-400/20 hover:bg-emerald-400/20 transition-all disabled:opacity-50"
                    >
                      {fulfilling === item.id ? <Loader2 className="w-3 h-3 animate-spin inline" /> : <CheckCircle className="w-3 h-3 inline" />}
                      <span className="ml-1">Mark done</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-white/20 text-center py-12">
          <p>No pending procurement items</p>
          <p className="text-xs mt-2">Use the Ona Agent or Generate from Forecast to create procurement recommendations.</p>
        </div>
      )}
    </Card>
  )
}
