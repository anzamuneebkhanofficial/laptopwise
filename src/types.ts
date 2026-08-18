export type ConfidenceStatus = "verified" | "inferred" | "flagged" | "unverified";
export type ComponentType = "ram" | "storage" | "battery" | "adapter" | "bios" | "display" | "windows" | "chassis" | "gpu";
export type UseCaseTag = "Gaming" | "Software Development" | "Office & Browsing" | "Graphic Design & Video" | "Avoid / Caution";

export interface FindingItem {
  id: string;
  component: ComponentType;
  title: string;
  status: ConfidenceStatus;
  detail: string;
  evidence: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface RawRamModule {
  manufacturer: string;
  partNumber: string;
  capacityGB: number;
  speedMHz: number;
  channel: "single" | "dual" | "unknown";
  formFactor?: string;
  slotLabel?: string;
}

export interface RamSlotsInfo {
  totalPhysicalSlots: number;
  occupiedSlots: number;
  emptySlots: number;
}

export interface RawStorageDrive {
  type: "NVMe" | "SATA SSD" | "HDD" | "Unknown";
  manufacturer: string;
  model: string;
  firmware: string;
  capacityGB: number;
  vendorId?: string;
  smart: {
    powerOnHours: number;
    totalBytesWrittenGB: number;
    wearPercent: number;
    reallocatedSectors?: number;
    hasConsistentFields: boolean;
  };
}

export interface RawBatteryData {
  designCapacityMWh: number;
  fullChargeCapacityMWh: number;
  cycleCount: number;
  manufacturer: string;
  modelString: string;
  hasBattery?: boolean;
}

export interface RawAdapterData {
  reportedWattageW: number;
  idString: string;
}

export interface RawDisplayData {
  resolution: string;
  refreshHz: number;
  panelString?: string;
}

export interface RawBiosData {
  version: string;
  date: string;
  serialNumber: string;
  oemLock: boolean;
  systemModel: string;
  systemBrand: string;
  uuid?: string;
  bootMode?: string;
}

export interface RawWindowsData {
  edition: string;
  activationStatus: string;
  buildNumber: string;
  version?: string;
  lastBootTime?: string;
}

export interface RawGpuData {
  name: string;
  driverVersion?: string;
  adapterRAMMB?: number;
}

export interface RawFingerprint {
  cpu: {
    model: string;
    cores: number;
    threads: number;
    baseClockGHz: number;
    architecture?: number;
    socketType?: string;
  };
  ram: RawRamModule[];
  ramSlots?: RamSlotsInfo;
  ramSlotsInfo?: RamSlotsInfo;
  storage: RawStorageDrive[];
  battery: RawBatteryData;
  adapter: RawAdapterData;
  display: RawDisplayData;
  bios: RawBiosData;
  windows: RawWindowsData;
  gpu?: RawGpuData[];
  userWorkload?: string;
  scannedAtISO: string;
}

export interface LaptopSpec {
  _id?: string;
  brand: string;
  model: string;
  aliases?: string[];
  releaseYear: number;
  processorFamily: string;
  maxRamGB: number;
  ramType: string;
  ramSlots: string;
  supportedStorageTypes: string[];
  maxStorageGB: number;
  officialChargerWattageW: number;
  batteryPartNumbers: string[];
  batteryOriginalCapacityMWh: number;
  displaySpec: { resolution: string; refreshHz: number };
  officialSpecUrl?: string;
  qvlUrl?: string;
  typicalMarketPricePKR: { min: number; max: number };
  verifiedRetailMarketPricePKR?: { min: number; max: number };
}

export interface PriceBreakdownPKR {
  bazaarMinPKR: number;
  bazaarMaxPKR: number;
  onlineRetailMinPKR: number;
  onlineRetailMaxPKR: number;
  askingPricePKR?: number;
  verdict: "Great Deal" | "Fair Price" | "Overpriced" | "High Risk";
  simplePriceAdvice: string;
}

export interface UseCaseScores {
  webDevelopment: number;        // 0–10 (Software & Web Development)
  appDevelopment: number;        // 0–10 (App Development / Mobile & Desktop)
  officeAndStudy: number;        // 0–10 (Office Use & Everyday Study)
  videoEditingAndDesign: number; // 0–10 (Graphic Design & Video Editing)
  gaming: number;                // 0–10 (Gaming & Competitive Esports)
  codingAndDevOps?: number;      // Backward compatibility alias for webDevelopment
}

export interface OemValidation {
  confirmedModel: string;
  releaseYear: number;
  maxRamGB: number;
  ramSlots: string;
  storageBays: string;
  officialChargerWattageW: number;
  specMatchNote: string;        // "Matches OEM Specifications" or "Custom/Modified Configuration"
  sourceNote: string;           // e.g. "Official Lenovo PSREF / Dell Technical Guide / HP QuickSpecs"
  referenceUrls: string[];      // URLs to the exact OEM specs or reviews used for cross-checking
}

export interface BudgetAnalysis {
  fairMarketMin: number;
  fairMarketMax: number;
  onlineMin: number;
  onlineMax: number;
  currency: "PKR" | "USD";
  userBudget?: number;
  budgetVerdict: "Great Deal" | "Fair Price" | "Overpriced" | "Underpriced – Inspect Carefully";
  negotiateToPrice?: number;    // only when Overpriced
  priceAdvice: string;
  dataSource: string;           // e.g. "Hafeez Centre, Techno City, Paklap, CZone, Mega.pk, Galaxy & OLX PK" OR "eBay Refurbished, Swappa"
  referenceUrls: string[];      // URLs to listings for cross-checking
}

export interface AiTruthReport {
  summary: string;
  useCaseTags: UseCaseTag[];
  useCaseScores: UseCaseScores;
  redFlags: string[];
  oemValidation?: OemValidation;
  budgetAnalysis?: BudgetAnalysis;
  priceBreakdown: PriceBreakdownPKR;
  laptopAgeYears: number;
  isTooOldForHeavyTasks: boolean;
  batteryHealthRating: "Good" | "Moderate Wear" | "Replace Soon";
  storageHealthRating: "Good" | "Monitor" | "Replace Soon";
  chargerStatusNote: string;
  ramUpgradeAdvice: string;
  storageUpgradeAdvice: string;
  batteryBackupAdvice: string;
  buyScore: number;             // 0–100
  buyRecommendation: "BUY" | "NEGOTIATE" | "PASS";
  providerUsed: "gemini" | "groq" | "oem-synthesizer";
  generatedAt: string;
}


export interface ScanReportDocument {
  _id: string;
  userId?: string;
  laptopModel: string;
  brand: string;
  serialNumber: string;
  scannedAt: string;
  isManualMode: boolean;
  userWorkload?: string;
  userBudgetDisplay?: string;
  askingPricePKR?: number;
  rawFingerprint: RawFingerprint;
  matchedSpec?: LaptopSpec | null;
  findings: FindingItem[];
  trustScore: number;
  aiReport: AiTruthReport;
  shareLinkId: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  provider?: "gemini" | "groq";
}
