"use client";

import React from "react";
import Link from "next/link";
import {
  Download,
  Terminal,
  ShieldCheck,
  ArrowLeft,
  Zap,
  CheckCircle2,
  HardDrive,
  Battery,
  Cpu,
  Lock,
  Sparkles,
} from "lucide-react";

export default function ScannerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      <Link
        href="/scan"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Scan Portal</span>
      </Link>

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Single 1-Click Solution
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          LaptopWise Windows Hardware Scanner
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
          Zero installation. Single lightweight file (23 KB). Runs on any Windows 10 & 11 laptop in 5 seconds.
        </p>
      </div>

      {/* ── HERO DOWNLOAD CARD ───────────────────────────────────────── */}
      <div className="relative overflow-hidden glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-slate-900/80 to-slate-950/90 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                v3.0 Official Release
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                23 KB File
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Download LaptopWiseScanner.bat</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Carry it on a USB flash drive or download directly on the laptop you are inspecting at Hafeez Centre, Techno City, or an OLX meetup.
            </p>
          </div>

          <a
            href="/api/scanner/download"
            download="LaptopWiseScanner.bat"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transform hover:-translate-y-0.5 transition-all self-start md:self-auto shrink-0"
          >
            <Download className="w-5 h-5" />
            <span>Download 1-Click Scanner (.bat)</span>
          </a>
        </div>

        {/* ── 3-STEP VISUAL HOW-TO-USE GUIDE ─────────────────────────────────── */}
        <div className="border-t border-slate-800/80 pt-8 space-y-5">
          <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>How to Use in 3 Simple Steps:</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 text-sm font-black flex items-center justify-center border border-indigo-500/30">
                1
              </div>
              <h4 className="font-bold text-slate-100 text-sm">Download to Laptop</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click the download button to save <code className="text-indigo-300 font-mono">LaptopWiseScanner.bat</code> onto the laptop Desktop or USB drive.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-black flex items-center justify-center border border-emerald-500/30">
                2
              </div>
              <h4 className="font-bold text-slate-100 text-sm">Run as Administrator</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Right-click <code className="text-emerald-300 font-mono">LaptopWiseScanner.bat</code> and select <strong className="text-emerald-400">"Run as Administrator"</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 text-sm font-black flex items-center justify-center border border-amber-500/30">
                3
              </div>
              <h4 className="font-bold text-slate-100 text-sm">Instant Truth Report</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                In 5 seconds, the scanner reads the hardware and automatically opens your web browser with the full verified audit report!
              </p>
            </div>
          </div>
        </div>

        {/* Security / Admin Note */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <strong className="text-slate-100 block">Why Administrator Rights Are Essential:</strong>
            <p className="text-slate-400 leading-relaxed">
              Windows locks direct ACPI battery registers (real milliwatt-hour capacities) and low-level SSD S.M.A.R.T. controller wear counters for standard users. Running as Administrator unlocks full 100% hardware telemetry accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* ── WHAT HARDWARE DOES THE SCANNER INSPECT? ───────────────────────── */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white">What Hardware Does the Scanner Inspect?</h2>
          <p className="text-xs text-slate-400">Everything the seller cannot hide or fake:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-max border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Motherboard &amp; BIOS</h3>
            <p className="text-slate-400 leading-relaxed">
              Queries factory SMBIOS serial numbers, release date, exact model designation, and CPU socket generation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-max border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">RAM Slots &amp; Speeds</h3>
            <p className="text-slate-400 leading-relaxed">
              Inspects total physical motherboard memory slots (occupied vs empty), stick part numbers, MHz frequency, and max upgrade limit.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 w-max border border-rose-500/20">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Fake SSD Detection</h3>
            <p className="text-slate-400 leading-relaxed">
              Examines S.M.A.R.T. health percentage, power-on hours, and chip vendor IDs to catch relabeled SSDs with spoofed firmware.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-max border border-emerald-500/20">
              <Battery className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Real Battery Health</h3>
            <p className="text-slate-400 leading-relaxed">
              Queries ACPI registers for original factory design capacity vs current full charge capacity to reveal true battery wear.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-max border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Charger Wattage Match</h3>
            <p className="text-slate-400 leading-relaxed">
              Detects charging rate to ensure the bundled power adapter matches the manufacturer's required wattage.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 w-max border border-teal-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">100% Privacy &amp; Open</h3>
            <p className="text-slate-400 leading-relaxed">
              Human-readable script with zero background telemetry, zero spyware, and zero permanent database requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
