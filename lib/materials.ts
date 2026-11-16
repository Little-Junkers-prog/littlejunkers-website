import { photos, type Photo } from "./media";

// Dumpster-rental material rules, owner-approved in STRATEGY-ARCHIVE §19.11 and
// TIER-1 spec §17. Supabase has no dumpster-material-rules table yet, so this
// file is the interim single source for the Materials page and the FAQ. Do not
// copy Bulk Pickup rules in here.
//
// OPEN QUESTION for Marcus: mattresses, tires and appliances. `fees` has active
// per-item rows for them (keyed "prohibited_*"), BRAND-001 flags the old surcharge
// guidance as conflicting, and the spec forbids presenting item fees. Until the
// rule is confirmed they resolve to "ask" (text us first) and no fee is shown.

export type MaterialStatus = "yes" | "instructions" | "no" | "ask";

export type Material = {
  name: string;
  aliases?: string[];
  status: MaterialStatus;
  note?: string;
  photo?: Photo;
};

export const statusLabel: Record<MaterialStatus, string> = {
  yes: "Yes, you can toss it",
  instructions: "Accepted with instructions",
  no: "No, not in the dumpster",
  ask: "Text us first",
};

const HEAVY = "Allowed, but heavy. It can reach the included weight before the dumpster looks full.";

export const materials: Material[] = [
  // Allowed. First four are the page preview.
  { name: "Furniture", aliases: ["couch", "sofa", "chair", "table", "dresser", "desk", "bed frame"], status: "yes", photo: photos.loadFurniture },
  { name: "Household junk", aliases: ["boxes", "bags", "clutter", "toys", "clothes", "garage", "attic", "basement"], status: "yes", photo: photos.loadCleanout },
  { name: "Wood and lumber", aliases: ["deck", "fence", "pallets", "plywood", "boards", "trim"], status: "yes", photo: photos.loadWood },
  { name: "Yard debris", aliases: ["branches", "brush", "limbs", "leaves", "shrubs"], status: "yes", photo: photos.loadYardWaste },
  { name: "Drywall", aliases: ["sheetrock", "plaster board"], status: "yes" },
  { name: "Flooring", aliases: ["carpet", "laminate", "vinyl", "hardwood", "padding"], status: "yes" },
  { name: "Cabinets and countertops", aliases: ["vanity", "kitchen", "bathroom"], status: "yes" },
  { name: "Doors, windows and fixtures", aliases: ["sink", "tub", "toilet"], status: "yes" },
  { name: "Remodel debris", aliases: ["construction debris", "demo", "siding", "insulation"], status: "yes" },
  { name: "Roofing shingles", aliases: ["roof", "shingle", "tear-off", "felt"], status: "yes", note: HEAVY },
  { name: "Tile", aliases: ["ceramic", "porcelain"], status: "yes", note: HEAVY },

  // Accepted with instructions.
  {
    name: "Paint",
    aliases: ["latex", "paint cans", "stain"],
    status: "instructions",
    note: "Only if it's dried out or in a tightly sealed can. Wet, open or leaking paint isn't accepted.",
    photo: photos.spilledPaint,
  },
  {
    name: "Batteries",
    aliases: ["lithium", "car battery", "tool battery", "e-bike"],
    status: "instructions",
    note: "Don't put them in the dumpster. Set lithium and car batteries outside, at the front of the dumpster, and tell us. We'll coordinate recycling.",
  },
  {
    name: "Motor oil",
    aliases: ["used oil", "oil"],
    status: "instructions",
    note: "Up to 10 quarts, in sealed containers, set outside at the front of the dumpster. We'll coordinate recycling. More than 10 quarts isn't accepted.",
  },

  // Not accepted. First four are the page preview.
  { name: "Dirt", aliases: ["soil", "sod", "fill", "gravel"], status: "no" },
  { name: "Concrete", aliases: ["cement", "slab", "pavers"], status: "no" },
  {
    name: "Compressed cylinders",
    aliases: ["propane", "helium tank", "fire extinguisher", "gas cylinder", "oxygen tank"],
    status: "no",
    note: "That includes helium tanks and fire extinguishers.",
  },
  {
    name: "Hazardous chemicals",
    aliases: ["pesticide", "solvent", "pool chemicals", "gasoline", "fuel", "asbestos", "antifreeze"],
    status: "no",
    note: "Anything hazardous or regulated that we haven't approved stays out.",
  },
  { name: "Wet or leaking paint", aliases: ["open paint"], status: "no", note: "Dry it out or seal the can first." },
  { name: "Motor oil over 10 quarts", status: "no" },

  // Unresolved rule. See the note at the top of this file.
  { name: "Mattresses and box springs", aliases: ["mattress", "box spring"], status: "ask", note: "These need separate handling. Text us before you load them." },
  { name: "Tires", aliases: ["tire"], status: "ask", note: "These need separate handling. Text us before you load them." },
  {
    name: "Appliances",
    aliases: ["refrigerator", "fridge", "freezer", "washer", "dryer", "stove", "oven", "water heater", "ac unit", "microwave", "dishwasher"],
    status: "ask",
    note: "These need separate handling. Text us before you load them.",
  },
];

export const byStatus = (status: MaterialStatus) => materials.filter((m) => m.status === status);
