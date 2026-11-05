import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const widths = [360, 390, 500, 768, 1024, 1440, 1920];
const results = [];
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2900);
  const info = await page.evaluate(() => {
    const navInner = document.querySelector("header > div");
    const flagContainer = document.querySelector("main#top canvas")?.parentElement?.parentElement;
    const navRect = navInner?.getBoundingClientRect();
    const flagRect = flagContainer?.getBoundingClientRect();
    return {
      gap: flagRect && navRect ? flagRect.top - navRect.bottom : null,
      scrollOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
  results.push({ width, ...info });
  await page.close();
}
await browser.close();
console.table(results);
