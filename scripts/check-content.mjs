// Guardrail: fails if customer-facing source contains a banned claim, a retired
// product, a retired name or a stale contact detail (charter §7 and §17).
// Run with `npm run check:content`.
import fs from "node:fs";
import path from "node:path";

const banned = [
  [/same[- ]day/i, "same-day delivery claim"],
  [/best price|cheapest|lowest price/i, "unsupported price superlative"],
  [/most popular/i, "unsupported popularity claim"],
  [/\b10[- ]yard\b|tough junker/i, "retired 10-yard product"],
  [/lil'? ?dumpers/i, "paused product line"],
  [/ivette/i, "retired public owner name (use Ivy)"],
  [/\$89\b/, "internal overage rate"],
  [/464-7364/, "stale phone number"],
  [/flat rate/i, "roofing language: say inclusive rate"],
  [/junk removal company|full-service junk/i, "junk-removal positioning"],
  // AI drift: build notes, reviewer language and filler that leaked into customer copy (ADR-CX-003).
  [/won'?t guess|won'?t substitute|draft note|slot for the|prototype|vetted|regional reference/i, "internal or method note in customer copy", "pages"],
  [/has(n'?t| not) been approved|fleet-confirmed|build my rental/i, "internal process language in customer copy", "pages"],
  [/seamless|stress-free|hassle-free|tailored solution|designed with you in mind|game[- ]changer|peace of mind/i, "generic AI/corporate filler", "pages"],
  [/\u2014/, "em dash in customer copy (rewrite the sentence)", "pages"],
  // ADR-CX-004: booking happens inside the site. No CTA may send customers to the booking app.
  [/bookingUrl\(|book\.littlejunkersllc\.com\/rent-a-dumpster/, "booking CTA must stay in-site (ADR-CX-004)", "pages"],
];

const roots = ["app", "components", "lib", "content"];
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    // Legal copy is owner-approved text copied word for word; it is not marketing copy.
    if (entry.isDirectory() && full === path.join("content", "legal")) continue;
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx?|md|css)$/.test(entry.name) && !entry.name.startsWith("_")) files.push(full);
  }
};
roots.filter((root) => fs.existsSync(root)).forEach(walk);

let failures = 0;
for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // code comments are not customer-facing
    for (const [pattern, reason, scope] of banned) {
      // "pages" rules cover site pages and components; migrated blog posts get their own editorial pass.
      if (scope === "pages" && file.endsWith(".md")) continue;
      if (pattern.test(line)) {
        failures += 1;
        console.error(`${file}:${index + 1}  ${reason}\n    ${line.trim()}`);
      }
    }
  });
}

if (failures > 0) {
  console.error(`\n${failures} banned-content match(es).`);
  process.exit(1);
}
console.log(`Content check passed (${files.length} files).`);
