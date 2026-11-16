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
];

const roots = ["app", "components", "lib", "content"];
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
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
    for (const [pattern, reason] of banned) {
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
