"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Download, Terminal, ShieldCheck, Copy, Check, FileCode, ArrowLeft,
  Play, ExternalLink, Zap, CheckCircle2, AlertTriangle, HelpCircle,
  Laptop, Code, Sparkles, Cpu, Layers
} from "lucide-react";

export default function ScannerPage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const dotnetPublishCmd = "dotnet publish LaptopTruthScanner.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o .\\dist";
  const ps1DirectCmd = "powershell -NoProfile -ExecutionPolicy Bypass -File .\\LaptopTruthScanner.ps1";

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      <Link
        href="/scan"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Scan Portal</span>
      </Link>

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Hardware Scanner Download
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Download Your Laptop Scanner
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Choose how you want to scan your laptop. Option 1 (.BAT) is the easiest and runs immediately on any Windows laptop without installing anything.
        </p>
      </div>

      {/* 3 SCANNER CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── OPTION 1: BAT FILE ───────────────────────────────────────── */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 flex flex-col justify-between space-y-5 relative">
          <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 uppercase tracking-wide">
            Easiest & Recommended
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Option 1</span>
                <h3 className="text-lg font-extrabold text-white">Instant Scanner (.bat)</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Single file. Just download and double-click to scan. Works on all Windows 10 and 11 laptops.
            </p>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-200">What It Does:</div>
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex items-start gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Zero installation needed (Single file)</span>
                </li>
                <li className="flex items-start gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Checks real RAM slots, SSD health, battery</span>
                </li>
                <li className="flex items-start gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Opens your Truth Report automatically</span>
                </li>
              </ul>

              <div className="pt-2 font-bold text-slate-200">How to Use:</div>
              <ul className="space-y-1 text-slate-400">
                <li className="flex items-start gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Right-click &rarr; Run as Administrator</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200">How to run:</strong> Double-click or Right-Click &rarr; <span className="text-emerald-400 font-semibold">Run as Administrator</span>.
            </div>
            <a
              href="/LaptopTruthScanner.bat"
              download="LaptopTruthScanner.bat"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download .BAT Launcher</span>
            </a>
          </div>
        </div>

        {/* ── OPTION 2: POWERSHELL PS1 ─────────────────────────────────── */}
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-indigo-950/10 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Option 2</span>
                <h3 className="text-lg font-extrabold text-white">PowerShell Script (.ps1)</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Open script file. You can open and read every line of code before running it on your machine.
            </p>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-200">What It Does:</div>
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex items-start gap-1.5 text-indigo-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>100% open code you can inspect</span>
                </li>
                <li className="flex items-start gap-1.5 text-indigo-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Shows full progress in terminal window</span>
                </li>
                <li className="flex items-start gap-1.5 text-indigo-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Works on any Windows PowerShell</span>
                </li>
              </ul>

              <div className="pt-2 font-bold text-slate-200">How to Run:</div>
              <ul className="space-y-1 text-slate-400">
                <li className="flex items-start gap-1.5 text-indigo-300">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Run command shown below in PowerShell</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-200">Quick Command:</strong>
              <div className="flex items-center justify-between gap-1 mt-1 font-mono text-[10px] text-indigo-300">
                <span className="truncate">{ps1DirectCmd}</span>
                <button
                  onClick={() => copyToClipboard(ps1DirectCmd, "ps1")}
                  className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
                  title="Copy command"
                >
                  {copiedCmd === "ps1" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
            <a
              href="/LaptopTruthScanner.ps1"
              download="LaptopTruthScanner.ps1"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download .PS1 Script</span>
            </a>
          </div>
        </div>

        {/* ── OPTION 3: C# NATIVE AGENT ───────────────────────────────── */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-purple-950/10 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">Option 3</span>
                <h3 className="text-lg font-extrabold text-white">Standalone Program (.exe)</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Single-file Windows program. Copy to a USB drive and scan laptops at shops in Hafeez Center or OLX meetups.
            </p>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-200">What It Does:</div>
              <ul className="space-y-1.5 text-purple-400">
                <li className="flex items-start gap-1.5 text-purple-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Single .EXE file &mdash; ready to use</span>
                </li>
                <li className="flex items-start gap-1.5 text-purple-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Super fast native performance</span>
                </li>
                <li className="flex items-start gap-1.5 text-purple-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Perfect to carry on a USB drive</span>
                </li>
              </ul>

              <div className="pt-2 font-bold text-slate-200">How to Use:</div>
              <ul className="space-y-1 text-slate-400">
                <li className="flex items-start gap-1.5 text-purple-300">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Click download and double-click the .EXE</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800">
            <a
              href="/LaptopTruthScanner.exe"
              download="LaptopTruthScanner.exe"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Compiled .EXE (Ready to Run)</span>
            </a>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="/LaptopTruthScanner_Source.zip"
                download="LaptopTruthScanner_Source.zip"
                className="py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Source (.ZIP)</span>
              </a>
              <a
                href="/BuildExecutable.bat"
                download="BuildExecutable.bat"
                className="py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Build Script</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ── SIDE-BY-SIDE COMPARISON TABLE ────────────────────────────────── */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="font-bold text-slate-100 text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Full Scanner Feature & Limitation Matrix</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Capability / Metric</th>
                <th className="pb-3 font-semibold text-emerald-400">Option 1: .BAT Launcher</th>
                <th className="pb-3 font-semibold text-indigo-400">Option 2: .PS1 Script</th>
                <th className="pb-3 font-semibold text-purple-400">Option 3: C# Native (.exe)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 font-medium text-slate-400">Installation Requirement</td>
                <td className="py-2.5 text-emerald-400 font-bold">Zero (Built-in)</td>
                <td className="py-2.5 text-emerald-400 font-bold">Zero (Built-in)</td>
                <td className="py-2.5 text-amber-400">Requires .NET SDK to compile</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-slate-400">Hardware Access Level</td>
                <td className="py-2.5 text-white">Full WMI + ACPI + CIM</td>
                <td className="py-2.5 text-white">Full WMI + ACPI + CIM</td>
                <td className="py-2.5 text-purple-300 font-bold">Full WMI + Low-Level IOCTL</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-slate-400">Execution Method</td>
                <td className="py-2.5">Double-click in Explorer</td>
                <td className="py-2.5">PowerShell Terminal</td>
                <td className="py-2.5">Double-click compiled EXE</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-slate-400">RAM Slot Detection</td>
                <td className="py-2.5 text-emerald-400">Total & Occupied Slots</td>
                <td className="py-2.5 text-emerald-400">Total & Occupied Slots</td>
                <td className="py-2.5 text-emerald-400">Total & Occupied Slots</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-slate-400">Battery ACPI Capacity & Cycles</td>
                <td className="py-2.5 text-emerald-400">Yes (Run as Admin)</td>
                <td className="py-2.5 text-emerald-400">Yes (Run as Admin)</td>
                <td className="py-2.5 text-emerald-400">Yes (Run as Admin)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-slate-400">SSD SMART Health & Hours</td>
                <td className="py-2.5 text-emerald-400">Yes (StorageReliability)</td>
                <td className="py-2.5 text-emerald-400">Yes (StorageReliability)</td>
                <td className="py-2.5 text-emerald-400">Yes (WMI Storage)</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium text-slate-400">Security & Inspection</td>
                <td className="py-2.5">Plain-text script</td>
                <td className="py-2.5">Plain-text script</td>
                <td className="py-2.5">Open source .CS file</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── HOW TO COMPILE C# INTO STANDALONE EXE ─────────────────────────── */}
      <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">How to Compile the C# Scanner into a Standalone .EXE</h2>
            <p className="text-xs text-slate-400">Follow these 3 simple steps to generate a native `LaptopTruthScanner.exe`</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">1</div>
            <h3 className="font-bold text-slate-100">Install .NET 8 SDK</h3>
            <p className="text-slate-400 leading-relaxed">
              Download and install the official Microsoft .NET 8.0 SDK (x64) installer:
            </p>
            <a
              href="https://dotnet.microsoft.com/download/dotnet/8.0"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold pt-1"
            >
              <span>Microsoft .NET 8 SDK Download</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">2</div>
            <h3 className="font-bold text-slate-100">Run the 1-Click Builder</h3>
            <p className="text-slate-400 leading-relaxed">
              Download <strong className="text-white">BuildExecutable.bat</strong> into your project <code className="text-purple-300">scanner/</code> folder and double-click it.
            </p>
            <span className="text-[11px] text-slate-500 block">It detects .NET SDK and builds the EXE automatically!</span>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">3</div>
            <h3 className="font-bold text-slate-100">Run LaptopTruthScanner.exe</h3>
            <p className="text-slate-400 leading-relaxed">
              Your self-contained executable will be created in <code className="text-emerald-400">scanner\dist\LaptopTruthScanner.exe</code>.
            </p>
            <span className="text-[11px] text-emerald-400 block font-semibold">Copy it to any USB drive and scan any laptop!</span>
          </div>
        </div>

        {/* Manual Build Command */}
        <div className="space-y-2">
          <span className="text-xs text-slate-400 font-medium">Or compile manually via Terminal:</span>
          <div className="relative bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-400 flex items-center justify-between">
            <code className="truncate pr-4">{dotnetPublishCmd}</code>
            <button
              onClick={() => copyToClipboard(dotnetPublishCmd, "dotnet")}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors shrink-0"
              title="Copy command"
            >
              {copiedCmd === "dotnet" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
