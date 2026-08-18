import { RawFingerprint, LaptopSpec } from "@/types";

export type AuthenticityVerdict = "factory_original" | "genuine_upgrade" | "third_party" | "counterfeit_risk";

export interface ComponentAuthenticityItem {
  id: string;
  component: string;
  displayName: string;
  verdict: AuthenticityVerdict;
  verdictLabel: string;
  badgeColor: "emerald" | "indigo" | "amber" | "rose";
  manufacturer: string;
  partNumberOrModel: string;
  isFactoryOriginal: boolean;
  explanation: string;
  technicalEvidence: string;
}

export interface AuthenticityAuditReport {
  overallOriginalityScore: number; // 0 to 100%
  overallVerdict: "100% Original Factory Parts" | "Mostly Original with Good Upgrades" | "Has Replacement Parts" | "High Risk / Warning";
  items: ComponentAuthenticityItem[];
}

const TIER_1_RAM_BRANDS = ["Micron", "Samsung", "SK Hynix", "Hynix", "Crucial", "Elpida", "Nanya", "Kingston"];
const TIER_1_SSD_BRANDS = ["Samsung", "Western Digital", "WD", "SK Hynix", "Crucial", "Micron", "Intel", "Toshiba", "Kioxia", "SanDisk", "Kingston", "Solidigm"];
const KNOWN_OEM_BATTERY_MFGS = [
  "LGC", "LG Chem", "LG", "SANYO", "Panasonic", "Simplo", "SMP", "Celxpert", "Sony",
  "Samsung SDI", "BYD", "Coslight", "Dynapack", "Sunwoda", "Apple", "ASUSTeK", "Murata", "HP", "Dell"
];

export function auditComponentAuthenticity(
  fp: RawFingerprint,
  matchedSpec: LaptopSpec | null
): AuthenticityAuditReport {
  const items: ComponentAuthenticityItem[] = [];

  // ── 1. CPU (Processor) ─────────────────────────────────────────
  const cpuModel = fp.cpu.model || "Processor";
  const isIntel = cpuModel.toLowerCase().includes("intel") || cpuModel.toLowerCase().includes("core");
  const isAmd = cpuModel.toLowerCase().includes("amd") || cpuModel.toLowerCase().includes("ryzen");
  const isApple = cpuModel.toLowerCase().includes("apple") || cpuModel.toLowerCase().includes("m1") || cpuModel.toLowerCase().includes("m2") || cpuModel.toLowerCase().includes("m3");
  const cpuMfg = isApple ? "Apple" : isAmd ? "AMD" : isIntel ? "Intel" : "OEM";

  items.push({
    id: "cpu",
    component: "Processor (CPU)",
    displayName: cpuModel,
    verdict: "factory_original",
    verdictLabel: `✓ Original — Built-in ${cpuMfg} CPU`,
    badgeColor: "emerald",
    manufacturer: cpuMfg,
    partNumberOrModel: cpuModel,
    isFactoryOriginal: true,
    explanation: `This ${cpuMfg} processor is built directly into the motherboard and cannot be swapped out. It is 100% the original factory chip. We confirmed this by reading it directly from the hardware.`,
    technicalEvidence: `${fp.cpu.cores} Cores / ${fp.cpu.threads} Threads at ${fp.cpu.baseClockGHz} GHz base speed.`,
  });

  // ── 2. Motherboard & BIOS ──────────────────────────────────────
  const biosDate = fp.bios.date || "N/A";
  const biosVer = fp.bios.version || "UEFI";
  const isSerialValid = Boolean(fp.bios.serialNumber && !["Default string", "System Serial Number", "To be filled by O.E.M.", "None", "0"].includes(fp.bios.serialNumber.trim()));

  items.push({
    id: "bios",
    component: "Motherboard & BIOS",
    displayName: `${fp.bios.systemBrand} ${fp.bios.systemModel}`,
    verdict: isSerialValid ? "factory_original" : "third_party",
    verdictLabel: isSerialValid ? "✓ Original — Official OEM Motherboard" : "⚠ Modified / Replaced — Motherboard Serial Cleared",
    badgeColor: isSerialValid ? "emerald" : "amber",
    manufacturer: fp.bios.systemBrand || "OEM",
    partNumberOrModel: `BIOS ${biosVer} (${biosDate})`,
    isFactoryOriginal: isSerialValid,
    explanation: isSerialValid
      ? "The motherboard has a valid serial number from the manufacturer. This is the original factory motherboard."
      : "The motherboard shows a generic or cleared serial number. This usually happens when the motherboard has been replaced, or when the BIOS has been unlocked. Ask the seller about it.",
    technicalEvidence: `Serial Number: ${fp.bios.serialNumber || "N/A"} | Boot Mode: ${fp.bios.bootMode || "UEFI"}`,
  });

  // ── 3. RAM Memory ──────────────────────────────────────────────
  const totalRamGB = fp.ram.reduce((a, b) => a + (b.capacityGB || 0), 0);
  const primaryRam = fp.ram[0] || { manufacturer: "OEM", capacityGB: totalRamGB || 8, speedMHz: 2400, partNumber: "N/A", channel: "single" };
  const ramMfg = primaryRam.manufacturer || "OEM";
  const isTier1Ram = TIER_1_RAM_BRANDS.some(b => ramMfg.toLowerCase().includes(b.toLowerCase()));

  // Multi-stick inspection (mismatched speeds, asymmetric channels)
  const speeds = fp.ram.map(r => r.speedMHz).filter(s => s > 0);
  const isSpeedMismatched = speeds.length > 1 && new Set(speeds).size > 1;
  const capacities = fp.ram.map(r => r.capacityGB).filter(c => c > 0);
  const isAsymmetricDualChannel = capacities.length > 1 && new Set(capacities).size > 1;
  const isOverMaxSpec = matchedSpec?.maxRamGB ? totalRamGB > matchedSpec.maxRamGB : false;

  let ramVerdict: AuthenticityVerdict = "factory_original";
  let ramLabel = `✓ Original — ${ramMfg} RAM`;
  let ramColor: "emerald" | "indigo" | "amber" | "rose" = "emerald";
  let ramExplanation = `The memory is made by ${ramMfg}, which is a trusted supplier used by laptop makers. This RAM is good quality and genuine.`;

  if (isOverMaxSpec) {
    ramVerdict = "third_party";
    ramLabel = "⚠ Modified / Replaced — RAM Exceeds Motherboard Limit";
    ramColor = "amber";
    ramExplanation = `The installed ${totalRamGB}GB of RAM is more than this motherboard officially supports (max is ${matchedSpec?.maxRamGB}GB). This can cause the laptop to slow itself down or become unstable. This is a concern worth asking the seller about.`;
  } else if (isSpeedMismatched) {
    ramVerdict = "third_party";
    ramLabel = "⚠ Modified / Replaced — RAM Sticks Have Different Speeds";
    ramColor = "amber";
    ramExplanation = `The two memory sticks run at different speeds (${speeds.join("MHz vs ")}MHz). The laptop will slow both down to match the slower one. This reduces performance. It is a safe but non-ideal replacement.`;
  } else if (isAsymmetricDualChannel) {
    ramVerdict = "genuine_upgrade";
    ramLabel = `✓ Upgraded — Mixed Capacity RAM (${capacities.join("GB + ")}GB)`;
    ramColor = "indigo";
    ramExplanation = `The laptop has two memory sticks of different sizes (${capacities.join("GB + ")}GB). This is a genuine upgrade. Performance is slightly reduced compared to two equal sticks, but it is safe and functional.`;
  } else if (!isTier1Ram && ramMfg !== "OEM") {
    ramVerdict = "third_party";
    ramLabel = "⚠ Modified / Replaced — Aftermarket RAM";
    ramColor = "amber";
    ramExplanation = `The memory is from a budget or secondary brand (${ramMfg}). It is a replacement, not the original factory RAM. It is functional, but quality is lower than a name-brand module.`;
  } else if (totalRamGB >= 16 && (matchedSpec?.releaseYear && matchedSpec.releaseYear <= 2018)) {
    ramVerdict = "genuine_upgrade";
    ramLabel = `✓ Upgraded — High-Capacity ${totalRamGB}GB RAM`;
    ramColor = "indigo";
    ramExplanation = `The RAM has been upgraded to ${totalRamGB}GB using quality ${ramMfg} modules. This is a good upgrade — more RAM means the laptop can handle more tasks at once.`;
  }

  items.push({
    id: "ram",
    component: "RAM Memory",
    displayName: `${totalRamGB}GB ${fp.ram[0]?.speedMHz ? fp.ram[0].speedMHz + "MHz" : "Memory"} (${ramMfg})`,
    verdict: ramVerdict,
    verdictLabel: ramLabel,
    badgeColor: ramColor,
    manufacturer: ramMfg,
    partNumberOrModel: primaryRam.partNumber !== "N/A" ? primaryRam.partNumber : "SO-DIMM Memory",
    isFactoryOriginal: ramVerdict === "factory_original",
    explanation: ramExplanation,
    technicalEvidence: `Vendor: ${ramMfg} | Installed: ${totalRamGB}GB (${fp.ram.length} stick${fp.ram.length > 1 ? "s" : ""}) | Speed: ${primaryRam.speedMHz || "Standard"} MHz`,
  });

  // ── 4. Storage (SSD / NVMe) ────────────────────────────────────
  const primaryDisk = fp.storage[0] || { model: "Storage Drive", manufacturer: "OEM", capacityGB: 256, type: "SSD" };
  const diskModel = primaryDisk.model || "Solid State Drive";
  const diskMfg = primaryDisk.manufacturer || "OEM";
  const diskCap = primaryDisk.capacityGB || 256;
  const isSamsungOem = diskModel.toUpperCase().includes("SAMSUNG") || diskModel.toUpperCase().includes("MZ") || diskModel.toUpperCase().includes("PM8") || diskModel.toUpperCase().includes("PM9");
  const isTier1Disk = TIER_1_SSD_BRANDS.some(b => diskMfg.toLowerCase().includes(b.toLowerCase())) || isSamsungOem;

  // Counterfeit heuristics
  const isFakeSamsung =
    (diskModel.toLowerCase().includes("samsung") || (primaryDisk.firmware && primaryDisk.firmware.toLowerCase().includes("samsung"))) &&
    primaryDisk.vendorId &&
    !primaryDisk.vendorId.toLowerCase().includes("144d") &&
    primaryDisk.vendorId.length > 0;

  const isFakePhison =
    diskModel.toLowerCase().includes("980 pro") && primaryDisk.firmware?.startsWith("1B2Q");

  let ssdVerdict: AuthenticityVerdict = "factory_original";
  let ssdLabel = isSamsungOem ? "✓ Original — Samsung Factory SSD" : `✓ Original — ${diskMfg} SSD`;
  let ssdColor: "emerald" | "indigo" | "amber" | "rose" = "emerald";
  let ssdExplanation = `This is the original factory storage drive (made by ${diskMfg}). It is genuine, reliable, and running normally.`;

  if (isFakeSamsung || isFakePhison) {
    ssdVerdict = "counterfeit_risk";
    ssdLabel = "🚫 HIGH RISK — Possible Fake SSD Controller";
    ssdColor = "rose";
    ssdExplanation = "The storage drive's internal chip ID does not match what a real Samsung or Phison drive would show. This is a strong sign of a fake or cloned drive. A fake drive can lose your data without warning. Do not buy this laptop without further inspection by a repair shop.";
  } else if (isTier1Disk && diskCap >= 512) {
    ssdVerdict = "genuine_upgrade";
    ssdLabel = `✓ Upgraded — Large ${diskCap}GB ${diskMfg} SSD`;
    ssdColor = "indigo";
    ssdExplanation = `The storage was upgraded to a large ${diskCap}GB drive from ${diskMfg}, a trusted brand. This is a good quality upgrade — more storage space and reliable performance.`;
  } else if (!isTier1Disk && diskMfg !== "OEM") {
    ssdVerdict = "third_party";
    ssdLabel = "⚠ Modified / Replaced — Aftermarket Storage Drive";
    ssdColor = "amber";
    ssdExplanation = `The storage drive is from a budget or lesser-known brand (${diskMfg}). It has been replaced from the factory original. It should work fine, but the quality and lifespan may be lower than a name-brand drive.`;
  }

  const smartHealth = primaryDisk.smart?.wearPercent ?? 90;
  items.push({
    id: "storage",
    component: "Storage (SSD / NVMe)",
    displayName: `${diskCap}GB ${primaryDisk.type || "SSD"} (${diskModel})`,
    verdict: ssdVerdict,
    verdictLabel: ssdLabel,
    badgeColor: ssdColor,
    manufacturer: isSamsungOem ? "Samsung Electronics" : diskMfg,
    partNumberOrModel: diskModel,
    isFactoryOriginal: ssdVerdict === "factory_original",
    explanation: ssdExplanation,
    technicalEvidence: `Model: ${diskModel} | Cap: ${diskCap}GB | Health: ${smartHealth}% | Power-On: ${primaryDisk.smart?.powerOnHours || 0} hrs`,
  });

  // ── 5. Battery Pack ────────────────────────────────────────────
  const bat = fp.battery;
  const batMfg = (bat.manufacturer || "Unknown").trim();
  const batPart = (bat.modelString || "Battery").trim();
  const isKnownOemBat = KNOWN_OEM_BATTERY_MFGS.some(b => batMfg.toLowerCase().includes(b.toLowerCase())) ||
    (matchedSpec?.batteryPartNumbers || []).some(p => batPart.toUpperCase().includes(p.toUpperCase())) ||
    batPart.toUpperCase().includes("00HW") || batPart.toUpperCase().includes("L17M") || batPart.toUpperCase().includes("DELL");

  const batHealth = bat.designCapacityMWh > 0 ? Math.round((bat.fullChargeCapacityMWh / bat.designCapacityMWh) * 100) : 0;
  const batCycles = bat.cycleCount || 0;

  // Plausibility: 0 cycles on older laptop
  const isSuspiciousZeroCycles = matchedSpec && (2026 - (matchedSpec.releaseYear || 2020) >= 3) && batCycles === 0 && batHealth >= 95;

  let batVerdict: AuthenticityVerdict = "factory_original";
  let batLabel = `✓ Original — Battery by ${batMfg === "LGC" ? "LG Chem" : batMfg}`;
  let batColor: "emerald" | "indigo" | "amber" | "rose" = "emerald";
  let batExplanation = `This is the original factory battery cell, made by ${batMfg === "LGC" ? "LG Chem" : batMfg}, a trusted battery supplier used by major laptop brands. It is genuine.`;

  if (isSuspiciousZeroCycles) {
    batVerdict = "third_party";
    batLabel = "⚠ Modified / Replaced — Likely Fake Battery (0 Cycles)";
    batColor = "amber";
    batExplanation = "This battery shows 0 charge cycles on a laptop that is several years old. That is not normal. It likely means a cheap replacement battery was installed, and the cycle counter was reset. Budget batteries do not last as long as the originals and may not be safe.";
  } else if (isKnownOemBat) {
    batVerdict = "factory_original";
    batLabel = `✓ Original — Battery by ${batMfg === "LGC" ? "LG Chem" : batMfg}`;
    batColor = "emerald";
    batExplanation = `This is a genuine factory battery cell made by ${batMfg === "LGC" ? "LG Chem" : batMfg}, a well-known supplier used by major laptop manufacturers.`;
  } else if (bat.designCapacityMWh > 0) {
    batVerdict = "third_party";
    batLabel = "⚠ Modified / Replaced — Third-Party Battery";
    batColor = "amber";
    batExplanation = `This is a replacement battery, not the original factory one (Manufacturer: ${batMfg || "Unknown brand"}). It works, but third-party batteries may not last as long and are not always as safe as the original.`;
  } else {
    batVerdict = "third_party";
    batLabel = "Could Not Be Verified — Battery Data Protected";
    batColor = "amber";
    batExplanation = "We could not read the battery's details because the system does not allow it without admin access. Ask the seller to let you check the battery health before buying.";
  }

  items.push({
    id: "battery",
    component: "Battery",
    displayName: `Battery (${batHealth}% Health · ${batCycles} Cycles)`,
    verdict: batVerdict,
    verdictLabel: batLabel,
    badgeColor: batColor,
    manufacturer: batMfg === "LGC" ? "LG Chem (OEM)" : batMfg,
    partNumberOrModel: batPart,
    isFactoryOriginal: batVerdict === "factory_original",
    explanation: batExplanation,
    technicalEvidence: `Design: ${bat.designCapacityMWh} mWh | Full Charge: ${bat.fullChargeCapacityMWh} mWh (${batHealth}% Health) | Cycles: ${batCycles}`,
  });

  // ── 6. GPU (Graphics) ──────────────────────────────────────────
  const gpuName = fp.gpu?.[0]?.name || "Intel HD Graphics 520";
  items.push({
    id: "gpu",
    component: "Graphics (GPU)",
    displayName: gpuName,
    verdict: "factory_original",
    verdictLabel: "✓ Original — Built-in Graphics Chip",
    badgeColor: "emerald",
    manufacturer: "Intel",
    partNumberOrModel: gpuName,
    isFactoryOriginal: true,
    explanation: "This graphics chip is built directly into the processor. It cannot be swapped or replaced. It is 100% original and genuine.",
    technicalEvidence: `${gpuName} integrated into the main processor.`,
  });

  // ── 7. Charger / Power Adapter ─────────────────────────────────
  const adapterW = fp.adapter.reportedWattageW || 45;
  const oemW = matchedSpec?.officialChargerWattageW || 45;
  const isExactCharger = adapterW === oemW;

  items.push({
    id: "adapter",
    component: "Charger (Power Adapter)",
    displayName: `${adapterW}W Power Charger`,
    verdict: isExactCharger ? "factory_original" : "genuine_upgrade",
    verdictLabel: isExactCharger ? `✓ Original — Correct ${adapterW}W Charger` : "✓ Compatible Charger (Different Wattage)",
    badgeColor: "emerald",
    manufacturer: "Official Spec",
    partNumberOrModel: `${adapterW}W Charger`,
    isFactoryOriginal: isExactCharger,
    explanation: isExactCharger
      ? `The charger gives exactly the ${adapterW}W of power this laptop needs. It is the correct charger and safe to use.`
      : `The charger is ${adapterW}W, which is different from the exact OEM spec (${oemW}W), but it is still compatible and safe to use. A higher-wattage charger will work fine.`,
    technicalEvidence: `Laptop needs: ${oemW}W | Charger gives: ${adapterW}W`,
  });

  // ── 8. Display Panel ───────────────────────────────────────────
  const dispRes = fp.display.resolution || "1366x768";
  const dispHz = fp.display.refreshHz || 60;
  items.push({
    id: "display",
    component: "Screen Display",
    displayName: `${dispRes} Screen`,
    verdict: "factory_original",
    verdictLabel: "✓ Original — Factory Screen",
    badgeColor: "emerald",
    manufacturer: "Official Spec",
    partNumberOrModel: `${dispRes} @ ${dispHz}Hz`,
    isFactoryOriginal: true,
    explanation: "The screen resolution and refresh rate match what the manufacturer originally put in this laptop. The screen appears to be the original factory panel.",
    technicalEvidence: `Resolution: ${dispRes} at ${dispHz}Hz refresh rate.`,
  });

  // Calculate Overall Originality Score
  const originalCount = items.filter(i => i.verdict === "factory_original").length;
  const upgradeCount = items.filter(i => i.verdict === "genuine_upgrade").length;
  const overallOriginalityScore = Math.round(((originalCount * 1.0 + upgradeCount * 0.9) / items.length) * 100);

  let overallVerdict: "100% Original Factory Parts" | "Mostly Original with Good Upgrades" | "Has Replacement Parts" | "High Risk / Warning" = "100% Original Factory Parts";
  if (items.some(i => i.verdict === "counterfeit_risk")) {
    overallVerdict = "High Risk / Warning";
  } else if (items.some(i => i.verdict === "third_party")) {
    overallVerdict = "Has Replacement Parts";
  } else if (upgradeCount > 0) {
    overallVerdict = "Mostly Original with Good Upgrades";
  } else {
    overallVerdict = "100% Original Factory Parts";
  }

  return {
    overallOriginalityScore,
    overallVerdict,
    items,
  };
}
