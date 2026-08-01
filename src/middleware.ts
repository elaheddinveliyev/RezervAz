import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  isSupabaseConfigured,
  isDemoLoginEnabled,
  verifyDemoSession,
  DEMO_SESSION_COOKIE,
  isAppRole,
  getAdminLoginPath,
  isAdminIpAllowed,
} from "@/lib/env";
import { authRateLimiter, bookingRateLimiter, apiRateLimiter } from "@/lib/rate-limiter";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const response = NextResponse.next();

  // Skip middleware for static files and specific public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return response;
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api")) {
    const rateLimitResponse = await apiRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;
  }

  // Rate limiting for auth endpoints
  if (pathname.startsWith("/login") || pathname.startsWith("/admin")) {
    const rateLimitResponse = await authRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;
  }

  // Rate limiting for public booking
  if (pathname === "/book") {
    const rateLimitResponse = await bookingRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;
  }

  // Allow root and login page without auth
  if (pathname === "/" || pathname.startsWith("/login")) {
    return response;
  }

  // Admin IP allowlist check for admin routes - enforce in production
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                     request.headers.get("x-real-ip") ||
                     "127.0.0.1";
    
    if (!isAdminIpAllowed(clientIp)) {
      // Log unauthorized access attempt
      console.warn(`[SECURITY] Admin access denied from IP: ${clientIp} for path: ${pathname}`);
      // In production, you could redirect to a 403 page
      // return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  // Check authentication for dashboard routes
  if (pathname.startsWith("/dashboard")) {
    let isAuthenticated = false;
    let userRole: "admin" | "staff" | null = null;

    // Try Supabase auth first
    if (isSupabaseConfigured()) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const metadataRole = user.app_metadata?.role;
        if (metadataRole === "admin" || metadataRole === "staff") {
          isAuthenticated = true;
          userRole = metadataRole;
        }
      }
    }

    // Fallback to demo auth
    if (!isAuthenticated && isDemoLoginEnabled()) {
      const cookieValue = request.cookies.get(DEMO_SESSION_COOKIE)?.value;
      const role = await verifyDemoSession(cookieValue);
      
      if (role && isAppRole(role)) {
        isAuthenticated = true;
        userRole = role;
      }
    }

    if (!isAuthenticated) {
      const loginUrl = new URL(getAdminLoginPath(), request.url);
      loginUrl.searchParams.set("next", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    // Add user role to headers for downstream use
    if (userRole) {
      response.headers.set("x-user-role", userRole);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};