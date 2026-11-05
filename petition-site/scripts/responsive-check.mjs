import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const widths = [360, 390, 768, 1024, 1440, 1920];
mkdirSync("text-snapshots/responsive", { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const width of widths) {
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.emulateMedia({ colorScheme: theme });
    await page.addInitScript((t) => {
      try {
        localStorage.setItem("theme", t);
      } catch {}
    }, theme);
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2900);

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);

    results.push({ width, theme, hasHorizontalScroll, scrollWidth });
    await page.screenshot({
      path: `text-snapshots/responsive/${width}-${theme}.png`,
      fullPage: false,
    });
    await page.close();
  }
}

await browser.close();
console.table(results);
const overflowing = results.filter((r) => r.hasHorizontalScroll);
if (overflowing.length > 0) {
  console.log("HORIZONTAL SCROLL DETECTED:", JSON.stringify(overflowing, null, 2));
} else {
  console.log("No horizontal scroll at any tested width.");
}
