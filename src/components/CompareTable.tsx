import React from "react";
import { ScanReportDocument } from "@/types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { CheckCircle2, ShieldAlert, AlertTriangle, ExternalLink } from "lucide-react";

interface Props {
  reports: ScanReportDocument[];
}

export const CompareTable: React.FC<Props> = ({ reports }) => {
  if (!reports || reports.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
        <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="p-4 w-44">Feature / Metric</th>
            {reports.map((r) => (
              <th key={r._id} className="p-4 min-w-[220px]">
                <div className="flex flex-col">
                  <span className="text-slate-100 font-bold text-sm">{r.brand} {r.laptopModel}</span>
                  <span className="text-[10px] text-slate-500 font-mono">SN: {r.serialNumber}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {/* Trust Score */}
          <tr className="bg-indigo-500/5">
            <td className="p-4 font-bold text-indigo-300">Trust Score</td>
            {reports.map((r) => (
              <td key={r._id} className="p-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-sm ${
                  r.trustScore >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                  r.trustScore >= 60 ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
                  "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                }`}>
                  {r.trustScore} / 100
                </span>
              </td>
            ))}
          </tr>

          {/* Asking Price & Fair Value */}
          <tr>
            <td className="p-4 font-semibold text-slate-400">Asking Price & Market Range</td>
            {reports.map((r) => (
              <td key={r._id} className="p-4">
                <div className="font-bold text-slate-100">
                  {r.askingPricePKR ? `PKR ${r.askingPricePKR.toLocaleString()}` : "N/A"}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Bazaar: PKR {r.aiReport.priceBreakdown.bazaarMinPKR.toLocaleString()} - {r.aiReport.priceBreakdown.bazaarMaxPKR.toLocaleString()}
                </div>
              </td>
            ))}
          </tr>

          {/* CPU */}
          <tr>
            <td className="p-4 font-semibold text-slate-400">CPU Processor</td>
            {reports.map((r) => (
              <td key={r._id} className="p-4">
                {r.rawFingerprint.cpu.model} ({r.rawFingerprint.cpu.cores} Cores)
              </td>
            ))}
          </tr>

          {/* RAM */}
          <tr>
            <td className="p-4 font-semibold text-slate-400">Installed RAM</td>
            {reports.map((r) => {
              const ram = r.rawFingerprint.ram[0];
              const totalGB = r.rawFingerprint.ram.reduce((a, b) => a + b.capacityGB, 0);
              return (
                <td key={r._id} className="p-4">
                  <div>{totalGB} GB ({ram?.speedMHz || 2400} MHz)</div>
                  <div className="text-[10px] text-slate-400">{ram?.manufacturer || "OEM"}</div>
                </td>
              );
            })}
          </tr>

          {/* Storage & SMART */}
          <tr>
            <td className="p-4 font-semibold text-slate-400">Storage & Health</td>
            {reports.map((r) => {
              const disk = r.rawFingerprint.storage[0];
              return (
                <td key={r._id} className="p-4">
                  <div>{disk?.capacityGB || 0} GB {disk?.type || "SSD"}</div>
                  <div className="text-[10px] text-slate-400">Health: {disk?.smart?.wearPercent || 100}% | {disk?.smart?.powerOnHours || 0} hrs</div>
                </td>
              );
            })}
          </tr>

          {/* Battery */}
          <tr>
            <td className="p-4 font-semibold text-slate-400">Battery Condition</td>
            {reports.map((r) => {
              const bat = r.rawFingerprint.battery;
              const wear = bat.designCapacityMWh > 0 ? Math.round((bat.fullChargeCapacityMWh / bat.designCapacityMWh) * 100) : 0;
              return (
                <td key={r._id} className="p-4">
                  <div>{wear}% Health ({bat.cycleCount || 0} Cycles)</div>
                  <div className="text-[10px] text-slate-400">{bat.fullChargeCapacityMWh} mWh capacity</div>
                </td>
              );
            })}
          </tr>

          {/* Charger Wattage */}
          <tr>
            <td className="p-4 font-semibold text-slate-400">Connected Charger</td>
            {reports.map((r) => (
              <td key={r._id} className="p-4">
                {r.rawFingerprint.adapter.reportedWattageW}W Adapter
              </td>
            ))}
          </tr>

          {/* Red Flags Count */}
          <tr>
            <td className="p-4 font-semibold text-slate-400">Red Flags Detected</td>
            {reports.map((r) => (
              <td key={r._id} className="p-4">
                {r.aiReport.redFlags.length === 0 ? (
                  <span className="text-emerald-400 font-semibold">0 Flags (Clean)</span>
                ) : (
                  <span className="text-rose-400 font-semibold">{r.aiReport.redFlags.length} Flag(s)</span>
                )}
              </td>
            ))}
          </tr>

          {/* Action Link */}
          <tr>
            <td className="p-4 font-semibold text-slate-400">View Full Truth Report</td>
            {reports.map((r) => (
              <td key={r._id} className="p-4">
                <a
                  href={`/report/${r._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
                >
                  <span>Open Report</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
