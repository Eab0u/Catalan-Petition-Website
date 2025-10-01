import React from "react";

interface ProgressBarProps {
  value: number; // current count
  goal: number;  // max goal
}

export default function ProgressBar({ value, goal }: ProgressBarProps) {
  const percent = Math.min((value / goal) * 100, 100);

  return (
    <div className="relative w-full h-12 bg-white/5 rounded-full p-1 shadow-inner border border-white/20">
      {/* Track with glassy look */}
      <div className="relative h-full w-full rounded-full bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
        {/* Progress fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 shadow-md transition-all duration-3500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
