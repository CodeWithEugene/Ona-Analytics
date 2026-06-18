import { generateText, tool } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"
import { query } from "@/lib/db"
import { NextResponse } from "next/server"

const nvidia = createOpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
})

const SYSTEM_PROMPT = `You are Ona Agent, an autonomous operations analyst for remote safari camps and eco-lodges.

Your role is to help camp managers understand demand forecasts and optimize their supply chain.

## Tools Available

### 1. query_demand_data
Execute SQL SELECT queries against the demand_logs table to retrieve occupancy metrics.
Only use SELECT queries. Never modify data.
Schema: demand_logs(id UUID, org_id UUID, log_date DATE, metric_type VARCHAR, actual_value DECIMAL, predicted_value DECIMAL)
The metric_type column uses values like 'occupancy_rate'. Always use the correct column name.

### 2. search_context_knowledge
Search the camp's Standard Operating Procedures (SOPs) using text similarity search.

### 3. generate_procurement
When a spike is detected, generate procurement recommendations and persist them.

## Behavior Rules
- Always query demand_data first for occupancy/numbers questions
- Use search_context_knowledge for "how to" logistics/weather/SOP questions
- When confirming a spike >50%, proactively generate procurement
- Be concise, direct, like an experienced camp ops manager
- Never hallucinate numbers — always use real data`

async function executeQuery(sql: string, orgId: string) {
  const normalized = sql.trim().toUpperCase()
  if (!normalized.startsWith("SELECT")) {
    return { success: false, error: "Only SELECT queries are permitted" }
  }
  try {
    const rows = await query(sql)
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
    description:
      "Query occupancy demand data from the database. Accepts a SELECT SQL query against demand_logs. The metric_type column uses values like 'occupancy_rate'.",
    inputSchema: z.object({
      sql: z.string().describe("SELECT SQL query against demand_logs table. Must be SELECT only."),
    }),
  }),
  search_context_knowledge: tool({
    description:
      "Search camp SOPs and logistics knowledge. Uses full-text search. Returns relevant procedures.",
    inputSchema: z.object({
      search_term: z.string().describe("What logistics info to search for"),
    }),
  }),
  generate_procurement: tool({
    description:
      "Generate procurement recommendations based on demand spike data. Call when you confirm a significant occupancy increase.",
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

export async function POST(request: Request) {
  try {
    const { message, orgId = "11111111-1111-1111-1111-111111111111" } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
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
          const tcArgs = (tc as any).input || (tc as any).args
          allToolCalls.push({ name: tc.toolName, args: tcArgs })

          let toolResult: any
          if (tc.toolName === "query_demand_data") {
            toolResult = await executeQuery(tcArgs.sql, orgId)
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

    return NextResponse.json({
      response: finalText || "Analysis complete. Check the dashboard for updated data.",
      toolCalls: allToolCalls,
    })
  } catch (error: any) {
    console.error("Agent error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
