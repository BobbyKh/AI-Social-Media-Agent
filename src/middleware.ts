import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/(app)"]; // protect only the (app) group
const PUBLIC_ROUTES = ["/", "/pricing"]; // public routes that don't require authentication

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Allow access to public routes
  if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }
  
  // Check if it's a protected route
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith("/" + p));
  if (!isProtected) return NextResponse.next();

  const access = req.cookies.get("access")?.value;
  if (!access) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|auth/route).*)"],
};


