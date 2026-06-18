# Ona Analytics — Operations Playbook

## Running Locally

```bash
npm run dev
```

Opens at `http://localhost:3000`.

Requires a running PostgreSQL instance with the schema from `lib/db/schema.sql` applied.

## Database

### Local
Create the database and run schema + seed:
```sql
createdb ona_analytics
psql ona_analytics < lib/db/schema.sql
psql ona_analytics < lib/db/seed.sql
```

Set env vars:
- `DATABASE_URL=postgres://user:pass@localhost:5432/ona_analytics?sslmode=require`
- Or use `PGPASSWORD` env var for local dev fallback

### Production (Vercel + Aurora PostgreSQL)
- DB is managed via Vercel's IAM OIDC integration
- Vercel injects `DATABASE_URL` at runtime
- Pool max is `3` (serverless-safe, don't increase without load testing)

### Backup
- Aurora PostgreSQL automated backups to S3 (default 7-day retention)
- To increase retention period, use the AWS Console:
  RDS → Databases → [cluster] → Modify → Backup retention period
- Manual snapshots before schema migrations are recommended

## Migrations

Run the migrate API endpoint:
```
POST /api/migrate
Authorization: Bearer <token>
```

Only users in `ADMIN_EMAILS` can run this. Applies `schema.sql` idempotently.

## Auth

- `AUTH_SECRET` must be a random base64 string (generated via `openssl rand -base64 32`)
- NextAuth v5 beta with JWT strategy
- `SameSite=Strict` on session cookie
- Session carries `id` and `orgId` in JWT

### First user
A seed admin user is created by `seed.sql`:
- Email: `admin@ona-analytics.com`
- Password: `admin123`
- **Must change password on first login** via Settings → Change Password

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes (prod) | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | NextAuth encryption secret |
| `AUTH_URL` | Yes | App URL (http://localhost:3000 locally) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL |
| `NVIDIA_API_KEY` | Yes | NVIDIA Nemotron API key for Ona Agent |
| `SETUP_API_KEY` | No | API key for setup endpoint |
| `ADMIN_EMAILS` | No | Comma-separated admin emails for migration |
| `PGPASSWORD` | No | Local dev password fallback |

## Testing

```bash
npm t              # Unit tests (Vitest)
npm run test:e2e   # E2E tests (Playwright — requires running app)
npm run typecheck  # TypeScript type checking
npm run lint       # ESLint
```

## CI/CD

On push to `main` / PR to `main`, GitHub Actions runs:
1. `lint`
2. `typecheck`
3. `build`
4. `test` (Vitest)

TODO: Add Playwright E2E to CI pipeline once test DB credentials are available.

## Monitoring

Currently no error monitoring (Sentry, etc.) is configured.

### Adding Sentry
1. Create Sentry project (select "Next.js")
2. Set `SENTRY_DSN` env var
3. Install `@sentry/nextjs`: `npm install @sentry/nextjs`
4. Run `npx @sentry/nextjs init` to configure

### Adding Error Logging
The app logs structured JSON to stdout via `lib/log.ts`:
```ts
import { log } from "@/lib/log"
log.info("user_action", { action: "password_change", userId })
log.error("db_query_failed", { error: e.message, query: "..." })
```

## Rate Limiting

Uses in-memory `Map`-based rate limiter in `lib/rate-limit.ts`. Per-instance only.

### Limits
| Endpoint | Limit | Scope |
|---|---|---|
| Agent | 10/min | per user |
| Register | 3/min | per IP |
| Password change | 5/min | per user |
| Setup | 5/min | per IP |
| Migrate | 2/min | per user |
| Procurement generate | 10/min | per user |

### Upgrade path for Vercel KV
```ts
// lib/rate-limit.ts — swap the map-based store with:
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
})
```

## Security Checklist

- [x] `SameSite=Strict` on session cookie
- [x] Rate limiting on all mutation endpoints
- [x] Input validation on all API routes
- [x] SQL injection prevention (structured params, no raw LLM SQL)
- [x] Error message sanitization (no stack traces in responses)
- [x] Password hashing via bcrypt
- [x] Session expiry via JWT (NextAuth default: 30 days)
- [x] No secrets in client bundle
- [x] Body size limits on mutation endpoints (1MB register, 4000 chars agent)
- [ ] Error monitoring (Sentry)
- [ ] E2E tests in CI pipeline
- [ ] Audit log for admin actions
- [ ] Team member invite flow
- [ ] Vercel OIDC token in public .env.local → must revoke in Vercel dashboard
