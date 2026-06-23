import { generateText, tool, embed } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"
import { query } from "@/lib/db"
import { NextResponse } from "next/server"
import { requireAuth, unauthorized, forbidden, getOrgId, getUserId, logAudit } from "@/lib/api-auth"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"
import { logger } from "@/lib/log"

const agentLimiter = createRateLimiter({ interval: 60000, maxRequests: 10 })

const nvidia = createOpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
  fetch: async (url, options) => {
    const urlString = typeof url === "string" ? url : (url as any).url || (url as any).href || ""
    if (urlString.endsWith("/embeddings") && options?.body) {
      try {
        const body = JSON.parse(options.body as string)
        body.input_type = "query"
        options.body = JSON.stringify(body)
      } catch {}
    }
    return fetch(url, options)
  }
})

const SYSTEM_PROMPT = `You are Ona Agent, an autonomous operations analyst for remote safari camps and eco-lodges.

Your role is to help camp managers understand demand forecasts and optimize their supply chain.

## Tools Available

### 1. query_demand_data
Query occupancy demand metrics from the database.
Parameters: metric_type (e.g. 'occupancy_rate'), limit (number of records), days_back (history window).

### 2. search_context_knowledge
Search the camp's Standard Operating Procedures (SOPs) using semantic similarity search.

### 3. generate_procurement
When a spike is detected, generate procurement recommendations and persist them.

## Behavior Rules
- Always query demand_data first for occupancy/numbers questions
- Use search_context_knowledge for "how to" logistics/weather/SOP questions
- When confirming a spike >50%, proactively generate procurement
- Be concise, direct, like an experienced camp ops manager
- Never hallucinate numbers — always use real data
- After getting tool results, synthesize a final answer
- If a database query returns empty results, clearly say "No data available" rather than guessing
- If the RAG search finds no relevant SOPs, suggest the manager upload SOP documents
- If procurement generation succeeds, confirm what was created`

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
    if (rows.length === 0) {
      return { success: true, data: [], message: `No ${metricType} data found for this camp in the last ${daysBack} days.` }
    }
    return { success: true, data: rows }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

async function searchContext(searchTerm: string, orgId: string) {
  try {
    let embeddingResult: number[]
    try {
      const res = await embed({
        model: nvidia.embedding("nvidia/embed-qa-4"),
        value: searchTerm,
      })
      embeddingResult = res.embedding
    } catch {
      // Fallback if embed-qa-4 fails/404s
      const res = await embed({
        model: nvidia.embedding("nvidia/nv-embedqa-e5-v5"),
        value: searchTerm,
      })
      embeddingResult = res.embedding
    }

    let vector = embeddingResult
    if (vector.length < 1536) {
      const pad = new Array(1536 - vector.length).fill(0)
      vector = vector.concat(pad)
    } else if (vector.length > 1536) {
      vector = vector.slice(0, 1536)
    }

    const vectorStr = `[${vector.join(",")}]`
    const rows = await query<any>(
      `SELECT content,
              embedding <=> $2::vector AS distance
       FROM context_knowledge
       WHERE org_id = $1
       ORDER BY distance ASC
       LIMIT 5`,
      [orgId, vectorStr]
    )
    if (rows.length === 0) {
      // Try ILIKE fallback
      const fallback = await query<any>(
        `SELECT content FROM context_knowledge WHERE org_id = $1 AND content ILIKE $2 LIMIT 3`,
        [orgId, `%${searchTerm}%`]
      )
      if (fallback.length > 0) {
        return { success: true, results: fallback.map((r: any) => ({ content: r.content })) }
      }
      // No SOPs found at all
      const countResult = await query<any>(
        `SELECT COUNT(*) as count FROM context_knowledge WHERE org_id = $1`,
        [orgId]
      )
      const totalSops = parseInt(countResult[0]?.count || "0")
      if (totalSops === 0) {
        return { success: true, results: [], message: "No SOP documents found for this camp. A camp admin can upload SOPs to enable semantic search." }
      }
      return { success: true, results: [], message: `No SOPs matched "${searchTerm}". Try rephrasing or searching for a different topic.` }
    }
    return { success: true, results: rows.map((r: any) => ({ content: r.content, distance: r.distance })) }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

async function generateProcurement(items: any[], orgId: string) {
  try {
    if (!items || items.length === 0) {
      return { success: true, count: 0, message: "No procurement needed at this time." }
    }

    // Validate each item before inserting
    for (const item of items) {
      if (!item.item_name || !item.unit || !item.urgency) {
        return { success: false, error: "Invalid item: item_name, unit, and urgency are required" }
      }
      if (!["high", "medium", "low"].includes(item.urgency)) {
        return { success: false, error: `Invalid urgency: ${item.urgency}. Must be high, medium, or low.` }
      }
    }

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

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return unauthorized()
    if (session.user.mustChangePassword) {
      return forbidden("Password change required")
    }

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
    if (!body || !body.message || typeof body.message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    if (body.message.length > 4000) {
      return NextResponse.json({ error: "Message too long" }, { status: 413 })
    }

    const messages: any[] = [{ role: "user", content: body.message }]

    const tools = {
      query_demand_data: tool({
        description: "Query occupancy demand metrics. Returns recent actual and predicted values.",
        inputSchema: z.object({
          metric_type: z.string().default("occupancy_rate"),
          limit: z.number().default(10),
          days_back: z.number().default(30),
        }),
        execute: async (args) => queryDemandData(args.metric_type, args.limit, args.days_back, orgId),
      }),
      search_context_knowledge: tool({
        description: "Search camp SOPs and logistics knowledge using semantic similarity search.",
        inputSchema: z.object({
          search_term: z.string(),
        }),
        execute: async (args) => searchContext(args.search_term, orgId),
      }),
      generate_procurement: tool({
        description: "Generate procurement recommendations. Call when significant occupancy increase is confirmed.",
        inputSchema: z.object({
          items: z.array(z.object({
            item_name: z.string(),
            required_amount: z.number(),
            unit: z.string(),
            urgency: z.enum(["high", "medium", "low"]),
            reason: z.string(),
          })),
        }),
        execute: async (args) => {
          const result = await generateProcurement(args.items, orgId)
          if (result.success) {
            await logAudit("agent_procurement_generated", { itemCount: result.count, items: args.items }, request, orgId, getUserId(session)).catch(() => {})
          }
          return result
        },
      }),
    }

    const result = await generateText({
      model: nvidia("nvidia/nemotron-3-ultra-550b-a55b"),
      system: SYSTEM_PROMPT,
      messages,
      tools,
      maxSteps: 5,
    } as any)

    const allToolCalls = (result.steps || []).flatMap(step =>
      (step.toolCalls || []).map((tc: any) => ({ name: tc.toolName, args: tc.args }))
    )

    const response = result.text || "Analysis complete. Check the dashboard for updated data."

    try {
      await query(
        `INSERT INTO agent_conversations (org_id, user_message, agent_response, tool_calls)
         VALUES ($1, $2, $3, $4)`,
        [orgId, body.message, response, JSON.stringify(allToolCalls)]
      )
    } catch (err) {
      logger.error("conversation_log_failed", { error: String(err) })
    }

    return NextResponse.json({ response, toolCalls: allToolCalls })
  } catch (error: any) {
    logger.error("agent_request_failed", { error: String(error) })
    return NextResponse.json({ error: "Agent request failed" }, { status: 500 })
  }
}
