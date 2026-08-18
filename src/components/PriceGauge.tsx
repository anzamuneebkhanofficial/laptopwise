import React from "react";
import { Tag, Store, ShoppingBag, Lightbulb } from "lucide-react";
import { PriceBreakdownPKR } from "@/types";

interface Props {
  priceBreakdown: PriceBreakdownPKR;
}

export const PriceGauge: React.FC<Props> = ({ priceBreakdown }) => {
  const {
    bazaarMinPKR,
    bazaarMaxPKR,
    onlineRetailMinPKR,
    onlineRetailMaxPKR,
    askingPricePKR,
    verdict,
    simplePriceAdvice,
  } = priceBreakdown;

  const verdictColors = {
    "Great Deal": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    "Fair Price": "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    "Overpriced": "bg-amber-500/10 text-amber-400 border-amber-500/30",
    "High Risk": "bg-rose-500/10 text-rose-400 border-rose-500/30",
  }[verdict];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Pakistan Market Price Benchmark</h3>
            <p className="text-xs text-slate-400">Hafeez Centre, Techno City, Paklap, CZone & OLX PK</p>
          </div>
        </div>

        <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${verdictColors}`}>
          {verdict}
        </span>
      </div>

      {/* Two-Column Benchmark Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Hafeez Centre / Local Bazaar Price */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
            <Store className="w-3.5 h-3.5 text-indigo-400" />
            <span>Physical IT Bazaars (Hafeez Centre / Techno City)</span>
          </div>
          <div className="font-extrabold text-sm text-slate-100">
            PKR {bazaarMinPKR.toLocaleString()} — {bazaarMaxPKR.toLocaleString()}
          </div>
        </div>

        {/* Verified PK Retail / Online Price */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified PK Retailers (Paklap, CZone, Mega.pk)</span>
          </div>
          <div className="font-extrabold text-sm text-slate-100">
            PKR {onlineRetailMinPKR.toLocaleString()} — {onlineRetailMaxPKR.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Asking Price Comparison */}
      {askingPricePKR && (
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs">
          <span className="text-indigo-300 font-semibold">Seller Asking Price:</span>
          <span className="font-extrabold text-white text-sm">PKR {askingPricePKR.toLocaleString()}</span>
        </div>
      )}

      {/* Simple Price Advice */}
      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{simplePriceAdvice}</p>
      </div>
    </div>
  );
};
