import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export function getBaseUrl(req: NextRequest): string {
  // 1. Explicit query parameter passed from frontend (e.g. ?origin=https://my-server.com)
  const queryOrigin = req.nextUrl?.searchParams?.get("origin");
  if (queryOrigin && queryOrigin.trim() !== "" && queryOrigin !== "null" && queryOrigin !== "undefined") {
    const clean = queryOrigin.trim().replace(/\/+$/, "");
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }
  }

  // 2. Explicit environment variable configured by user
  const envAppUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL;

  if (envAppUrl && envAppUrl.trim() !== "") {
    let url = envAppUrl.trim().replace(/\/+$/, "");
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    // If user explicitly configured a domain that is NOT localhost, always prioritize it!
    if (!url.includes("localhost") && !url.includes("127.0.0.1")) {
      return url;
    }
  }

  // 3. Vercel deployment variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim().replace(/\/+$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim().replace(/\/+$/, "")}`;
  }

  // 4. Referer header (The web page from which user triggered the download)
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const refUrl = new URL(referer);
      if (refUrl.origin && refUrl.origin !== "null" && !refUrl.origin.includes("localhost") && !refUrl.origin.includes("127.0.0.1")) {
        return refUrl.origin.replace(/\/+$/, "");
      }
    } catch {}
  }

  // 5. Dynamic request headers (e.g. Reverse Proxy, Cloudflare, Nginx, VPS host header)
  const forwardedProto = req.headers.get("x-forwarded-proto") || req.nextUrl?.protocol?.replace(":", "") || "https";
  const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host") || req.nextUrl?.host;

  if (forwardedHost && !forwardedHost.includes("localhost") && !forwardedHost.includes("127.0.0.1")) {
    const proto = forwardedProto.includes("https") ? "https" : forwardedProto;
    return `${proto}://${forwardedHost}`.replace(/\/+$/, "");
  }

  // 6. If envAppUrl is set (even if localhost), use it
  if (envAppUrl && envAppUrl.trim() !== "") {
    let url = envAppUrl.trim().replace(/\/+$/, "");
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `http://${url}`;
    }
    return url;
  }

  // 7. Request nextUrl origin
  try {
    const origin = req.nextUrl?.origin;
    if (origin && origin !== "null" && origin !== "http://null") {
      return origin.replace(/\/+$/, "");
    }
  } catch {}

  // 8. Default fallback
  return "http://localhost:3000";
}

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), "public", "LaptopWiseScanner.bat");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Scanner script not found on server" }, { status: 404 });
    }

    let fileContent = fs.readFileSync(filePath, "utf-8");
    const baseUrl = getBaseUrl(req);

    // Replace placeholder with the exact active base URL
    fileContent = fileContent.replace(/__SERVER_APP_URL__/g, baseUrl);

    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "application/x-bat; charset=utf-8",
        "Content-Disposition": 'attachment; filename="LaptopWiseScanner.bat"',
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to download scanner file" }, { status: 500 });
  }
}
