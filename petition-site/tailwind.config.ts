import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        catalanBlue: "#0066cc",
        catalanYellow: "#ffcc00",
        catalanRed: "#cc0000",
      },
    },
  },
} satisfies Config;