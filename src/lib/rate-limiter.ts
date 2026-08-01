import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientKey(request: NextRequest, prefix: string): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
             request.headers.get("x-real-ip") ||
             "unknown";
  const userAgent = request.headers.get("user-agent") || "";
  return `${prefix}:${ip}:${hashString(userAgent)}`;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function createRateLimiter(config: RateLimitConfig) {
  return async function rateLimiter(request: NextRequest): Promise<NextResponse | null> {
    const key = getClientKey(request, config.keyPrefix);
    const now = Date.now();
    
    const entry = rateLimitStore.get(key);
    
    if (!entry || now > entry.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return null;
    }
    
    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      const response = new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(config.maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(entry.resetTime / 1000)),
          },
        }
      );
      return response;
    }
    
    entry.count++;
    return null;
  };
}

// Pre-configured rate limiters
export const bookingRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 bookings per hour per IP
  keyPrefix: "booking",
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 min
  keyPrefix: "auth",
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  keyPrefix: "api",
});

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes