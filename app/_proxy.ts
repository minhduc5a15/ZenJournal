import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require auth
  const isPublicPath = pathname === "/login" || pathname === "/register";
  
  // Potential protected path
  const isEntryPath = pathname.startsWith("/entry/");
  
  const token = request.cookies.get("token")?.value || "";
  const payload = token ? await verifyJWT(token) : null;

  // We allow access to /entry/[id] if the user is logged in, 
  // and the API handles specific entry-level visibility.
  // However, we still want to prevent completely unauthenticated access to the UI.
  // For ZenJournal, we'll allow unauthenticated users to view PUBLIC entries if they have the link.
  // But wait, our current architecture requires being logged in to even use the AuthProvider.
  // Let's stick to: Must be logged in to view ANY entry UI, but logged in users can view other's PUBLIC entries.

  if (isEntryPath && !payload) {
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