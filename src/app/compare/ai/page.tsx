"use client";

import React, { useState } from "react";
import {
  Cpu, HardDrive, MemoryStick, Monitor, DollarSign, Briefcase, Plus,
  Trash2, Zap, Sparkles, Trophy, ChevronDown, ChevronUp, Loader2,
  AlertCircle, TrendingUp, Star, ArrowRight, ShieldCheck, Target,
  GitCompare, Info, Battery, Layers, Tag, CheckCircle2, AlertTriangle,
  BadgeAlert, HelpCircle
} from "lucide-react";
import type {
  CompareAiResult, LaptopInput, HierarchyItem, MatrixRow,
  RankedLaptop, LaptopPriceAnalysis
} from "@/app/api/compare/ai/route";

// ── Constants ─────────────────────────────────────────────────────────────────
const USE_CASES = [
  "💻 Software & Web Development (Coding, VS Code, Node.js, Full-Stack)",
  "📱 App Development (Mobile Apps, Android Studio, Flutter, iOS/Xcode, Emulators)",
  "🏢 Office Use & Everyday Study (MS Word, Excel, Zoom, PowerPoint, Browsing)",
  "🎨 Graphic Design & Video Editing (Adobe Premiere, Photoshop, 3D Rendering)",
  "🎮 Gaming & Competitive Esports (Pure Gaming, GTA V, Valorant, CS2, AAA Titles)",
];

const STORAGE_TYPES = ["Fast NVMe M.2 PCIe SSD", "M.2 SATA SSD", '2.5" SATA SSD', "Mechanical HDD"];
const RAM_FREQUENCIES = [
  "1600 MHz (DDR3L)",
  "2133 MHz (DDR4)",
  "2400 MHz (DDR4)",
  "2666 MHz (DDR4)",
  "3200 MHz (DDR4)",
  "4800 MHz (DDR5)",
  "5600 MHz (DDR5)",
];

const EMPTY_LAPTOP = (): LaptopInput => ({
  name:                  "",
  cpu:                   "",
  gpuType:               "integrated",
  gpu:                   "Integrated Graphics (Intel UHD / Iris Xe / AMD)",
  ramSlots:              "2",
  ramSlot1GB:            8,
  ramSlot2GB:            8,
  ramGB:                 16,
  ramType:               "DDR4",
  ramSpeedMHz:           "2400",
  storageMode:           "single",
  storageType:           "Fast NVMe M.2 PCIe SSD",
  storageGB:             512,
  secondaryStorageType:  "Mechanical HDD",
  secondaryStorageGB:    1000,
  displaySpec:           "",
  askingPricePKR:        null,
  userBudgetPKR:         null,
  pricePKR:              null,
  batteryHealthPercent:  85,
  chargerWattageW:       65,
  useCase:               USE_CASES[0],
});

const MEDAL_COLORS: Record<number, { bg: string; border: string; text: string; glow: string; badge: string }> = {
  1: { bg: "bg-amber-950/30",   border: "border-amber-500/40",  text: "text-amber-300",  glow: "shadow-amber-500/10",   badge: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
  2: { bg: "bg-slate-900/60",   border: "border-slate-500/30",  text: "text-slate-200",  glow: "shadow-slate-500/5",    badge: "bg-slate-700/60 text-slate-300 border-slate-600/40" },
  3: { bg: "bg-orange-950/20",  border: "border-orange-700/30", text: "text-orange-300", glow: "shadow-orange-500/5",   badge: "bg-orange-900/30 text-orange-300 border-orange-700/30" },
  4: { bg: "bg-rose-950/20",    border: "border-rose-500/20",   text: "text-rose-400",   glow: "shadow-rose-500/5",     badge: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function LaptopSlot({
  laptop, index, onUpdate, onRemove, canRemove,
}: {
  laptop:   LaptopInput;
  index:    number;
  onUpdate: (idx: number, field: keyof LaptopInput, val: any) => void;
  onRemove: (idx: number) => void;
  canRemove: boolean;
}) {
  const u = (field: keyof LaptopInput, val: any) => onUpdate(index, field, val);

  const computedRam =
    laptop.ramSlots === "2"
      ? Number(laptop.ramSlot1GB || 0) + Number(laptop.ramSlot2GB || 0)
      : Number(laptop.ramGB || 8);

  const isDualChannel =
    laptop.ramSlots === "2" && Number(laptop.ramSlot1GB || 0) > 0 && Number(laptop.ramSlot2GB || 0) > 0;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
      {/* Slot Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-md shadow-indigo-600/30">
            {index + 1}
          </div>
          <span className="text-sm font-extrabold text-slate-100 truncate max-w-[200px]">
            {laptop.name || `Laptop ${index + 1}`}
          </span>
        </div>
        {canRemove && (
          <button
            onClick={() => onRemove(index)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Remove laptop"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Fields Container */}
      <div className="p-5 space-y-4 text-xs">

        {/* 1. Model Name */}
        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1">1. Laptop Model Name *</label>
          <input
            type="text"
            placeholder="e.g. Lenovo ThinkPad T14 Gen 1, Latitude 5490, Victus 16"
            value={laptop.name}
            onChange={e => u("name", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* 2. Processor (CPU) */}
        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" /> 2. Processor (CPU) *
          </label>
          <input
            type="text"
            placeholder="e.g. Intel Core i5-10210U, Core i5-8350U, Ryzen 5 5600H"
            value={laptop.cpu}
            onChange={e => u("cpu", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* 3. Graphics (GPU) */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-cyan-400" /> 3. Graphics (GPU)
            </label>
            <div className="flex items-center gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  u("gpuType", "integrated");
                  u("gpu", "Integrated Graphics (Intel UHD / Iris Xe / AMD)");
                }}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  laptop.gpuType === "integrated"
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Integrated
              </button>
              <button
                type="button"
                onClick={() => {
                  u("gpuType", "dedicated");
                  u("gpu", "NVIDIA GeForce RTX 3050 4GB");
                }}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  laptop.gpuType === "dedicated"
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Dedicated GPU
              </button>
            </div>
          </div>
          <input
            type="text"
            placeholder={laptop.gpuType === "dedicated" ? "e.g. NVIDIA RTX 3050 4GB / GTX 1650" : "e.g. Intel UHD 620 / Iris Xe / AMD Radeon"}
            value={laptop.gpu}
            onChange={e => u("gpu", e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* 4. Memory (RAM Configuration) */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <MemoryStick className="w-3.5 h-3.5 text-indigo-400" /> 4. Memory (RAM)
            </label>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-extrabold border border-indigo-500/20">
              Total: {computedRam} GB {isDualChannel ? "(Dual Channel ⚡)" : "(Single Channel)"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Motherboard Slots:</span>
              <select
                value={laptop.ramSlots || "2"}
                onChange={e => u("ramSlots", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
              >
                <option value="1">1 Slot (Single)</option>
                <option value="2">2 Slots (Standard)</option>
                <option value="4">4 Slots (Workstation)</option>
                <option value="0">0 Slots (Soldered)</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-1">RAM Speed (MHz):</span>
              <select
                value={laptop.ramSpeedMHz || "2400"}
                onChange={e => u("ramSpeedMHz", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
              >
                {RAM_FREQUENCIES.map(f => (
                  <option key={f} value={f.split(" ")[0]}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {laptop.ramSlots === "2" ? (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Slot 1 Stick:</span>
                <select
                  value={laptop.ramSlot1GB ?? 8}
                  onChange={e => {
                    const v = Number(e.target.value);
                    u("ramSlot1GB", v);
                    u("ramGB", v + Number(laptop.ramSlot2GB || 0));
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
                >
                  <option value="0">0 GB (Empty)</option>
                  <option value="4">4 GB Stick</option>
                  <option value="8">8 GB Stick</option>
                  <option value="16">16 GB Stick</option>
                  <option value="32">32 GB Stick</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Slot 2 Stick:</span>
                <select
                  value={laptop.ramSlot2GB ?? 8}
                  onChange={e => {
                    const v = Number(e.target.value);
                    u("ramSlot2GB", v);
                    u("ramGB", Number(laptop.ramSlot1GB || 0) + v);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
                >
                  <option value="0">0 GB (Empty)</option>
                  <option value="4">4 GB Stick</option>
                  <option value="8">8 GB Stick</option>
                  <option value="16">16 GB Stick</option>
                  <option value="32">32 GB Stick</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Installed Capacity:</span>
              <select
                value={laptop.ramGB || 8}
                onChange={e => u("ramGB", Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
              >
                <option value="4">4 GB RAM</option>
                <option value="8">8 GB RAM</option>
                <option value="16">16 GB RAM</option>
                <option value="32">32 GB RAM</option>
                <option value="64">64 GB RAM</option>
              </select>
            </div>
          )}
        </div>

        {/* 5. Storage (Single vs Dual Storage) */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> 5. Storage
            </label>
            <div className="flex items-center gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => u("storageMode", "single")}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  laptop.storageMode === "single"
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                1 Drive
              </button>
              <button
                type="button"
                onClick={() => u("storageMode", "dual")}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  laptop.storageMode === "dual"
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                2 Drives (Dual)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">
                {laptop.storageMode === "dual" ? "Drive 1 (Primary OS):" : "Drive Type:"}
              </span>
              <select
                value={laptop.storageType}
                onChange={e => u("storageType", e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
              >
                {STORAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Drive Size:</span>
              <select
                value={laptop.storageGB}
                onChange={e => u("storageGB", Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
              >
                <option value="128">128 GB</option>
                <option value="256">256 GB</option>
                <option value="512">512 GB</option>
                <option value="1000">1 TB (1000 GB)</option>
                <option value="2000">2 TB (2000 GB)</option>
              </select>
            </div>
          </div>

          {laptop.storageMode === "dual" && (
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
              <div>
                <span className="text-[10px] text-indigo-400 block mb-1 font-bold">Drive 2 (Secondary):</span>
                <select
                  value={laptop.secondaryStorageType || "Mechanical HDD"}
                  onChange={e => u("secondaryStorageType", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
                >
                  <option value="Mechanical HDD">2.5" SATA HDD</option>
                  <option value='2.5" SATA SSD'>2.5" SATA SSD</option>
                  <option value="Fast NVMe M.2 PCIe SSD">2nd NVMe M.2 SSD</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] text-indigo-400 block mb-1 font-bold">Drive 2 Size:</span>
                <select
                  value={laptop.secondaryStorageGB || 1000}
                  onChange={e => u("secondaryStorageGB", Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
                >
                  <option value="500">500 GB</option>
                  <option value="1000">1 TB (1000 GB)</option>
                  <option value="2000">2 TB (2000 GB)</option>
                  <option value="256">256 GB</option>
                  <option value="512">512 GB</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 6. Pricing & Budget */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> Shopkeeper Price (PKR) *
            </label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 80000"
              value={laptop.askingPricePKR ?? laptop.pricePKR ?? ""}
              onChange={e => {
                const val = e.target.value ? Number(e.target.value) : null;
                u("askingPricePKR", val);
                u("pricePKR", val);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
              <Target className="w-3 h-3 text-amber-400" /> My Max Budget (PKR)
            </label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 30000 (Optional)"
              value={laptop.userBudgetPKR ?? ""}
              onChange={e => u("userBudgetPKR", e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 7. Battery & Display */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
              <Battery className="w-3 h-3 text-amber-400" /> Battery Health (%)
            </label>
            <input
              type="number"
              min={10} max={100}
              placeholder="e.g. 85"
              value={laptop.batteryHealthPercent ?? ""}
              onChange={e => u("batteryHealthPercent", e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Display & Build</label>
            <input
              type="text"
              placeholder='e.g. 14" FHD IPS'
              value={laptop.displaySpec}
              onChange={e => u("displaySpec", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 8. Use Case */}
        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Target Workload *
          </label>
          <select
            value={laptop.useCase}
            onChange={e => u("useCase", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
          >
            {USE_CASES.map(uc => <option key={uc} value={uc}>{uc}</option>)}
          </select>
        </div>

      </div>
    </div>
  );
}

// ── Verified Pakistani Sellers Directory Data ─────────────────────────────────
const VERIFIED_NEW_SELLERS = [
  {
    name: "Indus Office Automation",
    location: "Karachi & Nationwide Delivery",
    url: "https://indusofficeautomation.pk/",
    focus: "Official Brand New Lenovo / Dell / HP",
    trust: "⭐⭐⭐⭐⭐ (Official OEM Partner)",
    desc: "Authorized partner for Lenovo, Dell, and HP selling factory-sealed machines with genuine manufacturer warranty.",
  },
  {
    name: "TechGlobe.pk (Saad Computer)",
    location: "Karachi, Lahore & Islamabad",
    url: "https://www.techglobe.pk/",
    focus: "New Laptops & Enterprise IT Hardware",
    trust: "⭐⭐⭐⭐⭐ (Operating since 1995)",
    desc: "Powered by Saad Computer distribution network. Authorized dealer/reseller for HP, Dell, Lenovo, and Acer.",
  },
  {
    name: "Awais International",
    location: "Lahore & Nationwide Reseller Network",
    url: "https://awaisinternational.com/",
    focus: "Corporate & Business Laptops",
    trust: "⭐⭐⭐⭐⭐ (Authorized Channel Partner)",
    desc: "Authorized channel partner for HP, Dell, Lenovo, Canon, and Microsoft with full nationwide corporate support.",
  },
  {
    name: "Compsi Pakistan",
    location: "Lahore, Karachi & Islamabad",
    url: "https://www.compsi.com/",
    focus: "Enterprise & Business Hardware",
    trust: "⭐⭐⭐⭐⭐ (Operating since 1984)",
    desc: "HP distributor, Dell registered partner, and Lenovo authorized reseller with 40+ years in Pakistan.",
  },
  {
    name: "PC House / HP Flagship Store",
    location: "Lahore, Karachi, Islamabad & Peshawar",
    url: "https://www.hpflagshipstore.com/",
    focus: "Official HP Laptops & Workstations",
    trust: "⭐⭐⭐⭐⭐ (HP Amplify Synergy Partner)",
    desc: "HP flagship retail partner selling authentic HP laptops with official HP Pakistan manufacturer warranty.",
  },
  {
    name: "Paklap.pk",
    location: "Lahore, Karachi & Islamabad",
    url: "https://www.paklap.pk/",
    focus: "New & Refurbished Consumer Laptops",
    trust: "⭐⭐⭐⭐½ (Major E-Commerce Portal)",
    desc: "One of Pakistan's largest online laptop portals with physical pickup points in Hafeez Centre and Karachi.",
  },
  {
    name: "CZone.com.pk (Computer Zone)",
    location: "Karachi & Nationwide Shipping",
    url: "https://www.czone.com.pk/",
    focus: "Computer Hardware & Laptops",
    trust: "⭐⭐⭐⭐½ (Longstanding Online Retailer)",
    desc: "Reliable online computer store known for transparent pricing and prompt order fulfillment across Pakistan.",
  },
];

const VERIFIED_USED_HUBS = [
  {
    name: "Hafeez Centre Lahore (Gulberg III)",
    location: "Main Boulevard Gulberg, Lahore",
    focus: "Imported Business Laptops (ThinkPad, Latitude, EliteBook)",
    desc: "Pakistan's largest physical computer market. Excellent for hands-on inspection of used ThinkPad T-series, Dell Latitude, and HP EliteBook machines.",
  },
  {
    name: "Techno X Laptops Lahore",
    location: "Gulberg, Lahore (0322 4350505)",
    focus: "Inspected Used Business Laptops",
    desc: "Specialized physical dealer for tested business laptops with strong customer reviews.",
  },
  {
    name: "Wasim Laptops (Hall Road Lahore)",
    location: "Hall Road, Lahore (0321 9413780)",
    focus: "Used Computer Wholesale & Retail",
    desc: "High-volume wholesale and retail outlet on Hall Road, ideal for comparing multiple used business machines.",
  },
  {
    name: "Al Wajid Laptops Lahore",
    location: "Main Ghazi Road, Lahore (0307 0021000)",
    focus: "Tested Used & Refurbished Laptops",
    desc: "Established physical shop dedicated specifically to the used and refurbished laptop market.",
  },
  {
    name: "Techno City & Regal Chowk Karachi",
    location: "I.I. Chundrigar Road / Saddar, Karachi",
    focus: "Wholesale & Retail Imported Laptops",
    desc: "Karachi's primary electronics hub for imported enterprise machines and wholesale used laptop deals.",
  },
];

// ── Dedicated Pakistani Market Price & Budget Cross-Check Section ─────────────
function PriceCrossCheckSection({ analyses }: { analyses: LaptopPriceAnalysis[] }) {
  const [showDirectory, setShowDirectory] = useState(false);
  const [activeTab, setActiveTab] = useState<"new" | "used">("new");

  if (!analyses || analyses.length === 0) return null;

  return (
    <div className="space-y-5">
      {/* Section Title Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-black text-white">
              🇵🇰 Pakistani Market Price & Budget Cross-Check
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-referenced with Hafeez Centre Lahore, Techno City Karachi, Paklap.pk, CZone & OLX Pakistan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDirectory(!showDirectory)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <span>{showDirectory ? "Hide Verified Sellers Directory" : "View Verified Sellers & Market Hubs"}</span>
          {showDirectory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Per-Laptop Price Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analyses.map((pa, idx) => {
          const isOverpriced = pa.priceVerdict.includes("Overpriced");
          const isUnderpriced = pa.priceVerdict.includes("Underpriced");

          const borderCol = isOverpriced
            ? "border-rose-500/40 bg-rose-950/10"
            : isUnderpriced
            ? "border-amber-500/40 bg-amber-950/10"
            : "border-emerald-500/30 bg-emerald-950/10";

          const badgeCol = isOverpriced
            ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
            : isUnderpriced
            ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
            : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";

          const paklapSearch = `https://www.paklap.pk/catalogsearch/result/?q=${encodeURIComponent(pa.laptopName)}`;
          const czoneSearch  = `https://www.czone.com.pk/search.aspx?kw=${encodeURIComponent(pa.laptopName)}`;
          const olxSearch    = `https://www.olx.com.pk/laptops_c1432/q-${encodeURIComponent(pa.laptopName.replace(/\s+/g, '-'))}`;

          return (
            <div
              key={idx}
              className={`glass-panel p-5 rounded-3xl border ${borderCol} space-y-4 shadow-xl flex flex-col justify-between`}
            >
              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{pa.medal}</span>
                    <h3 className="text-sm font-extrabold text-white truncate max-w-[220px]">
                      {pa.laptopName}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${badgeCol}`}>
                    {pa.priceVerdict}
                  </span>
                </div>

                {/* 3-Way Price Comparison Box */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Shop Demand</span>
                    <span className="text-xs font-black text-slate-100">
                      {pa.askingPricePKR ? `PKR ${pa.askingPricePKR.toLocaleString()}` : "Not given"}
                    </span>
                  </div>
                  <div className="border-x border-slate-800 px-1">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Fair Market Rate</span>
                    <span className="text-xs font-black text-emerald-300">
                      PKR {pa.fairMarketMinPKR.toLocaleString()}–{pa.fairMarketMaxPKR.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Your Budget</span>
                    <span className="text-xs font-black text-amber-300">
                      {pa.userBudgetPKR ? `PKR ${pa.userBudgetPKR.toLocaleString()}` : "No limit"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assessment Breakdown */}
              <div className="space-y-2.5 text-xs">
                {/* Market Advice */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    Market Assessment & Negotiation Room
                  </div>
                  <p className="text-slate-200 leading-relaxed">{pa.marketAdvice}</p>
                </div>

                {/* Budget Advice */}
                {pa.userBudgetPKR && (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-amber-400" />
                      Budget Suitability Check
                    </div>
                    <p className="text-slate-200 leading-relaxed">{pa.budgetAdvice}</p>
                  </div>
                )}

                {/* Negotiation Target CTA */}
                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-300 font-bold">🎯 Max Counter-Offer Target:</span>
                  <span className="text-white font-extrabold bg-indigo-600/40 px-2.5 py-0.5 rounded-md border border-indigo-500/40">
                    PKR {pa.negotiateToPKR.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Live Market Search Links for this exact model */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Verify Live Listings for this Model:
                </span>
                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  <a
                    href={paklapSearch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/50 border border-slate-700 hover:border-indigo-500/50 text-slate-200 font-semibold flex items-center gap-1 transition-all"
                  >
                    <span>Paklap.pk</span>
                    <ArrowRight className="w-2.5 h-2.5 text-indigo-400" />
                  </a>
                  <a
                    href={czoneSearch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/50 border border-slate-700 hover:border-indigo-500/50 text-slate-200 font-semibold flex items-center gap-1 transition-all"
                  >
                    <span>CZone.com.pk</span>
                    <ArrowRight className="w-2.5 h-2.5 text-indigo-400" />
                  </a>
                  <a
                    href={olxSearch}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/50 border border-slate-700 hover:border-indigo-500/50 text-slate-200 font-semibold flex items-center gap-1 transition-all"
                  >
                    <span>OLX Pakistan</span>
                    <ArrowRight className="w-2.5 h-2.5 text-indigo-400" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Verified Pakistani Sellers & Market Directory */}
      {showDirectory && (
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-slate-950/80 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Verified Laptop Sellers & Market Hubs in Pakistan
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic sources for new OEM machines and tested used business laptops.
              </p>
            </div>

            <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("new")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTab === "new" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🌟 Authorized New Laptops
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("used")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTab === "used" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🏢 Physical Used & Business Hubs
              </button>
            </div>
          </div>

          {activeTab === "new" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              {VERIFIED_NEW_SELLERS.map((s, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-slate-100">{s.name}</h4>
                      <span className="text-[10px] text-amber-300 font-bold">{s.trust}</span>
                    </div>
                    <span className="text-[10px] text-indigo-300 block font-semibold">{s.location}</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed pt-1">{s.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-medium">{s.focus}</span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Visit Site</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              {VERIFIED_USED_HUBS.map((h, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-100">{h.name}</h4>
                    <span className="text-[10px] text-indigo-300 block font-semibold">{h.location}</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed pt-1">{h.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-emerald-400 font-medium block">{h.focus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Comparison Matrix Table ───────────────────────────────────────────────────
function ComparisonMatrix({ rows, ranked }: { rows: MatrixRow[]; ranked: RankedLaptop[] }) {
  const highlightRow = [
    "Target Verdict",
    "Real-World Benchmark Tier",
    "Shopkeeper Asking Price",
    "Authentic Pakistan Market Range",
    "Price Fairness Verdict"
  ];

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 overflow-x-auto shadow-2xl">
      <table className="w-full text-left text-xs text-slate-300 min-w-[640px]">
        <thead className="border-b border-slate-800 bg-slate-950/80">
          <tr>
            <th className="p-4 w-48 text-slate-400 font-bold text-[11px] uppercase tracking-wider">Feature</th>
            {ranked.map((r) => {
              const mc = MEDAL_COLORS[r.rank] || MEDAL_COLORS[2];
              return (
                <th key={r.rank} className={`p-4 min-w-[190px] ${mc.bg}`}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{r.medal}</span>
                      <span className={`text-[11px] font-extrabold uppercase tracking-wider ${mc.text}`}>
                        #{r.rank} {r.targetVerdict}
                      </span>
                    </div>
                    <span className="text-slate-100 font-bold text-sm leading-tight">{r.name}</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {rows.map((row, ri) => {
            const isHighlight = highlightRow.includes(row.feature);
            const isVerdict   = row.feature === "Target Verdict";
            return (
              <tr key={ri} className={isHighlight ? "bg-indigo-500/5" : ""}>
                <td className={`p-4 font-semibold ${isHighlight ? "text-indigo-300 font-bold" : "text-slate-400"}`}>
                  {row.feature}
                </td>
                {row.values.map((val, vi) => {
                  const rank = vi + 1;
                  const mc   = MEDAL_COLORS[rank] || MEDAL_COLORS[2];
                  if (isVerdict) {
                    return (
                      <td key={vi} className={`p-4 ${mc.bg}`}>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${mc.badge}`}>
                          <span>{ranked[vi]?.medal}</span>
                          {val}
                        </span>
                      </td>
                    );
                  }
                  return (
                    <td key={vi} className={`p-4 ${isHighlight ? mc.bg : ""}`}>
                      <span className={isHighlight ? `font-bold ${mc.text}` : "text-slate-200"}>
                        {val}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Hierarchy Breakdown Cards ─────────────────────────────────────────────────
function HierarchyBreakdown({ items }: { items: HierarchyItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const mc = MEDAL_COLORS[item.rank] || MEDAL_COLORS[2];
        const isWinner = item.rank === 1;

        return (
          <div
            key={item.rank}
            className={`glass-panel p-6 rounded-3xl border ${mc.border} ${mc.bg} space-y-4 transition-all relative overflow-hidden`}
          >
            {isWinner && (
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            )}

            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{item.medal}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-extrabold uppercase tracking-wider ${mc.text}`}>
                      #{item.rank} {isWinner ? "Overall Winner / Top Recommendation" : `Rank ${item.rank}`}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white">{item.name}</h3>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${mc.badge}`}>
                {isWinner ? "🥇 Top Pick" : `Rank #${item.rank}`}
              </span>
            </div>

            {/* Why It Wins */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isWinner ? "Why It Takes 1st Place" : "Core Strengths"}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{item.whyItWins}</p>
            </div>

            {/* vs Next Laptop */}
            {item.vsNext && (
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                <div className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  What the Higher Rank Has Over This Model
                </div>
                <p className="text-slate-300 leading-relaxed">{item.vsNext}</p>
              </div>
            )}

            {/* Where It Falls Short */}
            {item.whereFallsShort && (
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{item.whereFallsShort}</p>
              </div>
            )}

            {/* Best Suited For */}
            <div className="flex items-center gap-2 text-xs text-slate-300 pt-1 border-t border-slate-800/60">
              <Target className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span><strong className="text-slate-200">Ideal For:</strong> {item.bestSuitedFor}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Loading Skeleton ──────────────────────────────────────────────────────────
function CompareLoadingState() {
  return (
    <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 text-center space-y-6 max-w-xl mx-auto shadow-2xl">
      <div className="relative inline-flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center animate-pulse">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-bold text-white">AI Analyzing Real Hardware & Pakistani Market Rates…</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Cross-checking CPU generations, RAM configurations, NVMe speeds, shopkeeper asking prices against authentic Hafeez Centre & Paklap rates.
        </p>
      </div>
      <div className="space-y-2 text-left text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
        {[
          "Evaluating processor architectures & Cinebench tiers…",
          "Analyzing memory channels & single vs dual stick speeds…",
          "Cross-checking shopkeeper asking prices vs genuine Pakistani market range…",
          "Assessing buyer budget feasibility & calculating negotiation targets…",
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" style={{ animationDelay: `${i * 0.2}s` }} />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AiComparePage() {
  const [laptops,  setLaptops]  = useState<LaptopInput[]>([EMPTY_LAPTOP(), EMPTY_LAPTOP()]);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<CompareAiResult | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  // ── Laptop slot management ──────────────────────────────────────────────────
  const addLaptop = () => {
    if (laptops.length >= 4) return;
    setLaptops([...laptops, EMPTY_LAPTOP()]);
  };

  const removeLaptop = (idx: number) => {
    if (laptops.length <= 2) return;
    setLaptops(laptops.filter((_, i) => i !== idx));
  };

  const updateLaptop = (idx: number, field: keyof LaptopInput, val: any) => {
    const next = [...laptops];
    next[idx] = { ...next[idx], [field]: val };
    setLaptops(next);
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): string | null => {
    for (let i = 0; i < laptops.length; i++) {
      const l = laptops[i];
      if (!l.name.trim())  return `Laptop ${i + 1}: Model name is required.`;
      if (!l.cpu.trim())   return `Laptop ${i + 1}: CPU model is required.`;
    }
    return null;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleCompare = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/compare/ai", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ laptops }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Comparison failed. Please try again.");
      }
      setResult(data.result);
      setTimeout(() => {
        document.getElementById("ai-compare-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4">

      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 text-center space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Multi-Laptop Head-to-Head & Price Cross-Check</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Which Laptop Should You Buy?
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Compare 2 to 4 laptops head-to-head. Our AI evaluates real hardware benchmarks, single vs dual-channel RAM, NVMe speeds, battery health, and cross-checks shopkeeper asking prices against genuine Pakistani market rates.
        </p>
      </div>

      {/* Laptop Input Slots */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-100">
              Enter Laptop Specifications ({laptops.length}/4)
            </h2>
          </div>
          {laptops.length < 4 && (
            <button
              type="button"
              onClick={addLaptop}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another Laptop
            </button>
          )}
        </div>

        <div className={`grid grid-cols-1 ${laptops.length >= 2 ? "lg:grid-cols-2" : ""} gap-5`}>
          {laptops.map((l, i) => (
            <LaptopSlot
              key={i}
              laptop={l}
              index={i}
              onUpdate={updateLaptop}
              onRemove={removeLaptop}
              canRemove={laptops.length > 2}
            />
          ))}
        </div>

        {/* Guidance Note */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex items-start gap-2.5 text-xs text-indigo-200">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Fields marked with * are required. You can specify exact shopkeeper asking prices and your maximum budget to let the AI analyze price-to-performance value, market fairness, and negotiation room.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Compare CTA */}
        <button
          type="button"
          onClick={handleCompare}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>AI Running Deep-Dive Benchmark & Market Rate Analysis…</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Run AI Deep-Dive Comparison ({laptops.length} Laptops)</span>
            </>
          )}
        </button>
      </div>

      {/* Loading state */}
      {loading && <CompareLoadingState />}

      {/* Results Section */}
      {result && (
        <div id="ai-compare-results" className="space-y-8 pt-4 scroll-mt-6">

          {/* Section Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-800" />
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              AI Verification & Market Comparison Results
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-800" />
          </div>

          {/* Final Buying Verdict Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900 to-indigo-950/20 space-y-3 relative overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>AI Final Buying Recommendation</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {result.rankedLaptops[0]?.medal} Top Recommendation: {result.rankedLaptops[0]?.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {result.buyingVerdict}
            </p>
          </div>

          {/* Dedicated Pakistani Market Price & Budget Cross-Check Section */}
          <PriceCrossCheckSection analyses={result.priceAnalyses} />

          {/* Hierarchy Breakdown (Trade-offs & Detailed Reasoning) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-extrabold text-white">
                Detailed Ranking & Trade-off Hierarchy
              </h2>
            </div>
            <HierarchyBreakdown items={result.hierarchyBreakdown} />
          </div>

          {/* Comparison Matrix Table */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-extrabold text-white">
                Side-by-Side Hardware & Value Matrix
              </h2>
            </div>
            <ComparisonMatrix rows={result.matrixRows} ranked={result.rankedLaptops} />
          </div>

        </div>
      )}

    </div>
  );
}
