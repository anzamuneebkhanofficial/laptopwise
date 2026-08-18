"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen, HelpCircle, Store, Eye, Terminal, ShieldAlert,
  Layers, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight,
  ExternalLink, Copy, Check, Info, Sparkles, Download, ArrowRight,
  Search, ShieldCheck, Cpu, HardDrive, Battery, MemoryStick, Laptop,
  Lightbulb, AlertOctagon, CheckSquare
} from "lucide-react";
import { BUYING_GUIDE_SECTIONS, GuideSection, GuideTool } from "@/data/buyingGuideContent";

// Icon mapping helper
function getSectionIcon(iconName: string, className: string = "w-5 h-5") {
  switch (iconName) {
    case "HelpCircle": return <HelpCircle className={className} />;
    case "Store": return <Store className={className} />;
    case "Eye": return <Eye className={className} />;
    case "Terminal": return <Terminal className={className} />;
    case "ShieldAlert": return <ShieldAlert className={className} />;
    case "Layers": return <Layers className={className} />;
    case "AlertTriangle": return <AlertTriangle className={className} />;
    case "CheckCircle": return <CheckCircle className={className} />;
    default: return <BookOpen className={className} />;
  }
}

// Tool Card Component
function DiagnosticToolCard({ tool }: { tool: GuideTool }) {
  const [copied, setCopied] = useState(false);

  const copyCommand = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {tool.category}
          </span>
          <h4 className="text-sm font-extrabold text-white pt-1">{tool.name}</h4>
        </div>
        {tool.officialUrl && (
          <a
            href={tool.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 border border-slate-700 transition-all"
            title="Open official site"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        {tool.description}
      </p>

      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-emerald-300 space-y-1">
        <strong className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Why use it:</strong>
        <p className="leading-tight text-slate-200">{tool.whyUseIt}</p>
      </div>

      {tool.isCommand ? (
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-indigo-300">
          <code className="truncate">{tool.commandOrUrl}</code>
          <button
            onClick={() => copyCommand(tool.commandOrUrl)}
            className="shrink-0 px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-[10px] font-sans font-bold flex items-center gap-1 transition-all"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      ) : tool.officialUrl ? (
        <a
          href={tool.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 hover:text-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <span>Official Download Page</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      ) : null}
    </div>
  );
}

export default function GuidePage() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const currentSection: GuideSection = BUYING_GUIDE_SECTIONS[currentStepIndex];

  const totalSteps = BUYING_GUIDE_SECTIONS.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  const goToNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4 sm:px-6">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-lg">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive Buying Guide Session</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          How to Buy a Laptop or PC Safely
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          A step-by-step masterclass in plain English. Learn how to inspect hardware, test parts in under 5 minutes, avoid scams in markets like Hafeez Center, and get the best value for your money.
        </p>
      </div>

      {/* ── PROGRESS BAR & STEP PILLS ────────────────────────────────────── */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="w-4 h-4" />
            Step {currentStepIndex + 1} of {totalSteps}: <strong className="text-white">{currentSection.title}</strong>
          </span>
          <span className="font-mono text-slate-400">{progressPercent}% Completed</span>
        </div>

        {/* Progress Line */}
        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Horizontal Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
          {BUYING_GUIDE_SECTIONS.map((sec, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-1.5 ${
                  isActive
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/50"
                    : isCompleted
                    ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300 hover:bg-slate-800/80"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-indigo-500 text-white"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {idx + 1}
                  </span>
                  {isCompleted ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    getSectionIcon(sec.iconName, `w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`)
                  )}
                </div>
                <span className="text-[11px] font-semibold line-clamp-1 leading-tight text-slate-200">
                  {sec.title.split("—")[0].trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ACTIVE STEP CONTENT PANEL ────────────────────────────────────── */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-indigo-950/10 space-y-6 shadow-2xl">

        {/* Section Header */}
        <div className="flex items-start sm:items-center justify-between flex-wrap gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg">
              {getSectionIcon(currentSection.iconName, "w-6 h-6")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {currentSection.badge || `Step ${currentSection.stepNumber} of ${totalSteps}`}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white pt-1">
                {currentSection.title}
              </h2>
            </div>
          </div>

          <span className="text-xs text-slate-400 hidden sm:block">
            Estimated read: <strong>2 minutes</strong>
          </span>
        </div>

        {/* Short Summary */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
          {currentSection.shortSummary}
        </p>

        {/* Key Takeaway Banner */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-xs sm:text-sm text-amber-200 flex items-start gap-3 shadow-md">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-amber-300 block font-bold text-xs uppercase tracking-wider">Golden Rule & Takeaway:</strong>
            <p className="leading-relaxed text-slate-200">{currentSection.keyTakeaway}</p>
          </div>
        </div>

        {/* Subsections Content */}
        <div className="space-y-6">
          {currentSection.subsections.map((sub, sIdx) => (
            <div key={sIdx} className="space-y-3 p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                {sub.heading}
              </h3>

              {sub.description && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {sub.description}
                </p>
              )}

              {sub.points && sub.points.length > 0 && (
                <ul className="space-y-2.5 pt-1">
                  {sub.points.map((pt, pIdx) => {
                    const isRedFlag = pt.startsWith("🚫");
                    return (
                      <li
                        key={pIdx}
                        className={`text-xs sm:text-sm leading-relaxed rounded-xl p-3 border flex items-start gap-2.5 ${
                          isRedFlag
                            ? "bg-rose-950/20 border-rose-500/30 text-rose-200 font-semibold"
                            : "bg-slate-900/60 border-slate-800/80 text-slate-300"
                        }`}
                      >
                        {!isRedFlag && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                        <span className="flex-1">{pt}</span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {sub.callout && (
                <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-2.5 mt-2 ${
                  sub.callout.type === "danger"
                    ? "bg-rose-950/30 border-rose-500/40 text-rose-200"
                    : sub.callout.type === "warning"
                    ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                    : sub.callout.type === "tip"
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                    : "bg-indigo-950/30 border-indigo-500/40 text-indigo-200"
                }`}>
                  {sub.callout.type === "danger" && <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                  {sub.callout.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                  {sub.callout.type === "tip" && <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  {sub.callout.type === "info" && <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
                  <div className="space-y-0.5">
                    <strong className="block font-bold">{sub.callout.title}</strong>
                    <p className="leading-relaxed">{sub.callout.text}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Diagnostic Tools Section (if present in step) */}
        {currentSection.tools && currentSection.tools.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-extrabold text-white">Recommended Free Testing Tools</h3>
                <p className="text-xs text-slate-400">Click to copy the command or visit official download pages:</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {currentSection.tools.map((tool, tIdx) => (
                <DiagnosticToolCard key={tIdx} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP NAVIGATION BUTTONS ──────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-slate-800">
          <button
            onClick={goToPrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
              currentStepIndex === 0
                ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800"
                : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-md"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStepIndex === totalSteps - 1 ? (
              <Link
                href="/scan"
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Now Run a Free Laptop Scan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={goToNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                <span>Next Step: {BUYING_GUIDE_SECTIONS[currentStepIndex + 1]?.title.split("—")[0].trim()}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ── FOOTER CALLOUT: 3 SCANNER OPTIONS ────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Ready to Test a Real Laptop? Download Our Free Scanner
              </h2>
              <p className="text-xs text-slate-400">
                Run our single-file zero-install scanner on any Windows laptop in 10 seconds to generate a complete truth audit.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Recommended Tool</span>
              <h4 className="text-sm font-bold text-white">LaptopWise 1-Click Hardware Scanner (.bat)</h4>
              <p className="text-xs text-slate-400">Zero install (23 KB). Right-click &rarr; Run as Administrator to check battery wear, RAM slots, and fake SSDs instantly.</p>
            </div>
            <a
              href="/api/scanner/download"
              onClick={(e) => {
                if (typeof window !== "undefined" && window.location.origin) {
                  e.currentTarget.href = `/api/scanner/download?origin=${encodeURIComponent(window.location.origin)}`;
                }
              }}
              download="LaptopWiseScanner.bat"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Scanner (.bat)</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
