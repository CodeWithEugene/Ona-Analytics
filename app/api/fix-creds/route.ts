import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query, querySingle, withConnection } from "@/lib/db"
import { createRateLimiter, rateLimitKey, rateLimitHeaders } from "@/lib/rate-limit"
import { logger } from "@/lib/log"

const SETUP_KEY = process.env.SETUP_API_KEY
const fixLimiter = createRateLimiter({ interval: 60000, maxRequests: 5 })

const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS org_profiles (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL, timezone VARCHAR(64) DEFAULT 'Africa/Nairobi', created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS camp_users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES org_profiles(id) ON DELETE CASCADE, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, role VARCHAR(20) NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager', 'viewer')), must_change_password BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_camp_users_org ON camp_users(org_id);
CREATE TABLE IF NOT EXISTS demand_logs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES org_profiles(id) ON DELETE CASCADE, log_date DATE NOT NULL, metric_type VARCHAR(50) NOT NULL DEFAULT 'occupancy_rate' CHECK (metric_type IN ('occupancy_rate', 'arrivals', 'departures', 'revpar', 'adr')), actual_value DECIMAL(12, 4), predicted_value DECIMAL(12, 4), created_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_demand_logs_org_date ON demand_logs(org_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_demand_logs_org_metric ON demand_logs(org_id, metric_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_demand_logs_unique ON demand_logs(org_id, log_date, metric_type);
ALTER TABLE camp_users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE camp_users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'manager';
CREATE TABLE IF NOT EXISTS context_knowledge (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES org_profiles(id) ON DELETE CASCADE, content TEXT NOT NULL, embedding VECTOR(1536) NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_context_knowledge_org ON context_knowledge(org_id);
CREATE TABLE IF NOT EXISTS procurement_items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES org_profiles(id) ON DELETE CASCADE, item_name VARCHAR(255) NOT NULL, required_amount DECIMAL(12, 2) NOT NULL, unit VARCHAR(50) NOT NULL DEFAULT 'units', urgency VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (urgency IN ('high', 'medium', 'low')), reason TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), fulfilled_at TIMESTAMPTZ);
CREATE INDEX IF NOT EXISTS idx_procurement_org_urgency ON procurement_items(org_id, urgency);
CREATE TABLE IF NOT EXISTS agent_conversations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES org_profiles(id) ON DELETE CASCADE, user_message TEXT NOT NULL, agent_response TEXT NOT NULL, tool_calls JSONB, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_agent_conversations_org ON agent_conversations(org_id, created_at DESC);
CREATE TABLE IF NOT EXISTS password_reset_tokens (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES camp_users(id) ON DELETE CASCADE, token_hash VARCHAR(255) NOT NULL, expires_at TIMESTAMPTZ NOT NULL, used BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token_hash);
CREATE TABLE IF NOT EXISTS audit_log (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID REFERENCES org_profiles(id) ON DELETE SET NULL, user_id UUID REFERENCES camp_users(id) ON DELETE SET NULL, action VARCHAR(100) NOT NULL, details JSONB, ip_address VARCHAR(45), created_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_audit_log_org ON audit_log(org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id, created_at DESC);
`

const ORG_ID = "11111111-1111-1111-1111-111111111111"

export async function POST(request: Request) {
  try {
    const rl = fixLimiter(rateLimitKey(request, "fix-creds"))
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: rateLimitHeaders(rl, 5) }
      )
    }

    if (!SETUP_KEY) {
      return NextResponse.json({ error: "Setup not configured" }, { status: 503 })
    }

    const body = await request.json().catch(() => ({}))
    if (body.setupKey !== SETUP_KEY) {
      return NextResponse.json({ error: "Invalid setup key" }, { status: 403 })
    }

    const results: string[] = []

    await withConnection(async (client) => {
      // 1. Run schema (idempotent)
      const stmts = SCHEMA_SQL.split(";").filter(s => s.trim().length > 0)
      for (const stmt of stmts) {
        try {
          await client.query(stmt + ";")
        } catch (err: any) {
          results.push(`schema: ${err.message?.substring(0, 60)}`)
        }
      }

      // 2. Upsert org
      await client.query(
        `INSERT INTO org_profiles (id, name, location, timezone) VALUES ($1, 'Olare Orok Eco-Lodge', 'Maasai Mara, Kenya', 'Africa/Nairobi') ON CONFLICT (id) DO NOTHING`,
        [ORG_ID]
      )
      results.push("org seeded")

      // 3. Seed demand data
      await client.query(`
        INSERT INTO demand_logs (org_id, log_date, metric_type, actual_value, predicted_value)
        SELECT * FROM (VALUES
          ($1::uuid, CURRENT_DATE - 13, 'occupancy_rate', 42.0, NULL),
          ($1::uuid, CURRENT_DATE - 12, 'occupancy_rate', 40.0, NULL),
          ($1::uuid, CURRENT_DATE - 11, 'occupancy_rate', 39.0, NULL),
          ($1::uuid, CURRENT_DATE - 10, 'occupancy_rate', 41.0, NULL),
          ($1::uuid, CURRENT_DATE - 9, 'occupancy_rate', 43.0, NULL),
          ($1::uuid, CURRENT_DATE - 8, 'occupancy_rate', 38.0, NULL),
          ($1::uuid, CURRENT_DATE - 7, 'occupancy_rate', 40.0, NULL),
          ($1::uuid, CURRENT_DATE - 6, 'occupancy_rate', 41.0, NULL),
          ($1::uuid, CURRENT_DATE - 5, 'occupancy_rate', 42.0, NULL),
          ($1::uuid, CURRENT_DATE - 4, 'occupancy_rate', 39.0, NULL),
          ($1::uuid, CURRENT_DATE - 3, 'occupancy_rate', 41.0, NULL),
          ($1::uuid, CURRENT_DATE - 2, 'occupancy_rate', 40.0, NULL),
          ($1::uuid, CURRENT_DATE - 1, 'occupancy_rate', 41.0, NULL),
          ($1::uuid, CURRENT_DATE, 'occupancy_rate', 41.0, NULL),
          ($1::uuid, CURRENT_DATE + 1, 'occupancy_rate', NULL, 48.0),
          ($1::uuid, CURRENT_DATE + 2, 'occupancy_rate', NULL, 75.0),
          ($1::uuid, CURRENT_DATE + 3, 'occupancy_rate', NULL, 95.0),
          ($1::uuid, CURRENT_DATE + 4, 'occupancy_rate', NULL, 93.0),
          ($1::uuid, CURRENT_DATE + 5, 'occupancy_rate', NULL, 65.0)
        ) AS v WHERE NOT EXISTS (SELECT 1 FROM demand_logs WHERE org_id = $1)
      `, [ORG_ID])
      results.push("demand data seeded")

      // 4. Fix admin password
      const adminHash = bcrypt.hashSync("admin123", 12)
      const adminResult = await client.query(
        `UPDATE camp_users SET password_hash = $1, must_change_password = FALSE WHERE email = 'admin@ona-analytics.com' RETURNING email`,
        [adminHash]
      )
      if (adminResult.rowCount && adminResult.rowCount > 0) {
        results.push("admin password updated")
      } else {
        await client.query(
          `INSERT INTO camp_users (org_id, email, password_hash, name, role, must_change_password) VALUES ($1, 'admin@ona-analytics.com', $2, 'Admin User', 'admin', FALSE) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
          [ORG_ID, adminHash]
        )
        results.push("admin user created")
      }

      // 5. Upsert manager
      const mgrHash = bcrypt.hashSync("ona-demo-2026", 12)
      await client.query(
        `INSERT INTO camp_users (org_id, email, password_hash, name, role, must_change_password) VALUES ($1, 'manager@ona-analytics.com', $2, 'Demo Manager', 'manager', FALSE) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, role = EXCLUDED.role`,
        [ORG_ID, mgrHash]
      )
      results.push("manager user upserted")

      // 6. Seed procurement items
      await client.query(`
        INSERT INTO procurement_items (org_id, item_name, required_amount, unit, urgency, reason)
        SELECT * FROM (VALUES
          ($1::uuid, 'Fresh Produce', 40, 'kg', 'high', 'Weekend surge to 95% occupancy requires +40kg additional fresh produce per SOP'),
          ($1::uuid, 'Gas Cylinders', 10, 'units', 'high', 'Occupancy spike above 80% triggers 50% increase in propane supply per Gas SOP'),
          ($1::uuid, 'Linens & Bedding', 25, 'sets', 'medium', 'Additional 25 linen sets needed for 3-set rotation at peak occupancy')
        ) AS v WHERE NOT EXISTS (SELECT 1 FROM procurement_items WHERE org_id = $1)
      `, [ORG_ID])
      results.push("procurement seeded")
    })

    return NextResponse.json({
      success: true,
      message: "Database initialized and demo credentials fixed",
      results,
      credentials: {
        manager: { email: "manager@ona-analytics.com", password: "ona-demo-2026" },
        admin: { email: "admin@ona-analytics.com", password: "admin123" },
      },
    })
  } catch (error: any) {
    const msg = error?.message || String(error)
    logger.error("fix-creds failed", { error: msg, stack: error?.stack })
    return NextResponse.json({ error: msg, details: msg }, { status: 500 })
  }
}
