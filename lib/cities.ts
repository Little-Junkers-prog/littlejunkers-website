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
  proofHeading: string;
  proofCopy: string;
  heroDisclosure?: string;
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

export const cities: CityContent[] = [
  {
    city: "Newnan",
    slug: slugFor("Newnan"),
    county: "Coweta County",
    metaDescription:
      "Pink dumpsters delivered in Newnan, GA. See current prices for 11, 16 and 21-yard dumpsters, check your ZIP and book online with Little Junkers.",
    intro: "We deliver all three sizes in Newnan, from garage cleanouts to full remodels.",
    proofHeading: "Little Junkers jobs in Newnan",
    proofCopy: "Our Newnan photos show a full 11-yard dumpster and two 16-yard placements, one by a garage and one in a yard. Completed rentals here also include the 21-yard. These are our containers on real jobs, not stock photos.",
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
    proofHeading: "A Peachtree City driveway, photographed by our team",
    proofCopy: "The 21-yard pictured here is a Little Junkers dumpster placed in Peachtree City. Our completed rental records also include the 11- and 16-yard sizes in this city.",
    sizesDelivered: [11, 16, 21],
    hero: photos.y21PeachtreeCity,
    proof: [photos.y21PeachtreeCity],
    placement: {
      heading: "Driveways and golf cart paths",
      body: "If reaching the drop spot would involve crossing or using a public cart path or right-of-way, check with Peachtree City before scheduling. The city publishes a cart-path encroachment permit application. For a driveway placement, show us any tight access or overhead branches so we can plan the drop spot.",
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
    intro: "Our Fayetteville photos show an 11-yard driveway placement, a 16-yard delivery and a 21-yard dumpster on site. See the real equipment before you decide.",
    proofHeading: "Three sizes at Fayetteville jobs",
    proofCopy: "Our team photographed an 11-yard dumpster in a Fayetteville driveway, a 16-yard being delivered and a 21-yard on site. Completed rentals in Fayetteville include all three sizes.",
    sizesDelivered: [11, 16, 21],
    hero: photos.y11Fayetteville,
    proof: [photos.y16Fayetteville, photos.y21Fayetteville, photos.y11Fayetteville],
    placement: {
      heading: "Planning a Fayetteville delivery",
      body: "Our truck needs a clear route into the placement spot, not just enough room for the dumpster. Check for low tree limbs, wires and tight turns; send us a driveway photo if access looks close.",
    },
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
    intro: "Our Senoia photo shows an 11-yard dumpster loaded level with the top. Completed rentals here also include the 16- and 21-yard sizes.",
    proofHeading: "An 11-yard Little Junkers in Senoia",
    proofCopy: "This is a real Senoia job photo, not a generic local illustration. The container is loaded level with the top rail, a useful example of the safe loading limit.",
    sizesDelivered: [11, 16, 21],
    hero: photos.y11Senoia,
    proof: [photos.y11Senoia],
    placement: {
      heading: "Getting to the placement spot",
      body: "For a Senoia property with a long drive or gravel surface, check the route and the ground where the container would sit. The truck needs a safe, accessible approach; text us a driveway photo if the turn or slope is uncertain.",
    },
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
    intro: "We've completed rentals in Sharpsburg with 11-, 16- and 21-yard dumpsters. The right size depends on what you are clearing out and how heavy it is.",
    proofHeading: "Our completed rental history in Sharpsburg",
    proofCopy: "Our records include completed Sharpsburg rentals in all three dumpster sizes. We don't yet have an approved Sharpsburg job photograph on this site, so we won't present a nearby job as if it happened here.",
    heroDisclosure: "Little Junkers equipment photo from our service area, not a Sharpsburg-specific job.",
    sizesDelivered: [11, 16, 21],
    hero: photos.hero,
    proof: [],
    placement: {
      heading: "Have a gate, gravel drive or tight turn?",
      body: "If you're arranging a Sharpsburg rental, tell us about gates, low branches, uneven ground or a long approach before delivery. A photo of the proposed drop spot helps us check truck access.",
    },
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
    intro: "We've photographed our compact 11-yard dumpster at a Tyrone property. Check the delivery area for ZIP 30290 and tell us about the driveway before you choose a date.",
    proofHeading: "An 11-yard dumpster photographed in Tyrone",
    proofCopy: "This first-party photo shows our 11-yard dumpster in a Tyrone driveway. We can help you decide whether a smaller footprint or a larger container is right for your project.",
    sizesDelivered: [],
    hero: photos.y11Tyrone,
    proof: [photos.y11Tyrone],
    placement: {
      heading: "Room for the truck matters",
      body: "A small dumpster still arrives on a hook-lift truck. For a Tyrone driveway, leave a clear backing path and tell us about low branches, wires or a tight approach. Not sure about clearance? Send us a photo.",
    },
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
    intro: "The 21-yard Little Junkers shown here is photographed in a Fairburn driveway. Our completed rental records also include 11-yard dumpsters in this market.",
    proofHeading: "Real Little Junkers equipment in Fairburn",
    proofCopy: "Our Fairburn image shows the 21-yard in a driveway, and completed rental records include both 11- and 21-yard jobs. Match the container to your debris and check access before delivery.",
    sizesDelivered: [11, 21],
    hero: photos.y21Fairburn,
    proof: [photos.y21Fairburn],
    placement: {
      heading: "Pick a safe, reachable drop spot",
      body: "For a Fairburn delivery, check the access route as well as the place where the container will sit. A steep slope, narrow turn or overhead obstruction can change where we can set it. Text us a photo if you're unsure.",
    },
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
