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
  metaTitle: string;
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
  a: "An 11-yard is a good place to start for a smaller cleanout. The 16- and 21-yard bins give you more room for bigger projects. Heavy material can hit the weight limit before the bin is full, so tell us what you're loading if you're unsure.",
};

const deliveryFaq = (city: string) => ({
  q: `How soon can you deliver in ${city}?`,
  a: "Tell us your ZIP and the date you'd prefer. We'll confirm the available delivery options before you reserve anything.",
});

export const cities: CityContent[] = [
  {
    city: "Newnan",
    slug: slugFor("Newnan"),
    county: "Coweta County",
    metaTitle: "Newnan, GA Dumpster Rental | Little Junkers",
    metaDescription:
      "Dumpster rental in Newnan, GA. Compare 11-, 16- and 21-yard Pink Bins, included disposal weight and delivery fees for your address.",
    intro: "Cleaning out a garage, replacing flooring or clearing out a house in Newnan? We offer 11-, 16- and 21-yard Pink Bins. Check the price for your address below.",
    proofHeading: "Pink Bins at Newnan homes",
    proofCopy: "Here are a few of our Newnan dumpsters. The photos show an 11-yard bin filled for pickup and 16-yard bins beside a garage and in a yard. They can help you picture how much space you'll need.",
    sizesDelivered: [11, 16, 21],
    hero: photos.y16NewnanGarage,
    proof: [photos.y16NewnanYard, photos.y11Newnan, photos.y16NewnanGarage],
    placement: {
      heading: "Thinking about putting it on the street?",
      body: "For a Newnan driveway delivery, make sure there's room for the truck to back in and set down the dumpster. If the bin needs to go in the street or public right-of-way, check with the City of Newnan Engineering Department about permits first.",
    },
    faqs: [
      {
        q: "Is there a delivery fee in Newnan?",
        a: "Enter your Newnan ZIP on this page to see the delivery fee with the current rental estimate.",
      },
      deliveryFaq("Newnan"),
      {
        q: "Do I need a permit for street placement in Newnan?",
        a: "Check with the City of Newnan Engineering Department before putting a dumpster in the street or right-of-way. For a driveway delivery, we'll still need to confirm there's room for the truck.",
      },
      sizeFaq,
    ],
    nearby: ["Sharpsburg", "Senoia", "Peachtree City", "Fayetteville"],
  },
  {
    city: "Peachtree City",
    slug: slugFor("Peachtree City"),
    county: "Fayette County",
    metaTitle: "Peachtree City Dumpster Rental | Little Junkers",
    metaDescription:
      "Little Junkers is based in Peachtree City, GA. Compare 11-, 16- and 21-yard Pink Bins, included weight and current delivery fees.",
    intro: "We're based right here in Peachtree City. Whether you're cleaning out the garage or working on a bigger remodel, we'll help you choose a Pink Bin that fits the job.",
    proofHeading: "A Big Junker in Peachtree City",
    proofCopy: "That's our 21-yard Big Junker in a Peachtree City driveway. If your project is smaller, take a look at the 11- and 16-yard options in the price cards above.",
    sizesDelivered: [11, 16, 21],
    hero: photos.y21PeachtreeCity,
    proof: [photos.y21PeachtreeCity],
    placement: {
      heading: "Driveway and cart-path access",
      body: "A cart path or a tight driveway can affect where we can put a dumpster. If delivery would mean using or crossing a public cart path, check with the city first. Peachtree City has a cart-path encroachment permit process.",
    },
    faqs: [
      {
        q: "Is Little Junkers based in Peachtree City?",
        a: "Yes. We're Marcus and Ivy, and we run Little Junkers from Peachtree City in Fayette County. We're in Peachtree City, not Peachtree Corners.",
      },
      deliveryFaq("Peachtree City"),
      {
        q: "Is there a delivery fee in Peachtree City?",
        a: "Enter your Peachtree City ZIP to check delivery. The fee appears separately from the dumpster price.",
      },
      sizeFaq,
    ],
    nearby: ["Fayetteville", "Tyrone", "Senoia", "Sharpsburg"],
  },
  {
    city: "Fayetteville",
    slug: slugFor("Fayetteville"),
    county: "Fayette County",
    metaTitle: "Fayetteville, GA Dumpster Rental | Little Junkers",
    metaDescription:
      "Dumpster rental in Fayetteville, GA. Compare 11-, 16- and 21-yard Pink Bins, included weight and delivery fees for your address.",
    intro: "Cleaning out a room, replacing flooring or taking on a remodel in Fayetteville? Our Pink Bins come in three sizes, so you can pick the space you need without guessing.",
    proofHeading: "We've delivered all three sizes in Fayetteville",
    proofCopy: "These are our dumpsters on Fayetteville jobs: an 11-yard in a driveway, a 16-yard being delivered and a 21-yard on site. Have a look at the photos, then compare sizes above.",
    sizesDelivered: [11, 16, 21],
    hero: photos.y11Fayetteville,
    proof: [photos.y16Fayetteville, photos.y21Fayetteville, photos.y11Fayetteville],
    placement: {
      heading: "Make room for the delivery truck",
      body: "The dumpster may fit in your driveway, but the truck needs room to set it down. Check for low branches, overhead wires and tight turns. If you aren't sure about access, text us a photo of the spot.",
    },
    faqs: [
      {
        q: "Is there a delivery fee in Fayetteville?",
        a: "Fayetteville has more than one ZIP. Enter yours so we can show the right delivery fee.",
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
    metaTitle: "Senoia, GA Dumpster Rental | Little Junkers",
    metaDescription:
      "Dumpster rental in Senoia, GA. See Little Junkers' 11-, 16- and 21-yard Pink Bins, check current delivery fees and compare starting rates.",
    intro: "Got a cleanout or renovation underway in Senoia? Choose from our 11-, 16- and 21-yard Pink Bins. If your driveway is long or unpaved, tell us before delivery.",
    proofHeading: "Here's an 11-yard Pink Bin in Senoia",
    proofCopy: "This Senoia dumpster is loaded right to the top rail. That's where to stop. Debris piled above the sides can't travel safely, even if there's still room to squeeze more in.",
    sizesDelivered: [11, 16, 21],
    hero: photos.y11Senoia,
    proof: [photos.y11Senoia],
    placement: {
      heading: "Long drives and gravel surfaces",
      body: "Have a long gravel drive or a narrow turn? Send us a photo of the way in and the spot where you want the bin. We need to check that the truck can get through and the ground can support a loaded dumpster.",
    },
    faqs: [
      {
        q: "Is there a delivery fee in Senoia?",
        a: "Enter your Senoia ZIP to check the delivery fee. It's listed separately from the dumpster price.",
      },
      deliveryFaq("Senoia"),
      {
        q: "Can you deliver to a rural address or a long gravel drive?",
        a: "We need to check the access and the ground before saying yes to a long or unpaved driveway. Text us a photo of the route and where you'd like the bin.",
      },
      sizeFaq,
    ],
    nearby: ["Sharpsburg", "Peachtree City", "Newnan"],
  },
  {
    city: "Sharpsburg",
    slug: slugFor("Sharpsburg"),
    county: "Coweta County",
    metaTitle: "Sharpsburg, GA Dumpster Rental | Little Junkers",
    metaDescription:
      "Looking for dumpster rental in Sharpsburg, GA? Compare Little Junkers' 11-, 16- and 21-yard Pink Bins and check delivery fees and pricing.",
    intro: "Working on a cleanout or renovation in Sharpsburg? We've rented 11-, 16- and 21-yard dumpsters in the area. Take a look at the sizes and tell us what you're throwing away.",
    proofHeading: "Dumpster rental for Sharpsburg cleanouts",
    proofCopy: "We've had all three dumpster sizes on rental in Sharpsburg. The 11-yard is our smallest bin, while the 16- and 21-yard give you more room for larger cleanouts. We'll help you choose if you're between sizes.",
    heroDisclosure: "Little Junkers equipment photographed elsewhere in our service area.",
    sizesDelivered: [11, 16, 21],
    hero: photos.hero,
    proof: [],
    placement: {
      heading: "Is the driveway easy to reach?",
      body: "If your Sharpsburg property has a gate, a long gravel drive or a tight turn, send us a photo before scheduling. We'll need to check access for the hook-lift truck, not just the bin itself.",
    },
    faqs: [
      {
        q: "Is there a delivery fee in Sharpsburg?",
        a: "Enter your Sharpsburg ZIP to see the delivery fee. We'll confirm the address before scheduling.",
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
    metaTitle: "Tyrone, GA Dumpster Rental | Little Junkers",
    metaDescription:
      "Compare Pink Bin dumpster sizes for Tyrone, GA. Little Junkers offers 11-, 16- and 21-yard rentals, with delivery fees checked by ZIP.",
    intro: "Need a dumpster for a garage cleanout, flooring job or renovation in Tyrone? Start by choosing the right size. Check the delivery fee for your ZIP below.",
    proofHeading: "Our 11-yard Little Junker in Tyrone",
    proofCopy: "This is one of our 11-yard Pink Bins in a Tyrone driveway. It's a good starting point for smaller jobs; if you've got more debris, compare it with our 16- and 21-yard bins.",
    sizesDelivered: [],
    hero: photos.y11Tyrone,
    proof: [photos.y11Tyrone],
    placement: {
      heading: "Even a small dumpster needs truck access",
      body: "Our hook-lift truck has to back into the delivery area. If the driveway has a sharp turn or low branches, text us a picture so we can talk through where the dumpster could go.",
    },
    faqs: [
      {
        q: "Is there a delivery fee in Tyrone?",
        a: "Enter your Tyrone ZIP to see the current delivery fee.",
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
    metaTitle: "Fairburn, GA Dumpster Rental | Little Junkers",
    metaDescription:
      "Dumpster rental in Fairburn, GA. Check delivery fees and compare Little Junkers' 11-, 16- and 21-yard Pink Bins and included disposal weight.",
    intro: "Clearing out a house or working on a renovation in Fairburn? We offer three Pink Bin sizes, and you can check the delivery fee before choosing one.",
    proofHeading: "A 21-yard Big Junker in Fairburn",
    proofCopy: "This is our 21-yard dumpster at a Fairburn home. We've also rented our smaller 11-yard bins in the area. If you're unsure how much space you need, compare the sizes above or text us about the job.",
    sizesDelivered: [11, 21],
    hero: photos.y21Fairburn,
    proof: [photos.y21Fairburn],
    placement: {
      heading: "Choosing a spot for the bin",
      body: "Take a look at the route into your driveway as well as the drop spot itself. Slopes, branches and narrow turns can affect delivery. A quick photo helps us check the options with you.",
    },
    faqs: [
      {
        q: "Is there a delivery fee in Fairburn?",
        a: "Enter your Fairburn ZIP to see the delivery fee before choosing your rental.",
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
