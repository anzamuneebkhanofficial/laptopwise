"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Laptop, Cpu, HardDrive, Battery, Zap, DollarSign, Loader2,
  AlertCircle, Sparkles, CheckCircle2, Search, Globe, ShieldCheck,
  MemoryStick, Info, ChevronDown, Layers, PlusCircle
} from "lucide-react";

export const ManualScanForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<"PKR" | "USD">("PKR");
  const [selectedBrand, setSelectedBrand] = useState("Lenovo");
  const [customBrand, setCustomBrand] = useState("");

  // RAM configuration state
  const [ramSlots, setRamSlots] = useState<"1" | "2" | "4" | "0">("2");
  const [ramSlot1, setRamSlot1] = useState("8");
  const [ramSlot2, setRamSlot2] = useState("8");
  const [singleRamGB, setSingleRamGB] = useState("16");
  const [ramSpeedMHz, setRamSpeedMHz] = useState("2400");

  // Storage configuration state
  const [storageSetupMode, setStorageSetupMode] = useState<"single" | "dual">("single");
  const [primaryStorageType, setPrimaryStorageType] = useState("NVMe");
  const [primaryStorageGB, setPrimaryStorageGB] = useState("512");
  const [secondaryStorageType, setSecondaryStorageType] = useState("HDD");
  const [secondaryStorageGB, setSecondaryStorageGB] = useState("1000");
  const [storageBays, setStorageBays] = useState("1x M.2 NVMe Slot + 1x 2.5\" SATA Bay");

  const [formData, setFormData] = useState({
    model: "ThinkPad T480",
    workload: "Software & Web Development (Coding, VS Code, Node.js, Python, Full-Stack)",
    cpuModel: "Intel Core i5-8350U",
    storageHealthPercent: "95",
    batteryHealthPercent: "88",
    chargerWattageW: "65",
    budget: "75000",
    serialNumber: "",
  });

  // Calculate total RAM dynamically
  const calculatedTotalRam =
    ramSlots === "2"
      ? Number(ramSlot1 || 0) + Number(ramSlot2 || 0)
      : ramSlots === "1"
      ? Number(ramSlot1 || 8)
      : Number(singleRamGB || 16);

  const ramChannelLayout =
    ramSlots === "2"
      ? (Number(ramSlot1) > 0 && Number(ramSlot2) > 0 ? "dual" : "single")
      : "single";

  const activeBrand = selectedBrand === "Other" ? (customBrand || "Custom Brand") : selectedBrand;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const budgetInPKR = currency === "USD" ? Math.round(Number(formData.budget) * 280) : Number(formData.budget);

      const res = await fetch("/api/scan/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: activeBrand,
          model: formData.model,
          cpuModel: formData.cpuModel,
          ramGB: calculatedTotalRam,
          ramSlots: ramSlots,
          ramSlot1GB: ramSlot1,
          ramSlot2GB: ramSlot2,
          ramStickLayout: ramChannelLayout,
          ramSpeedMHz: ramSpeedMHz,
          storageType: primaryStorageType,
          storageGB: primaryStorageGB,
          hasSecondaryDrive: storageSetupMode === "dual",
          secondaryStorageType: secondaryStorageType,
          secondaryStorageGB: secondaryStorageGB,
          storageBays: storageBays,
          storageHealthPercent: formData.storageHealthPercent,
          batteryHealthPercent: formData.batteryHealthPercent,
          chargerWattageW: formData.chargerWattageW,
          askingPricePKR: budgetInPKR || undefined,
          serialNumber: formData.serialNumber,
          workload: formData.workload,
          currency: currency,
          rawBudget: formData.budget,
        }),
      });

      const data = await res.json();
      if (data.scanId) {
        router.push(`/report/${data.scanId}`);
      } else {
        alert(data.error || "Failed to generate AI verification report");
      }
    } catch (err) {
      alert("Network error processing online AI research report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 space-y-6">
      
      {/* Notice Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 text-indigo-200 text-xs leading-relaxed space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Buyer Advisory & Hardware Suitability Planning</span>
        </div>
        <p className="text-slate-300">
          Enter any laptop configuration you are planning to purchase. Our Dual AI Engine researches official manufacturer specs, checks maximum upgrade limits (RAM slots & storage bays), evaluates workload suitability, and calculates the fair market price in Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        
        {/* 1. Brand */}
        <div>
          <label className="block font-bold text-slate-200 mb-1.5">1. Laptop Brand</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="Lenovo">Lenovo (ThinkPad, IdeaPad, Legion, Yoga)</option>
            <option value="Dell">Dell (Latitude, XPS, Inspiron, Precision, Alienware)</option>
            <option value="HP">HP (EliteBook, ProBook, Pavilion, Envy, Victus, Omen)</option>
            <option value="Apple">Apple (MacBook Air, MacBook Pro)</option>
            <option value="Asus">Asus (ZenBook, ROG, TUF, VivoBook)</option>
            <option value="Acer">Acer (Aspire, Nitro, Predator, Swift)</option>
            <option value="MSI">MSI (Modern, Stealth, Katana, Raider)</option>
            <option value="Microsoft">Microsoft (Surface Laptop, Surface Pro)</option>
            <option value="Samsung">Samsung (Galaxy Book)</option>
            <option value="Razer">Razer (Blade)</option>
            <option value="Toshiba">Toshiba / Dynabook</option>
            <option value="Other">Other / Custom Brand</option>
          </select>

          {selectedBrand === "Other" && (
            <input
              type="text"
              required
              value={customBrand}
              onChange={(e) => setCustomBrand(e.target.value)}
              placeholder="Type brand name (e.g. Huawei, LG, Gigabyte)"
              className="mt-2 w-full bg-slate-900 border border-indigo-500/50 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          )}
        </div>

        {/* 2. Model */}
        <div>
          <label className="block font-bold text-slate-200 mb-1.5">2. Exact Laptop Model</label>
          <input
            type="text"
            required
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="e.g. ThinkPad T480, Latitude 5490, Victus 16, MacBook Air M1"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* 3. Intended Workload (5 Distinct User Categories) */}
        <div className="md:col-span-2">
          <label className="block font-bold text-slate-200 mb-1.5">3. Target Usage / Workload (What will you use it for?)</label>
          <select
            value={formData.workload}
            onChange={(e) => setFormData({ ...formData, workload: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="Software & Web Development (Coding, VS Code, Node.js, Python, Full-Stack)">
              💻 1. Software & Web Development (Coding, VS Code, Node.js, Python, Full-Stack Web)
            </option>
            <option value="App Development (Mobile & Desktop Apps, Android Studio, Flutter, iOS/Xcode, Emulators)">
              📱 2. App Development (Mobile Apps, Android Studio, Flutter, iOS/Xcode, React Native, Heavy Emulators)
            </option>
            <option value="Office, Studies & Everyday Browsing (MS Word, Excel, Zoom, PowerPoint)">
              🏢 3. Office Use, Studies & Everyday Browsing (MS Word, Excel, Zoom, PowerPoint, Accounting)
            </option>
            <option value="Graphic Design & Video Editing (Adobe Premiere Pro, After Effects, Photoshop, 3D Rendering)">
              🎨 4. Graphic Design & Video Editing (Adobe Premiere Pro, Photoshop, After Effects, Illustrator, 3D/Blender)
            </option>
            <option value="Gaming & Competitive Esports (Pure Gaming, GTA V, Valorant, CS2, Cyberpunk, AAA Titles)">
              🎮 5. Gaming & Competitive Esports (Pure Gaming, GTA V, Valorant, CS2, Cyberpunk, AAA Titles)
            </option>
          </select>
        </div>

        {/* 4. Processor */}
        <div>
          <label className="block font-bold text-slate-200 mb-1.5">4. Processor (CPU Model)</label>
          <input
            type="text"
            required
            value={formData.cpuModel}
            onChange={(e) => setFormData({ ...formData, cpuModel: e.target.value })}
            placeholder="e.g. Intel Core i5-8350U, Ryzen 5 5600H, Apple M1, Core i7-12700H"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* 5. Memory (RAM Configuration with Dynamic Slots & Full Frequency List) */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <MemoryStick className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-slate-200 text-sm">5. Memory (RAM Configuration & Slots)</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-extrabold text-[11px] border border-indigo-500/20">
              Total RAM: {calculatedTotalRam} GB ({ramChannelLayout === "dual" ? "Dual Channel ⚡" : "Single Channel"})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            
            {/* Motherboard Physical Slots */}
            <div>
              <span className="text-[10px] text-slate-400 block mb-1 font-semibold">Motherboard Slots:</span>
              <select
                value={ramSlots}
                onChange={(e) => setRamSlots(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="1">1 Slot (Single-Slot Laptop e.g. Yoga 260)</option>
                <option value="2">2 Slots (Standard Dual-Slot Laptop)</option>
                <option value="4">4 Slots (Mobile Workstation / Gaming)</option>
                <option value="0">0 Slots (Soldered / Non-upgradeable)</option>
              </select>
            </div>

            {/* Per-Slot Selection if 2 Slots */}
            {ramSlots === "2" ? (
              <>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-semibold">Slot 1 RAM Stick:</span>
                  <select
                    value={ramSlot1}
                    onChange={(e) => setRamSlot1(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="0">0 GB (Slot 1 Empty)</option>
                    <option value="4">4 GB Stick</option>
                    <option value="8">8 GB Stick</option>
                    <option value="16">16 GB Stick</option>
                    <option value="32">32 GB Stick</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-semibold">Slot 2 RAM Stick:</span>
                  <select
                    value={ramSlot2}
                    onChange={(e) => setRamSlot2(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="0">0 GB (Slot 2 Empty)</option>
                    <option value="4">4 GB Stick</option>
                    <option value="8">8 GB Stick</option>
                    <option value="16">16 GB Stick</option>
                    <option value="32">32 GB Stick</option>
                  </select>
                </div>
              </>
            ) : ramSlots === "1" ? (
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-semibold">Single Slot RAM Stick:</span>
                <select
                  value={ramSlot1}
                  onChange={(e) => setRamSlot1(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="4">4 GB RAM</option>
                  <option value="8">8 GB RAM</option>
                  <option value="16">16 GB RAM</option>
                  <option value="32">32 GB RAM</option>
                </select>
              </div>
            ) : (
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-semibold">Total Memory Capacity:</span>
                <select
                  value={singleRamGB}
                  onChange={(e) => setSingleRamGB(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="4">4 GB RAM</option>
                  <option value="8">8 GB RAM</option>
                  <option value="16">16 GB RAM</option>
                  <option value="32">32 GB RAM</option>
                  <option value="64">64 GB RAM</option>
                  <option value="128">128 GB RAM</option>
                </select>
              </div>
            )}

            {/* RAM Speed / Frequency (Complete list from DDR3 to DDR5) */}
            <div className={ramSlots === "2" ? "sm:col-span-2 lg:col-span-3" : ""}>
              <span className="text-[10px] text-slate-400 block mb-1 font-semibold">RAM Speed / Frequency (MHz):</span>
              <select
                value={ramSpeedMHz}
                onChange={(e) => setRamSpeedMHz(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <optgroup label="DDR3 / DDR3L (Older Generation)">
                  <option value="1333">1333 MHz (DDR3 — 2nd/3rd Gen Core)</option>
                  <option value="1600">1600 MHz (DDR3L Low-Voltage — 4th/5th Gen Core)</option>
                  <option value="1866">1866 MHz (DDR3L High-Speed)</option>
                </optgroup>
                <optgroup label="DDR4 (Standard / Modern Laptops)">
                  <option value="2133">2133 MHz (DDR4 — 6th Gen Core)</option>
                  <option value="2400">2400 MHz (DDR4 — 7th & 8th Gen Core)</option>
                  <option value="2666">2666 MHz (DDR4 — 8th, 9th & 10th Gen Core)</option>
                  <option value="2933">2933 MHz (DDR4 — 10th Gen Core)</option>
                  <option value="3200">3200 MHz (DDR4 — 10th/11th/12th Gen & AMD Ryzen)</option>
                </optgroup>
                <optgroup label="DDR5 / LPDDR5X (Latest Generation)">
                  <option value="4800">4800 MHz (DDR5 — 12th & 13th Gen)</option>
                  <option value="5200">5200 MHz (DDR5 — 13th Gen)</option>
                  <option value="5600">5600 MHz (DDR5 — 13th & 14th Gen High-Performance)</option>
                  <option value="6000">6000 MHz (DDR5 / LPDDR5X — High-End Flagship)</option>
                  <option value="6400">6400 MHz (LPDDR5X — Ultra-Fast)</option>
                </optgroup>
              </select>
            </div>

          </div>
        </div>

        {/* 6. Storage Configuration (Single vs Dual Drive Setup) */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200 text-sm">6. Storage (Drive Types, Capacities & Expansion)</span>
            </div>
            
            {/* Single vs Dual Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px]">
              <button
                type="button"
                onClick={() => setStorageSetupMode("single")}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  storageSetupMode === "single"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                1 Single Drive
              </button>
              <button
                type="button"
                onClick={() => setStorageSetupMode("dual")}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  storageSetupMode === "dual"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                2 Drives (Dual Storage)
              </button>
            </div>
          </div>

          {storageSetupMode === "single" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-semibold">Primary Drive Type:</span>
                <select
                  value={primaryStorageType}
                  onChange={(e) => setPrimaryStorageType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="NVMe">Fast NVMe M.2 PCIe SSD (Ultra Fast)</option>
                  <option value="M.2 SATA">M.2 SATA SSD (Standard Speed)</option>
                  <option value="SATA SSD">2.5" SATA SSD (Standard 2.5-inch Drive)</option>
                  <option value="HDD">Mechanical HDD (Slow Hard Disk)</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block mb-1 font-semibold">Primary Drive Size:</span>
                <select
                  value={primaryStorageGB}
                  onChange={(e) => setPrimaryStorageGB(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="128">128 GB</option>
                  <option value="256">256 GB</option>
                  <option value="512">512 GB (Recommended)</option>
                  <option value="1000">1 TB (1000 GB)</option>
                  <option value="2000">2 TB (2000 GB)</option>
                  <option value="4000">4 TB (4000 GB)</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="text-[10px] text-emerald-400 block mb-1 font-bold">Drive 1 (Primary — OS & Windows Boot):</span>
                  <select
                    value={primaryStorageType}
                    onChange={(e) => setPrimaryStorageType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="NVMe">Fast NVMe M.2 PCIe SSD</option>
                    <option value="M.2 SATA">M.2 SATA SSD</option>
                    <option value="SATA SSD">2.5" SATA SSD</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-400 block mb-1 font-bold">Drive 1 Size:</span>
                  <select
                    value={primaryStorageGB}
                    onChange={(e) => setPrimaryStorageGB(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="128">128 GB SSD</option>
                    <option value="256">256 GB SSD</option>
                    <option value="512">512 GB SSD</option>
                    <option value="1000">1 TB (1000 GB) SSD</option>
                    <option value="2000">2 TB SSD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="text-[10px] text-indigo-400 block mb-1 font-bold">Drive 2 (Secondary — Extra Storage & Files):</span>
                  <select
                    value={secondaryStorageType}
                    onChange={(e) => setSecondaryStorageType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="HDD">2.5" SATA HDD (Mechanical Hard Disk)</option>
                    <option value="SATA SSD">2.5" SATA SSD</option>
                    <option value="NVMe">2nd Fast NVMe M.2 SSD</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-indigo-400 block mb-1 font-bold">Drive 2 Size:</span>
                  <select
                    value={secondaryStorageGB}
                    onChange={(e) => setSecondaryStorageGB(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="500">500 GB</option>
                    <option value="1000">1 TB (1000 GB)</option>
                    <option value="2000">2 TB (2000 GB)</option>
                    <option value="4000">4 TB (4000 GB)</option>
                    <option value="256">256 GB</option>
                    <option value="512">512 GB</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Motherboard Expansion Bays */}
          <div>
            <span className="text-[10px] text-slate-400 block mb-1 font-semibold">Motherboard Storage Slots Available:</span>
            <select
              value={storageBays}
              onChange={(e) => setStorageBays(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="1x M.2 NVMe Slot Only">1x M.2 NVMe SSD Slot Only</option>
              <option value="1x M.2 Slot + 1x 2.5&quot; SATA Bay">1x M.2 Slot + 1x 2.5" SATA Bay (Dual Drive Support)</option>
              <option value="2x M.2 NVMe SSD Slots (Dual NVMe)">2x M.2 NVMe SSD Slots (Dual NVMe Support)</option>
              <option value="3x M.2 SSD Slots (Workstation)">3x M.2 SSD Slots (Mobile Workstation)</option>
              <option value="1x 2.5&quot; SATA Bay Only">1x 2.5" SATA Bay Only (Older Laptop)</option>
            </select>
          </div>
        </div>

        {/* 7. Battery Health */}
        <div>
          <label className="block font-bold text-slate-200 mb-1.5">7. Reported Battery Health (%)</label>
          <input
            type="number"
            min="10"
            max="100"
            value={formData.batteryHealthPercent}
            onChange={(e) => setFormData({ ...formData, batteryHealthPercent: e.target.value })}
            placeholder="e.g. 88"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
          />
          <span className="text-[10px] text-slate-400 block mt-1">
            💡 Ask the seller or check the Windows battery report (e.g. 80%+ is healthy for used laptops).
          </span>
        </div>

        {/* 8. Charger Power (Full Spectrum: 45W to 300W+) */}
        <div>
          <label className="block font-bold text-slate-200 mb-1.5">8. Charger Power (Wattage)</label>
          <select
            value={formData.chargerWattageW}
            onChange={(e) => setFormData({ ...formData, chargerWattageW: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none"
          >
            <option value="45">45W (Ultrabooks, Thin & Light, ThinkPad Yoga, MacBook Air)</option>
            <option value="65">65W (Standard Business & Office Laptops — ThinkPad T-Series, Latitude)</option>
            <option value="90">90W / 100W (Performance Business / Light Dedicated GPU)</option>
            <option value="135">135W (Entry-Level Gaming / Legion Slim / Victus / IdeaPad Gaming)</option>
            <option value="170">170W (Performance Gaming / RTX 3060/4060 Laptops)</option>
            <option value="230">230W / 240W (Heavy Gaming / RTX 3070/4070/4080 Laptops)</option>
            <option value="300">300W+ (Extreme Desktop-Replacement Gaming Workstations)</option>
          </select>
        </div>

        {/* 9. Budget / Asking Price */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-bold text-slate-200">9. Asking Price / Your Budget</label>
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
              <button
                type="button"
                onClick={() => setCurrency("PKR")}
                className={`px-2.5 py-1 rounded transition-all ${currency === "PKR" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
              >
                PKR (Rs)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-2.5 py-1 rounded transition-all ${currency === "USD" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
              >
                USD ($)
              </button>
            </div>
          </div>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder={currency === "PKR" ? "e.g. 75000" : "e.g. 280"}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>AI Performing Live Hardware Research & Price Analysis...</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span>Verify Hardware & Generate AI Buyer Advisor Report</span>
          </>
        )}
      </button>

    </form>
  );
};
