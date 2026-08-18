import { NextRequest, NextResponse } from "next/server";
import { MEMORY_SCANS_STORE } from "@/lib/engine/sessionStore";
import { MOCK_SCENARIOS } from "@/lib/scanner/mockPayloads";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Check in-memory session store
  if (MEMORY_SCANS_STORE.has(id)) {
    return NextResponse.json({ report: MEMORY_SCANS_STORE.get(id) });
  }

  // 2. Check preset test scenario IDs
  const mockScenario = MOCK_SCENARIOS.find((s) => s.id === id);
  if (mockScenario) {
    const { findMatchingSpec } = await import("@/lib/engine/specMatcher");
    const { calculateTrustScore } = await import("@/lib/engine/trustScorer");
    const { generateTruthReport } = await import("@/lib/ai/dualAiClient");

    const matchedSpec = await findMatchingSpec(mockScenario.fingerprint);
    const { trustScore, findings } = calculateTrustScore(mockScenario.fingerprint, matchedSpec, false);
    const aiReport = await generateTruthReport(
      mockScenario.fingerprint,
      matchedSpec,
      findings,
      trustScore,
      mockScenario.askingPricePKR
    );

    const reportObj = {
      _id: mockScenario.id,
      laptopModel: mockScenario.fingerprint.bios.systemModel,
      brand: mockScenario.fingerprint.bios.systemBrand,
      serialNumber: mockScenario.fingerprint.bios.serialNumber,
      scannedAt: mockScenario.fingerprint.scannedAtISO,
      isManualMode: false,
      askingPricePKR: mockScenario.askingPricePKR,
      rawFingerprint: mockScenario.fingerprint,
      matchedSpec,
      findings,
      trustScore,
      aiReport,
      shareLinkId: "truth_" + mockScenario.id,
    };

    MEMORY_SCANS_STORE.set(id, reportObj as any);
    return NextResponse.json({ report: reportObj });
  }

  return NextResponse.json({ error: "Scan report not found in active session" }, { status: 404 });
}
