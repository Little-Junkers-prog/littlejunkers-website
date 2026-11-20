import { photos, type PhotoSlot } from "./media";
import type { SizeYards } from "./pricing";

// City pages share one template (TIER-1 spec §9A) but each carries its own
// first-party evidence. ZIPs, zone and delivery fee are NOT stored here: they
// resolve from canonical ZIP rows at render, keyed by `city`.
//
// `sizesDelivered` was verified against completed rentals in Supabase on
// 2026-11-16 (non-cancelled rentals, grouped by service ZIP). Re-verify before
// launch. Nothing here is a testimonial or an invented job.

export type CityContent = {
  city: string;
  slug: string;
  county: string;
  metaDescription: string;
  intro: string;
  sizesDelivered: SizeYards[];
  proof: PhotoSlot[];
  hero: PhotoSlot;
  placement: { heading: string; body: string };
  faqs: { q: string; a: string }[];
  nearby: string[];
};

const slugFor = (city: string) => `dumpster-rental-${city.toLowerCase().replace(/\s+/g, "-")}-little-junkers`;

const sizeFaq = {
  q: "What size dumpster should I get?",
  a: "For a garage or one-room job, the 11-yard. For a remodel or a bigger cleanout, the 16. For a whole house, the 21. If you're stuck between two, text us what you're tossing.",
};

const deliveryFaq = (city: string) => ({
  q: `How soon can you deliver in ${city}?`,
  a: "The booking calendar shows the delivery days that are open right now. Pick the one that works and you're set.",
});

const genericPlacement = (city: string) => ({
  heading: "Where it goes",
  body: `Most ${city} customers put the dumpster in the driveway. If you want it on the street or anywhere off your property, check with the city and your HOA first. Rules vary, and we'd rather you find out before delivery day.`,
});

export const cities: CityContent[] = [
  {
    city: "Newnan",
    slug: slugFor("Newnan"),
    county: "Coweta County",
    metaDescription:
      "Pink dumpsters delivered in Newnan, GA. See current prices for 11, 16 and 21-yard dumpsters, check your ZIP and book online with Little Junkers.",
    intro: "We deliver all three sizes in Newnan, from garage cleanouts to full remodels.",
    sizesDelivered: [11, 16, 21],
    hero: photos.y16NewnanGarage,
    proof: [photos.y16NewnanYard, photos.y11Newnan, photos.y16NewnanGarage],
    placement: {
      heading: "Putting it in the street?",
      body: "The City of Newnan has a right-of-way permitting process through its Engineering Department. Check the city's requirements before delivery. HOA or private-property rules may also apply.",
    },
    faqs: [
      {
        q: "Is there a delivery fee in Newnan?",
        a: "Your delivery fee depends on your ZIP. The current fee for Newnan ZIPs is shown at the top of this page and again before you pay.",
      },
      deliveryFaq("Newnan"),
      {
        q: "Do I need a permit for street placement in Newnan?",
        a: "If the dumpster will sit in the street or the public right-of-way, check with the City of Newnan Engineering Department first. A driveway on your own property is the simplest spot.",
      },
      sizeFaq,
    ],
    nearby: ["Sharpsburg", "Senoia", "Peachtree City", "Fayetteville"],
  },
  {
    city: "Peachtree City",
    slug: slugFor("Peachtree City"),
    county: "Fayette County",
    metaDescription:
      "Dumpster rental in Peachtree City, GA from the pink-dumpster company based here. See current 11, 16 and 21-yard prices and book online.",
    intro: "Peachtree City is home. Little Junkers is owned and run here by Marcus and Ivy.",
    sizesDelivered: [11, 16, 21],
    hero: photos.y21PeachtreeCity,
    proof: [photos.y21PeachtreeCity, { needed: "Peachtree City job photo: 11 or 16-yard in a driveway, city named in the file" }],
    placement: {
      heading: "Driveways and cart paths",
      body: "Most Peachtree City customers put the dumpster in the driveway. If a golf cart path crosses or borders your driveway, tell us when you book and we'll plan the placement around it. For street placement, check with the city and your HOA first.",
    },
    faqs: [
      {
        q: "Are you actually based in Peachtree City?",
        a: "Yes. Little Junkers is a Peachtree City, Georgia business in Fayette County, not Peachtree Corners. Marcus and Ivy own and run it.",
      },
      deliveryFaq("Peachtree City"),
      {
        q: "Is there a delivery fee in Peachtree City?",
        a: "Your delivery fee depends on your ZIP. The current fee for Peachtree City is shown at the top of this page and again before you pay.",
      },
      sizeFaq,
    ],
    nearby: ["Fayetteville", "Tyrone", "Senoia", "Sharpsburg"],
  },
  {
    city: "Fayetteville",
    slug: slugFor("Fayetteville"),
    county: "Fayette County",
    metaDescription:
      "Dumpster rental in Fayetteville, GA. Little Junkers delivers 11, 16 and 21-yard pink dumpsters across Fayette County. See prices for your ZIP and book online.",
    intro: "We've set all three sizes in Fayetteville driveways. The photos below are from those jobs.",
    sizesDelivered: [11, 16, 21],
    hero: photos.y11Fayetteville,
    proof: [photos.y16Fayetteville, photos.y21Fayetteville, photos.y11Fayetteville],
    placement: genericPlacement("Fayetteville"),
    faqs: [
      {
        q: "Is there a delivery fee in Fayetteville?",
        a: "Your delivery fee depends on your ZIP. The current fee for Fayetteville ZIPs is shown at the top of this page and again before you pay.",
      },
      deliveryFaq("Fayetteville"),
      {
        q: "How full can I load the dumpster?",
        a: "Level with the top. We can't haul a dumpster with debris sticking up over the sides, so stop at the rail.",
      },
      sizeFaq,
    ],
    nearby: ["Peachtree City", "Tyrone", "Fairburn", "Newnan"],
  },
  {
    city: "Senoia",
    slug: slugFor("Senoia"),
    county: "Coweta County",
    metaDescription:
      "Dumpster rental in Senoia, GA. Little Junkers delivers 11, 16 and 21-yard pink dumpsters in Coweta County. See current prices and book online.",
    intro: "We deliver all three sizes in Senoia.",
    sizesDelivered: [11, 16, 21],
    hero: photos.y11Senoia,
    proof: [photos.y11Senoia, { needed: "Senoia job photo: 16 or 21-yard at a home, city named in the file" }],
    placement: genericPlacement("Senoia"),
    faqs: [
      {
        q: "Is there a delivery fee in Senoia?",
        a: "Your delivery fee depends on your ZIP. The current fee for Senoia is shown at the top of this page and again before you pay.",
      },
      deliveryFaq("Senoia"),
      {
        q: "Can you deliver to a rural address or a long gravel drive?",
        a: "Usually. Tell us about the drive when you book, or text us a photo, so we can check that the truck can get in and out.",
      },
      sizeFaq,
    ],
    nearby: ["Sharpsburg", "Peachtree City", "Newnan"],
  },
  {
    city: "Sharpsburg",
    slug: slugFor("Sharpsburg"),
    county: "Coweta County",
    metaDescription:
      "Dumpster rental in Sharpsburg, GA. Little Junkers delivers 11, 16 and 21-yard pink dumpsters in Coweta County. See current prices and book online.",
    intro: "We deliver all three sizes in Sharpsburg.",
    sizesDelivered: [11, 16, 21],
    hero: { needed: "Sharpsburg hero: pink dumpster in a Sharpsburg driveway" },
    proof: [{ needed: "Sharpsburg job photo with dumpster size" }, { needed: "Second Sharpsburg job photo" }],
    placement: genericPlacement("Sharpsburg"),
    faqs: [
      {
        q: "Is there a delivery fee in Sharpsburg?",
        a: "Your delivery fee depends on your ZIP. The current fee for Sharpsburg is shown at the top of this page and again before you pay.",
      },
      deliveryFaq("Sharpsburg"),
      {
        q: "Can you deliver to a rural address or a long gravel drive?",
        a: "Usually. Tell us about the drive when you book, or text us a photo, so we can check that the truck can get in and out.",
      },
      sizeFaq,
    ],
    nearby: ["Newnan", "Senoia", "Peachtree City"],
  },
  {
    city: "Tyrone",
    slug: slugFor("Tyrone"),
    county: "Fayette County",
    metaDescription:
      "Dumpster rental in Tyrone, GA. Little Junkers delivers pink roll-off dumpsters in Fayette County. See current prices and book online.",
    intro: "Tyrone is right next door to us in Peachtree City.",
    sizesDelivered: [],
    hero: photos.y11Tyrone,
    proof: [photos.y11Tyrone, { needed: "Second Tyrone job photo with dumpster size" }],
    placement: genericPlacement("Tyrone"),
    faqs: [
      {
        q: "Is there a delivery fee in Tyrone?",
        a: "Your delivery fee depends on your ZIP. The current fee for Tyrone is shown at the top of this page and again before you pay.",
      },
      deliveryFaq("Tyrone"),
      {
        q: "How full can I load the dumpster?",
        a: "Level with the top. We can't haul a dumpster with debris sticking up over the sides, so stop at the rail.",
      },
      sizeFaq,
    ],
    nearby: ["Peachtree City", "Fayetteville", "Fairburn"],
  },
  {
    city: "Fairburn",
    slug: slugFor("Fairburn"),
    county: "Fulton County",
    metaDescription:
      "Dumpster rental in Fairburn, GA. Little Junkers delivers pink roll-off dumpsters in south Fulton County. See current prices and book online.",
    intro: "We deliver in Fairburn, just up the road from our home base in Peachtree City.",
    sizesDelivered: [11, 21],
    hero: photos.y21Fairburn,
    proof: [photos.y21Fairburn, { needed: "Second Fairburn job photo with dumpster size" }],
    placement: genericPlacement("Fairburn"),
    faqs: [
      {
        q: "Is there a delivery fee in Fairburn?",
        a: "Your delivery fee depends on your ZIP. The current fee for Fairburn is shown at the top of this page and again before you pay.",
      },
      deliveryFaq("Fairburn"),
      {
        q: "How full can I load the dumpster?",
        a: "Level with the top. We can't haul a dumpster with debris sticking up over the sides, so stop at the rail.",
      },
      sizeFaq,
    ],
    nearby: ["Tyrone", "Fayetteville", "Peachtree City"],
  },
];

export const cityBySlug = (slug: string) => cities.find((c) => c.slug === slug);
export const cityByName = (name: string) => cities.find((c) => c.city === name);
