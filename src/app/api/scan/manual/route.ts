import { NextRequest, NextResponse } from "next/server";
import { RawFingerprint, RawStorageDrive, ScanReportDocument } from "@/types";
import { findMatchingSpec } from "@/lib/engine/specMatcher";
import { calculateTrustScore } from "@/lib/engine/trustScorer";
import { generateTruthReport } from "@/lib/ai/dualAiClient";
import { MEMORY_SCANS_STORE } from "@/lib/engine/sessionStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      brand = "Lenovo",
      model = "ThinkPad",
      cpuModel = "Intel Core i5",
      ramGB = 16,
      ramSlots = 2,
      ramSlot1GB = 8,
      ramSlot2GB = 8,
      ramStickLayout = "dual",
      ramSpeedMHz = 2400,
      storageType = "NVMe",
      storageGB = 512,
      hasSecondaryDrive = false,
      secondaryStorageType = "HDD",
      secondaryStorageGB = 1000,
      storageBays = "1x M.2 NVMe Slot + 1x 2.5\" SATA Bay",
      storageHealthPercent = 95,
      batteryHealthPercent = 88,
      chargerWattageW = 65,
      askingPricePKR,
      serialNumber,
      workload,
      currency = "PKR",
      rawBudget,
    } = body;

    // Clean duplicate brand from model string if needed
    let cleanModel = model.trim();
    if (cleanModel.toLowerCase().startsWith(brand.toLowerCase())) {
      const remainder = cleanModel.substring(brand.length).trim();
      if (remainder.length > 0) cleanModel = remainder;
    }

    const budgetDisplay = rawBudget ? `${currency} ${Number(rawBudget).toLocaleString()}` : undefined;
    const numRamSlots = Number(ramSlots) || 2;
    const occupiedCount = ramStickLayout === "dual" ? 2 : 1;
    const emptyCount = Math.max(0, numRamSlots - occupiedCount);

    const calculatedTotalRam = Number(ramGB) || (Number(ramSlot1GB || 0) + Number(ramSlot2GB || 0)) || 16;

    const storageDrives: RawStorageDrive[] = [
      {
        type: storageType.includes("NVMe") ? "NVMe" : storageType.includes("HDD") ? "HDD" : "SATA SSD",
        manufacturer: "OEM Primary",
        model: `${storageGB || 512}GB ${storageType || "NVMe SSD"}`,
        firmware: "OEM_FW",
        capacityGB: Number(storageGB) || 512,
        smart: {
          powerOnHours: 500,
          totalBytesWrittenGB: 2000,
          wearPercent: Number(storageHealthPercent) || 95,
          hasConsistentFields: true,
        },
      },
    ];

    if (hasSecondaryDrive && secondaryStorageGB) {
      storageDrives.push({
        type: String(secondaryStorageType).includes("NVMe") ? "NVMe" : String(secondaryStorageType).includes("HDD") ? "HDD" : "SATA SSD",
        manufacturer: "OEM Secondary",
        model: `${secondaryStorageGB}GB ${secondaryStorageType}`,
        firmware: "OEM_SEC_FW",
        capacityGB: Number(secondaryStorageGB),
        smart: {
          powerOnHours: 500,
          totalBytesWrittenGB: 1000,
          wearPercent: 95,
          hasConsistentFields: true,
        },
      });
    }

    const fingerprint: RawFingerprint = {
      cpu: {
        model: cpuModel || "Intel Core Processor",
        cores: 4,
        threads: 8,
        baseClockGHz: 2.0,
      },
      ram: [
        {
          manufacturer: "OEM",
          partNumber: "RAM_SPECIFIED",
          capacityGB: calculatedTotalRam,
          speedMHz: Number(ramSpeedMHz) || 2400,
          channel: ramStickLayout === "dual" ? "dual" : "single",
        },
      ],
      ramSlotsInfo: {
        totalPhysicalSlots: numRamSlots,
        occupiedSlots: occupiedCount,
        emptySlots: emptyCount,
      },
      storage: storageDrives,
      battery: {
        designCapacityMWh: 50000,
        fullChargeCapacityMWh: Math.round(50000 * ((Number(batteryHealthPercent) || 88) / 100)),
        cycleCount: 120,
        manufacturer: "OEM Battery",
        modelString: "BATTERY_OEM",
      },
      adapter: {
        reportedWattageW: Number(chargerWattageW) || 65,
        idString: "OEM Charger",
      },
      display: {
        resolution: "1920x1080",
        refreshHz: 60,
      },
      bios: {
        version: "OEM BIOS",
        date: "01/01/2021",
        serialNumber: serialNumber || `MANUAL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        oemLock: false,
        systemModel: cleanModel,
        systemBrand: brand,
      },
      windows: {
        edition: "Windows 11",
        activationStatus: "Active",
        buildNumber: "22631",
      },
      userWorkload: workload || "Software & Web Development",
      scannedAtISO: new Date().toISOString(),
    };

    // 1. Resolve dynamic baseline spec
    const matchedSpec = await findMatchingSpec(fingerprint);

    // 2. Score trustworthiness and findings
    const { trustScore, findings } = calculateTrustScore(fingerprint, matchedSpec, true);

    // 3. Perform Live Dynamic Online OEM AI Research
    const aiReport = await generateTruthReport(
      fingerprint,
      matchedSpec,
      findings,
      trustScore,
      askingPricePKR ? Number(askingPricePKR) : undefined,
      true
    );

    const scanId = "scan_manual_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const shareLinkId = "truth_" + Math.random().toString(36).substring(2, 10);

    const scanReportDoc: ScanReportDocument = {
      _id: scanId,
      laptopModel: cleanModel,
      brand: brand,
      serialNumber: fingerprint.bios.serialNumber,
      scannedAt: new Date().toISOString(),
      isManualMode: true,
      userWorkload: workload || "Software & Web Development",
      userBudgetDisplay: budgetDisplay,
      askingPricePKR: askingPricePKR ? Number(askingPricePKR) : undefined,
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
    console.error("Error creating manual scan report:", error);
    return NextResponse.json({ error: error.message || "Failed to process manual scan" }, { status: 500 });
  }
}
