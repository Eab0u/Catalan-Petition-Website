import React from "react";

interface ProgressBarProps {
  value: number; // current count
  goal: number;  // max goal
}

export default function ProgressBar({ value, goal }: ProgressBarProps) {
  const percent = Math.min((value / goal) * 100, 100);

  return (
    <div
      className="
        relative w-full h-12 rounded-full p-1 shadow-inner
        border border-black/60 bg-transparent
        dark:border-white/20 dark:bg-transparent
        transition-colors duration-300
      "
    >
      {/* Track with glassy look */}
      <div
        className="
          relative h-full w-full rounded-full overflow-hidden border
          /* Light mode track */
          bg-black/40 border-black/20 backdrop-blur-md
          /* Dark mode track (unchanged) */
          dark:bg-white/10 dark:border-white/20 dark:backdrop-blur-xl
          transition-colors duration-300
        "
      >
        {/* Progress fill */}
        <div
          className="
            absolute inset-y-0 left-0 rounded-full border shadow-md
            bg-white/70 border-black/10 backdrop-blur-md
            dark:bg-white/20 dark:border-white/30 dark:backdrop-blur-lg
            transition-all duration-700 ease-in-out
          "
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
