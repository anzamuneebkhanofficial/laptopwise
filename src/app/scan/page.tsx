"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Download,
  Sliders,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
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
          Check real laptop hardware using our 1-click Windows scanner or test an online listing by entering specs manually.
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
            <span>1-Click Windows Scanner</span>
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
            <span>Manual Specs Entry</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: AGENT */}
      {activeTab === "agent" && (
        <div className="space-y-6">
          {/* Featured 1-Click Scanner Hero Card */}
          <div className="relative overflow-hidden glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-2xl bg-gradient-to-b from-indigo-950/20 via-slate-900/60 to-slate-950/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-white text-lg">LaptopWise 1-Click Hardware Scanner</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                      23 KB · Zero-Install
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Fast, open, and deep hardware inspection for any Windows 10 & 11 laptop.
                  </p>
                </div>
              </div>

              <a
                href="/LaptopWiseScanner.bat"
                download="LaptopWiseScanner.bat"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transform hover:-translate-y-0.5 transition-all self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Download Scanner (.bat)</span>
              </a>
            </div>

            {/* Visual 3-Step Guide */}
            <div className="border-t border-slate-800/80 pt-6 space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>3 Simple Steps to Scan in 10 Seconds:</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center">
                    1
                  </div>
                  <h4 className="font-bold text-slate-100 text-xs">Download the File</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Click the download button above to get <code className="text-indigo-300 font-mono">LaptopWiseScanner.bat</code> (only 23 KB).
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/20 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center">
                    2
                  </div>
                  <h4 className="font-bold text-slate-100 text-xs">Right-Click &amp; Run as Admin</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Right-click the file and select <strong className="text-emerald-300">Run as Administrator</strong> to allow deep battery ACPI and SSD health access.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black flex items-center justify-center">
                    3
                  </div>
                  <h4 className="font-bold text-slate-100 text-xs">Get Instant Truth Report</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    The scanner automatically opens your browser with the full verified report, authenticity score, and price match!
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Elevation Note */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Why Run as Administrator?</strong> Administrator rights allow the script to read motherboard ACPI battery registers and SSD S.M.A.R.T. wear tables directly to detect fake storage drives and worn-out batteries.
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
