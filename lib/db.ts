import { Pool, ClientBase } from "pg"
import { awsCredentialsProvider } from "@vercel/functions/oidc"
import { Signer } from "@aws-sdk/rds-signer"

let pool: Pool | null = null
let signer: Signer | null = null

function getSigner(): Signer {
  if (!signer) {
    signer = new Signer({
      hostname: process.env.PGHOST!,
      port: Number(process.env.PGPORT) || 5432,
      username: process.env.PGUSER!,
      region: process.env.AWS_REGION || "us-east-1",
      credentials: awsCredentialsProvider({
        roleArn: process.env.AWS_ROLE_ARN!,
        clientConfig: { region: process.env.AWS_REGION || "us-east-1" },
      }),
    })
  }
  return signer
}

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      database: process.env.PGDATABASE || "postgres",
      password: () => getSigner().getAuthToken(),
      port: Number(process.env.PGPORT) || 5432,
      ssl: { rejectUnauthorized: true },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  }
  return pool
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = await getPool().connect()
  try {
    const result = await client.query(text, params)
    return result.rows as T[]
  } finally {
    client.release()
  }
}

export async function querySingle<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}

export async function execute(
  text: string,
  params?: any[]
): Promise<{ rowCount: number | null }> {
  const client = await getPool().connect()
  try {
    const result = await client.query(text, params)
    return { rowCount: result.rowCount }
  } finally {
    client.release()
  }
}

export async function withConnection<T>(
  fn: (client: ClientBase) => Promise<T>
): Promise<T> {
  const client = await getPool().connect()
  try {
    return await fn(client)
  } finally {
    client.release()
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    await query("SELECT 1")
    return true
  } catch {
    return false
  }
}
