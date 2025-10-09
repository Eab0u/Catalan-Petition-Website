import React from "react";
import { useTheme } from "../theme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle color mode"
        aria-pressed={isDark}
        className="
            cursor-pointer inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium
            border-neutral-300 bg-white text-neutral-900
            hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
            dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800
        "
    >
        {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}