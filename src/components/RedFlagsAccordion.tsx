import React from "react";
import { AlertOctagon, ShieldAlert, AlertTriangle } from "lucide-react";

interface Props {
  redFlags: string[];
}

export const RedFlagsAccordion: React.FC<Props> = ({ redFlags }) => {
  if (!redFlags || redFlags.length === 0) {
    return (
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-xs text-emerald-300 font-medium">
          Zero critical hardware red flags or counterfeit heuristics were detected during scan.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5">
      <div className="flex items-center gap-2.5 mb-3 text-rose-400">
        <AlertOctagon className="w-5 h-5 shrink-0" />
        <h3 className="font-bold text-sm tracking-wide">Hardware Warnings & Red Flags ({redFlags.length})</h3>
      </div>

      <div className="space-y-2.5">
        {redFlags.map((flag, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-rose-500/20 text-xs text-rose-200 leading-relaxed"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{flag}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
