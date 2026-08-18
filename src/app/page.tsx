"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Download,
  Zap,
  HardDrive,
  Battery,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 py-6">
      {/* HERO SECTION */}
      <section className="relative text-center space-y-6 pt-8 pb-12 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/10 to-emerald-500/20 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>The Smart Laptop Checker & Clean Buying Assistant</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Know the <span className="gradient-text">100% Real Hardware Truth</span> Before You Buy
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          <strong className="text-white font-semibold">LaptopWise</strong> checks the real hardware inside any laptop. It tells you if parts are <strong className="text-emerald-400">100% Original</strong>, replaced, or fake, checks the real battery health, and calculates if the price matches fair market value.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/scan"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4" />
            <span>Scan Laptop Now</span>
          </Link>

          <Link
            href="/guide"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-bold text-sm border border-emerald-500/30 flex items-center justify-center gap-2.5 transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>How to Buy Guide</span>
          </Link>

          <Link
            href="/scanner"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl glass-panel hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 flex items-center justify-center gap-2.5 transition-all"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download Scanner</span>
          </Link>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-100">How We Protect You When Buying a Used Laptop</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            We check the real parts inside the laptop so sellers cannot trick you with fake, weak, or replaced parts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 w-max border border-rose-500/20">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Catches Fake Storage Drives</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We check the storage drive chips to make sure it is a genuine brand drive, not a cheap fake copy that could fail and lose your files.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-max border border-amber-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Checks the Charger Power</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We check if the charger gives enough power. Sellers often bundle weak chargers that charge slowly or harm the laptop.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-max border border-emerald-500/20">
              <Battery className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Tests Real Battery Health</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We test how much battery life is left and flag if someone reset the battery numbers to make an old battery look brand new.
            </p>
          </div>
        </div>
      </section>

      {/* CONFIDENCE LABEL EXPLANATION BANNER */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-100">How to Understand Your Report</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Every finding in your report shows a simple badge so you know exactly what is tested and confirmed:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300">
            <div className="font-bold text-sm mb-1">🟢 Verified</div>
            <span>Confirmed directly from the laptop hardware and official maker specs.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300">
            <div className="font-bold text-sm mb-1">🟡 Estimated</div>
            <span>Estimated from system health numbers, but cannot be 100% proven by software.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-300">
            <div className="font-bold text-sm mb-1">🔴 Problem Found</div>
            <span>A real issue, mismatch, or fake part was detected. Be careful before buying.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400">
            <div className="font-bold text-sm mb-1">⚪ Physical Check Needed</div>
            <span>Things software cannot check, like body scratches, screen hinges, or charger cables.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
