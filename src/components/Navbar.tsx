"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Download, Search, BookOpen, GitCompare } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
              Laptop<span className="text-indigo-400">Wise</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v3.0
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">Smart Hardware & Buying Assistant</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
          <Link
            href="/scan"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Scan Laptop</span>
          </Link>

          <Link
            href="/guide"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buying Guide</span>
          </Link>

          <Link
            href="/compare/ai"
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>AI Compare</span>
          </Link>

          <Link
            href="/scanner"
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scanner</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
