"use client";

import React, { useState, useEffect } from "react";
import { Layers, Plus, Loader2 } from "lucide-react";
import { ScanReportDocument } from "@/types";
import { CompareTable } from "@/components/CompareTable";
import { MOCK_SCENARIOS } from "@/lib/scanner/mockPayloads";

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "genuine_thinkpad_t480",
    "suspect_hp_elitebook_840_g5",
    "underpowered_charger_dell_5490",
  ]);
  const [reports, setReports] = useState<ScanReportDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const res = await fetch("/api/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scanIds: selectedIds }),
        });
        const data = await res.json();
        if (data.reports) {
          setReports(data.reports);
        }
      } catch (err) {
        console.error("Error loading compare reports:", err);
      } finally {
        setLoading(false);
      }
    }

    if (selectedIds.length > 0) {
      loadReports();
    } else {
      setReports([]);
      setLoading(false);
    }
  }, [selectedIds]);

  const toggleScenario = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 3) {
        alert("You can compare up to 3 candidate laptops at a time.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
          <Layers className="w-3.5 h-3.5" />
          <span>Side-by-Side Laptop Comparison</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Compare Scanned Laptops</h1>
        <p className="text-xs text-slate-400">
          Compare candidate laptops by Trust Score, PKR market valuation, component wear, and red flags before deciding.
        </p>
      </div>

      {/* Scenario Selector Chips */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-300">Select Laptops to Compare (Max 3):</span>
        <div className="flex flex-wrap gap-2">
          {MOCK_SCENARIOS.map((s) => {
            const isSelected = selectedIds.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleScenario(s.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                <span>{s.name}</span>
                {isSelected && <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-bold">Selected</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading side-by-side specs...</span>
        </div>
      ) : reports.length > 0 ? (
        <CompareTable reports={reports} />
      ) : (
        <div className="glass-panel p-8 text-center text-xs text-slate-400 rounded-2xl border border-slate-800">
          Select at least 1 laptop scenario above to render the comparison table.
        </div>
      )}
    </div>
  );
}
