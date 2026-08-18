"use client";

import React from "react";
import { Download, Printer } from "lucide-react";

export const PdfExportButton: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-colors shadow-sm"
    >
      <Printer className="w-4 h-4 text-indigo-400" />
      <span>Print / PDF Export</span>
    </button>
  );
};
