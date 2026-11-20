// TEMPORARY image source (owner decision, Nov 16 2026).
//
// Real Little Junkers photos, resized from the booking repo's first-party media
// (littlejunkers-messenger-bot/public). They live in /public/images until the
// photo uploader (D-008) fills Supabase `media_library`. Pages only reference
// photos by key through this manifest, so the swap to Supabase touches this
// file and nothing else.
//
// Captions state only what the source filename attests (size, city). No job
// details are invented. A `needed` entry renders a labeled placeholder slot.

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type PhotoSlot = Photo | { needed: string };

const job = (file: string, width: number, height: number, alt: string, caption?: string): Photo => ({
  src: `/images/jobs/${file}.jpg`,
  width,
  height,
  alt,
  caption,
});

export const photos = {
  hero: job("hero-driveway", 1200, 1600, "Pink Little Junkers dumpster on a residential driveway"),
  stoneHome: job("stone-home-driveway", 1600, 1200, "Pink Little Junkers dumpster in the driveway of a stone home"),
  suburbanGarage: job("suburban-driveway-garage", 1600, 1200, "Pink Little Junkers dumpster in front of a two-car garage"),
  golfCartDriveway: job("driveway-golf-cart", 1600, 1200, "Pink Little Junkers dumpster beside a driveway with a golf cart parked in the garage"),
  curbside: job("curbside-street", 1600, 1200, "Pink Little Junkers dumpster at the curb on a residential street"),
  renovationSite: job("renovation-site", 1200, 1600, "Pink Little Junkers dumpster next to a home under renovation"),
  loadedBesideGarage: job("loaded-beside-garage", 1600, 1200, "Loaded pink Little Junkers dumpster beside a garage"),

  y11SmallDriveway: job("11-yard-small-driveway", 1600, 1200, "11-yard Little Junkers dumpster in a short driveway", "11-yard in a short driveway"),
  y11Residential: job("11-yard-residential-driveway", 1600, 1200, "11-yard Little Junkers dumpster in a residential driveway", "11-yard"),
  y11Fayetteville: job("11-yard-fayetteville", 1200, 1600, "11-yard Little Junkers dumpster in a Fayetteville driveway", "Fayetteville · 11-yard"),
  y11Tyrone: job("11-yard-tyrone", 1200, 1600, "11-yard Little Junkers dumpster in a Tyrone driveway", "Tyrone · 11-yard"),
  y11Senoia: job("11-yard-senoia-level-load", 1200, 1600, "11-yard Little Junkers dumpster in Senoia, loaded level with the top", "Senoia · 11-yard, loaded level"),
  y11Newnan: job("11-yard-newnan-full", 1200, 1600, "Full 11-yard Little Junkers dumpster in Newnan", "Newnan · 11-yard"),
  y11Wood: job("11-yard-wood", 1200, 1600, "11-yard Little Junkers dumpster loaded with scrap wood", "11-yard with scrap wood"),

  y16NewnanGarage: job("16-yard-newnan-garage", 1200, 1600, "16-yard Little Junkers dumpster near a garage in Newnan", "Newnan · 16-yard"),
  y16NewnanYard: job("16-yard-newnan-yard", 1200, 1600, "16-yard Little Junkers dumpster placed in a yard in Newnan", "Newnan · 16-yard"),
  y16Fayetteville: job("16-yard-fayetteville-delivery", 1200, 1600, "16-yard Little Junkers dumpster being delivered in Fayetteville", "Fayetteville · 16-yard delivery"),
  y16Overloaded: job("16-yard-fayetteville-overloaded", 1600, 1200, "Overloaded 16-yard dumpster in Fayetteville with debris above the top rail", "Overloaded: debris above the rail"),

  y21PeachtreeCity: job("21-yard-peachtree-city", 1200, 1600, "21-yard Little Junkers dumpster in a Peachtree City driveway", "Peachtree City · 21-yard"),
  y21Fayetteville: job("21-yard-fayetteville", 1200, 1600, "21-yard Little Junkers dumpster in Fayetteville", "Fayetteville · 21-yard"),
  y21Fairburn: job("21-yard-fairburn", 1200, 1600, "21-yard Little Junkers dumpster in a Fairburn driveway", "Fairburn · 21-yard"),
  y21Driveway: job("21-yard-driveway", 1600, 1200, "21-yard Little Junkers dumpster in a driveway in front of a two-story home", "21-yard"),
  y21OnTruck: job("21-yard-on-truck", 1200, 1600, "21-yard Little Junkers dumpster on the delivery truck", "21-yard on the truck"),

  truckDelivering: job("truck-delivering", 1200, 1600, "Little Junkers hook-lift truck setting down a pink dumpster"),
  loadWood: job("load-wood-debris", 1200, 1600, "Dumpster filled with wood and construction debris"),
  loadDeckLumber: job("load-deck-lumber", 1200, 1600, "Little Junkers dumpster filled with old deck boards and lumber"),
  concreteLoads: job("no-concrete-two-dumpsters", 1600, 1205, "Two pink Little Junkers dumpsters loaded with broken concrete and stone"),
  batteriesOutside: job("batteries-set-outside", 1600, 1200, "Three batteries set on the outside ledge of a pink Little Junkers dumpster instead of inside it"),
  loadFurniture: job("load-household-furniture", 1200, 1600, "Dumpster filled with household junk and furniture"),
  loadCleanout: job("load-household-cleanout", 1600, 1200, "Dumpster loaded with household cleanout items"),
  loadYardWaste: job("load-yard-waste", 1200, 1600, "11-yard Little Junkers dumpster loaded with branches and yard waste"),
  loadLevel: job("load-level-correct", 1600, 1200, "11-yard dumpster loaded correctly, level with the top", "Loaded right: level with the top"),
  loadOverloaded: job("load-overloaded", 1200, 1600, "Overloaded Little Junkers dumpster with debris piled above the rail", "Overloaded"),
  spilledPaint: job("spilled-paint", 1600, 1200, "Wet paint spilled across the floor of a dumpster"),

  marcusAndIvy: {
    src: "/images/team/marcus-and-ivy-truck.jpg",
    width: 1600,
    height: 1200,
    alt: "Marcus and Ivy, owners of Little Junkers, in the Little Junkers truck",
  },
  ivyTruck: {
    src: "/images/team/ivy-truck-new-bin.jpg",
    width: 1600,
    height: 900,
    alt: "Ivy standing beside the Little Junkers truck carrying a new pink dumpster",
  },
  marcusTruck: {
    src: "/images/team/marcus-truck-new-bin.jpg",
    width: 1600,
    height: 900,
    alt: "Marcus standing beside the Little Junkers truck carrying a new pink dumpster",
  },
  truckDoor: {
    src: "/images/team/truck-door-logo.jpg",
    width: 1600,
    height: 1200,
    alt: "Little Junkers truck door with the raccoon logo and phone number 470-548-4733",
  },
} satisfies Record<string, Photo>;

export const logo = {
  src: "/images/brand/little-junkers-logo.png",
  width: 1000,
  height: 1000,
  alt: "Little Junkers",
};
