"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck } from "lucide-react"

const procurementData = [
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
]

export function ProcurementTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Item</th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Required Amount</th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Urgency</th>
            <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Action</th>
          </tr>
        </thead>
        <tbody>
          {procurementData.map((item) => (
            <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-medium">{item.item}</td>
              <td className="py-3 px-4">{item.requiredAmount}</td>
              <td className="py-3 px-4">
                <Badge
                  variant={item.urgency === "High" ? "destructive" : "secondary"}
                  className={item.urgency === "High" ? "" : ""}
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
  )
}
