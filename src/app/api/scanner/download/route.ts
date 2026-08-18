import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getBaseUrl(req: NextRequest): string {
  // 1. Explicit environment variable configured by user
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
    return url;
  }

  // 2. Vercel deployment variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim().replace(/\/+$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim().replace(/\/+$/, "")}`;
  }

  // 3. Dynamic request headers (e.g. behind reverse proxy, ngrok, cloudflare, VPS domain)
  const forwardedProto = req.headers.get("x-forwarded-proto") || "http";
  const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host");

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`.replace(/\/+$/, "");
  }

  // 4. Request URL origin
  try {
    const origin = req.nextUrl?.origin;
    if (origin && origin !== "null" && origin !== "http://null") {
      return origin.replace(/\/+$/, "");
    }
  } catch {}

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

    // Replace the placeholder base URL with the detected or configured server URL
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
