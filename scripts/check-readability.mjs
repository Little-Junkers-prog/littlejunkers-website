// Guardrail: booking-path copy must stay easy to read (owner direction, Nov 22, 2026:
// aim for a 6th–7th grade level, never above 8th–9th). Run with `npm run check:readability`.
//
// This is an approximate Flesch-Kincaid grade. It counts syllables with a simple rule,
// so treat the score as a trend line, not an exact grade. It scores customer sentences
// (six words or more) from quoted strings and JSX text; code, class names and labels are skipped.
// Legal and consent wording is skipped: it needs attorney review, not simpler words.
import fs from "node:fs";

const MAX_GRADE = 8;
const pages = {
  "Home": ["app/page.tsx", "components/PinkBinExperience.tsx"],
  "Planner": ["components/DaysPlusPlanner.tsx", "app/plan/page.tsx"],
  "Pricing": ["app/pricing/page.tsx", "components/PriceCards.tsx"],
  "Compare": ["app/compare/page.tsx", "components/ComparisonTool.tsx", "components/CompetitorExitDialog.tsx"],
  "Size pages": ["app/[slug]/SizePage.tsx", "lib/sizes.ts"],
  "City pages": ["app/[slug]/CityPage.tsx", "lib/cities.ts"],
};
const legal = /affiliated|By submitting|not a marketing subscription/i;

function syllables(word) {
  let w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  return Math.max(1, (w.match(/[aeiouy]{1,2}/g) ?? []).length);
}

function customerText(source) {
  const out = [];
  for (const m of source.matchAll(/"([^"]{25,})"|>([^<>{}]{25,})</g)) {
    let text = (m[1] ?? m[2]).trim().replace(/&apos;/g, "'");
    // Skip code that the simple pattern catches between two unrelated quote marks.
    if (/^(\/|http|\(|@)/.test(text) || /[\n;{}=]|=>|\bimport\b|className/.test(text)) continue;
    if (!text.includes(" ") || /\b[a-z]+[A-Z][a-zA-Z]*\b/.test(text)) continue;
    if (legal.test(text)) continue;
    // Score sentences only. Short labels ("3-day rental") would drag the grade down artificially.
    if (text.split(/\s+/).length < 6) continue;
    if (!/[.?!]$/.test(text)) text += ".";
    out.push(text);
  }
  return out.join(" ");
}

function grade(text) {
  const sentences = text.split(/[.!?]+\s/).filter((s) => s.trim()).length;
  const words = text.match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
  const syl = words.reduce((sum, w) => sum + syllables(w), 0);
  return 0.39 * (words.length / sentences) + 11.8 * (syl / words.length) - 15.59;
}

let failures = 0;
for (const [name, files] of Object.entries(pages)) {
  const text = files.map((f) => customerText(fs.readFileSync(f, "utf8"))).join(" ");
  const score = grade(text);
  const ok = score <= MAX_GRADE;
  if (!ok) failures += 1;
  console.log(`${ok ? "ok  " : "FAIL"} ${name.padEnd(11)} grade ~${score.toFixed(1)}`);
}
if (failures > 0) {
  console.error(`\n${failures} page group(s) read above grade ${MAX_GRADE}. Use shorter sentences and plainer words.`);
  process.exit(1);
}
console.log(`Readability check passed (booking pages at or below grade ${MAX_GRADE}).`);
