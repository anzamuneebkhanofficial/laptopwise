"use client";

import React from "react";

interface Props {
  score: number;
  size?: number;
}

export const TrustScoreGauge: React.FC<Props> = ({ score, size = 160 }) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "stroke-emerald-400 text-emerald-400";
  let glowColor = "rgba(16, 185, 129, 0.3)";
  let verdictText = "Safe & Verified";
  let verdictSubtext = "All tested parts match official factory standards and are in good shape.";

  if (score < 60) {
    colorClass = "stroke-rose-500 text-rose-400";
    glowColor = "rgba(239, 68, 68, 0.3)";
    verdictText = "High Risk / Warning";
    verdictSubtext = "Problems, fake parts, or big mismatches were detected. Inspect carefully.";
  } else if (score < 80) {
    colorClass = "stroke-amber-400 text-amber-400";
    glowColor = "rgba(245, 158, 11, 0.3)";
    verdictText = "Check with Seller";
    verdictSubtext = "Some parts show wear, age, or small changes from original factory parts.";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Glowing Background Blur */}
        <div
          className="absolute inset-0 rounded-full filter blur-xl opacity-50 transition-all duration-700"
          style={{ background: glowColor }}
        />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${colorClass.split(" ")[1]}`}>
            {score}
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Out of 100
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h4 className={`text-sm font-bold ${colorClass.split(" ")[1]}`}>{verdictText}</h4>
        <p className="text-xs text-slate-400 max-w-[220px] mt-0.5">{verdictSubtext}</p>
      </div>
    </div>
  );
};
