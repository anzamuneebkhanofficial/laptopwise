"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ShieldCheck, Share2, ExternalLink, Cpu, HardDrive, Battery,
  Monitor, Sparkles, Check, Loader2, AlertCircle, Clock, Calendar,
  Layers, MemoryStick, Zap, Tag, Store, ShoppingBag, Lightbulb,
  Server, Globe, CheckCircle2, ShieldAlert, Info, Search,
  Award, AlertTriangle, Briefcase, TrendingUp, DollarSign, CheckSquare
} from "lucide-react";
import { ScanReportDocument } from "@/types";
import { TrustScoreGauge } from "@/components/TrustScoreGauge";
import { PdfExportButton } from "@/components/PdfExportButton";
import { auditComponentAuthenticity } from "@/lib/engine/authenticityEngine";

// ─── Score Bar ───────────────────────────────────────────────────────────────
function ScoreBar({
  label,
  score,
  sublabel
}: {
  label: string;
  score: number;
  sublabel?: string;
}) {
  const verdict =
    score >= 8 ? { text: "✓ Best Recommended", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", bar: "bg-emerald-500" } :
    score >= 6 ? { text: "✓ Recommended", bg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30", bar: "bg-indigo-500" } :
    score >= 4 ? { text: "⚠ Basic / Light Tasks Only", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30", bar: "bg-amber-500" } :
                 { text: "✕ Not Recommended", bg: "bg-rose-500/10 text-rose-400 border-rose-500/30", bar: "bg-rose-500" };

  return (
    <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5 hover:border-slate-700/80 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-slate-100 block">{label}</span>
          {sublabel && <span className="text-[10px] text-slate-400 block">{sublabel}</span>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${verdict.bg}`}>
            {verdict.text}
          </span>
          <span className="font-extrabold text-xs text-white bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
            {score}/10
          </span>
        </div>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800/50">
        <div
          className={`h-full rounded-full transition-all ${verdict.bar}`}
          style={{ width: `${Math.min(100, Math.max(5, score * 10))}%` }}
        />
      </div>
    </div>
  );
}

// ─── Health Pill ────────────────────────────────────────────────────────────
function HealthPill({ label, rating }: { label: string; rating?: string }) {
  const r = rating || "Good";
  const cls =
    r === "Good"          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
    r === "Moderate Wear" ? "bg-amber-500/10   text-amber-400   border-amber-500/30"   :
    r === "Monitor"       ? "bg-amber-500/10   text-amber-400   border-amber-500/30"   :
                            "bg-rose-500/10    text-rose-400    border-rose-500/30";
  return (
    <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${cls}`}>{r}</span>
    </div>
  );
}

// ─── Section Box ─────────────────────────────────────────────────────────────
function Section({ title, icon, children, accent = false }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 space-y-3 ${accent ? "border-indigo-500/30 bg-indigo-950/20" : "border-slate-800 bg-slate-900/40"}`}>
      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
        <span className="text-indigo-400">{icon}</span>{title}
      </h3>
      {children}
    </div>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────
function Row({ label, value, highlight, mono, subtext }: {
  label: string; value: string; highlight?: boolean; mono?: boolean; subtext?: string;
}) {
  return (
    <div className="flex flex-col py-2 border-b border-slate-800/60 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs text-slate-400 shrink-0">{label}</span>
        <span className={`text-xs text-right ${highlight ? "text-white font-bold" : "text-slate-200"} ${mono ? "font-mono" : ""}`}>{value}</span>
      </div>
      {subtext && <span className="text-[10px] text-slate-500 mt-0.5">{subtext}</span>}
    </div>
  );
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport]       = useState<ScanReportDocument | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [copiedShare, setCopied]   = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSec(s => +(s + 0.5).toFixed(1));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (elapsedSec > 1.0 && activeStep === 1) setActiveStep(2);
    if (elapsedSec > 2.5 && activeStep === 2) setActiveStep(3);
    if (elapsedSec > 4.5 && activeStep === 3) setActiveStep(4);
  }, [elapsedSec, activeStep]);

  useEffect(() => {
    let attempts = 0;
    let isCancelled = false;

    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/scan/${id}`);
        const data = await res.json();
        if (isCancelled) return;

        if (data.report) {
          setReport(data.report);
          setLoading(false);
        } else if (attempts < 5) {
          attempts++;
          setTimeout(fetchReport, 1000);
        } else {
          setError(data.error || "Scan report not found in active session.");
          setLoading(false);
        }
      } catch (err) {
        if (attempts < 5) {
          attempts++;
          setTimeout(fetchReport, 1000);
        } else {
          if (!isCancelled) {
            setError("Failed to load hardware report. Please try running the scanner again.");
            setLoading(false);
          }
        }
      }
    };

    fetchReport();
    return () => { isCancelled = true; };
  }, [id]);

  const copyShare = () => {
    if (!report) return;
    navigator.clipboard.writeText(`${window.location.origin}/share/${report.shareLinkId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 max-w-md w-full text-center space-y-5 shadow-2xl relative overflow-hidden">
        {/* Glowing aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative">
          <h2 className="text-lg font-bold text-slate-100 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            Testing Laptop Hardware
          </h2>
          <p className="text-xs text-slate-400">
            Checking real hardware and researching official factory specs...
          </p>
          <div className="text-[11px] font-mono text-indigo-400 pt-1 font-semibold">
            Time elapsed: {elapsedSec}s
          </div>
        </div>

        {/* Progress Stepper in Simple English */}
        <div className="space-y-2.5 text-left text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-2.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Hardware details read directly from laptop</span>
          </div>

          <div className={`flex items-center gap-2.5 transition-all ${activeStep >= 2 ? "text-indigo-300 font-semibold" : "text-slate-500"}`}>
            {activeStep >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Loader2 className="w-4 h-4 shrink-0 animate-spin text-indigo-400" />}
            <span>Checking official factory specs & maximum limits</span>
          </div>

          <div className={`flex items-center gap-2.5 transition-all ${activeStep >= 3 ? "text-indigo-300 font-semibold" : "text-slate-500"}`}>
            {activeStep >= 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : activeStep === 3 ? <Loader2 className="w-4 h-4 shrink-0 animate-spin text-indigo-400" /> : <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />}
            <span>Checking Pakistan market prices (Paklap, Hafeez Centre, OLX)</span>
          </div>

          <div className={`flex items-center gap-2.5 transition-all ${activeStep >= 4 ? "text-amber-300 font-semibold" : "text-slate-500"}`}>
            {activeStep >= 4 ? <Loader2 className="w-4 h-4 shrink-0 animate-spin text-amber-400" /> : <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />}
            <span>Writing simple, honest report</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !report) return (
    <div className="glass-panel p-8 rounded-3xl text-center max-w-lg mx-auto my-12 border border-rose-500/30 space-y-4">
      <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
      <h2 className="text-xl font-bold text-slate-100">Report Not Found</h2>
      <p className="text-xs text-slate-400">{error}</p>
      <Link href="/scan" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
        Go Back to Scan Portal
      </Link>
    </div>
  );

  const { rawFingerprint: fp, matchedSpec, findings, trustScore, aiReport } = report;
  const authenticityReport = auditComponentAuthenticity(fp, matchedSpec || null);
  const totalRamGB    = fp.ram.reduce((a, b) => a + b.capacityGB, 0);
  const primaryDisk   = fp.storage[0];
  const battery       = fp.battery;
  const batteryHealth = battery.designCapacityMWh > 0
    ? Math.round((battery.fullChargeCapacityMWh / battery.designCapacityMWh) * 100) : 0;

  const budgetAnalysis   = aiReport.budgetAnalysis;
  const oemValidation    = aiReport.oemValidation;
  const useCaseScores    = aiReport.useCaseScores;
  const buyScore         = aiReport.buyScore  ?? trustScore;
  const buyRec           = aiReport.buyRecommendation ?? "BUY";

  const buyRecColor =
    buyRec === "BUY"       ? "bg-emerald-600 text-white" :
    buyRec === "NEGOTIATE" ? "bg-amber-600 text-white"   : "bg-rose-600 text-white";

  const verdictColor: Record<string, string> = {
    "Great Deal":  "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    "Fair Price":  "bg-indigo-500/10  text-indigo-400  border-indigo-500/30",
    "Overpriced":  "bg-amber-500/10   text-amber-400   border-amber-500/30",
    "High Risk":   "bg-rose-500/10    text-rose-400    border-rose-500/30",
    "Underpriced – Inspect Carefully": "bg-amber-500/10 text-amber-400 border-amber-500/30",
  };

  const bav = budgetAnalysis?.budgetVerdict ?? aiReport.priceBreakdown.verdict;

  return (
    <div className="space-y-7 py-4">

      {/* ── PRINT-ONLY EXECUTIVE HEADER ──────────────────────────────────── */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">LaptopWise™ Hardware Truth Report</h1>
            <p className="text-xs text-slate-600 font-semibold">Physical Telemetry & OEM Compliance Audit · Zero-Guesswork Precision</p>
          </div>
          <div className="text-right text-xs">
            <span className="font-extrabold text-indigo-900 block">
              {aiReport.providerUsed === "gemini"
                ? "AI Engine: Google Gemini AI"
                : "AI Engine: Groq AI"}
            </span>
            <span className="text-slate-500 font-mono text-[10px]">
              Scanned: {new Date(report.scannedAt).toLocaleDateString()} · SN: {report.serialNumber}
            </span>
          </div>
        </div>
      </div>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${report.isManualMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"}`}>
              {report.isManualMode ? "BUYER ADVISOR REPORT" : "HARDWARE TRUTH REPORT"}
            </span>
            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400" />
              {aiReport.laptopAgeYears} Years Old
            </span>
            {aiReport.isTooOldForHeavyTasks
              ? <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">⚠ Older Model</span>
              : <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓ Modern</span>
            }

            {/* AI Provider Badge in Clean Simple English */}
            {aiReport.providerUsed === "gemini" ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Verified by Google Gemini AI
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                Verified by Groq AI
              </span>
            )}

            {/* Buy Verdict badge */}
            <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full ${buyRecColor}`}>
              {buyRec === "NEGOTIATE" ? `NEGOTIATE ↓ ${budgetAnalysis?.currency || "PKR"} ${budgetAnalysis?.negotiateToPrice?.toLocaleString() ?? ""}` : buyRec}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {report.laptopModel.toLowerCase().startsWith(report.brand.toLowerCase())
              ? report.laptopModel
              : `${report.brand} ${report.laptopModel}`}
          </h1>
          {oemValidation && (
            <p className="text-xs text-slate-400">
              Confirmed Factory Model: <strong className="text-indigo-400">{oemValidation.confirmedModel} ({oemValidation.releaseYear})</strong>
              <span className="ml-2 text-slate-500">— {oemValidation.sourceNote}</span>
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
            {report.userWorkload && (
              <span className="text-indigo-300 font-semibold flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> For: {report.userWorkload}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Checked: {new Date(report.scannedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <PdfExportButton />
          <button onClick={copyShare} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition-all">
            {copiedShare ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? "Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* ── BUY SCORE + AI VERDICT ────────────────────────────────────────── */}
      <div className={`grid grid-cols-1 ${report.isManualMode ? "" : "lg:grid-cols-3"} gap-5`}>
        {!report.isManualMode && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-center">
            <TrustScoreGauge score={buyScore} size={180} />
          </div>
        )}

        <div className={`${report.isManualMode ? "col-span-1" : "lg:col-span-2"} glass-panel p-6 rounded-3xl border border-indigo-500/20 space-y-4 flex flex-col justify-between`}>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  {report.isManualMode ? "AI Expert Research & Cross-Check Summary" : "AI Hardware Summary"}
                </h3>
              </div>
              {aiReport.providerUsed === "gemini" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[11px] font-bold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verified by Google Gemini AI</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Verified by Groq AI</span>
                </span>
              )}
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">"{aiReport.summary}"</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            {aiReport.useCaseTags.map((tag, i) => (
              <span key={i} className={`px-3 py-1 rounded-full text-xs font-bold border ${tag === "Avoid / Caution" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── USE-CASE PERFORMANCE SCORES (All 5 Workloads) ─────────────────── */}
      {useCaseScores && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Performance & Suitability Scores for All 5 Workloads (out of 10)
            </h2>
            <span className="text-[11px] text-slate-400">
              Evaluated based on processor generation, RAM capacity & graphics
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <ScoreBar
              label="💻 1. Software & Web Development"
              sublabel="Coding, VS Code, Node.js, Python, Full-Stack Web"
              score={useCaseScores.webDevelopment ?? useCaseScores.codingAndDevOps ?? 6}
            />
            <ScoreBar
              label="📱 2. App Development"
              sublabel="Android Studio, Flutter, iOS/Xcode, Heavy Emulators"
              score={useCaseScores.appDevelopment ?? (useCaseScores.webDevelopment ? Math.max(1, useCaseScores.webDevelopment - 1) : 5)}
            />
            <ScoreBar
              label="🏢 3. Office Use & Everyday Study"
              sublabel="MS Word, Excel, Zoom, PowerPoint, Web Browsing"
              score={useCaseScores.officeAndStudy ?? 8}
            />
            <ScoreBar
              label="🎨 4. Graphic Design & Video Editing"
              sublabel="Adobe Premiere Pro, Photoshop, After Effects, 3D/Blender"
              score={useCaseScores.videoEditingAndDesign ?? 4}
            />
            <div className="sm:col-span-2">
              <ScoreBar
                label="🎮 5. Gaming & Competitive Esports"
                sublabel="Pure Gaming, GTA V, Valorant, CS2, Cyberpunk, AAA Titles"
                score={useCaseScores.gaming ?? 2}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── OEM / FACTORY SPEC VERIFICATION (Only for Hardware Scan Mode) ─ */}
      {!report.isManualMode && oemValidation && (
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-indigo-950/10 space-y-4">
          <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Official Factory Specs & Upgrade Limits (OEM Check)</h2>
                <p className="text-xs text-slate-400">
                  What the maker (<span className="text-slate-200 font-semibold">{report.brand || "manufacturer"}</span>) officially designed and allowed for this model
                </p>
              </div>
            </div>
            <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${oemValidation.specMatchNote.includes("Matches") ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}`}>
              {oemValidation.specMatchNote.includes("Matches") ? "✓ Matches Official Maker Specs" : oemValidation.specMatchNote}
            </span>
          </div>

          {/* Quick explanation for non-technical buyers */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <p>
                <strong>What does this section tell you?</strong> OEM stands for <em>Original Equipment Manufacturer</em> (the company that made this laptop). This section shows the official limits set by the manufacturer — telling you the maximum RAM you can upgrade to, how many slots exist inside, and which charger power is safe to use.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {[
              {
                label: "Maximum RAM Limit",
                value: `${oemValidation.maxRamGB} GB RAM`,
                help: "The highest amount of memory this laptop's motherboard can support",
              },
              {
                label: "RAM Slots Inside",
                value: oemValidation.ramSlots,
                help: "Number of memory slots available for upgrading",
              },
              {
                label: "Storage Drive Slots",
                value: oemValidation.storageBays,
                help: "Internal slot type for adding or replacing your SSD drive",
              },
              {
                label: "Required Official Charger",
                value: `${oemValidation.officialChargerWattageW}W Charger`,
                help: "The exact power wattage the laptop was designed to run on",
              },
              {
                label: "Official Data Source",
                value: oemValidation.sourceNote,
                help: "Verified from manufacturer spec sheets & hardware manuals",
              },
              {
                label: "AI Verification Engine",
                value: aiReport.providerUsed === "gemini" ? "Google Gemini AI" : "Groq AI",
                help: "Cross-checked and researched live by AI",
              },
            ].map((i, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px] font-semibold block">{i.label}</span>
                <span className="font-bold text-white text-sm block">{i.value}</span>
                <span className="text-[10px] text-slate-400 block leading-tight">{i.help}</span>
              </div>
            ))}
          </div>

          {aiReport.chargerStatusNote && (
            <div className="flex items-start gap-2 text-xs text-indigo-200 bg-indigo-950/50 p-3.5 rounded-2xl border border-indigo-500/20">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{aiReport.chargerStatusNote}</span>
            </div>
          )}

          {oemValidation.referenceUrls && oemValidation.referenceUrls.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">
                Double-check official specifications online:
              </span>
              <div className="flex flex-wrap gap-2">
                {oemValidation.referenceUrls.map((url, i) => {
                  const isGoogle = url.includes("google.com");
                  const isNotebookcheck = url.includes("notebookcheck.net");
                  const label = isGoogle
                    ? "🔍 Search Official Spec Sheet on Google"
                    : isNotebookcheck
                    ? "📖 View Hardware Specs & Review on Notebookcheck"
                    : `🔗 Official Source #${i + 1}`;
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
                    >
                      <span>{label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── BUDGET ANALYSIS ───────────────────────────────────────────────── */}
      {budgetAnalysis && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Price & Budget Analysis</h3>
                <p className="text-xs text-slate-400">{budgetAnalysis.dataSource}</p>
              </div>
            </div>
            <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${verdictColor[bav] || "bg-slate-700 text-slate-300 border-slate-600"}`}>
              {bav}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                <Store className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold">Local Market Estimate</span>
              </div>
              <div className="text-xl font-extrabold text-white">{budgetAnalysis.currency} {budgetAnalysis.fairMarketMin.toLocaleString()}</div>
              <div className="text-slate-400">to {budgetAnalysis.currency} {budgetAnalysis.fairMarketMax.toLocaleString()}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">Online Market Estimate</span>
              </div>
              <div className="text-xl font-extrabold text-white">{budgetAnalysis.currency} {budgetAnalysis.onlineMin.toLocaleString()}</div>
              <div className="text-slate-400">to {budgetAnalysis.currency} {budgetAnalysis.onlineMax.toLocaleString()}</div>
            </div>

            {(report.userBudgetDisplay || budgetAnalysis.userBudget) && (
              <div className={`p-4 rounded-2xl border ${bav === "Great Deal" ? "bg-emerald-950/30 border-emerald-500/30" : bav === "Overpriced" ? "bg-rose-950/30 border-rose-500/30" : "bg-indigo-500/10 border-indigo-500/20"}`}>
                <div className="flex items-center gap-1.5 text-slate-300 mb-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="font-semibold">Your Budget / Asking Price</span>
                </div>
                <div className="text-xl font-extrabold text-white">
                  {report.userBudgetDisplay || `${budgetAnalysis.currency} ${budgetAnalysis.userBudget?.toLocaleString()}`}
                </div>
                {bav === "Overpriced" && budgetAnalysis.negotiateToPrice && (
                  <div className="text-rose-400 text-[11px] font-bold mt-1">
                    Negotiate to {budgetAnalysis.currency} {budgetAnalysis.negotiateToPrice.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>{budgetAnalysis.priceAdvice}</p>
          </div>

          {budgetAnalysis.referenceUrls && budgetAnalysis.referenceUrls.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">
                Double-check market prices online:
              </span>
              <div className="flex flex-wrap gap-2">
                {budgetAnalysis.referenceUrls.map((url, i) => {
                  const isPaklap = url.includes("paklap.pk");
                  const isCzone = url.includes("czone.com.pk");
                  const isOlx = url.includes("olx.com.pk");
                  const label = isPaklap
                    ? "🔍 Search on Paklap Pakistan"
                    : isCzone
                    ? "🔍 Search on CZone Pakistan"
                    : isOlx
                    ? "🔍 Search on OLX Pakistan"
                    : `🔗 Price Source #${i + 1}`;
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
                    >
                      <span>{label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── HARDWARE SPECS & CAPABILITIES ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* CPU */}
        <Section title="Processor (CPU)" icon={<Cpu className="w-4 h-4" />}>
          <Row label="Processor Model"      value={fp.cpu.model} highlight />
          <Row label="Cores & Processing Units" value={`${fp.cpu.cores} Cores / ${fp.cpu.threads} Threads`} />
          <Row label="Base Clock Speed"     value={`${fp.cpu.baseClockGHz} GHz`} />
          {!report.isManualMode && oemValidation && <Row label="Official Model Name" value={oemValidation.confirmedModel} />}
          {report.isManualMode && report.userWorkload && <Row label="Primary Use Case" value={report.userWorkload} highlight />}
        </Section>

        {/* RAM */}
        <Section title="Memory (RAM)" icon={<MemoryStick className="w-4 h-4" />}>
          <Row label={report.isManualMode ? "Entered Memory" : "Installed Memory"} value={`${totalRamGB} GB (${fp.ram[0]?.speedMHz || 2400} MHz)`} highlight />
          <Row label="Maximum Supported"   value={`${oemValidation?.maxRamGB ?? matchedSpec?.maxRamGB ?? 32} GB`} highlight />
          <Row label="Memory Slots Inside" value={fp.ramSlotsInfo ? `${fp.ramSlotsInfo.totalPhysicalSlots} Slot(s) — ${fp.ram[0]?.channel === "dual" ? "Dual Channel (2 sticks)" : "Single Channel (1 stick)"}` : (oemValidation?.ramSlots ?? matchedSpec?.ramSlots ?? "2 SODIMM Slots")} />
          <div className="pt-1.5 p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
            {aiReport.ramUpgradeAdvice}
          </div>
        </Section>

        {/* Storage */}
        <Section title="Storage Drive" icon={<HardDrive className="w-4 h-4" />}>
          {fp.storage && fp.storage.length > 1 ? (
            <>
              <Row label="Total Storage Space" value={`${fp.storage.reduce((sum, d) => sum + (d.capacityGB || 0), 0)} GB (${fp.storage.length} Drives)`} highlight />
              {fp.storage.map((d, i) => (
                <Row key={i} label={`Drive ${i + 1} (${d.type})`} value={`${d.capacityGB} GB ${d.type}`} />
              ))}
            </>
          ) : (
            <>
              <Row label="Drive Type" value={primaryDisk?.type || "SSD"} highlight />
              <Row label="Total Storage Space" value={`${primaryDisk?.capacityGB ?? 256} GB`} highlight />
            </>
          )}
          {!report.isManualMode && (
            <>
              <Row label="Drive Health" value={`${primaryDisk?.smart?.wearPercent ?? 90}% Health`} />
              <HealthPill label="Drive Condition" rating={aiReport.storageHealthRating} />
            </>
          )}
          {report.isManualMode && (
            <Row label="Available Expansion" value={oemValidation?.storageBays ?? matchedSpec?.supportedStorageTypes?.join(", ") ?? "1x M.2 NVMe SSD Slot"} />
          )}
          <div className="pt-1.5 p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
            {aiReport.storageUpgradeAdvice}
          </div>
        </Section>

        {/* Battery */}
        <Section title="Battery Condition" icon={<Battery className="w-4 h-4" />}>
          <Row label="Battery Health"    value={`${batteryHealth}%`} highlight />
          {!report.isManualMode && battery.designCapacityMWh > 0 && (
            <>
              <Row label="Original Factory Capacity"  value={`${battery.designCapacityMWh} mWh`} />
              <Row label="Current Full Capacity" value={`${battery.fullChargeCapacityMWh} mWh`} />
              <Row label="Total Charge Count" value={`${battery.cycleCount ?? 0} cycles`} />
            </>
          )}
          {!report.isManualMode && (
            <HealthPill label="Battery Condition" rating={aiReport.batteryHealthRating} />
          )}
          <div className="pt-1.5 p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200">
            {aiReport.batteryBackupAdvice}
          </div>
        </Section>

        {/* Charger */}
        <Section title="Charger & Power Adapter" icon={<Zap className="w-4 h-4" />}>
          <Row label={report.isManualMode ? "Entered Charger" : "Connected Charger"} value={`${fp.adapter.reportedWattageW}W`} highlight />
          <Row label="Recommended by Maker" value={`${oemValidation?.officialChargerWattageW ?? matchedSpec?.officialChargerWattageW ?? 65}W`} />
          <div className="pt-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            {aiReport.chargerStatusNote}
          </div>
        </Section>

        {/* Screen */}
        <Section title="Screen & Graphics" icon={<Monitor className="w-4 h-4" />}>
          <Row label="Screen Resolution"  value={fp.display.resolution} highlight />
          <Row label="Refresh Speed"      value={`${fp.display.refreshHz} Hz`} />
          {fp.gpu && fp.gpu.length > 0 && fp.gpu.map((g, i) => (
            <Row key={i} label={`Graphics Card ${i + 1}`} value={g.name} />
          ))}
        </Section>

      </div>

      {/* ── HARDWARE SCAN ORIGINALITY (Only for .BAT / .EXE scans) ─────────── */}
      {!report.isManualMode && (
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Original Parts vs Replacement Check</h2>
              <p className="text-xs text-slate-400">We check if each part inside is the original factory part or if it has been replaced.</p>
            </div>
            <div className="ml-auto text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall</span>
              <span className="text-xs font-extrabold text-emerald-400">{authenticityReport.overallVerdict}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authenticityReport.items.map((item) => (
              <div key={item.id}
                className={`p-4 rounded-2xl border space-y-2.5 bg-slate-950/70 ${
                  item.badgeColor === "emerald" ? "border-emerald-500/20" :
                  item.badgeColor === "indigo"  ? "border-indigo-500/20"  :
                  item.badgeColor === "amber"   ? "border-amber-500/20"   :
                                                  "border-rose-500/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">{item.component}</span>
                    <h4 className="text-xs font-bold text-white mt-0.5 truncate">{item.displayName}</h4>
                    <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      item.isFactoryOriginal
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : item.badgeColor === "rose"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}>
                      {item.isFactoryOriginal ? "✓ ORIGINAL" : item.badgeColor === "rose" ? "🚫 HIGH RISK" : "⚠ MODIFIED / REPLACED"}
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${
                    item.badgeColor === "emerald" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                    item.badgeColor === "indigo"  ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"   :
                    item.badgeColor === "amber"   ? "bg-amber-500/10 text-amber-400 border-amber-500/30"      :
                                                    "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  }`}>{item.verdictLabel}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">{item.explanation}</p>
                <div className="text-[10px] text-slate-400 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="font-mono truncate">{item.technicalEvidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RED FLAGS ────────────────────────────────────────────────────── */}
      {aiReport.redFlags && aiReport.redFlags.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 space-y-3">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Important Warnings
          </h3>
          <ul className="space-y-2">
            {aiReport.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── WARRANTY LINKS ────────────────────────────────────────────────── */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-100 text-sm">Verify Serial on Official Brand Website</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Check serial <strong className="font-mono text-white">"{report.serialNumber}"</strong>:
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {report.brand.toLowerCase().includes("dell") ? (
            <a href="https://www.dell.com/support/home" target="_blank" rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all">
              Dell Service Tag <ExternalLink className="w-3 h-3" />
            </a>
          ) : report.brand.toLowerCase().includes("hp") ? (
            <a href="https://support.hp.com/checkwarranty" target="_blank" rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all">
              HP Warranty <ExternalLink className="w-3 h-3" />
            </a>
          ) : report.brand.toLowerCase().includes("apple") ? (
            <a href="https://checkcoverage.apple.com" target="_blank" rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all">
              Apple Coverage <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <a href="https://pcsupport.lenovo.com/warrantylookup" target="_blank" rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all">
              {report.brand} Warranty <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

    </div>
  );
}
