import { NextRequest, NextResponse } from "next/server";
import { MEMORY_SCANS_STORE } from "@/lib/engine/sessionStore";
import { MOCK_SCENARIOS } from "@/lib/scanner/mockPayloads";
import { ScanReportDocument } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { scanIds } = (await req.json()) as { scanIds: string[] };

    if (!Array.isArray(scanIds) || scanIds.length === 0) {
      return NextResponse.json({ error: "scanIds array required" }, { status: 400 });
    }

    const reports: ScanReportDocument[] = [];

    for (const id of scanIds) {
      if (MEMORY_SCANS_STORE.has(id)) {
        reports.push(MEMORY_SCANS_STORE.get(id)!);
      } else {
        const mock = MOCK_SCENARIOS.find((s) => s.id === id);
        if (mock) {
          const { findMatchingSpec } = await import("@/lib/engine/specMatcher");
          const { calculateTrustScore } = await import("@/lib/engine/trustScorer");
          const { generateTruthReport } = await import("@/lib/ai/dualAiClient");

          const matchedSpec = await findMatchingSpec(mock.fingerprint);
          const { trustScore, findings } = calculateTrustScore(mock.fingerprint, matchedSpec, false);
          const aiReport = await generateTruthReport(
            mock.fingerprint,
            matchedSpec,
            findings,
            trustScore,
            mock.askingPricePKR
          );

          reports.push({
            _id: mock.id,
            laptopModel: mock.fingerprint.bios.systemModel,
            brand: mock.fingerprint.bios.systemBrand,
            serialNumber: mock.fingerprint.bios.serialNumber,
            scannedAt: mock.fingerprint.scannedAtISO,
            isManualMode: false,
            askingPricePKR: mock.askingPricePKR,
            rawFingerprint: mock.fingerprint,
            matchedSpec,
            findings,
            trustScore,
            aiReport,
            shareLinkId: "truth_" + mock.id,
          });
        }
      }
    }

    return NextResponse.json({ success: true, reports });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to compare scans" }, { status: 500 });
  }
}
