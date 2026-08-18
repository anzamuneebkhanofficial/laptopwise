import { NextRequest, NextResponse } from "next/server";
import { RawFingerprint, ScanReportDocument } from "@/types";
import { findMatchingSpec } from "@/lib/engine/specMatcher";
import { calculateTrustScore } from "@/lib/engine/trustScorer";
import { generateTruthReport } from "@/lib/ai/dualAiClient";
import { MEMORY_SCANS_STORE } from "@/lib/engine/sessionStore";

export { MEMORY_SCANS_STORE };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fingerprint, askingPricePKR } = body as {
      fingerprint: RawFingerprint;
      askingPricePKR?: number;
    };

    if (!fingerprint || !fingerprint.bios) {
      return NextResponse.json({ error: "Invalid hardware fingerprint payload provided" }, { status: 400 });
    }

    const laptopBrand = fingerprint.bios.systemBrand || "OEM";
    const systemName = ((fingerprint.bios as any).systemName || "").trim();
    const rawModel = (fingerprint.bios.systemModel || "Laptop").trim();
    let laptopModel = rawModel;
    if (systemName && systemName !== "Universal Model" && systemName !== "Unknown" && !rawModel.toLowerCase().includes(systemName.toLowerCase())) {
      laptopModel = `${systemName} (${rawModel})`;
    }
    fingerprint.bios.systemModel = laptopModel;
    // Normalize storage drive types (ensure NVMe drives are accurately detected)
    if (fingerprint.storage && Array.isArray(fingerprint.storage)) {
      fingerprint.storage.forEach((disk) => {
        const m = (disk.model || "").toLowerCase();
        const v = (disk.vendorId || "").toLowerCase();
        const isNvme = m.includes("nvme") || m.includes("pcie") || m.includes("pci-e") ||
          m.includes("mzv") || m.includes("mz-v") || m.includes("pm9") ||
          m.includes("sn5") || m.includes("sn7") || m.includes("sn8") || m.includes("pc sn") ||
          m.includes("om8") || m.includes("kxg") || m.includes("kbg") || m.includes("ssdpe") ||
          m.includes("kingston nv") || m.includes("skhynix_hfm") || v.includes("144d") || v.includes("nvme");
        if (isNvme) {
          disk.type = "NVMe";
        }
      });
    }

    const serialNumber = fingerprint.bios.serialNumber || `SN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // 1. Dynamic OEM baseline matching
    const matchedSpec = await findMatchingSpec(fingerprint);

    // 2. Calculate Trust Score & itemize findings
    const { trustScore, findings } = calculateTrustScore(fingerprint, matchedSpec, false);

    // 3. Dynamic Live Online Research & AI Verification
    const aiReport = await generateTruthReport(
      fingerprint,
      matchedSpec,
      findings,
      trustScore,
      askingPricePKR
    );

    const scanId = "scan_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const shareLinkId = "truth_" + Math.random().toString(36).substring(2, 10);

    const scanReportDoc: ScanReportDocument = {
      _id: scanId,
      laptopModel,
      brand: laptopBrand,
      serialNumber,
      scannedAt: new Date().toISOString(),
      isManualMode: false,
      askingPricePKR,
      rawFingerprint: fingerprint,
      matchedSpec,
      findings,
      trustScore,
      aiReport,
      shareLinkId,
    };

    // Store in session memory
    MEMORY_SCANS_STORE.set(scanId, scanReportDoc);
    MEMORY_SCANS_STORE.set(shareLinkId, scanReportDoc);

    return NextResponse.json({
      success: true,
      scanId,
      shareLinkId,
      report: scanReportDoc,
    });
  } catch (error: any) {
    console.error("Error processing scan upload route:", error);
    return NextResponse.json({ error: error.message || "Failed to process scan upload" }, { status: 500 });
  }
}
