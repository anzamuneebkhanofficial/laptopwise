"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Terminal, ShieldCheck, Copy, Check, FileCode, ArrowLeft, Play } from "lucide-react";

export default function AgentPage() {
  const [copied, setCopied] = useState(false);

  const buildCommand = "dotnet publish -c Release -r win-x64 --self-contained true -p:PublishAot=true -o ./dist";

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(buildCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              Windows Native Agent v2.0
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">LaptopTruth Scanner (.bat / .exe)</h1>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          The LaptopTruth Scanner is a lightweight process for Windows laptops.
          It queries SMBIOS tables, WMI hardware infrastructure, SetupAPI device enumeration, and storage IOCTLs (SMART attributes) to capture an unalterable hardware fingerprint.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Installation Required</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Download the double-clickable <strong className="text-white">LaptopTruthScanner.bat</strong> agent script. Double click it on any Windows laptop to scan instantly!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>Native C# & PowerShell Integration</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Queries system CIM & WMI hardware registers directly. Zero third-party spyware or background services.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="/LaptopTruthScanner.bat"
            download="LaptopTruthScanner.bat"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Windows Agent (.bat)</span>
          </a>

          <Link
            href="/scan"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>Test Web Simulation Scan</span>
          </Link>
        </div>
      </div>

      {/* COMPILATION INSTRUCTIONS */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>Build Standalone C# .exe (Optional)</span>
        </h2>

        <p className="text-xs text-slate-400">
          If you prefer a single compiled executable (`LaptopTruthScanner.exe`), compile it using .NET 10 SDK:
        </p>

        <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 flex items-center justify-between">
          <code className="truncate pr-4">{buildCommand}</code>
          <button
            onClick={handleCopyCommand}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors shrink-0"
            title="Copy command"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
