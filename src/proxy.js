import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/token";

// Runs on the server before a page renders (Next.js 16 renamed
// "middleware" to "proxy"). Logged-out users cannot open product pages,
// and logged-in users are sent away from the login page.
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);

  if (pathname.startsWith("/products") && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && hasToken) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/login"],
};
