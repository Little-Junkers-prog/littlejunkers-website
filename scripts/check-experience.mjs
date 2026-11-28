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
const header = read("components/Header.tsx");
const drawer = read("components/MobileMenu.tsx");

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

assert.ok(!header.includes('className="site-nav"'), "desktop nav rows should not reappear");
assert.ok(header.includes("<MobileMenu"), "one universal navigation component at every size");
assert.ok(header.includes('site-header__book'), "booking CTA stays prominent in desktop header");
assert.ok(header.includes('Start Booking'), "booking CTA remains primary");
assert.ok(drawer.includes("createPortal(drawer, document.body)"), "drawer is not clipped by sticky header stacking");
assert.ok(drawer.includes('aria-expanded={open}'), "menu button announces open state");
assert.ok(drawer.includes('aria-controls={panelId}'), "menu button controls drawer");
assert.ok(drawer.includes('role="dialog"'), "drawer provides appropriate accessible modal semantics");
assert.ok(drawer.includes("inert={!open}"), "closed drawer is not tabbable");
assert.ok(drawer.includes('event.key === "Escape"'), "Escape dismisses drawer");
assert.ok(drawer.includes('event.key !== "Tab"'), "keyboard focus is contained in open drawer");
assert.ok(drawer.includes('onClick={() => close(true)}'), "drawer can close with outside click or close button");
assert.ok(drawer.includes('href="/#sizes"'), "the all-sizes page remains discoverable");
assert.ok(drawer.includes("aria-current={pathname === item.href"), "drawer identifies current page");
assert.ok(!css.includes(".mobile-bar,\n  .menu {"), "desktop breakpoint no longer hides the menu");
assert.ok(!css.includes(".site-nav {\n    display: flex;"), "desktop breakpoint does not restore old nav");
assert.ok(css.includes(".menu__layer.is-open"), "desktop backdrop and drawer are visible when opened");
assert.ok(css.includes(".menu__button-label"), "menu is recognizable on desktop");
assert.ok(css.includes("@media (prefers-reduced-motion: reduce)"), "drawer motion respects reduced motion");
console.log("Experience design prototype contract checks passed.");

// CX conversion guardrails, 2026-11-28.
assert.ok(home.includes("No account or contact details needed"));
assert.ok(home.includes("company.googleReviewsUrl"));
for (const file of ["app/[slug]/SizePage.tsx", "lib/faqs.ts", "components/PriceTable.tsx"]) {
  assert.ok(read(file).includes("threeDayTier(pricing)"), file + " uses canonical 3-day tier");
  assert.ok(!read(file).includes("pricing.tiers[0]"), file + " must not substitute another tier");
}
assert.ok(read("components/ZipCheck.tsx").includes("request !== version.current"));
assert.ok(read("components/ZipCheck.tsx").includes('params.set("size", String(size))'));
assert.ok(read("app/service-areas/page.tsx").includes("size={size}"));
