// One-off script (not a test): renders every route and saves all visible
// text to a JSON file, so a before/after redesign diff can prove wording
// never changed. Run with: node scripts/capture-text.mjs <out-file.json>
//
// Handles two kinds of rendered-but-rotating text that a plain innerText()
// snapshot would miss:
//   - TextType (hero): only one partial/full phrase is in the DOM at a time
//   - RotatingQA: only one Q&A pair is in the DOM at a time
// For both, we poll their container over several rotation cycles and union
// every distinct value we see, so the snapshot captures all phrases/pairs
// regardless of which one happened to be showing at capture time.
import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:5173";
const OUT = process.argv[2] ?? "text-snapshots/baseline.json";

const ERROR_KEYS = [
  "ja_signat",
  "sessio_expirada",
  "sessio_invalida",
  "consent_required",
  "massa_peticions",
  "params_invalids",
  "signatura_fallida",
  "server_error",
  "__unknown_key_fallback__",
];

const ROUTES = [
  { name: "home", path: "/" },
  { name: "sign", path: "/sign" },
  { name: "sign-result-success", path: "/sign/result?status=success" },
  { name: "sign-result-cancelled", path: "/sign/result?status=cancelled" },
  ...ERROR_KEYS.map((k) => ({
    name: `sign-result-error-${k}`,
    path: `/sign/result?status=error&message=${k}`,
  })),
  { name: "admin-logged-out", path: "/admin" },
  { name: "documents", path: "/documents" },
  { name: "under-construction", path: "/under-construction" },
];

function normalize(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function scrollThroughPage(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = 400;
  for (let y = 0; y < height; y += step) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

// Drops any string that is a proper prefix of another string in the set.
// Needed because a character-by-character typing animation (TextType)
// passes through every partial prefix of a phrase on the way to the full
// text, and those partial states are non-deterministic timing noise, not
// real content to diff.
function dropPrefixes(variants) {
  return variants.filter(
    (candidate) => !variants.some((other) => other !== candidate && other.startsWith(candidate))
  );
}

async function collectRotatingVariants(page, testId, durationMs) {
  const seen = new Set();
  const start = Date.now();
  while (Date.now() - start < durationMs) {
    const text = await page
      .locator(`[data-testid="${testId}"]`)
      .innerText()
      .catch(() => "");
    // Strip TextType's decorative typing cursor ("|"), appended fresh each
    // tick — without this, partial typing states aren't literal prefixes
    // of the final phrase and the dropPrefixes() filter below can't work.
    const norm = normalize(text).replace(/\|+$/, "").trim();
    if (norm) seen.add(norm);
    await page.waitForTimeout(250);
  }
  return dropPrefixes(Array.from(seen)).sort();
}

async function captureRoute(page, route) {
  await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);

  const dynamic = {};

  if (route.name === "home") {
    // Trigger every scroll-reveal (AnimatedContent/GSAP ScrollTrigger)
    // before taking the static snapshot.
    await scrollThroughPage(page);

    // Hero TextType cycles 3 phrases; RotatingQA cycles 5 pairs. Poll long
    // enough to see every distinct value at least once.
    dynamic.heroRotatingText = await collectRotatingVariants(
      page,
      "hero-rotating-text",
      28000
    );
    dynamic.rotatingQA = await collectRotatingVariants(
      page,
      "rotating-qa",
      42000
    );

    // Expand every FAQ accordion item so its answer text is captured too.
    const faqQuestions = page.locator('[id="faq"] .cursor-pointer > div.flex');
    const count = await faqQuestions.count();
    for (let i = 0; i < count; i++) {
      await faqQuestions.nth(i).click();
      await page.waitForTimeout(350);
    }
  }

  const staticText = normalize(await page.locator("body").innerText());

  return { path: route.path, staticText, ...dynamic };
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const snapshot = {};

  for (const route of ROUTES) {
    console.log(`Capturing ${route.name} (${route.path})...`);
    snapshot[route.name] = await captureRoute(page, route);
  }

  await browser.close();

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(snapshot, null, 2));
  console.log(`Wrote ${OUT}`);
}

main();
