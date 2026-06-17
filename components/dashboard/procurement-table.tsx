"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Loader2, RefreshCw } from "lucide-react"

interface ProcurementItem {
  id: number
  item: string
  requiredAmount: string
  urgency: "High" | "Medium" | "Low"
  action: string
}

export function ProcurementTable() {
  const [items, setItems] = useState<ProcurementItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchItems() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/procurement")
      if (!res.ok) throw new Error("Failed to fetch")
      const json = await res.json()
      if (json.data && json.data.length > 0) {
        setItems(json.data)
      } else {
        setItems([
          {
            id: 1,
            item: "Fresh Produce",
            requiredAmount: "+40kg",
            urgency: "High",
            action: "Dispatch Truck",
          },
          {
            id: 2,
            item: "Gas Cylinders",
            requiredAmount: "+10 units",
            urgency: "High",
            action: "Dispatch Truck",
          },
          {
            id: 3,
            item: "Linens & Bedding",
            requiredAmount: "+25 sets",
            urgency: "Medium",
            action: "Dispatch Truck",
          },
        ])
      }
    } catch (err) {
      console.error("Procurement fetch error:", err)
      setItems([
        {
          id: 1,
          item: "Fresh Produce",
          requiredAmount: "+40kg",
          urgency: "High",
          action: "Dispatch Truck",
        },
        {
          id: 2,
          item: "Gas Cylinders",
          requiredAmount: "+10 units",
          urgency: "High",
          action: "Dispatch Truck",
        },
        {
          id: 3,
          item: "Linens & Bedding",
          requiredAmount: "+25 sets",
          urgency: "Medium",
          action: "Dispatch Truck",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                Item
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                Required Amount
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                Urgency
              </th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">{item.item}</td>
                <td className="py-3 px-4">
                  {item.requiredAmount}
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      item.urgency === "High"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {item.urgency}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <Button size="sm" variant="default">
                    <Truck className="h-4 w-4 mr-2" />
                    {item.action}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchItems}
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
    </div>
  )
}
