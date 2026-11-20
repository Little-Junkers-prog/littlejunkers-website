// Release guard for seven preserved Little Junkers city URLs and truthful local proof.
// File-based by design: runs without credentials, service data or customer information.
import assert from "node:assert/strict";
import fs from "node:fs";

const source = (file) => fs.readFileSync(file, "utf8");
const cities = source("lib/cities.ts");
const page = source("app/[slug]/CityPage.tsx");
const router = source("app/[slug]/page.tsx");
const sitemap = source("app/sitemap.ts");
const plan = source("components/PlanLink.tsx");
const prices = source("components/PriceCards.tsx");
const audit = source("docs/phase-2/CITY-PAGE-PRESERVATION-AUDIT-2026-11-20.md");
const cases = [
  ["Newnan", "dumpster-rental-newnan-little-junkers"],
  ["Sharpsburg", "dumpster-rental-sharpsburg-little-junkers"],
  ["Senoia", "dumpster-rental-senoia-little-junkers"],
  ["Peachtree City", "dumpster-rental-peachtree-city-little-junkers"],
  ["Fayetteville", "dumpster-rental-fayetteville-little-junkers"],
  ["Tyrone", "dumpster-rental-tyrone-little-junkers"],
  ["Fairburn", "dumpster-rental-fairburn-little-junkers"],
];
const matches = [...cities.matchAll(/\n  \{\n    city: "([^"]+)",\n    slug: slugFor\("([^"]+)"\)/g)];
assert.equal(matches.length, 7, "preserve exactly seven priority city pages in the registry");
const desc = new Set();
const expected = new Map(cases);
const seen = new Set();
for (let i = 0; i < matches.length; i++) {
  const found = matches[i];
  const name = found[1];
  const expectedSlug = expected.get(name);
  assert.ok(expectedSlug, "unexpected city in the preserved route registry: " + name);
  assert.ok(!seen.has(name), "duplicate city registry entry: " + name);
  seen.add(name);
  assert.equal(found[2], name, name + " slug source must match its city");
  const slug = "dumpster-rental-" + name.toLowerCase().replace(/\s+/g, "-") + "-little-junkers";
  assert.equal(slug, expectedSlug, "original city slug must remain unchanged");
  assert.ok(audit.includes("/" + expectedSlug), name + " requires an explicit preservation row");
  const nextIndex = i + 1 < matches.length ? matches[i + 1].index : cities.indexOf("\n];", found.index);
  const block = cities.slice(found.index, nextIndex);
  assert.ok(block.includes("proofHeading:"), name + " requires unique first-party proof heading");
  assert.ok(block.includes("proofCopy:"), name + " requires substantive market evidence");
  assert.ok(block.includes("placement: {"), name + " requires distinct placement guidance");
  assert.ok(block.includes("faqs: ["), name + " requires local FAQs");
  assert.ok(block.includes("nearby: ["), name + " needs neighboring internal links");
  assert.ok(block.includes("hero: photos."), name + " must use authentic media");
  if (name === "Sharpsburg") {
    assert.ok(block.includes("proof: [],"), "no fake Sharpsburg job photos");
    assert.ok(block.includes("heroDisclosure:"), "the general-equipment photo must be disclosed");
  } else {
    assert.ok(block.includes("proof: [photos."), name + " must have at least one local proof image");
  }
  const description = block.match(/metaDescription:\s*\n\s*"([^"]+)"/)?.[1] ?? "";
  assert.ok(description.length >= 75, name + " needs useful metadata");
  assert.ok(description.toLowerCase().includes(name.toLowerCase()), name + " metadata must match the city");
  assert.ok(!desc.has(description), "duplicate city metadata");
  desc.add(description);
}
assert.deepEqual([...seen].sort(), cases.map(([name]) => name).sort(), "seven preserved cities must all be present");
assert.equal(cities.includes("needed:"), false, "do not publicly render unfinished city photo slots");
assert.equal(cities.includes("genericPlacement("), false, "do not reintroduce city-name-swap placement copy");
assert.ok(page.includes("documentedPhotos.length > 0"), "empty photo galleries must not render");
assert.ok(page.includes("city.heroDisclosure"), "general-location hero must be labeled honestly");
assert.ok(page.includes("city.proofHeading"), "unique local proof headings must be visible");
assert.ok(page.includes('location={city.city}'), "city estimate must preserve its location");
assert.ok(page.includes("zips.length > 0 ? ("), "schema must require canonical active service ZIP evidence");
assert.ok(page.includes("JsonLd"), "city Service structured data must link to canonical business");
assert.ok(page.includes('href="/what-can-i-put-in-a-dumpster"'), "material guidance must be discoverable");
assert.ok(router.includes("...cities") && router.includes("cityBySlug(slug)"), "city router must preserve exact slugs");
assert.ok(router.includes("canonical: `/${slug}`"), "each city must have a self canonical");
assert.ok(sitemap.includes("...cities.map((city) => `/${city.slug}`)"), "each city must appear in sitemap");
assert.ok(prices.includes("location={location}"), "price cards must carry city into estimate");
assert.ok(plan.includes("location?.trim() || savedQuery || area?.zip"), "explicit city context must beat stale browser state");
assert.ok(audit.includes("not a fresh Search Console export") || audit.includes("not prove today's Google index state"),
  "no unverified claim of current index status");
console.log("City preservation, seven-market proof, sitemap, SEO and estimate-handoff checks passed.");
