// Release gate: public-facing Little Junkers content must use owners' first names only.
// Includes visible copy, page metadata, alt text, legal pages, JSON-LD source,
// client/server modules that feed the site, and publicly served HTML/SVG assets.
// Internal charters, handoffs and historical project documentation aren't served.
import fs from "node:fs";
import path from "node:path";

const roots = ["app", "components", "content", "lib", "public"];
const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md", ".mdx",
  ".json", ".html", ".htm", ".css", ".svg", ".xml", ".txt", ".webmanifest"]);
const disallowedSurname = /griffin/i;
const errors = [];
let scanned = 0;

function checkDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDirectory(file);
    } else if (entry.isFile() && textExtensions.has(path.extname(file).toLowerCase())) {
      scanned++;
      const text = fs.readFileSync(file, "utf8");
      const lines = text.split("\n");
      lines.forEach((line, index) => {
        if (disallowedSurname.test(line)) {
          errors.push(`${file}:${index + 1}`);
        }
      });
    }
  }
}
for (const root of roots) checkDirectory(root);
if (errors.length) {
  console.error("Public owner-name privacy check failed (surname found):");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log(`Public owner-name privacy check passed (${scanned} text files scanned).`);
