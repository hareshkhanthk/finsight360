import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/accounts",
  "/credit-cards",
  "/import",
  "/settings"
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const sessionCookie = req.cookies.get("fs360_session")?.value;
  if (!sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/accounts/:path*", "/credit-cards/:path*", "/import/:path*", "/settings/:path*"]
};
