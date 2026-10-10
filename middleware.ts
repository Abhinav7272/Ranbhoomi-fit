import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { siteUrl } from "@/lib/site";

const COOKIE = "rfc_admin";

function secretKey() {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "dev-only";
  return new TextEncoder().encode(secret.padEnd(32, "0").slice(0, 64));
}

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl()}/</loc>
    <lastmod>2026-10-10</lastmod>
  </url>
</urlset>
`;

async function gzip(text: string) {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/sitemap.xml") {
    const accept = req.headers.get("accept-encoding") || "";
    const body = /\bgzip\b|\bbr\b/.test(accept) ? await gzip(SITEMAP) : SITEMAP;
    const headers = new Headers({
      "Content-Type": "text/xml; charset=UTF-8",
      "Cache-Control": "public, max-age=3600",
    });
    if (typeof body !== "string") headers.set("Content-Encoding", "gzip");
    return new NextResponse(body, { status: 200, headers });
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
  matcher: ["/sitemap.xml", "/admin", "/admin/:path*"],
};
