import React from "react";

interface ProgressBarProps {
  value: number; // current count
  goal: number;  // max goal
}

export default function ProgressBar({ value, goal }: ProgressBarProps) {
  const percent = Math.min((value / goal) * 100, 100);

  return (
    <div className="relative w-full h-24 bg-white rounded-full p-2">
      {/* Inner track (pipe background) */}
      <div className="relative h-full w-full rounded-full bg-neutral-200 overflow-hidden">
        {/* Blue fill */}
        <div
          className="absolute inset-y-0 left-0 bg-blue-600 transition-all duration-3000"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
