import React from "react";
import { ConfidenceStatus } from "@/types";
import { CheckCircle2, AlertTriangle, ShieldAlert, HelpCircle } from "lucide-react";

interface Props {
  status: ConfidenceStatus;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ConfidenceBadge: React.FC<Props> = ({ status, showText = true, size = "md" }) => {
  const config = {
    verified: {
      label: "Verified",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      icon: CheckCircle2,
      tooltip: "🟢 Verified: Confirmed directly from the laptop hardware and official maker specs.",
    },
    inferred: {
      label: "Estimated",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      icon: AlertTriangle,
      tooltip: "🟡 Estimated: Estimated from system numbers, but cannot be 100% proven by software.",
    },
    flagged: {
      label: "Problem Found",
      color: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      icon: ShieldAlert,
      tooltip: "🔴 Problem Found: A real issue, mismatch, or fake part was detected.",
    },
    unverified: {
      label: "Physical Check Needed",
      color: "bg-slate-500/10 text-slate-400 border-slate-500/30",
      icon: HelpCircle,
      tooltip: "⚪ Physical Check Needed: Things software cannot check, like body scratches, hinges, or charger cables.",
    },
  }[status];

  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-semibold gap-2",
  }[size];

  return (
    <span
      title={config.tooltip}
      className={`inline-flex items-center rounded-full border transition-colors cursor-help ${config.color} ${sizeClasses}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {showText && <span>{config.label}</span>}
    </span>
  );
};
