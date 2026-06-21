import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const hasSession = !!accessToken || !!refreshToken;

  const isAuthRoute = 
    pathname === "/loginAs" || 
    pathname === "/registerAs" || 
    pathname.startsWith("/auth/") || 
    pathname.startsWith("/admin/login") || 
    pathname.startsWith("/admin/signup") || 
    pathname.startsWith("/client/login") || 
    pathname.startsWith("/client/signup") || 
    pathname.startsWith("/agency/signup") || 
    pathname.startsWith("/agency/verify") || 
    pathname === "/forgot-password" || 
    pathname === "/reset-password";
  
  // Protected routes require authentication
  const isAdminRoute = pathname.startsWith("/admin") && !isAuthRoute;
  const isClientRoute = pathname.startsWith("/client") && !isAuthRoute;

  // If trying to access protected route without session
  if (!hasSession && (isAdminRoute || isClientRoute)) {
    return NextResponse.redirect(new URL("/loginAs", request.url));
  }

  const isPublicAuthRoute = 
    pathname === "/" ||
    pathname === "/loginAs" || 
    pathname === "/registerAs" || 
    pathname.startsWith("/admin/login") || 
    pathname.startsWith("/admin/signup") || 
    pathname.startsWith("/client/login") || 
    pathname.startsWith("/client/signup") || 
    pathname.startsWith("/agency/signup") || 
    pathname === "/forgot-password" || 
    pathname === "/reset-password";

  // If trying to access public auth routes while already logged in
  if (hasSession && isPublicAuthRoute) {
    // Attempt to guess role from JWT if it's a standard JWT
    let role = null;
    if (accessToken && accessToken.split(".").length === 3) {
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        role = payload.role || payload.admin_role;
      } catch (e) {
        // Ignored
      }
    }

    if (role === "owner") {
      return NextResponse.redirect(new URL("/admin/owner/dashboard", request.url));
    } else if (role === "staff") {
      return NextResponse.redirect(new URL("/admin/staff/dashboard", request.url));
    } else if (role === "developer") {
      return NextResponse.redirect(new URL("/admin/developer/dashboard", request.url));
    } else if (role === "client") {
      return NextResponse.redirect(new URL("/client/dashboard", request.url));
    } else {
      // Default to loginAs if we have a session but role is unknown or not mapped
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Role Mismatch Enforcement
  if (hasSession && (isAdminRoute || isClientRoute)) {
    let role = null;
    if (accessToken && accessToken.split(".").length === 3) {
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        role = payload.role || payload.admin_role;
      } catch (e) {
        // Ignored
      }
    }

    // If we successfully decoded a role, enforce mismatch logic
    if (role) {
      if (isAdminRoute && role === "client") {
        return NextResponse.redirect(new URL("/client/dashboard", request.url));
      }
      if (isClientRoute && role !== "client") {
        if (role === "owner") {
          return NextResponse.redirect(new URL("/admin/owner/dashboard", request.url));
        } else if (role === "staff") {
          return NextResponse.redirect(new URL("/admin/staff/dashboard", request.url));
        } else if (role === "developer") {
          return NextResponse.redirect(new URL("/admin/developer/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
