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
  ["/legal", "/terms"],
  ["/do-s-don-ts", "/what-can-i-put-in-a-dumpster"],
];

// Each migrated blog post carries its old Odoo URL(s) in `legacyPath`. The old
// Spanish mirror (/es/blog/viaje-1/<same slug>) is redirected to the same post
// until the Spanish blog exists (D-004), then it moves to the Spanish article.
function blogRedirects(): [string, string][] {
  const dir = path.join(process.cwd(), "content", "blog");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .flatMap((file): [string, string][] => {
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      if (data.status !== "published") return [];
      const target = `/blog/${file.replace(/\.md$/, "")}`;
      const raw = data.legacyPath;
      const paths: string[] = typeof raw === "string" ? [raw] : Array.isArray(raw) ? raw : [];
      return paths.flatMap((old): [string, string][] => [
        [old, target],
        [old.replace("/blog/our-blog-1/", "/es/blog/viaje-1/"), target],
      ]);
    });
}

// Odoo posts that were NOT migrated (owner decision, Nov 16 2026: move only posts
// that perform or add SEO value; drop date-specific ones). Each goes to the
// closest relevant page in one hop. Not a blanket homepage redirect.
const retiredPosts: [string, string][] = [
  // Duplicate of the cost article (-27)
  ["what-does-a-dumpster-rental-cost-in-fayette-coweta-county-2026-price-guide-26", "/blog/dumpster-rental-cost-fayette-coweta"],
  // Superseded by the local Fayette & Coweta guide; old copy listed 30/40-yard sizes we don't rent
  ["the-ultimate-guide-to-renting-a-roll-off-dumpster-from-start-to-finish-8", "/blog/dumpster-rental-guide-fayette-coweta"],
  // Size-specific posts: the size pages now answer these
  ["is-a-11-yard-dumpster-your-project-s-perfect-match-4", "/11-yard-the-little-junker"],
  ["simplify-your-college-move-out-the-benefits-of-renting-an-11-yard-dumpster-10", "/11-yard-the-little-junker"],
  ["ditch-the-renovation-chaos-why-a-16-yard-dumpster-is-your-bathroom-s-best-friend-3", "/16-yard-the-mighty-middler"],
  ["bigger-better-and-still-compact-introducing-our-new-21-yard-dumpsters-7", "/21-yard-the-big-junker"],
  ["12-vs-22-dumpsters-the-smart-choice-for-flexibility-and-efficiency-2", "/11-yard-the-little-junker"],
  // Date-specific or seasonal event posts
  ["the-ultimate-guide-to-summer-2026-fun-in-fayette-county-24", "/blog"],
  ["atlanta-ice-storm-2026-4-steps-to-reclaim-your-property-after-the-thaw-21", "/blog"],
  ["labor-day-in-atlanta-southside-style-18", "/blog"],
  ["heading-back-to-class-7-tips-for-a-smooth-back-to-school-in-georgia-16", "/blog"],
  ["memorial-day-weekend-events-near-peachtree-city-ga-2025-guide-14", "/blog"],
  ["office-decluttering-2025-a-practical-guide-to-reclaim-your-space-and-your-sanity-13", "/blog"],
  ["make-summer-events-in-peachtree-city-a-breeze-with-little-junkers-dumpster-rentals-12", "/blog"],
  ["graduation-month-in-georgia-how-to-declutter-refresh-and-celebrate-this-milestone-right-11", "/blog"],
  // Described services we don't offer (portable storage, donation hauling)
  ["the-ultimate-post-holiday-decluttering-guide-1", "/blog"],
].flatMap(([slug, to]): [string, string][] => [
  [`/blog/our-blog-1/${slug}`, to],
  [`/es/blog/viaje-1/${slug}`, to],
]);

// Odoo blog archives: index, pagination, tag and date-filter pages.
const blogArchives: [string, string][] = [
  ["/blog/our-blog-1", "/blog"],
  ["/blog/our-blog-1/page/:n", "/blog"],
  ["/blog/our-blog-1/tag/:tag*", "/blog"],
  ["/blog/viaje-1", "/blog"],
  ["/es/blog", "/blog"],
  ["/es/blog/viaje-1", "/blog"],
  ["/es/blog/viaje-1/page/:n", "/blog"],
  ["/es/blog/viaje-1/tag/:tag*", "/blog"],
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [...legacyAliases, ...blogRedirects(), ...retiredPosts, ...blogArchives].map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
