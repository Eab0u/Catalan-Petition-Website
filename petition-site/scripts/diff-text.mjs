// Compares two snapshots produced by capture-text.mjs and reports any
// wording differences. Run with: node scripts/diff-text.mjs before.json after.json
import { readFileSync } from "fs";

const [beforePath, afterPath] = process.argv.slice(2);
if (!beforePath || !afterPath) {
  console.error("Usage: node scripts/diff-text.mjs <before.json> <after.json>");
  process.exit(1);
}

const before = JSON.parse(readFileSync(beforePath, "utf8"));
const after = JSON.parse(readFileSync(afterPath, "utf8"));

let diffCount = 0;

function compareField(routeName, field, a, b) {
  const aStr = Array.isArray(a) ? JSON.stringify(a) : a;
  const bStr = Array.isArray(b) ? JSON.stringify(b) : b;
  if (aStr !== bStr) {
    diffCount++;
    console.log(`\n=== DIFF: ${routeName} / ${field} ===`);
    console.log("--- before ---");
    console.log(aStr);
    console.log("--- after ---");
    console.log(bStr);
  }
}

const allRoutes = new Set([...Object.keys(before), ...Object.keys(after)]);
for (const routeName of allRoutes) {
  const a = before[routeName];
  const b = after[routeName];
  if (!a || !b) {
    diffCount++;
    console.log(`\n=== DIFF: ${routeName} present in only one snapshot ===`);
    continue;
  }
  compareField(routeName, "staticText", a.staticText, b.staticText);
  if (a.heroRotatingText || b.heroRotatingText) {
    compareField(routeName, "heroRotatingText", a.heroRotatingText, b.heroRotatingText);
  }
  if (a.rotatingQA || b.rotatingQA) {
    compareField(routeName, "rotatingQA", a.rotatingQA, b.rotatingQA);
  }
}

if (diffCount === 0) {
  console.log("No differences. Wording is identical.");
} else {
  console.log(`\n${diffCount} field(s) differ. Review above.`);
}
