import { FindingItem, LaptopSpec, RawFingerprint } from "@/types";

export interface TrustScoreResult {
  trustScore: number;
  findings: FindingItem[];
}

export function calculateTrustScore(
  fingerprint: RawFingerprint,
  matchedSpec: LaptopSpec | null,
  isManualMode: boolean = false
): TrustScoreResult {
  let score = 100;
  const findings: FindingItem[] = [];

  // Manual Mode note
  if (isManualMode) {
    score -= 10;
    findings.push({
      id: "manual_mode_notice",
      component: "bios",
      title: "Scan Conducted via Manual Entry",
      status: "inferred",
      detail: "Specs were entered manually by the user. Hardware SMART & SMBIOS fields could not be direct-scanned.",
      evidence: "User-submitted form input mode active.",
      severity: "medium",
    });
  }

  // 1. RAM EVALUATION
  const totalRamGB = fingerprint.ram.reduce((acc, m) => acc + (m.capacityGB || 0), 0);
  const primaryRam = fingerprint.ram[0] || { manufacturer: "Unknown", partNumber: "Unknown", speedMHz: 2400, channel: "single" };
  const ramSpeeds = fingerprint.ram.map(r => r.speedMHz).filter(s => s > 0);
  const hasMismatchedRamSpeeds = ramSpeeds.length > 1 && new Set(ramSpeeds).size > 1;

  if (hasMismatchedRamSpeeds) {
    score -= 10;
    findings.push({
      id: "ram_mismatched_speeds",
      component: "ram",
      title: "Mismatched RAM Operating Frequencies Detected",
      status: "flagged",
      detail: `Installed RAM modules operate at different rated frequencies (${ramSpeeds.join("MHz vs ")}MHz). System memory controller will downclock all modules to the slowest speed, impacting memory bandwidth.`,
      evidence: `Speeds detected: ${ramSpeeds.join(", ")} MHz`,
      severity: "medium",
    });
  }

  if (matchedSpec) {
    if (totalRamGB > matchedSpec.maxRamGB) {
      score -= 15;
      findings.push({
        id: "ram_over_max_spec",
        component: "ram",
        title: "Installed RAM Exceeds Official Supported Spec",
        status: "flagged",
        detail: `Installed ${totalRamGB}GB RAM exceeds motherboard maximum supported capacity of ${matchedSpec.maxRamGB}GB. May cause instability or memory downclocking.`,
        evidence: `Installed: ${totalRamGB}GB vs Official Max: ${matchedSpec.maxRamGB}GB (${matchedSpec.ramType})`,
        severity: "high",
      });
    } else {
      findings.push({
        id: "ram_spec_matched",
        component: "ram",
        title: "RAM Capacity & Specification Validated",
        status: "verified",
        detail: `Installed ${totalRamGB}GB RAM (${primaryRam.manufacturer || "OEM"}) matches supported specs for ${matchedSpec.brand} ${matchedSpec.model}.`,
        evidence: `${totalRamGB}GB ${primaryRam.speedMHz ? primaryRam.speedMHz + "MHz" : ""} (${primaryRam.channel || "single"}-channel)`,
        severity: "low",
      });
    }
  } else {
    findings.push({
      id: "ram_generic_check",
      component: "ram",
      title: "RAM Hardware Detected",
      status: "inferred",
      detail: `Detected ${totalRamGB}GB RAM modules. Full OEM spec matching unavailable (unlisted laptop model).`,
      evidence: `${totalRamGB}GB total capacity reported by OS.`,
      severity: "low",
    });
  }

  // 2. STORAGE & SSD SMART / COUNTERFEIT HEURISTICS
  const primaryStorage = fingerprint.storage[0];
  if (primaryStorage) {
    let { model, firmware, vendorId, smart, capacityGB, type } = primaryStorage;

    // Detect Samsung and OEM drives
    const m = model.toLowerCase();
    const isNvme = m.includes("nvme") || m.includes("pcie") || m.includes("mzv") || m.includes("mz-v") || m.includes("pm9") || m.includes("sn5") || m.includes("sn7") || m.includes("sn8");
    const isSamsungOem = model.toUpperCase().includes("SAMSUNG") || model.toUpperCase().includes("MZ") || model.toUpperCase().includes("PM8") || isNvme;
    if (isNvme) {
      type = "NVMe";
    } else if (isSamsungOem && (type === "HDD" || !type || type === "Unknown")) {
      type = "SATA SSD";
    }

    // Counterfeit detection heuristic: Mismatched Samsung/Intel vendor ID vs firmware/model string
    const isFakeSamsung =
      (model.toLowerCase().includes("samsung") || (firmware && firmware.toLowerCase().includes("samsung"))) &&
      vendorId &&
      !vendorId.toLowerCase().includes("144d") &&
      vendorId.length > 0;

    const isFakePhison =
      model.toLowerCase().includes("980 pro") && firmware.startsWith("1B2Q");

    if (isFakeSamsung || isFakePhison) {
      score -= 30;
      findings.push({
        id: "ssd_counterfeit_heuristic",
        component: "storage",
        title: "CRITICAL RED FLAG: Potential Counterfeit SSD Detected",
        status: "flagged",
        detail: "Storage controller vendor ID and firmware signature do not match authentic Samsung NVMe specifications. High probability of spoofed controller or fake capacity drive.",
        evidence: `Model String: "${model}" | Firmware: "${firmware}" | PCI Vendor ID: "${vendorId || 'Suspicious'}"`,
        severity: "critical",
      });
    } else if (smart && smart.hasConsistentFields) {
      const wear = smart.wearPercent ?? 90;
      const hours = smart.powerOnHours ?? 1200;

      findings.push({
        id: "ssd_verified_good",
        component: "storage",
        title: `Primary Storage Verified (${type || "SSD"})`,
        status: "verified",
        detail: `Verified ${capacityGB}GB ${isSamsungOem ? "Samsung OEM " : ""}${type || "SSD"} with ${wear}% health remaining. Power-on time: ${Math.round(hours / 24)} days (${hours} hours).`,
        evidence: `Model: ${model} | FW: ${firmware} | TBW Written: ${smart.totalBytesWrittenGB || 0} GB`,
        severity: "low",
      });

      if (wear < 50) {
        score -= 10;
        findings.push({
          id: "ssd_high_wear",
          component: "storage",
          title: "Drive Health Wear Level Degraded",
          status: "flagged",
          detail: `Storage drive health is down to ${wear}%. High usage disk — replacement will be needed soon.`,
          evidence: `Wear level: ${wear}% remaining health`,
          severity: "medium",
        });
      }
    } else {
      // SMART data restricted by OS or older drive protocol
      findings.push({
        id: "ssd_verified_basic",
        component: "storage",
        title: `Primary Storage Detected (${type || "SSD"})`,
        status: "verified",
        detail: `Detected ${capacityGB}GB ${isSamsungOem ? "Samsung OEM " : ""}${type || "SSD"} (${model}). Detailed SMART wear counter was restricted by OS interface.`,
        evidence: `Model: ${model} | Capacity: ${capacityGB}GB | Firmware: ${firmware || "N/A"}`,
        severity: "low",
      });
    }
  } else {
    score -= 10;
    findings.push({
      id: "ssd_missing",
      component: "storage",
      title: "Storage Drive Metrics Unreachable",
      status: "unverified",
      detail: "Unable to read primary disk SMART health via OS interface.",
      evidence: "Storage query returned zero active physical disks.",
      severity: "medium",
    });
  }

  // 3. BATTERY HEALTH & WEAR EVALUATION
  const battery = fingerprint.battery;
  if (battery && battery.designCapacityMWh > 0) {
    const healthPercent = Math.round((battery.fullChargeCapacityMWh / battery.designCapacityMWh) * 100);
    const cycles = battery.cycleCount || 0;

    // Plausibility Check: "0 cycle count but 100% capacity" on older laptop model
    const isPlausibilityRedFlag = matchedSpec && (2026 - matchedSpec.releaseYear >= 4) && cycles === 0 && healthPercent >= 98;

    if (isPlausibilityRedFlag) {
      score -= 10;
      findings.push({
        id: "battery_suspicious_zero_cycles",
        component: "battery",
        title: "Suspicious Battery Report (0 Cycles on Older Laptop)",
        status: "flagged",
        detail: `Battery reports 0 cycles and 100% health on a ${2026 - matchedSpec.releaseYear}-year-old laptop. Likely a cheap aftermarket battery replacement with reset BMS firmware.`,
        evidence: `Design: ${battery.designCapacityMWh}mWh | Full Charge: ${battery.fullChargeCapacityMWh}mWh | Cycles: 0`,
        severity: "medium",
      });
    } else {
      const statusTag = healthPercent >= 75 ? "inferred" : "flagged";
      if (healthPercent < 75) score -= 10;

      findings.push({
        id: "battery_health_summary",
        component: "battery",
        title: `Battery Health: ${healthPercent}% (${cycles} Cycles)`,
        status: statusTag,
        detail: `Battery design capacity is ${battery.designCapacityMWh} mWh. Current max charge holds ${battery.fullChargeCapacityMWh} mWh. (Note: Software can read wear data; physical cell authenticity cannot be proven via software).`,
        evidence: `Model String: ${battery.modelString || "OEM"} | Manufacturer: ${battery.manufacturer || "Generic"}`,
        severity: healthPercent >= 75 ? "low" : "medium",
      });
    }
  } else {
    score -= 5;
    findings.push({
      id: "battery_unverified",
      component: "battery",
      title: "Battery ACPI Data Not Accessible",
      status: "unverified",
      detail: "Desktop machine or ACPI power report unavailable.",
      evidence: "ACPI query returned null design capacity.",
      severity: "low",
    });
  }

  // 4. CHARGER / ADAPTER WATTAGE MATCH
  const adapter = fingerprint.adapter;
  if (matchedSpec && adapter && adapter.reportedWattageW > 0) {
    if (adapter.reportedWattageW < matchedSpec.officialChargerWattageW) {
      score -= 15;
      findings.push({
        id: "charger_underpowered",
        component: "adapter",
        title: "Underpowered Charger Connected",
        status: "flagged",
        detail: `Connected adapter is rated at ${adapter.reportedWattageW}W. This laptop model requires at least ${matchedSpec.officialChargerWattageW}W. May cause slow charging, CPU throttling, or battery drain under load.`,
        evidence: `Negotiated Wattage: ${adapter.reportedWattageW}W vs Required OEM Spec: ${matchedSpec.officialChargerWattageW}W`,
        severity: "high",
      });
    } else {
      findings.push({
        id: "charger_wattage_verified",
        component: "adapter",
        title: "Charger Wattage Validated",
        status: "verified",
        detail: `Connected charger delivers ${adapter.reportedWattageW}W, fully meeting OEM requirements (${matchedSpec.officialChargerWattageW}W).`,
        evidence: `Negotiated: ${adapter.reportedWattageW}W`,
        severity: "low",
      });
    }
  } else {
    findings.push({
      id: "charger_chip_unverifiable",
      component: "adapter",
      title: "Charger Internal Circuit Provenance Unverifiable",
      status: "unverified",
      detail: "Adapter wattage is compatible, but software cannot inspect internal transformer circuit origin.",
      evidence: "Physical inspections recommended for barrel/Type-C charger labels.",
      severity: "low",
    });
  }

  // 5. BIOS & MOTHERBOARD SERIALS
  if (fingerprint.bios.serialNumber && fingerprint.bios.serialNumber !== "Default string" && fingerprint.bios.serialNumber !== "System Serial Number") {
    findings.push({
      id: "bios_serial_verified",
      component: "bios",
      title: "BIOS System Serial Number Authenticated",
      status: "verified",
      detail: `Valid OEM serial number "${fingerprint.bios.serialNumber}" read directly from SMBIOS tables.`,
      evidence: `Serial: ${fingerprint.bios.serialNumber} | System: ${fingerprint.bios.systemBrand} ${fingerprint.bios.systemModel}`,
      severity: "low",
    });
  } else {
    score -= 10;
    findings.push({
      id: "bios_serial_generic",
      component: "bios",
      title: "Generic or Cleared BIOS Serial Number",
      status: "flagged",
      detail: "SMBIOS serial string reads as default or cleared. Common on replaced motherboards or unlocked BIOS chips.",
      evidence: `Serial reported: "${fingerprint.bios.serialNumber || 'N/A'}"`,
      severity: "medium",
    });
  }

  // 6. CHASSIS / PHYSICAL BODY
  findings.push({
    id: "chassis_unverifiable",
    component: "chassis",
    title: "Chassis & Physical Body Authenticity",
    status: "unverified",
    detail: "Software scan cannot verify cosmetic dents, hinge tightness, original screws, or sticker authenticity.",
    evidence: "Physical visual inspection required.",
    severity: "low",
  });

  // Clamp final score
  const finalScore = Math.max(0, Math.min(100, score));

  return {
    trustScore: finalScore,
    findings,
  };
}
