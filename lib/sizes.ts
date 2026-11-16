import { photos, type Photo } from "./media";
import type { SizeYards } from "./pricing";

// Page content for the three dumpster product pages. One template renders all
// three (STRATEGY-ARCHIVE §19.3). Price, included tonnage, height and pickup-load
// counts are NOT here: they come from the canonical pricing contract at render.

export type SizeContent = {
  yards: SizeYards;
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  fitLine: string;
  fitTiles: [string, string, string, string];
  adjacent: { text: string; label: string; slug: string }[];
  fitsList: string[];
  weightNote: string;
  // Box dimensions from Marcus's E-Pak order specs (emails of Jul 30 2025 and
  // Nov 12 2026): every size is 12' long x 96" wide; side walls are 36", 54" and 72".
  // Note: Supabase `dumpster_sizes.height_ft` says 3.5 for the 11-yard. The build
  // spec says 36" (3 ft), which also matches 11 cubic yards. Fix the table in admin.
  box: { lengthFt: number; widthFt: number; wallFt: number };
  hero: Photo;
  gallery: Photo[];
  faqs: { q: string; a: string }[];
};

const SLUG_11 = "11-yard-the-little-junker";
const SLUG_16 = "16-yard-the-mighty-middler";
const SLUG_21 = "21-yard-the-big-junker";

export const sizes: SizeContent[] = [
  {
    yards: 11,
    slug: SLUG_11,
    name: "The Little Junker",
    metaTitle: "11-Yard Dumpster Rental | The Little Junker",
    metaDescription:
      "Our smallest roll-off. A good fit for garage cleanouts, small remodels and tight driveways in Fayette and Coweta County. See the price for your ZIP and book online.",
    fitLine: "Great for smaller cleanouts, remodels, and tight driveways.",
    fitTiles: ["Garage cleanout", "Small kitchen or bath remodel", "Decluttering and household junk", "Yard cleanup"],
    adjacent: [{ text: "Need more room?", label: "See the 16-Yard", slug: SLUG_16 }],
    fitsList: ["Boxes, bags and household junk", "A room or two of old furniture", "Cabinets and countertops from a small remodel", "Brush and yard debris"],
    weightNote: "Dense material like shingles or tile can reach the weight limit before the dumpster looks full.",
    box: { lengthFt: 12, widthFt: 8, wallFt: 3 },
    hero: photos.y11SmallDriveway,
    gallery: [photos.y11Fayetteville, photos.y11Tyrone, photos.y11Senoia, photos.y11Newnan, photos.y11Wood],
    faqs: [
      {
        q: "How much does the 11-yard hold?",
        a: "About 4 to 5 pickup-truck loads. That's a volume comparison. Weight limits still apply.",
      },
      {
        q: "Will it fit in my driveway?",
        a: "It's our smallest dumpster and the easiest one to place in a short or narrow driveway. We deliver with a hook-lift truck, not a full-size roll-off truck. If you're not sure, text us a photo of the spot.",
      },
      {
        q: "Can I use it for a roof tear-off?",
        a: "Yes. Shingles are allowed, but they're heavy. Tell us how many squares and layers you're pulling off and we'll help you check the weight before you book.",
      },
      {
        q: "What if I fill it up early?",
        a: "Text us. We can pick it up early, or swap it for an empty one if you have more to haul. An early pickup ends the rental, so unused days don't carry over.",
      },
    ],
  },
  {
    yards: 16,
    slug: SLUG_16,
    name: "The Mighty Middler",
    metaTitle: "16-Yard Dumpster Rental | The Mighty Middler",
    metaDescription:
      "A 16-yard dumpster for remodels, deck tear-outs and bigger cleanouts. See what fits, how much weight is included and the price for your ZIP. Book online.",
    fitLine: "The middle size for remodels, deck tear-outs and bigger cleanouts.",
    fitTiles: ["Kitchen or multi-room remodel", "Deck tear-out", "Basement or attic cleanout", "Roof tear-off"],
    adjacent: [
      { text: "Smaller job?", label: "The 11-Yard may do it", slug: SLUG_11 },
      { text: "Lots of bulky stuff?", label: "Look at the 21-Yard", slug: SLUG_21 },
    ],
    fitsList: ["Flooring, drywall and trim from a remodel", "Deck boards and railing", "Several rooms of furniture", "Mixed household and project debris"],
    weightNote: "Roofing, tile and plaster add up fast. Check the weight before you book a heavy job.",
    box: { lengthFt: 12, widthFt: 8, wallFt: 4.5 },
    hero: photos.y16NewnanGarage,
    gallery: [photos.y16NewnanYard, photos.y16Fayetteville, photos.loadedBesideGarage, photos.y16Overloaded],
    faqs: [
      {
        q: "How big is a 16-yard dumpster?",
        a: "It holds about 6 to 7 pickup-truck loads. All three sizes share the same 12 by 8 foot footprint. The 16-yard has 4.5-foot walls.",
      },
      {
        q: "Is the 16-yard right for a roofing job?",
        a: "Often, yes. For roofing we recommend the 11 or the 16. Shingles are heavy, so tell us the number of squares and layers and we'll help you pick.",
      },
      {
        q: "When should I pick the 11-yard instead?",
        a: "When it's one room, a garage, or a small remodel. If you're between sizes on bulky, light stuff like furniture, go up a size.",
      },
      {
        q: "How high can I load it?",
        a: "Level with the top rail. We can't haul a dumpster with debris sticking up over the sides.",
      },
    ],
  },
  {
    yards: 21,
    slug: SLUG_21,
    name: "The Big Junker",
    metaTitle: "21-Yard Dumpster Rental | The Big Junker",
    metaDescription:
      "Our largest dumpster, for whole-house cleanouts and major remodels. See what fits, how much weight is included and the price for your ZIP. Book online.",
    fitLine: "Room for whole-house cleanouts and major remodels.",
    fitTiles: ["Whole-house cleanout", "Major remodel", "Estate or move-out cleanout", "Bulky furniture and fixtures"],
    adjacent: [{ text: "Not that much to haul?", label: "You may only need the 16-Yard", slug: SLUG_16 }],
    fitsList: ["A house full of furniture and boxes", "Cabinets, doors and fixtures from a big remodel", "Carpet and flooring from several rooms", "Bulky items that eat up space"],
    weightNote:
      "More room doesn't mean more weight. Heavy debris hits the weight limit long before a 21-yard is full, so a smaller size is usually the better pick for dense loads.",
    box: { lengthFt: 12, widthFt: 8, wallFt: 6 },
    hero: photos.y21PeachtreeCity,
    gallery: [photos.y21Fayetteville, photos.y21Fairburn, photos.y21Driveway, photos.y21OnTruck],
    faqs: [
      {
        q: "How much does the 21-yard hold?",
        a: "About 8 to 10 pickup-truck loads. That's a volume comparison. Weight limits still apply.",
      },
      {
        q: "Will a 21-yard fit in a driveway?",
        a: "Usually. It's our tallest dumpster, so check for low branches and wires over the spot. Text us a photo if you want a second opinion.",
      },
      {
        q: "Should I get the 21-yard for roofing?",
        a: "No. For roofing we recommend the 11 or the 16. Shingles reach the weight limit well before a 21-yard fills up.",
      },
      {
        q: "Do I need the biggest size?",
        a: "Only if you have the volume. If you're clearing one or two rooms, the 16-yard usually covers it and costs less.",
      },
    ],
  },
];

export const sizeBySlug = (slug: string) => sizes.find((s) => s.slug === slug);
export const sizeByYards = (yards: SizeYards) => sizes.find((s) => s.yards === yards)!;
