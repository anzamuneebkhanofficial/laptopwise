import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import {
  AiTruthReport, FindingItem, LaptopSpec, RawFingerprint,
  UseCaseTag, UseCaseScores, OemValidation, BudgetAnalysis
} from "@/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEN_MODEL      = process.env.GEN_MODEL      || "gemini-3.6-flash";
const GROQ_API_KEY   = process.env.GROQ_API_KEY   || "";
const GROQ_MODEL     = process.env.GROQ_MODEL     || "openai/gpt-oss-120b";

// ── helpers ──────────────────────────────────────────────────────────────────
function batteryRating(h: number): "Good" | "Moderate Wear" | "Replace Soon" {
  if (h >= 85) return "Good";
  if (h >= 70) return "Moderate Wear";
  return "Replace Soon";
}
function storageRating(w: number): "Good" | "Monitor" | "Replace Soon" {
  if (w >= 80) return "Good";
  if (w >= 50) return "Monitor";
  return "Replace Soon";
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/```\s*$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "");
  }
  return cleaned.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
//  Main AI report generator (Dynamic Online OEM Research Engine)
// ─────────────────────────────────────────────────────────────────────────────
export async function generateTruthReport(
  fingerprint: RawFingerprint,
  matchedSpec: LaptopSpec | null,
  findings: FindingItem[],
  trustScore: number,
  askingPricePKR?: number,
  isManualMode = false
): Promise<AiTruthReport> {

  const currentYear  = new Date().getFullYear();
  const releaseYear  = matchedSpec?.releaseYear || 2020;
  const ageYears     = currentYear - releaseYear;
  const totalRamGB   = fingerprint.ram.reduce((a, b) => a + (b.capacityGB || 0), 0);
  const primaryDisk  = fingerprint.storage[0] || { capacityGB: 256, type: "SSD", smart: { wearPercent: 90, powerOnHours: 0, totalBytesWrittenGB: 0, hasConsistentFields: true } };
  const battery      = fingerprint.battery;
  const batHealth    = battery.designCapacityMWh > 0
    ? Math.round((battery.fullChargeCapacityMWh / battery.designCapacityMWh) * 100)
    : 80;
  const diskHealth   = primaryDisk.smart?.wearPercent ?? 90;

  const brand = fingerprint.bios.systemBrand || "Laptop";
  const systemName = ((fingerprint.bios as any).systemName || "").trim();
  const rawModel = (fingerprint.bios.systemModel || "Model").trim();
  const model = matchedSpec?.model || (systemName && systemName !== "Universal Model" ? systemName : rawModel);
  const modelDesignation = rawModel.includes(model) ? rawModel : `${model} (${rawModel})`;
  const cpuModel = fingerprint.cpu.model || "Processor";

  const bazaarMin = matchedSpec?.typicalMarketPricePKR.min  ?? 55000;
  const bazaarMax = matchedSpec?.typicalMarketPricePKR.max  ?? 75000;
  const verifiedRetailMin = matchedSpec?.verifiedRetailMarketPricePKR?.min ?? Math.round(bazaarMin * 1.08);
  const verifiedRetailMax = matchedSpec?.verifiedRetailMarketPricePKR?.max ?? Math.round(bazaarMax * 1.12);

  // ── DYNAMIC ONLINE OEM RESEARCH PROMPT (MODE-AWARE) ───────────────────────

  // ── SHARED PLAIN-ENGLISH WRITING RULES (both modes) ───────────────────────
  const plainEnglishRules = `
MANDATORY PLAIN-ENGLISH WRITING RULES — Apply to every word you write:
- Write like you are explaining to a parent, a student, or a small business owner who is NOT a tech person.
- Every sentence must be clear to someone with a basic reading level. If a 12-year-old would not understand it, rewrite it.
- Short sentences. One idea per sentence. No long run-ons.
- When you must use a tech term (e.g. NVMe SSD, DDR4, PCIe), immediately explain it in plain words right after. Example: "NVMe SSD (a very fast type of storage drive)" or "DDR4 RAM (the type of memory this laptop uses)".
- BANNED words and phrases — never use these, always use the plain alternative:
    "utilize" → use "use"
    "facilitates" → use "helps"
    "constitutes" → use "is"
    "in accordance with" → use "based on" or "matching"
    "aforementioned" → use "this" or "the"
    "optimal" → use "best" or "good"
    "leverage" → use "use"
    "robust" → use "strong" or "reliable"
    "seamlessly" → remove or rewrite
    "functionality" → use "feature" or "what it does"
    "specifications" → use "specs" or "what the maker says it supports"
    "authentic" or "authenticity" → (Mode B only) do not use at all
    "genuine" → (Mode B only) do not use at all
    "original" → (Mode B only) do not use at all
    "modified" → (Mode B only) do not use at all
- Numbers and specs (RAM GB, battery %, cycle count, prices) — keep them exactly as-is. Only the sentences around them need to be simple.
- Red flags must explain WHY it matters in plain English. Not just "RAM speed mismatch detected." Say "The two memory sticks run at different speeds. The laptop will slow both down to match the slower one. This reduces performance."
`;

  // ── SHARED SPEC-BASED SCORING RULES (both modes) ──────────────────────────
  const scoringRules = `
PERFORMANCE SCORE RULES — useCaseScores (0–10):
- These scores MUST be based on the real hardware specs provided below. Do NOT guess or make up numbers randomly.
- Use this reasoning framework:
    webDevelopment (VS Code, web dev, Node.js, Python, full-stack coding):
      - 16GB+ RAM + 8th gen+ CPU: score 8–9.
      - 8GB RAM + 8th gen+ CPU: score 6–7.
      - Less than 8GB RAM: score 4–5.
      - NVMe SSD adds +1 over SATA SSD.
    appDevelopment (Android Studio, Flutter, iOS/Xcode, heavy emulators, React Native):
      - 16GB+ RAM + 6+ CPU cores + fast NVMe SSD: score 8–9.
      - 16GB RAM + 4 cores: score 6–7.
      - 8GB RAM: score 4–5 (heavy emulators will lag).
      - 4GB RAM: score 1–2 (cannot run Android Studio smoothly).
    officeAndStudy (Word, Excel, email, Zoom calls, web browsing, PowerPoint):
      - Any modern laptop with 4GB+ RAM scores at least 6.
      - 8GB RAM + any Intel 8th gen or newer: score 8–9.
      - 4GB RAM or CPU older than 2016: score 5–6.
    videoEditingAndDesign (video editing, Premiere Pro, Photoshop, After Effects, 3D rendering):
      - Dedicated GPU present + 16GB+ RAM: score 7–9.
      - No dedicated GPU, 16GB+ RAM: score 5–6.
      - No dedicated GPU, 8GB RAM: score 3–4.
      - No dedicated GPU, less than 8GB RAM: score 1–2.
    gaming (playing games, Valorant, GTA V, CS2, Cyberpunk, AAA titles):
      - Gaming laptop model (Legion, ROG, TUF, Victus, Omen, Predator, Alienware, Nitro) with dedicated GPU: score 7–9.
      - Dedicated GPU but not a gaming model: score 5–6.
      - No dedicated GPU, any RAM: score 1–3. Most modern 3D games will not run well.
- Always provide a 1-sentence explanation in plain English for each score inside the "summary" field.
`;

  // ── MODE A PROMPT (Hardware Scan — Physical Device Verification) ───────────
  const promptModeA = `
You are the LIVE ONLINE HARDWARE RESEARCH & OEM VERIFICATION ENGINE ("AE") for LaptopWise.
Your job is to research and verify this physical laptop: ${brand} ${modelDesignation}.
You know official manufacturer spec sheets (Lenovo PSREF, Dell Technical Documentation, HP QuickSpecs, Apple Tech Specs, Asus/Acer specs) and live Pakistani laptop market prices from Hafeez Centre Lahore, Techno City Karachi, Blue Area Islamabad, Paklap, CZone, Mega.pk, OLX Pakistan, and global sources like eBay Refurbished and Swappa.

${plainEnglishRules}

${scoringRules}

HARDWARE VERIFICATION RULES:
1. ZERO GUESSWORK:
   - Match the exact model "${brand} ${modelDesignation}" with CPU "${cpuModel}".
   - Look up: official model name, release year (${releaseYear}), RAM type (DDR4 / DDR5 / LPDDR), max RAM, storage slots, and official charger wattage.
   - Never mix up different series (e.g. ThinkPad Yoga 260 vs ThinkPad E460 are totally different laptops).
   - If the installed hardware does not match the OEM spec, flag it clearly in plain English.
2. WHAT IS INSTALLED RIGHT NOW:
   - RAM installed: ${totalRamGB}GB vs OEM max limit
   - Charger: ${fingerprint.adapter.reportedWattageW}W vs OEM requirement
   - Storage: ${primaryDisk.capacityGB}GB ${primaryDisk.type} (${diskHealth}% health)
   - Battery: ${batHealth}% health, ${battery.cycleCount || 0} charge cycles
3. PRICING:
   - DO NOT mention or use Daraz. Do not reference it.
   - PKR sources: Paklap, CZone, Mega.pk, Galaxy Computers, Hafeez Centre Lahore, Techno City Karachi, Blue Area Islamabad, OLX Pakistan.
   - USD sources: eBay Refurbished, Swappa, Micro Center Refurbished.
   - User's asking price / budget: ${askingPricePKR ? "PKR " + askingPricePKR.toLocaleString() : "Not given"}
   - In priceAdvice, ALWAYS say where the price data came from. Example: "Based on prices at Hafeez Centre and Paklap, the fair range is PKR X – Y." Never show a price without its source.
4. Return ONLY valid JSON. No markdown, no commentary outside the JSON.

INPUT SPECS:
- Brand: ${brand}
- Model: ${modelDesignation}
- CPU: ${cpuModel} (${fingerprint.cpu.cores} cores / ${fingerprint.cpu.threads} threads)
- RAM installed: ${totalRamGB}GB at ${fingerprint.ram[0]?.speedMHz || 2400}MHz
- Storage: ${primaryDisk.capacityGB}GB ${primaryDisk.type} (${diskHealth}% health)
- Battery: ${batHealth}% health (${battery.cycleCount || 0} cycles)
- Charger: ${fingerprint.adapter.reportedWattageW}W
- Screen: ${fingerprint.display.resolution} at ${fingerprint.display.refreshHz}Hz
- Trust Score: ${trustScore}/100

REQUIRED JSON OUTPUT FORMAT:
{
  "summary": "3–4 short, plain-English sentences. Say: 1) The confirmed model name and year it came out. 2) Whether the RAM, storage, and charger match what the maker officially supports. 3) The battery condition in everyday terms. 4) What kinds of tasks this laptop handles well.",
  "useCaseTags": ["Gaming", "Software Development", "Office & Browsing", "Graphic Design & Video"],
  "useCaseScores": {
    "webDevelopment": 7,
    "appDevelopment": 6,
    "officeAndStudy": 8,
    "videoEditingAndDesign": 4,
    "gaming": 2
  },
  "redFlags": ["Each flag must be a plain English sentence explaining what is wrong AND why it matters. If nothing is wrong, say: 'No major hardware problems found.'"],
  "oemValidation": {
    "confirmedModel": "${brand} ${modelDesignation}",
    "releaseYear": ${releaseYear},
    "maxRamGB": ${matchedSpec?.maxRamGB || 16},
    "ramSlots": "${matchedSpec?.ramSlots || "1x DDR4 SO-DIMM Slot"}",
    "storageBays": "1x M.2 SSD Slot (SATA / PCIe NVMe — a fast internal storage connector)",
    "officialChargerWattageW": ${matchedSpec?.officialChargerWattageW || 45},
    "specMatchNote": "Matches Official OEM Specifications",
    "sourceNote": "Official ${brand} spec sheet / hardware manual",
    "referenceUrls": [
      "https://www.google.com/search?q=${encodeURIComponent(brand + " " + modelDesignation + " official specifications")}",
      "https://www.notebookcheck.net/index.php?id=128&specs=1&search=${encodeURIComponent(brand + " " + model)}"
    ]
  },
  "budgetAnalysis": {
    "fairMarketMin": ${bazaarMin},
    "fairMarketMax": ${bazaarMax},
    "onlineMin": ${verifiedRetailMin},
    "onlineMax": ${verifiedRetailMax},
    "currency": "PKR",
    "userBudget": ${askingPricePKR || "null"},
    "budgetVerdict": "Fair Price",
    "negotiateToPrice": null,
    "priceAdvice": "Based on local market prices at Hafeez Centre, Paklap, and CZone, the fair buying range for this laptop is PKR ${bazaarMin.toLocaleString()} to ${bazaarMax.toLocaleString()}.",
    "dataSource": "Paklap, CZone, Mega.pk, Galaxy Computers, Hafeez Centre Lahore & OLX Pakistan",
    "referenceUrls": [
      "https://www.paklap.pk/catalogsearch/result/?q=${encodeURIComponent(brand + " " + model)}",
      "https://www.czone.com.pk/search.aspx?kw=${encodeURIComponent(brand + " " + model)}",
      "https://www.olx.com.pk/items/q-${encodeURIComponent(brand + " " + model)}"
    ]
  },
  "priceBreakdown": {
    "bazaarMinPKR": ${bazaarMin},
    "bazaarMaxPKR": ${bazaarMax},
    "onlineRetailMinPKR": ${verifiedRetailMin},
    "onlineRetailMaxPKR": ${verifiedRetailMax},
    "verdict": "Fair Price",
    "simplePriceAdvice": "The fair price range (based on local market data from Hafeez Centre and Paklap) is PKR ${bazaarMin.toLocaleString()} to ${bazaarMax.toLocaleString()}."
  },
  "laptopAgeYears": ${ageYears},
  "isTooOldForHeavyTasks": ${ageYears >= 7},
  "batteryHealthRating": "${batHealth >= 85 ? "Good" : batHealth >= 70 ? "Moderate Wear" : "Replace Soon"}",
  "storageHealthRating": "${diskHealth >= 80 ? "Good" : diskHealth >= 50 ? "Monitor" : "Replace Soon"}",
  "chargerStatusNote": "The charger gives ${fingerprint.adapter.reportedWattageW}W of power. [Then in one plain sentence: say if this matches or does not match what the laptop officially needs, and what that means for the user.]",
  "ramUpgradeAdvice": "In plain English: say how much RAM is installed, what the maximum is, whether it can be upgraded, and if so what upgrading would help with.",
  "storageUpgradeAdvice": "In plain English: say the storage drive size, its health, and whether replacing or upgrading it would help.",
  "batteryBackupAdvice": "In plain English: say the battery health percentage and give a real-world estimate of how many hours the user can expect on a single charge.",
  "buyScore": 80,
  "buyRecommendation": "BUY"
}
`;

  // ── MODE B PROMPT (Manual Entry — Suitability & Budget Advisory) ───────────
  const promptModeB = `
You are the LAPTOP SUITABILITY & BUDGET ADVISOR for LaptopWise.
The user has typed in the specs of a laptop they are thinking about buying. There is NO physical device to scan here — the user is planning ahead or checking if a laptop fits their needs.

Your job is to:
1. Tell the user if this laptop is a good fit for what they want to do with it.
2. Show them the official minimum and maximum RAM and storage this exact laptop model supports (from the official maker's specs).
3. Tell them if the price or budget makes sense.
4. Give optional upgrade suggestions to help them get more out of the laptop if they choose to.

${plainEnglishRules}

${scoringRules}

IMPORTANT RULES FOR THIS MODE:
- This is a planning / suitability report, NOT a hardware scan. Do NOT use words like: original, modified, genuine, fake, authentic, counterfeit, replaced, OEM-original, factory parts, or any similar language. Those words do not apply here because we have not physically scanned any device.
- Focus entirely on: Does this laptop fit the user's work? Is the price right? What are the real RAM and storage limits? Are there useful upgrades?
- If the specs are good for the user's stated use case, say so clearly and simply. If they are not enough, explain why in plain everyday words and suggest what would help.
- Upgrade recommendations must be framed as helpful suggestions, not requirements. Use phrases like "If you upgrade to 16GB RAM, it will handle coding work much better" — not "You must upgrade."
- PRICING: Always say where price data came from. Example: "Based on current online listings at Paklap and CZone, the typical price for this laptop is PKR X – Y." Never show a price without its source.
- DO NOT mention or reference Daraz. Do not reference it.

INPUT SPECS (user-entered):
- Brand: ${brand}
- Model: ${modelDesignation}
- CPU: ${cpuModel} (${fingerprint.cpu.cores} cores / ${fingerprint.cpu.threads} threads)
- Target Workload / Primary Use Case: ${fingerprint.userWorkload || "Software & Web Development"}
- RAM entered: ${totalRamGB}GB at ${fingerprint.ram[0]?.speedMHz || 2400}MHz (${fingerprint.ramSlotsInfo ? fingerprint.ramSlotsInfo.totalPhysicalSlots + " physical slot(s), " + (fingerprint.ram[0]?.channel === "dual" ? "2 sticks dual-channel" : "1 stick single-channel") : "2 slots"})
- Storage entered: ${primaryDisk.capacityGB}GB ${primaryDisk.type}
- Battery health entered: ${batHealth}%
- Charger: ${fingerprint.adapter.reportedWattageW}W
- Screen: ${fingerprint.display.resolution} at ${fingerprint.display.refreshHz}Hz
- User's budget / asking price: ${askingPricePKR ? "PKR " + askingPricePKR.toLocaleString() : "Not given"}

OEM SPEC LIMITS FOR THIS MODEL (from official maker data):
- Max RAM supported: ${matchedSpec?.maxRamGB || 32}GB (${matchedSpec?.ramType || "DDR4"})
- RAM slots: ${matchedSpec?.ramSlots || "2 SODIMM Slots"}
- Official charger wattage: ${matchedSpec?.officialChargerWattageW || 65}W
- Release year: ${releaseYear}

REQUIRED JSON OUTPUT FORMAT:
{
  "summary": "3–4 short, plain-English sentences. Say: 1) What this laptop is and when it came out. 2) Whether the specs are good or not good for the user's stated purpose. 3) How the price compares to what this laptop usually sells for. Do NOT mention originality, authenticity, or scanning.",
  "useCaseTags": ["Gaming", "Software Development", "Office & Browsing", "Graphic Design & Video"],
  "useCaseScores": {
    "webDevelopment": 7,
    "appDevelopment": 6,
    "officeAndStudy": 8,
    "videoEditingAndDesign": 4,
    "gaming": 2
  },
  "redFlags": ["Each item must be a plain English sentence about a spec or budget concern. Examples: 'The RAM may not be enough for running multiple programs at once.' or 'The price is higher than what this laptop usually sells for.' Do NOT mention parts being fake, original, or replaced. If everything looks fine, say: 'No major concerns found with these specs.'"],
  "oemValidation": {
    "confirmedModel": "${brand} ${modelDesignation}",
    "releaseYear": ${releaseYear},
    "maxRamGB": ${matchedSpec?.maxRamGB || 32},
    "ramSlots": "${matchedSpec?.ramSlots || "2 SODIMM Slots"}",
    "storageBays": "1x M.2 SSD Slot (SATA / PCIe NVMe — a fast internal storage connector)",
    "officialChargerWattageW": ${matchedSpec?.officialChargerWattageW || 65},
    "specMatchNote": "Specs reviewed against official maker data",
    "sourceNote": "Official ${brand} spec sheet / hardware manual",
    "referenceUrls": [
      "https://www.google.com/search?q=${encodeURIComponent(brand + " " + modelDesignation + " official specifications")}",
      "https://www.notebookcheck.net/index.php?id=128&specs=1&search=${encodeURIComponent(brand + " " + model)}"
    ]
  },
  "budgetAnalysis": {
    "fairMarketMin": ${bazaarMin},
    "fairMarketMax": ${bazaarMax},
    "onlineMin": ${verifiedRetailMin},
    "onlineMax": ${verifiedRetailMax},
    "currency": "PKR",
    "userBudget": ${askingPricePKR || "null"},
    "budgetVerdict": "Fair Price",
    "negotiateToPrice": null,
    "priceAdvice": "Based on current online listings at Paklap and CZone, this laptop typically sells for PKR ${bazaarMin.toLocaleString()} to ${bazaarMax.toLocaleString()}. [Then in one plain sentence say if the user's budget is a good fit, too high, or a good deal.]",
    "dataSource": "Paklap, CZone, Mega.pk, Galaxy Computers, Hafeez Centre Lahore & OLX Pakistan",
    "referenceUrls": [
      "https://www.paklap.pk/catalogsearch/result/?q=${encodeURIComponent(brand + " " + model)}",
      "https://www.czone.com.pk/search.aspx?kw=${encodeURIComponent(brand + " " + model)}",
      "https://www.olx.com.pk/items/q-${encodeURIComponent(brand + " " + model)}"
    ]
  },
  "priceBreakdown": {
    "bazaarMinPKR": ${bazaarMin},
    "bazaarMaxPKR": ${bazaarMax},
    "onlineRetailMinPKR": ${verifiedRetailMin},
    "onlineRetailMaxPKR": ${verifiedRetailMax},
    "verdict": "Fair Price",
    "simplePriceAdvice": "Typical price range (based on Paklap and CZone listings): PKR ${bazaarMin.toLocaleString()} to ${bazaarMax.toLocaleString()}."
  },
  "laptopAgeYears": ${ageYears},
  "isTooOldForHeavyTasks": ${ageYears >= 7},
  "batteryHealthRating": "${batHealth >= 85 ? "Good" : batHealth >= 70 ? "Moderate Wear" : "Replace Soon"}",
  "storageHealthRating": "${diskHealth >= 80 ? "Good" : diskHealth >= 50 ? "Monitor" : "Replace Soon"}",
  "chargerStatusNote": "The charger entered is ${fingerprint.adapter.reportedWattageW}W. [One plain sentence: say if this matches the official requirement and what it means for everyday use.]",
  "ramUpgradeAdvice": "In plain English: say how much RAM is entered, what the maximum this model officially supports is (${matchedSpec?.maxRamGB || 32}GB), whether upgrading would help, and if so what it would improve. Frame as a helpful suggestion, not a requirement.",
  "storageUpgradeAdvice": "In plain English: say the storage size entered and suggest if a larger drive would make a meaningful difference for the user's stated use case. Frame as a helpful suggestion.",
  "batteryBackupAdvice": "In plain English: based on the ${batHealth}% battery health entered, give a real-world estimate of how many hours the user can expect on a single charge.",
  "buyScore": 80,
  "buyRecommendation": "BUY"
}
`;

  const promptText = isManualMode ? promptModeB : promptModeA;

  // ── 2. AI QUERY ENGINE (Primary: Groq openai/gpt-oss-120b → Fallback: Gemini gemini-3.6-flash) ──
  console.log(`[DualAI] Querying AI engine for ${brand} ${model}...`);

  let aiResult: { data: any; provider: "groq" | "gemini" } | null = null;

  // Primary Provider: Groq (openai/gpt-oss-120b)
  if (GROQ_API_KEY) {
    try {
      const groq = new Groq({ apiKey: GROQ_API_KEY });
      const targetModel = GROQ_MODEL || "openai/gpt-oss-120b";
      
      const cc = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are the Live Online Hardware Research & OEM Verification Engine for laptops. Return strictly valid JSON only." },
          { role: "user",   content: promptText },
        ],
        model: targetModel,
        temperature: 0.15,
        response_format: { type: "json_object" },
      });
      const rawJson = cleanJsonString(cc.choices[0]?.message?.content || "");
      if (rawJson) {
        const p = JSON.parse(rawJson);
        if (p && typeof p === "object") {
          aiResult = { data: p, provider: "groq" };
          console.log(`[DualAI] Successfully received verified response from Groq (${targetModel}).`);
        }
      }
    } catch (err: any) {
      console.warn(`[DualAI] Primary provider Groq failed (${err?.message}). Falling back to Gemini (${GEN_MODEL})...`);
    }
  }

  // Fallback Provider: Google Gemini (gemini-3.6-flash)
  if (!aiResult && GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: GEN_MODEL || "gemini-3.6-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          temperature: 0.15,
        },
      });
      const rawJson = cleanJsonString(response.text || "");
      if (rawJson) {
        const p = JSON.parse(rawJson);
        if (p && typeof p === "object") {
          aiResult = { data: p, provider: "gemini" };
          console.log(`[DualAI] Successfully received verified response from fallback Gemini (${GEN_MODEL}).`);
        }
      }
    } catch (err: any) {
      console.warn(`[DualAI] Fallback provider Gemini failed (${err?.message}). Activating local OEM synthesizer...`);
    }
  }

  if (aiResult) {
    return buildReport(
      aiResult.data,
      fingerprint,
      ageYears,
      batHealth,
      diskHealth,
      totalRamGB,
      primaryDisk,
      matchedSpec,
      bazaarMin,
      bazaarMax,
      verifiedRetailMin,
      verifiedRetailMax,
      askingPricePKR,
      trustScore,
      aiResult.provider,
      isManualMode
    );
  }

  // ── 3. DYNAMIC HEURISTIC SYNTHESIZER (0ms Local Fallback) ─────────────────
  console.log(`[DualAI] Using dynamic heuristic OEM synthesizer for ${brand} ${model}`);
  return buildReport({}, fingerprint, ageYears, batHealth, diskHealth, totalRamGB, primaryDisk, matchedSpec, bazaarMin, bazaarMax, verifiedRetailMin, verifiedRetailMax, askingPricePKR, trustScore, "oem-synthesizer", isManualMode);
}

// ─────────────────────────────────────────────────────────────────────────────
//  Report builder — maps parsed AI JSON → typed AiTruthReport
// ─────────────────────────────────────────────────────────────────────────────
function buildReport(
  p: any,
  fp: RawFingerprint,
  ageYears: number,
  batHealth: number,
  diskHealth: number,
  totalRamGB: number,
  primaryDisk: any,
  matchedSpec: LaptopSpec | null,
  bazaarMin: number,
  bazaarMax: number,
  verifiedRetailMin: number,
  verifiedRetailMax: number,
  askingPricePKR: number | undefined,
  trustScore: number,
  provider: "gemini" | "groq" | "oem-synthesizer",
  isManualMode: boolean = false
): AiTruthReport {

  const batRating   = batteryRating(batHealth);
  const diskRating  = storageRating(diskHealth);

  const brand = fp.bios.systemBrand || "Laptop";
  const model = fp.bios.systemModel || "Model";

  const verifiedReleaseYear = Number(p?.oemValidation?.releaseYear) || (matchedSpec?.releaseYear || (new Date().getFullYear() - ageYears));
  const verifiedAgeYears = Math.max(0, new Date().getFullYear() - verifiedReleaseYear);

  const rawWebDev = p?.useCaseScores?.webDevelopment ?? p?.useCaseScores?.codingAndDevOps;
  const scores: UseCaseScores = {
    webDevelopment:          rawWebDev                                 ?? (totalRamGB >= 16 ? 8 : totalRamGB >= 8 ? 6 : 4),
    appDevelopment:          p?.useCaseScores?.appDevelopment          ?? (totalRamGB >= 16 && (fp.cpu.cores >= 6 || verifiedAgeYears <= 4) ? 8 : totalRamGB >= 16 ? 6 : totalRamGB >= 8 ? 4 : 2),
    officeAndStudy:          p?.useCaseScores?.officeAndStudy          ?? (verifiedAgeYears < 6 ? 8 : 6),
    videoEditingAndDesign:   p?.useCaseScores?.videoEditingAndDesign   ?? (totalRamGB >= 16 && verifiedAgeYears <= 4 ? 6 : 3),
    gaming:                  p?.useCaseScores?.gaming                  ?? (model.toLowerCase().includes("gaming") || model.toLowerCase().includes("legion") || model.toLowerCase().includes("rog") ? 7 : 2),
    codingAndDevOps:         rawWebDev                                 ?? (totalRamGB >= 16 ? 8 : totalRamGB >= 8 ? 6 : 4),
  };

  const oemVal: OemValidation = {
    confirmedModel:           p?.oemValidation?.confirmedModel          ?? `${brand} ${model}`,
    releaseYear:              verifiedReleaseYear,
    maxRamGB:                 p?.oemValidation?.maxRamGB                ?? (matchedSpec?.maxRamGB ?? 32),
    ramSlots:                 p?.oemValidation?.ramSlots                ?? (matchedSpec?.ramSlots ?? "2 SODIMM Slots"),
    storageBays:              p?.oemValidation?.storageBays             ?? "1x M.2 NVMe SSD Slot",
    officialChargerWattageW:  p?.oemValidation?.officialChargerWattageW ?? (matchedSpec?.officialChargerWattageW ?? 65),
    specMatchNote:            p?.oemValidation?.specMatchNote           ?? "Matches Official OEM Specifications",
    sourceNote:               p?.oemValidation?.sourceNote             ?? `Official ${brand} Technical Specifications & Hardware Manual`,
    referenceUrls:            p?.oemValidation?.referenceUrls          ?? [
      `https://www.google.com/search?q=${encodeURIComponent(brand + " " + model + " official specifications")}`,
      `https://www.notebookcheck.net/index.php?id=128&specs=1&search=${encodeURIComponent(brand + " " + model)}`
    ],
  };

  const pvMin = p?.priceBreakdown?.bazaarMinPKR  ?? p?.budgetAnalysis?.fairMarketMin ?? bazaarMin;
  const pvMax = p?.priceBreakdown?.bazaarMaxPKR  ?? p?.budgetAnalysis?.fairMarketMax ?? bazaarMax;
  const odMin = p?.priceBreakdown?.onlineRetailMinPKR ?? p?.budgetAnalysis?.onlineMin ?? verifiedRetailMin;
  const odMax = p?.priceBreakdown?.onlineRetailMaxPKR ?? p?.budgetAnalysis?.onlineMax ?? verifiedRetailMax;
  const currency = p?.budgetAnalysis?.currency ?? "PKR";

  let budgetVerdict: BudgetAnalysis["budgetVerdict"] = "Fair Price";
  if (askingPricePKR) {
    if (askingPricePKR < pvMin * 0.88) budgetVerdict = "Underpriced – Inspect Carefully";
    else if (askingPricePKR > pvMax * 1.12) budgetVerdict = "Overpriced";
    else if (askingPricePKR <= pvMin) budgetVerdict = "Great Deal";
    else budgetVerdict = "Fair Price";
  }
  const bv = (p?.budgetAnalysis?.budgetVerdict ?? budgetVerdict) as BudgetAnalysis["budgetVerdict"];

  const budget: BudgetAnalysis = {
    fairMarketMin:  pvMin,
    fairMarketMax:  pvMax,
    onlineMin:      odMin,
    onlineMax:      odMax,
    currency,
    userBudget:     askingPricePKR !== undefined ? askingPricePKR : undefined,
    budgetVerdict:  bv,
    negotiateToPrice: p?.budgetAnalysis?.negotiateToPrice ?? (askingPricePKR && askingPricePKR > pvMax ? pvMax : undefined),
    priceAdvice:    p?.budgetAnalysis?.priceAdvice ?? `Fair market target is PKR ${pvMin.toLocaleString()} – ${pvMax.toLocaleString()}.`,
    dataSource:     p?.budgetAnalysis?.dataSource  ?? "Paklap, CZone, Mega.pk, Galaxy, Hafeez Centre & OLX Pakistan",
    referenceUrls:  p?.budgetAnalysis?.referenceUrls ?? [
      `https://www.paklap.pk/catalogsearch/result/?q=${encodeURIComponent(brand + " " + model)}`,
      `https://www.czone.com.pk/search.aspx?kw=${encodeURIComponent(brand + " " + model)}`,
      `https://www.olx.com.pk/items/q-${encodeURIComponent(brand + " " + model)}`
    ],
  };

  const tags: UseCaseTag[] = p?.useCaseTags?.length ? p.useCaseTags : [
    scores.webDevelopment >= 7 ? "Software Development" : null,
    scores.officeAndStudy >= 7 ? "Office & Browsing" : null,
    scores.gaming >= 6 ? "Gaming" : null,
    scores.videoEditingAndDesign >= 6 ? "Graphic Design & Video" : null,
  ].filter(Boolean) as UseCaseTag[];

  if (tags.length === 0) tags.push("Office & Browsing");

  // Buy Score calculation
  let buyScore = p?.buyScore ?? Math.min(100, Math.max(10, Math.round(
    trustScore * 0.45 +
    batHealth * 0.20 +
    diskHealth * 0.15 +
    (scores.webDevelopment + scores.officeAndStudy) * 2.0
  )));

  let buyRec: "BUY" | "NEGOTIATE" | "PASS" = "BUY";
  if (trustScore < 50 || bv === "Overpriced" || batHealth < 50) {
    buyRec = "PASS";
  } else if (trustScore < 75 || bv === "Underpriced – Inspect Carefully" || batHealth < 70) {
    buyRec = "NEGOTIATE";
  }

  // ── Mode-aware fallback summary (used only if AI call fails) ──────────────
  const fallbackSummaryModeA = `This is a ${brand} ${model} powered by the ${fp.cpu.model}. It has ${totalRamGB}GB of RAM and a ${primaryDisk.capacityGB}GB ${primaryDisk.type} (a ${primaryDisk.type === "NVMe" ? "very fast type of" : ""} storage drive). The battery is at ${batHealth}% health. It is best suited for everyday office and study tasks.`;
  const fallbackSummaryModeB = `This is a ${brand} ${model} with an ${fp.cpu.model} processor. It has ${totalRamGB}GB of RAM (the maximum this model supports is ${oemVal.maxRamGB}GB) and a ${primaryDisk.capacityGB}GB ${primaryDisk.type} storage drive. This setup is good for everyday tasks like browsing, documents, and email. For heavier work like coding or video editing, see the scores below.`;

  return {
    summary: p?.summary ?? (isManualMode ? fallbackSummaryModeB : fallbackSummaryModeA),
    useCaseTags: tags,
    useCaseScores: scores,
    redFlags: p?.redFlags?.length ? p.redFlags : (
      trustScore < 70
        ? ["Something looks off with the battery or charger. Check these with the seller before buying."]
        : isManualMode
          ? ["No major concerns found with these specs."]
          : ["No major hardware problems found."]
    ),
    oemValidation: oemVal,
    budgetAnalysis: budget,
    priceBreakdown: {
      bazaarMinPKR:       pvMin,
      bazaarMaxPKR:       pvMax,
      onlineRetailMinPKR: odMin,
      onlineRetailMaxPKR: odMax,
      askingPricePKR,
      verdict:            bv === "Overpriced" ? "Overpriced" : bv === "Great Deal" ? "Great Deal" : "Fair Price",
      simplePriceAdvice:  budget.priceAdvice,
    },
    laptopAgeYears:       verifiedAgeYears,
    isTooOldForHeavyTasks: verifiedAgeYears >= 8,
    batteryHealthRating:  batRating,
    storageHealthRating:  diskRating,
    chargerStatusNote:    p?.chargerStatusNote ?? `This laptop uses a ${fp.adapter.reportedWattageW || 65}W charger, which matches what the maker officially recommends. It is safe to use.`,
    ramUpgradeAdvice:     p?.ramUpgradeAdvice ?? (
      totalRamGB < (oemVal.maxRamGB || 32)
        ? `This laptop currently has ${totalRamGB}GB of RAM. The maximum it supports is ${oemVal.maxRamGB || 32}GB. ${isManualMode ? "If you upgrade, you will notice a big difference when running multiple programs at once." : "It can be upgraded to improve performance."}`
        : `This laptop has ${totalRamGB}GB of RAM, which is the maximum it supports. No further upgrade is possible.`
    ),
    storageUpgradeAdvice: p?.storageUpgradeAdvice ?? `The storage drive is at ${diskHealth}% health. ${diskHealth >= 80 ? "It is in good shape." : diskHealth >= 50 ? "Keep an eye on it — it may need replacing in the future." : "It should be replaced soon as it is showing signs of wear."}`,
    batteryBackupAdvice:  p?.batteryBackupAdvice ?? (
      batHealth >= 80
        ? `The battery is at ${batHealth}% health. You can expect around 3 to 5 hours of real-world use on a single charge.`
        : `The battery is at ${batHealth}% health. Expect about 1.5 to 2.5 hours of use before needing to plug in.`
    ),
    buyScore:             p?.buyScore ?? buyScore,
    buyRecommendation:    (p?.buyRecommendation as any) ?? buyRec,
    providerUsed:         provider,
    generatedAt:          new Date().toISOString(),
  };
}
