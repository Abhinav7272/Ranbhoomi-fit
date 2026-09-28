import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { siteUrl } from "@/lib/site";

const COOKIE = "rfc_admin";

function secretKey() {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "dev-only";
  return new TextEncoder().encode(secret.padEnd(32, "0").slice(0, 64));
}

function crawlFile(body: string, contentType: string) {
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = siteUrl();

  if (pathname === "/sitemap.xml") {
    const today = new Date().toISOString().slice(0, 10);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`;
    return crawlFile(xml, "application/xml; charset=utf-8");
  }

  if (pathname === "/robots.txt") {
    const text = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`;
    return crawlFile(text, "text/plain; charset=utf-8");
  }

  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    await jwtVerify(token, secretKey());
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.delete(COOKIE);
    return res;
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/sitemap.xml", "/robots.txt"],
};
