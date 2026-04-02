import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

export default auth((request) => {
  const hostname = request.headers.get("host") ?? "";
  const pathname = request.nextUrl.pathname;

  const rootDomainWithoutPort = ROOT_DOMAIN.replace(/:\d+$/, "");
  const hostnameWithoutPort = hostname.replace(/:\d+$/, "");

  // Protect /admin routes — redirect to login if not authenticated
  if (pathname.startsWith("/admin")) {
    if (!request.auth) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Root domain → marketing site, no tenant context needed
  if (hostnameWithoutPort === rootDomainWithoutPort) {
    return NextResponse.next();
  }

  // Determine tenant identifier from hostname
  let tenantSlug: string | null = null;
  let lookupType: "slug" | "domain" = "slug";

  if (hostnameWithoutPort.endsWith(`.${rootDomainWithoutPort}`)) {
    tenantSlug = hostnameWithoutPort.replace(
      `.${rootDomainWithoutPort}`,
      "",
    );
    lookupType = "slug";
  } else {
    tenantSlug = hostnameWithoutPort;
    lookupType = "domain";
  }

  if (!tenantSlug) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  // Pass tenant info to server components via headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-slug", tenantSlug);
  requestHeaders.set("x-tenant-lookup-type", lookupType);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
