import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { NextConfig } from "next";

// Legacy Odoo aliases confirmed in phase-0/GSC-COVERAGE-DRILLDOWN.md. Single hop,
// closest relevant page. The full cutover redirect map (shop, /es, system URLs)
// is a separate reviewed change before DNS moves.
const legacyAliases: [string, string][] = [
  ["/16-yard-the-middle-junker", "/16-yard-the-mighty-middler"],
  ["/dumpster-rental-faq", "/faq"],
  ["/do-s-don-ts", "/what-can-i-put-in-a-dumpster"],
];

// Each migrated blog post can carry its old Odoo URL in `legacyPath`.
function blogRedirects(): [string, string][] {
  const dir = path.join(process.cwd(), "content", "blog");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .flatMap((file): [string, string][] => {
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      return data.status === "published" && typeof data.legacyPath === "string"
        ? [[data.legacyPath, `/blog/${file.replace(/\.md$/, "")}`]]
        : [];
    });
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [...legacyAliases, ...blogRedirects()].map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
