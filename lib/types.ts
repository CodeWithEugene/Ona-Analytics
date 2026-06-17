export interface DemandLog {
  id: string
  org_id: string
  log_date: string
  metric_type: string
  actual_value: number
  predicted_value: number | null
}

export interface ContextKnowledge {
  id: string
  org_id: string
  content: string
  embedding: number[]
}

export interface ProcurementItem {
  id: string
  org_id: string
  item_name: string
  required_amount: string
  unit: string
  urgency: "high" | "medium" | "low"
  reason: string
  created_at: string
}

export interface OrgProfile {
  id: string
  name: string
  location: string
  timezone: string
}

export interface ChatMessage {
  id: string
  role: "user" | "agent"
  content: string
  timestamp: Date
  tool_calls?: ToolCall[]
}

export interface ToolCall {
  name: string
  arguments: string
  result?: string
}

export interface KPIData {
  currentOccupancy: number
  weekendForecast: number
  supplyChainRisk: "Low" | "Medium" | "Critical"
  supplyChainNote: string
}

export interface ChartDataPoint {
  date: string
  occupancy: number | null
  predicted: number | null
  isPredicted?: boolean
}

export interface AgentRequest {
  message: string
  orgId: string
  conversationId?: string
}

export interface AgentResponse {
  message: string
  toolCalls?: ToolCall[]
}

export interface ProcurementRecommendation {
  id: number
  item: string
  requiredAmount: string
  urgency: "High" | "Medium" | "Low"
  action: string
}
