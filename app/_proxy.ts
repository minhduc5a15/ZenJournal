import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require auth
  const isPublicPath = pathname === "/login" || pathname === "/register";
  
  // Protected paths
  // We protect /entry/* and the dashboard / (though dashboard handles empty state, strict protection is maybe better, but let's stick to prompt requirements)
  // The prompt asked to fix security. Preventing access to /entry/* is key.
  const isProtectedPath = pathname.startsWith("/entry");

  const token = request.cookies.get("token")?.value || "";
  const payload = token ? await verifyJWT(token) : null;

  // If trying to access protected route without valid token
  if (isProtectedPath && !payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If trying to access login/register with valid token
  if (isPublicPath && payload) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/entry/:path*",
  ],
};
