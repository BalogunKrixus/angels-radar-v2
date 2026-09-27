import { auth } from "@/auth";
import { NextResponse } from "next/server";

const ROLE_HOME: Record<string, string> = {
  founder: "/founder",
  investor: "/investor",
  admin: "/admin",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isFounderRoute = pathname.startsWith("/founder");
  const isInvestorRoute = pathname.startsWith("/investor");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isFounderRoute && !isInvestorRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user.role;
  const roleMatches =
    (isFounderRoute && role === "founder") ||
    (isInvestorRoute && role === "investor") ||
    (isAdminRoute && role === "admin");

  if (!roleMatches) {
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/login", req.url));
  }

  return NextResponse.next();
});

// Page-level auth is enforced above; every data-touching server action and
// route handler re-checks the session independently (see src/lib/session.ts)
// rather than relying on this middleware alone.
export const config = {
  matcher: ["/founder/:path*", "/investor/:path*", "/admin/:path*"],
};
