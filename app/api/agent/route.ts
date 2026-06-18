import { generateText, tool } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"
import { query } from "@/lib/db"
import { NextResponse } from "next/server"
import { requireAuth, unauthorized, getOrgId, getUserId } from "@/lib/api-auth"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"
import { logger } from "@/lib/log"

const agentLimiter = createRateLimiter({ interval: 60000, maxRequests: 10 })

const nvidia = createOpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
})

const SYSTEM_PROMPT = `You are Ona Agent, an autonomous operations analyst for remote safari camps and eco-lodges.

Your role is to help camp managers understand demand forecasts and optimize their supply chain.

## Tools Available

### 1. query_demand_data
Query occupancy demand metrics from the database.
Parameters: metric_type (e.g. 'occupancy_rate'), limit (number of records), days_back (history window).

### 2. search_context_knowledge
Search the camp's Standard Operating Procedures (SOPs) using text similarity search.

### 3. generate_procurement
When a spike is detected, generate procurement recommendations and persist them.

## Behavior Rules
- Always query demand_data first for occupancy/numbers questions
- Use search_context_knowledge for "how to" logistics/weather/SOP questions
- When confirming a spike >50%, proactively generate procurement
- Be concise, direct, like an experienced camp ops manager
- Never hallucinate numbers — always use real data
- After getting tool results, synthesize a final answer`

async function queryDemandData(metricType: string, limit: number, daysBack: number, orgId: string) {
  try {
    const rows = await query<any>(
      `SELECT log_date, actual_value, predicted_value
       FROM demand_logs
       WHERE org_id = $1
         AND metric_type = $2
         AND log_date >= CURRENT_DATE - ($3::int || ' days')::INTERVAL
       ORDER BY log_date DESC
       LIMIT $4`,
      [orgId, metricType, Math.min(daysBack, 365), Math.min(limit, 100)]
    )
    return { success: true, data: rows }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

async function searchContext(searchTerm: string, orgId: string) {
  try {
    const rows = await query<any>(
      `SELECT content,
              ts_rank(to_tsvector('english', content), plainto_tsquery('english', $2)) AS rank
       FROM context_knowledge
       WHERE org_id = $1
         AND to_tsvector('english', content) @@ plainto_tsquery('english', $2)
       ORDER BY rank DESC
       LIMIT 5`,
      [orgId, searchTerm]
    )
    if (rows.length === 0) {
      const fallback = await query<any>(
        `SELECT content FROM context_knowledge WHERE org_id = $1 AND content ILIKE $2 LIMIT 3`,
        [orgId, `%${searchTerm}%`]
      )
      return { success: true, results: fallback.map((r: any) => ({ content: r.content })) }
    }
    return { success: true, results: rows.map((r: any) => ({ content: r.content })) }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

async function generateProcurement(items: any[], orgId: string) {
  try {
    for (const item of items) {
      await query(
        `INSERT INTO procurement_items (org_id, item_name, required_amount, unit, urgency, reason)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orgId, item.item_name, item.required_amount, item.unit, item.urgency, item.reason]
      )
    }
    return { success: true, count: items.length, message: `Generated ${items.length} procurement recommendations` }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

const TOOLS = {
  query_demand_data: tool({
    description: "Query occupancy demand metrics. Returns recent actual and predicted values.",
    inputSchema: z.object({
      metric_type: z.string().default("occupancy_rate").describe("The metric to query (e.g. occupancy_rate)"),
      limit: z.number().default(10).describe("Number of records to return (max 100)"),
      days_back: z.number().default(30).describe("How many days of history to look back (max 365)"),
    }),
  }),
  search_context_knowledge: tool({
    description: "Search camp SOPs and logistics knowledge. Uses full-text search. Returns relevant procedures.",
    inputSchema: z.object({
      search_term: z.string().describe("What logistics info to search for"),
    }),
  }),
  generate_procurement: tool({
    description: "Generate procurement recommendations based on demand spike data. Call when you confirm a significant occupancy increase.",
    inputSchema: z.object({
      items: z.array(
        z.object({
          item_name: z.string(),
          required_amount: z.number(),
          unit: z.string(),
          urgency: z.enum(["high", "medium", "low"]),
          reason: z.string(),
        })
      ),
    }),
  }),
}

function extractInput(tc: any): any {
  return tc.input || tc.args || {}
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return unauthorized()

    const rl = agentLimiter(rateLimitKey(request, `agent:${getUserId(session)}`))
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: rateLimitHeaders(rl, 10) }
      )
    }

    const orgId = getOrgId(session)
    if (!orgId) {
      return NextResponse.json({ error: "Account not associated with an organization" }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const { message } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (message.length > 4000) {
      return NextResponse.json({ error: "Message too long" }, { status: 413 })
    }

    let messages: any[] = [{ role: "user", content: message }]
    let finalText = ""
    let allToolCalls: any[] = []

    for (let step = 0; step < 5; step++) {
      const result = await generateText({
        model: nvidia("nvidia/nemotron-3-ultra-550b-a55b"),
        system: SYSTEM_PROMPT,
        maxRetries: 2,
        messages,
        tools: TOOLS,
      })

      if (result.toolCalls && result.toolCalls.length > 0) {
        for (const tc of result.toolCalls) {
          const tcArgs = extractInput(tc)
          allToolCalls.push({ name: tc.toolName, args: tcArgs })

          let toolResult: any
          if (tc.toolName === "query_demand_data") {
            toolResult = await queryDemandData(
              tcArgs.metric_type || "occupancy_rate",
              tcArgs.limit || 10,
              tcArgs.days_back || 30,
              orgId
            )
          } else if (tc.toolName === "search_context_knowledge") {
            toolResult = await searchContext(tcArgs.search_term, orgId)
          } else if (tc.toolName === "generate_procurement") {
            toolResult = await generateProcurement(tcArgs.items, orgId)
          }

          messages.push({
            role: "assistant",
            content: [{ type: "tool-call", toolCallId: tc.toolCallId, toolName: tc.toolName, input: tcArgs }],
          })
          messages.push({
            role: "tool",
            content: [{ type: "tool-result", toolCallId: tc.toolCallId, toolName: tc.toolName, output: { type: "text" as const, value: JSON.stringify(toolResult) } }],
          })
        }
      } else {
        finalText = result.text
        break
      }
    }

    if (!finalText && allToolCalls.length > 0) {
      try {
        const synthesisResult = await generateText({
          model: nvidia("nvidia/nemotron-3-ultra-550b-a55b"),
          system: SYSTEM_PROMPT,
          maxRetries: 1,
          messages,
        })
        finalText = synthesisResult.text
      } catch {
        finalText = "Analysis complete. Check the dashboard for updated data."
      }
    }

    const response = finalText || "Analysis complete. Check the dashboard for updated data."

    try {
      await query(
        `INSERT INTO agent_conversations (org_id, user_message, agent_response, tool_calls)
         VALUES ($1, $2, $3, $4)`,
        [orgId, message, response, JSON.stringify(allToolCalls)]
      )
    } catch (err) {
      console.error("Failed to log conversation:", err)
    }

    return NextResponse.json({ response, toolCalls: allToolCalls })
  } catch (error: any) {
    logger.error("agent_request_failed", { error: String(error) })
    return NextResponse.json(
      { error: "Agent request failed" },
      { status: 500 }
    )
  }
}
