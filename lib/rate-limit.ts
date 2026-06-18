const store = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitConfig {
  interval: number
  maxRequests: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

export function createRateLimiter(config: RateLimitConfig) {
  const { interval, maxRequests } = config

  // Cleanup expired entries periodically
  if (typeof setInterval !== "undefined") {
    const cleanup = setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of store) {
        if (now > entry.resetAt) store.delete(key)
      }
    }, Math.min(interval, 60000))
    if (typeof cleanup === "object" && "unref" in cleanup) cleanup.unref()
  }

  return (key: string): RateLimitResult => {
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + interval })
      return { success: true, remaining: maxRequests - 1, resetAt: now + interval }
    }

    if (entry.count >= maxRequests) {
      return { success: false, remaining: 0, resetAt: entry.resetAt }
    }

    entry.count++
    return { success: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
  }
}

export function rateLimitKey(request: Request, suffix?: string): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || "anonymous"
  return `${ip}:${suffix || "default"}`
}

export function rateLimitHeaders(result: RateLimitResult, limit: number) {
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  }
}
