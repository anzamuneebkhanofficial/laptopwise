import React from "react";
import { FindingItem, ComponentType } from "@/types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { Cpu, HardDrive, Battery, Zap, ShieldCheck, Monitor, Disc } from "lucide-react";

interface Props {
  component: ComponentType;
  title: string;
  finding?: FindingItem;
  metrics: { label: string; value: string | number; highlight?: boolean }[];
  icon?: any;
}

export const ComponentCard: React.FC<Props> = ({ component, title, finding, metrics, icon: CustomIcon }) => {
  const iconMap: Record<ComponentType, any> = {
    ram: Cpu,
    storage: HardDrive,
    battery: Battery,
    adapter: Zap,
    bios: ShieldCheck,
    display: Monitor,
    windows: Disc,
    chassis: ShieldCheck,
    gpu: Monitor,
  };

  const IconComponent = CustomIcon || iconMap[component] || Cpu;
  const status = finding?.status || "unverified";

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">{title}</h3>
            {finding && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{finding.title}</p>}
          </div>
        </div>

        <ConfidenceBadge status={status} size="sm" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-slate-950/50 border border-slate-900">
        {metrics.map((m, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{m.label}</span>
            <span className={`text-xs font-semibold mt-0.5 ${m.highlight ? "text-indigo-400" : "text-slate-200"}`}>
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* Detail / Evidence */}
      {finding && (
        <div className="mt-3 text-xs text-slate-300 space-y-1 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/50">
          <p className="leading-relaxed text-slate-300">{finding.detail}</p>
          <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60 truncate">
            <span className="text-slate-400 font-sans font-semibold">Evidence: </span>
            {finding.evidence}
          </div>
        </div>
      )}
    </div>
  );
};
