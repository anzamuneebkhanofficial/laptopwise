"use client";

import React from "react";
import Link from "next/link";
import { Download, Terminal, ShieldCheck, ArrowLeft, Play, Zap } from "lucide-react";

export default function AgentPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <Link
        href="/scan"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Scan Portal</span>
      </Link>

      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Terminal className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              Windows Native Scanner v3.0
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">LaptopWise 1-Click Scanner (.bat)</h1>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          The LaptopWise Scanner is a lightweight 1-click script for any Windows 10/11 laptop.
          It queries SMBIOS tables, WMI hardware infrastructure, battery ACPI registers, and storage S.M.A.R.T. health to capture an unalterable hardware truth report.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Installation Required</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Download the 23 KB <strong className="text-white">LaptopWiseScanner.bat</strong> file. Right-click and Run as Administrator on any Windows laptop to scan in 5 seconds!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Direct Hardware Telemetry</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Queries system CIM, WMI, and ACPI hardware registers directly. Zero third-party spyware, zero background services.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="/LaptopWiseScanner.bat"
            download="LaptopWiseScanner.bat"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download 1-Click Scanner (.bat)</span>
          </a>

          <Link
            href="/scan"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>Go to Scan Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
