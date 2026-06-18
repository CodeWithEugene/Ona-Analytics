import { generateText, dynamicTool } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"
import { zodSchema } from "ai"
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

export async function POST(request: Request) {
  try {
    const { message, orgId = "11111111-1111-1111-1111-111111111111" } =
      await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const result = await generateText({
      model: nvidia("nvidia/nemotron-3-ultra-550b-a55b"),
      system: SYSTEM_PROMPT,
      maxRetries: 2,
      messages: [{ role: "user", content: message }],
      tools: {
      query_demand_data: dynamicTool({
        description:
          "Query occupancy demand data from the database. Accepts a SELECT SQL query against demand_logs.",
        inputSchema: zodSchema(
          z.object({
            sql: z
              .string()
              .describe(
                "SELECT SQL query against demand_logs table. Must be SELECT only."
              ),
          })
        ),
        execute: async (input: unknown) => {
          const { sql } = input as { sql: string }
          const normalized = sql.trim().toUpperCase()
          if (!normalized.startsWith("SELECT")) {
            return JSON.stringify({
              success: false,
              error: "Only SELECT queries are permitted",
            })
          }
          try {
            const rows = await query(sql)
            return JSON.stringify({ success: true, data: rows })
          } catch (err: any) {
            return JSON.stringify({ success: false, error: err.message })
          }
        },
      }),

      search_context_knowledge: dynamicTool({
        description:
          "Search camp SOPs and logistics knowledge. Uses pgvector cosine similarity and text search. Returns relevant procedures.",
        inputSchema: zodSchema(
          z.object({
            search_term: z
              .string()
              .describe("What logistics info to search for"),
          })
        ),
        execute: async (input: unknown) => {
          const { search_term } = input as { search_term: string }
          try {
            const rows = await query<any>(
              `SELECT content,
                      ts_rank(to_tsvector('english', content), plainto_tsquery('english', $2)) AS rank
               FROM context_knowledge
               WHERE org_id = $1
                 AND to_tsvector('english', content) @@ plainto_tsquery('english', $2)
               ORDER BY rank DESC
               LIMIT 5`,
              [orgId, search_term]
            )
            if (rows.length === 0) {
              const fallbackRows = await query<any>(
                `SELECT content FROM context_knowledge
                 WHERE org_id = $1
                 AND content ILIKE $2
                 LIMIT 3`,
                [orgId, `%${search_term}%`]
              )
              return JSON.stringify({
                success: true,
                results: fallbackRows.map((r: any) => ({
                  content: r.content,
                })),
              })
            }
            return JSON.stringify({
              success: true,
              results: rows.map((r: any) => ({ content: r.content })),
            })
          } catch (err: any) {
            return JSON.stringify({ success: false, error: err.message })
          }
        },
      }),

      generate_procurement: dynamicTool({
        description:
          "Generate procurement recommendations based on demand spike data. Call when you confirm a significant occupancy increase.",
        inputSchema: zodSchema(
          z.object({
            items: z.array(
              z.object({
                item_name: z.string(),
                required_amount: z.number(),
                unit: z.string(),
                urgency: z.enum(["high", "medium", "low"]),
                reason: z.string(),
              })
            ),
          })
        ),
        execute: async (input: unknown) => {
          const { items } = input as {
            items: Array<{
              item_name: string
              required_amount: number
              unit: string
              urgency: "high" | "medium" | "low"
              reason: string
            }>
          }
          try {
            for (const item of items) {
              await query(
                `INSERT INTO procurement_items (org_id, item_name, required_amount, unit, urgency, reason)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                  orgId,
                  item.item_name,
                  item.required_amount,
                  item.unit,
                  item.urgency,
                  item.reason,
                ]
              )
            }
            return JSON.stringify({
              success: true,
              count: items.length,
              message: `Generated ${items.length} procurement recommendations`,
            })
          } catch (err: any) {
            return JSON.stringify({ success: false, error: err.message })
          }
        },
      }),
    },
  })

    const toolCalls = (result.toolCalls || []).map((tc: any) => ({
      name: tc.toolName,
      args: tc.args || tc.input || tc.arguments,
    }))

    const response = result.text || (
      toolCalls.length > 0
        ? `Queried ${toolCalls.map(t => t.name).join(', ')}. Check the dashboard for updated data.`
        : "I'm not sure how to answer that. Try asking about occupancy, forecasts, or procurement."
    )

    return NextResponse.json({
      response,
      toolCalls,
    })
  } catch (error: any) {
    console.error("Agent error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
