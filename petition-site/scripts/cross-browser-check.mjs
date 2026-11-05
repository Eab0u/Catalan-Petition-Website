import { chromium, firefox, webkit } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const engines = { chromium, firefox, webkit };

for (const [name, engine] of Object.entries(engines)) {
  const browser = await engine.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("[console] " + m.text());
  });
  try {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2900);
    const bodyText = await page.locator("body").innerText();
    await page.screenshot({ path: `text-snapshots/crossbrowser-${name}.png` });
    console.log(`${name}: OK, bodyText length=${bodyText.length}, errors=${JSON.stringify(errors)}`);
  } catch (e) {
    console.log(`${name}: FAILED - ${e.message}`);
  }
  await browser.close();
}
