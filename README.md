<div align="center">

# 💻 LaptopWise v3.0
### *The Smart Laptop Checker, Hardware Inspector & Clean Buying Companion*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![Groq AI](https://img.shields.io/badge/Groq_Cloud-Llama_3.3-f55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Author](https://img.shields.io/badge/Author-Muhammad_Anza_Muneeb_Khan-6366f1?style=for-the-badge&logo=github&logoColor=white)](https://github.com/anzamuneebkhanofficial)

<p align="center">
  <strong>Protecting buyers and clients worldwide from counterfeit storage, worn-out batteries, mismatched chargers, and deceptive market pricing.</strong>
</p>

[✨ Key Highlights](#-key-highlights) •
[🔍 What Problem LaptopWise Solves](#-the-problem-laptopwise-solves) •
[⚡ Core Features](#-core-features) •
[📊 Dual AI Engine & Pricing Model](#-dual-ai-engine--smart-budget-calculator) •
[🛠️ Tech Stack](#-technology-stack) •
[📁 Project Structure](#-repository-structure) •
[🚀 Getting Started](#-getting-started-local-setup) •
[🚢 Deployment Guide](#-production-deployment-vercel) •
[👨‍💻 Author & Credits](#-author--creator)

---

</div>

## 🌟 Key Highlights

- 🛡️ **Zero-Guesswork Hardware Inspector:** Read low-level SMBIOS, WMI, CIM, and ACPI hardware parameters directly from the motherboard.
- 🔋 **Deep Battery Wear & Spoof Detection:** Uncovers true battery wear percentage, design capacity vs full charge capacity, and flags manipulated cycle counts.
- 💽 **SSD S.M.A.R.T. & Counterfeit Protection:** Identifies fake or relabeled SSDs (e.g. cheap Phison / Silicon Motion controllers spoofed as Samsung Evo/Pro).
- 🔌 **Charger Wattage Matcher:** Prevents CPU throttling and battery degradation by verifying if the bundled charger provides the required factory wattage.
- 💰 **Smart Budget & Fair Market Price Calculator:** Evaluates if the seller's asking price matches fair market value across regional bazaars (Hafeez Centre Lahore, Techno City Karachi, Blue Area Islamabad) and online retailers (Paklap, CZone, OLX, eBay Refurbished).
- ⚖️ **Multi-Laptop AI Comparison (`/compare/ai`):** Compare up to 4 laptops simultaneously with benchmark insights (Cinebench, Geekbench, 3DMark, thermals) and ranked podium awards.
- 📖 **Interactive 8-Step Buying Guide (`/guide`):** Complete interactive checklist including physical chassis inspection, screen dead pixel checker, keyboard tester, and 5-minute diagnostic tools.
- 📄 **1-Click Shareable Reports & PDF Export:** Export comprehensive client-ready audit reports with printable layouts and persistent share links.

---

## 🎯 The Problem LaptopWise Solves

Buying a new, used, or refurbished laptop in physical tech markets or online marketplaces (**OLX**, **Facebook Marketplace**, **eBay**) comes with serious hidden risks:

| Common Scam / Risk | How Sellers Conceal It | How LaptopWise Protects You |
| :--- | :--- | :--- |
| **Fake / Relabeled SSDs** | Putting brand stickers (Samsung/WD) over cheap generic drives | Reads hardware vendor IDs, firmware strings, and SMART health |
| **Worn-out Batteries** | Claiming *"Battery lasts 4+ hours"* | Queries ACPI registers for design vs actual full charge capacity |
| **Mismatched / Weak Chargers** | Bundling 30W–45W phone adapters with 65W–90W laptops | Verifies AC adapter output against manufacturer OEM specs |
| **Overpricing & Spec Inefficiency** | Selling 7th/8th gen dual-cores at modern laptop prices | Computes fair market value brackets (PKR / USD) and performance scores |
| **Swapped Low-Speed RAM** | Mixing mismatched speeds or single-channel RAM | Detects exact RAM stick part numbers, MHz speeds, and free slots |

---

## ✨ Core Features

```
                                 ┌─────────────────────────────────┐
                                 │       LAPTOPWISE PLATFORM       │
                                 └────────────────┬────────────────┘
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 ▼                                                                 ▼
      ┌──────────────────────┐                                          ┌──────────────────────┐
      │  MODE A: HARDWARE    │                                          │   MODE B: MANUAL     │
      │  SCANNER AGENTS      │                                          │   SPECS ADVISOR      │
      ├──────────────────────┤                                          ├──────────────────────┤
      │ • Zero-install .BAT  │                                          │ • Online Research    │
      │ • Open-source .PS1   │                                          │ • OEM Spec Database  │
      │ • Native C# (.EXE)   │                                          │ • Budget Matching    │
      └──────────┬───────────┘                                          └──────────┬───────────┘
                 │                                                                 │
                 └────────────────────────────────┬────────────────────────────────┘
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │     DUAL AI REASONING ENGINE    │
                                 │   Google Gemini + Groq Llama    │
                                 └────────────────┬────────────────┘
                                                  │
                 ┌────────────────────────────────┼────────────────────────────────┐
                 ▼                                ▼                                ▼
      ┌──────────────────────┐         ┌──────────────────────┐         ┌──────────────────────┐
      │ 4-LAPTOP AI COMPARE  │         │ 8-STEP BUYING GUIDE  │         │ CLIENT-READY AUDITS  │
      │ Side-by-side specs,  │         │ Physical checklists, │         │ 1-Click PDF export   │
      │ benchmark scores &   │         │ screen dead pixels & │         │ & encrypted public   │
      │ ranked podium awards │         │ keyboard test tools  │         │ shareable web links  │
      └──────────────────────┘         └──────────────────────┘         └──────────────────────┘
```

### 1. 🔍 Automated Deep Hardware Scanner (Mode A)
- **1-Click Zero-Install Scanner (`LaptopWiseScanner.bat`):** 
  - Ultra-lightweight (23 KB) double-click launcher for all Windows 10 & 11 laptops.
  - Zero dependencies, zero installations, and zero background services.
  - Right-click → **Run as Administrator** to query low-level motherboard SMBIOS, RAM slots, battery ACPI registers, and SSD S.M.A.R.T. wear data.

### 2. 📝 Manual Buyer Advisor & Spec Matcher (Mode B)
- Pre-purchase research for buyers browsing OLX, Daraz, Paklap, or Amazon before visiting a store.
- Enter CPU, RAM, Storage, and asking price to instantly calculate:
  - **Upgrade Potential:** Maximum motherboard RAM ceiling and available M.2/SATA expansion bays.
  - **Workload Suitability:** Task-specific scores (0–10) for Web Development, App Development, Office Work, Video Editing, and Gaming.
  - **Budget Verdict:** Clear "Underpriced (Inspect Carefully)", "Fair Price", or "Overpriced" rating.

### 3. 🤖 Dual AI Truth Verification Engine
- Hybrid AI architecture leveraging **Google Gemini 2.5 Flash** and **Groq Cloud (Llama 3.3 / OSS 120B)**.
- Delivers findings in plain English (4th–5th grade readability) — eliminating complex engineering jargon for everyday buyers.

### 4. ⚖️ 4-Laptop Side-by-Side Comparison (`/compare/ai`)
- Compare up to 4 laptops side by side.
- AI calculates Cinebench, Geekbench, and 3DMark estimations, thermal efficiency, and display accuracy.
- Outputs an intelligent summary with 🥇 **1st Place Winner**, 🥈 **2nd Place**, and 🥉 **3rd Place** rankings.

### 5. 📖 8-Step Interactive Buying Guide (`/guide`)
- Step-by-step masterclass for purchasing used hardware safely:
  - Purpose & budget checklist.
  - Interactive screen dead-pixel tester & full keyboard matrix test.
  - 1-click diagnostic terminal commands (`powercfg /batteryreport`, CrystalDiskInfo, CPU-Z, HWMonitor).
  - Cosmetic inspection checklist and walk-away red flags.

---

## 💰 Smart Budget Calculator & Pricing Valuation

LaptopWise cross-references hardware configurations with live market pricing to prevent overpaying:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      FAIR MARKET PRICING ENGINE                        │
├────────────────────────────┬───────────────────────────────────────────┤
│ Pakistani Local Markets    │ Hafeez Centre (LHR), Techno City (KHI),   │
│                            │ Blue Area (ISB), Hall Road, Naz Plaza     │
├────────────────────────────┼───────────────────────────────────────────┤
│ Online Retailers & Bazaars │ Paklap, CZone, Mega.pk, Galaxy, OLX PK    │
├────────────────────────────┼───────────────────────────────────────────┤
│ International Refurbished  │ eBay Refurbished, Swappa, Micro Center    │
└────────────────────────────┴───────────────────────────────────────────┘
```

The system computes:
1. **Local Bazaar Floor Price (Min PKR):** Fair price in physical wholesale markets.
2. **Verified Retail Price (Max PKR):** Fair retail price with shop warranty.
3. **Target Negotiation Price:** The exact recommended counter-offer to negotiate with the seller.

---

## 🛠️ Technology Stack

- **Core Web App:** Next.js 16 (App Router with Turbopack), React 19, TypeScript
- **Styling & UI:** Tailwind CSS v4, Framer Motion animations, Glassmorphism design tokens
- **Iconography:** Lucide React
- **AI Backend:** Google GenAI SDK (`@google/genai`), Groq SDK (`groq-sdk`)
- **Native Scanner Agent:** Windows PowerShell Engine (WMI / CIM / ACPI) encapsulated in a 1-Click `.bat` launcher

---

## 📁 Repository Structure

```
laptopwise/
├── public/                         # Static assets & downloadable scanner
│   └── LaptopWiseScanner.bat       # 1-Click 23 KB Windows Hardware Inspector
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/                    # Serverless API routes
│   │   │   ├── compare/ai/         # 4-Laptop AI comparison endpoint
│   │   │   ├── scan/manual/        # Manual entry evaluation endpoint
│   │   │   ├── scan/upload/        # Telemetry JSON upload endpoint
│   │   │   ├── scanner/download/   # Scanner download endpoint
│   │   │   └── share/              # Public share link persistence
│   │   ├── compare/ai/             # Side-by-side comparison UI
│   │   ├── guide/                  # 8-Step interactive buying guide
│   │   ├── report/[id]/            # Comprehensive audit report page
│   │   ├── scan/                   # Scan mode selector (Agent vs Manual)
│   │   ├── scanner/                # Scanner download & visual 3-step guide
│   │   ├── globals.css             # Glassmorphic CSS styling tokens
│   │   ├── layout.tsx              # Root application layout & metadata
│   │   └── page.tsx                # Landing homepage
│   ├── components/                 # Reusable UI component library
│   │   ├── CompareTable.tsx        # Side-by-side spec comparison table
│   │   ├── ComponentCard.tsx       # Hardware telemetry card
│   │   ├── ConfidenceBadge.tsx     # Verification confidence indicators
│   │   ├── Footer.tsx              # Application footer with author credits
│   │   ├── ManualScanForm.tsx      # Comprehensive manual entry form
│   │   ├── Navbar.tsx              # Responsive navigation header
│   │   ├── PdfExportButton.tsx     # Client-side PDF print exporter
│   │   ├── PriceGauge.tsx          # Interactive market price gauge
│   │   └── TrustScoreGauge.tsx     # Hardware authenticity score meter
│   ├── data/                       # Buying guide content & checklists
│   ├── lib/                        # Backend business logic
│   │   ├── ai/                     # Dual AI clients (Gemini & Groq)
│   │   └── engine/                 # Spec matching, scoring & price formulas
│   └── types.ts                    # Global TypeScript interfaces
├── .env.example                    # Environment variables template
├── .gitignore                      # Git configuration (protects keys & builds)
├── package.json                    # Project dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Comprehensive project documentation
```

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/anzamuneebkhanofficial/laptopwise.git
cd laptopwise
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Add your AI API keys:
```env
# 1. Google Gemini API (Get free key: https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here
GEN_MODEL=gemini-2.5-flash

# 2. Groq AI Cloud API (Get free key: https://console.groq.com/)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

### 4. Launch the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🚢 Production Deployment (Vercel)

LaptopWise is optimized for **1-click zero-config deployment on Vercel**:

1. Push this repository to your GitHub account (`https://github.com/anzamuneebkhanofficial/laptopwise.git`).
2. Log in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `laptopwise` repository.
4. Under **Environment Variables**, configure:
   - `GEMINI_API_KEY`
   - `GEN_MODEL` (e.g. `gemini-2.5-flash`)
   - `GROQ_API_KEY`
   - `GROQ_MODEL` (e.g. `openai/gpt-oss-120b`)
5. Click **Deploy**. Your application will be live in under 60 seconds!

---

## 🔒 Security & Privacy

- **No Unauthorized Data Collection:** The scanner only queries standard Windows hardware management interfaces (WMI / CIM / ACPI) and uploads the hardware profile only when the user explicitly clicks upload.
- **Open-Source Code:** The scanner scripts (`.bat`, `.ps1`, `.cs`) are 100% open and human-readable. Users can inspect every line of code before execution.
- **Safe Environment Handling:** API keys and sensitive tokens are strictly encapsulated within serverless routes and never exposed to the client bundle.

---

## 👨‍💻 Author & Creator

<div align="center">

### **Muhammad Anza Muneeb Khan**
*Full-Stack Engineer & AI Solutions Developer*

[![GitHub](https://img.shields.io/badge/GitHub-anzamuneebkhanofficial-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/anzamuneebkhanofficial)
[![Repository](https://img.shields.io/badge/Repository-laptopwise-indigo?style=for-the-badge&logo=git&logoColor=white)](https://github.com/anzamuneebkhanofficial/laptopwise)

</div>

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute for educational, consumer protection, and commercial purposes.
