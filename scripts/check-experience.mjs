// Design-scope regression checks. No credentials, browsers or booking writes needed.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (file) => readFileSync(file, "utf8");

const home = read("app/page.tsx");
const size = read("app/[slug]/SizePage.tsx");
const shop = read("components/PinkBinExperience.tsx");
const css = read("app/globals.css");
const reveal = read("components/RevealOnScroll.tsx");
const design = read("DESIGN.md");
const pricing = read("components/PriceCards.tsx");
const city = read("app/[slug]/CityPage.tsx");
const charter = read("PROJECT-CHARTER.md");

assert.ok(home.includes('className="hero on-dark experience-hero"'), "home has scoped signature hero");
assert.ok(home.includes("photos.hero.src"), "homepage hero uses first-party photo manifest");
assert.ok(home.includes("<ZipCheck />"), "city/ZIP conversion entry stays in homepage hero");
assert.ok(home.includes("experience-hero__field-note"), "hero has local identity detail");
assert.ok(home.includes("experience-sizes"), "product cards have a scoped visual treatment");
assert.ok(home.includes("<PinkBinExperience pricing={pricing} />"), "homepage presents one interactive product selector");
assert.ok(home.includes("<PricingUnavailable />"), "homepage has an honest unavailable-price state");
assert.ok(shop.includes("useState<SizeYards>(11)"), "product stage responds to size changes");
assert.ok(shop.includes("aria-pressed={active}"), "size selection is keyboard and screen-reader friendly");
assert.ok(shop.includes("onClick={() => setSelected(yards)}"), "size buttons update selected item");
assert.ok(shop.includes("threeDayTier(pricing)"), "base prices are sourced from canonical API");
assert.ok(shop.includes("pricing.sizes[selected]?.includedTons"), "weight allowances are canonical");
assert.ok(shop.includes("pricing.overagePerTon"), "overweight rate is canonical");
assert.ok(shop.includes("formatUsd(tier.prices[yards])"), "all three choices have live base prices");
assert.ok(shop.includes("formatUsd(price)"), "detail price updates with selection");
assert.ok(shop.includes("key={selected}"), "image changes with size selection");
assert.ok(shop.includes("size.hero.src"), "authentic first-party bin photographs");
assert.ok(shop.includes("<PlanLink"), "shop routes into current shared rental planner");
assert.ok(shop.includes("/compare?size="), "comparison link follows the selected size");
assert.ok(shop.includes("<DeliveryLine"), "saved service-area delivery information is not discarded");
assert.ok(!shop.includes("pricing = {"), "shop never creates a duplicate price source");
assert.ok(css.includes("@media (max-width: 540px)"), "compact mobile layout is included");
assert.ok(css.includes(".bin-shop__choice:focus-visible"), "size buttons have visible keyboard focus");
assert.ok(home.includes("experience-process__visual"), "process photo gets distinct editorial treatment");
assert.ok(home.includes("experience-owners"), "local owner proof retains its own treatment");
assert.ok(home.includes("experience-gallery"), "local proof rail remains present");
assert.ok(home.includes('href="/plan"'), "main shopping path is not removed");

assert.ok(size.includes("experience-size__layout"), "size pages reuse one template");
assert.ok(size.includes("experience-size__visual"), "size visual is photographic");
assert.ok(size.includes("photo={size.hero}"), "all 3 sizes use their real equipment images");
assert.ok(size.includes("formatUsd(from.prices[size.yards])"), "price remains canonical");
assert.ok(size.includes("formatTons(facts.includedTons)"), "weight remains canonical");
assert.ok(size.includes("<PlanLink"), "product handoff remains the shared booking path");

assert.ok(reveal.includes('if (!node || !("IntersectionObserver" in window)) return;'), "unsupported browsers show content");
assert.ok(reveal.includes('prefers-reduced-motion: reduce'), "reveal respects reduced motion");
assert.ok(reveal.includes('node.getBoundingClientRect().top'), "first viewport not artificially hidden");
assert.ok(reveal.includes('focusin'), "keyboard focus reveals section");
assert.ok(reveal.includes("experience-reveal--pending"), "content only hidden after client enhancement");

assert.ok(css.includes("prefers-reduced-motion: reduce"), "CSS reduces or disables motion on request");
assert.ok(css.includes("experience-sizes .price-card:focus-within"), "pricing focus is visible");
assert.ok(css.includes(".experience-hero .hero__media::after"), "hero contrast gradient is present");
assert.ok(css.includes("var(--signature-pink)"), "uses approved pink token");
assert.ok(css.includes("var(--dark-hero)"), "uses approved dark token");
assert.ok(design.includes("Make renting a dumpster surprisingly enjoyable."), "design north star documented");
assert.ok(design.includes("Do not merge this PR without owner review."), "release gate documented");
assert.ok(pricing.includes("threeDayTier(pricing)"), "canonical pricing remains unchanged");
assert.ok(city.includes("city-page-hero"), "city pages retain approved text-first layout");
assert.ok(charter.includes("booking") || charter.includes("Booking"), "project charter still remains present");
assert.ok(!home.includes("import * as THREE"), "no unapproved 3D runtime bundle");
assert.ok(!css.includes("scroll-behavior: instant"), "accessible scroll behavior preserved");

console.log("Experience design prototype contract checks passed.");
