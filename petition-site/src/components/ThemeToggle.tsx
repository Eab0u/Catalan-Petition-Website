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
        transition-all duration-200 ease-in-out
        bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800
        dark:bg-white dark:text-black dark:border-white dark:hover:bg-neutral-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
      "
    >
      {isDark ? "☀️ Llum" : "🌙 Fosc"}
    </button>
  );
}
