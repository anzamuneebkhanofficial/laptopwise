"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Download, Sliders, Terminal, ShieldCheck, CheckCircle2,
  FileCode, Cpu, ExternalLink, HelpCircle
} from "lucide-react";
import { ManualScanForm } from "@/components/ManualScanForm";


export default function ScanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"agent" | "manual">("agent");

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Scan a Laptop</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Check real laptop hardware using our easy Windows scanner or test an online listing by entering specs.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex justify-center">
        <div className="p-1 rounded-2xl glass-panel border border-slate-800 flex gap-1 bg-slate-950/80">
          <button
            onClick={() => setActiveTab("agent")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "agent"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Windows Scanner (Recommended)</span>
          </button>

          <button
            onClick={() => setActiveTab("manual")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "manual"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Manual Entry Mode</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: AGENT */}
      {activeTab === "agent" && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-100 text-sm">Download Windows Native Hardware Scanner</h2>
                  <p className="text-xs text-slate-400">Choose from 3 direct native scanning formats</p>
                </div>
              </div>

              <Link
                href="/scanner"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold self-start sm:self-auto"
              >
                <span>Compare all 3 scanners &rarr;</span>
              </Link>
            </div>

            {/* 3 Download Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: BAT */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Option 1</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Fastest</span>
                  </div>
                  <h3 className="font-bold text-white text-xs mt-1">.BAT Launcher</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Zero-installation double-click launcher. Runs on any Windows 10/11 laptop.
                  </p>
                </div>
                <a
                  href="/LaptopTruthScanner.bat"
                  download="LaptopTruthScanner.bat"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .BAT</span>
                </a>
              </div>

              {/* Option 2: PS1 */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Option 2</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Transparent</span>
                  </div>
                  <h3 className="font-bold text-white text-xs mt-1">PowerShell (.ps1)</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direct open-source PowerShell script with all raw WMI/ACPI queries.
                  </p>
                </div>
                <a
                  href="/LaptopTruthScanner.ps1"
                  download="LaptopTruthScanner.ps1"
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .PS1</span>
                </a>
              </div>

              {/* Option 3: C# */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">Option 3</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">Deep Access</span>
                  </div>
                  <h3 className="font-bold text-white text-xs mt-1">C# Native (.exe)</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Compiled native C# executable for low-level SMBIOS & IOCTL queries.
                  </p>
                </div>
                <a
                  href="/LaptopTruthScanner.exe"
                  download="LaptopTruthScanner.exe"
                  className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .EXE</span>
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Important Note:</strong> Always right-click your chosen scanner and select <span className="text-emerald-400 font-semibold">Run as Administrator</span> to ensure battery ACPI registers and SSD SMART counters are fully accessible.
              </span>
            </div>
          </div>


        </div>
      )}

      {/* TAB CONTENT: MANUAL */}
      {activeTab === "manual" && (
        <div className="space-y-4">
          <ManualScanForm />
        </div>
      )}
    </div>
  );
}
