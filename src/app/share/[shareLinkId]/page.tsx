"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ShieldCheck, Clock, Tag, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { ScanReportDocument } from "@/types";
import { TrustScoreGauge } from "@/components/TrustScoreGauge";
import { PriceGauge } from "@/components/PriceGauge";
import { ComponentCard } from "@/components/ComponentCard";
import { RedFlagsAccordion } from "@/components/RedFlagsAccordion";

export default function PublicSharePage({ params }: { params: Promise<{ shareLinkId: string }> }) {
  const { shareLinkId } = use(params);
  const [report, setReport] = useState<ScanReportDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSharedReport() {
      try {
        const res = await fetch(`/api/share/${shareLinkId}`);
        const data = await res.json();
        if (data.report) {
          setReport(data.report);
        } else {
          setError(data.error || "Shared report not found");
        }
      } catch (err) {
        setError("Failed to load shared report");
      } finally {
        setLoading(false);
      }
    }
    fetchSharedReport();
  }, [shareLinkId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Fetching Verified Public Report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center max-w-lg mx-auto my-12 space-y-4 border border-rose-500/30">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-100">Public Report Expired or Invalid</h2>
        <p className="text-xs text-slate-400">{error || "This shared report link is unavailable."}</p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
        >
          Go to LaptopWise Home
        </Link>
      </div>
    );
  }

  const { rawFingerprint, matchedSpec, findings, trustScore, aiReport } = report;

  const totalRamGB = rawFingerprint.ram.reduce((a, b) => a + b.capacityGB, 0);
  const primaryRam = rawFingerprint.ram[0] || { manufacturer: "OEM", speedMHz: 2400, channel: "single" };
  const primaryDisk = rawFingerprint.storage[0] || { capacityGB: 0, type: "SSD", model: "Storage Device", firmware: "N/A" };
  const battery = rawFingerprint.battery;

  return (
    <div className="space-y-8 py-4">
      {/* PUBLIC HEADER BANNER */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 to-slate-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Public Hardware Report
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {report.brand} {report.laptopModel}
          </h1>

          <p className="text-xs text-slate-400">
            This public hardware report was verified by direct scan on{" "}
            {new Date(report.scannedAt).toLocaleDateString()}.
          </p>
        </div>

        <Link
          href="/scan"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-colors whitespace-nowrap"
        >
          Scan Your Own Laptop
        </Link>
      </div>

      {/* TOP ROW: TRUST GAUGE & VERDICT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-center">
          <TrustScoreGauge score={trustScore} size={180} />
        </div>

        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-100 text-sm">Simple Verified Summary</h3>
            <p className="text-slate-300 text-sm leading-relaxed">"{aiReport.summary}"</p>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Suitable For:</span>
            <div className="flex flex-wrap gap-2">
              {aiReport.useCaseTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRICE EVALUATION & RED FLAGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceGauge priceBreakdown={aiReport.priceBreakdown} />
        <RedFlagsAccordion redFlags={aiReport.redFlags} />
      </div>

      {/* COMPONENT BREAKDOWN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ComponentCard
          component="ram"
          title="RAM Memory"
          finding={findings.find((f) => f.component === "ram")}
          metrics={[
            { label: "Installed Capacity", value: `${totalRamGB} GB`, highlight: true },
            { label: "Speed & Channel", value: `${primaryRam.speedMHz || 2400}MHz (${primaryRam.channel || "single"})` },
          ]}
        />

        <ComponentCard
          component="storage"
          title="Primary SSD Storage"
          finding={findings.find((f) => f.component === "storage")}
          metrics={[
            { label: "Capacity & Type", value: `${primaryDisk.capacityGB} GB ${primaryDisk.type}`, highlight: true },
            { label: "SMART Health", value: `${primaryDisk.smart?.wearPercent || 100}% Remaining` },
          ]}
        />

        <ComponentCard
          component="battery"
          title="Battery Condition"
          finding={findings.find((f) => f.component === "battery")}
          metrics={[
            {
              label: "Capacity Health",
              value: `${battery.designCapacityMWh > 0 ? Math.round((battery.fullChargeCapacityMWh / battery.designCapacityMWh) * 100) : 0}%`,
              highlight: true,
            },
            { label: "Cycle Count", value: `${battery.cycleCount || 0} Cycles` },
          ]}
        />
      </div>
    </div>
  );
}
