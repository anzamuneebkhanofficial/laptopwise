import { NextRequest, NextResponse } from "next/server";
import { MEMORY_SCANS_STORE } from "@/lib/engine/sessionStore";

export async function GET(req: NextRequest, { params }: { params: Promise<{ shareLinkId: string }> }) {
  const { shareLinkId } = await params;

  if (MEMORY_SCANS_STORE.has(shareLinkId)) {
    return NextResponse.json({ report: MEMORY_SCANS_STORE.get(shareLinkId) });
  }

  return NextResponse.json({ error: "Public report link expired or not found in active session" }, { status: 404 });
}
