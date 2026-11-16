import { company } from "./company";
import { formatTons, formatUsd, startingTier, type Pricing, SIZE_YARDS } from "./pricing";

// FAQ content grouped by customer task (TIER-1 spec §18). Answers that state a
// price, fee, rental length or included weight are built from the canonical
// pricing contract. With no pricing they fall back to a pointer, never a number.
// The per-ton overage rate is deliberately not shown on marketing pages (charter §6).

export type Faq = { id: string; q: string; a: string; link?: { href: string; label: string }; top?: boolean };
export type FaqGroup = { id: string; title: string; items: Faq[] };

function list(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function buildFaqs(pricing: Pricing | null): FaqGroup[] {
  const tier = pricing ? startingTier(pricing) : null;

  const cost =
    pricing && tier
      ? `It depends on the size and how long you keep it. Right now a ${tier.days}-day rental is ${list(
          SIZE_YARDS.map((y) => `${formatUsd(tier.prices[y])} for the ${y}-yard`),
        )}.${tier.extraDay ? ` Extra days are ${formatUsd(tier.extraDay)} each.` : ""} Your exact price shows before you pay.`
      : "It depends on the size, how long you keep it and where you are. Enter your ZIP to see today's price before you book.";

  const included = pricing
    ? `Drop-off, pickup, and disposal up to the included weight: ${list(
        SIZE_YARDS.map((y) => `${formatTons(pricing.sizes[y].includedTons)} with the ${y}-yard`),
      )}. The starting price covers ${pricing.tiers[0].days} days. Outside our core area a delivery fee is added.`
    : "Drop-off, pickup, and disposal up to the included weight for your size. The booking page lists the included weight and rental lengths.";

  const zones = pricing ? Object.values(pricing.zones).sort((a, b) => a.deliveryFee - b.deliveryFee) : [];
  const paidFees = zones.filter((z) => z.deliveryFee > 0).map((z) => formatUsd(z.deliveryFee));
  const deliveryFee =
    pricing && zones.length > 0
      ? `It depends on your ZIP. ${zones[0].deliveryFee === 0 ? "Delivery is free in our core area." : ""}${
          paidFees.length ? ` Farther out, there's a delivery fee of ${list(paidFees)}, added to the rental price.` : ""
        } Enter your ZIP and we'll show yours.`
      : "It depends on your ZIP. Enter your ZIP and we'll show the delivery fee, if there is one, before you book.";

  return [
    {
      id: "pricing",
      title: "Pricing",
      items: [
        { id: "cost", q: "How much does it cost to rent a dumpster?", a: cost, top: true },
        { id: "included", q: "What's included in the price?", a: included },
        { id: "delivery-fee", q: "Is there a delivery fee?", a: deliveryFee, link: { href: "/service-areas", label: "Check your ZIP" } },
        {
          id: "overweight",
          q: "What happens if my load is over the included weight?",
          a: `Your load is weighed at the disposal site. If it's over the weight included with your dumpster, the extra weight is billed from that scale ticket${
            pricing?.overagePerTon ? ` at ${formatUsd(pricing.overagePerTon)} per ton` : ". The rate is shown at checkout before you pay"
          }.`,
        },
        {
          id: "extra-days",
          q: "Can I keep the dumpster longer?",
          a: `Yes. Extra days are ${tier?.extraDay ? `${formatUsd(tier.extraDay)} each` : "billed by the day"}. Text us before your pickup date so we can move it on the schedule.`,
        },
      ],
    },
    {
      id: "sizes",
      title: "Sizes",
      items: [
        {
          id: "which-size",
          q: "What size dumpster do I need?",
          a: "For a garage or one-room job, the 11-yard. For a remodel or a bigger cleanout, the 16-yard. For a whole house, the 21-yard. If you're stuck between two, text us what you're tossing.",
          top: true,
        },
        {
          id: "smallest",
          q: "What's the smallest dumpster you rent?",
          a: "The 11-yard. It holds about 4 to 5 pickup-truck loads.",
          link: { href: "/11-yard-the-little-junker", label: "See the 11-yard" },
        },
        {
          id: "roofing-size",
          q: "Which size is best for roofing?",
          a: "The 11-yard or the 16-yard. Shingles are heavy, so a bigger dumpster doesn't help. Tell us the number of squares and layers and we'll help you choose.",
        },
      ],
    },
    {
      id: "delivery",
      title: "Delivery and pickup",
      items: [
        {
          id: "how-soon",
          q: "How soon can I get a dumpster?",
          a: "The booking calendar shows the delivery days that are open right now. Pick the one that works for you.",
        },
        {
          id: "be-home",
          q: "Do I need to be home for delivery?",
          a: "No, as long as the spot is clear and you've told us where you want it.",
        },
        {
          id: "pickup",
          q: "How does pickup work?",
          a: "We pick up on the last day of your rental, and we text you the day before as a reminder. Have the dumpster loaded level and the area around it clear.",
        },
        {
          id: "early-pickup",
          q: "Can you pick it up early if I finish sooner?",
          a: "Yes. Text us when you're done and we'll schedule the pickup. One thing to know before you ask: the rental ends when we pick up, so days you didn't use can't be saved for a later rental.",
        },
        {
          id: "hours",
          q: "What are your hours?",
          a: `You can book online any time. We answer calls and texts ${company.hoursDisplay}.`,
        },
      ],
    },
    {
      id: "loading",
      title: "Loading and weight",
      items: [
        {
          id: "how-full",
          q: "How full can I load it?",
          a: "Level with the top. We can't haul a dumpster with debris sticking up over the sides.",
        },
        {
          id: "heavy",
          q: "Why does weight matter if everything fits?",
          a: "Size is how much room you get. Weight is what the disposal site charges for. Shingles, tile and plaster can hit the included weight while the dumpster still looks half empty.",
        },
      ],
    },
    {
      id: "materials",
      title: "What can go in",
      items: [
        {
          id: "not-accepted",
          q: "What can't go in the dumpster?",
          a: "Dirt, concrete, compressed cylinders like helium tanks and fire extinguishers, hazardous chemicals, and wet or leaking paint.",
          link: { href: "/what-can-i-put-in-a-dumpster", label: "See the full list" },
          top: true,
        },
        { id: "furniture", q: "Can I put furniture in the dumpster?", a: "Yes. Couches, tables, dressers and other household furniture are fine." },
        {
          id: "shingles",
          q: "Can I put roofing shingles in the dumpster?",
          a: "Yes. They're heavy, so check the weight before you book a roofing job.",
        },
        {
          id: "batteries-oil-paint",
          q: "What should I do with batteries, oil or paint?",
          a: "Keep batteries and motor oil out of the dumpster. Set them outside at the front and tell us, and we'll coordinate recycling. Oil is limited to 10 quarts in sealed containers. Paint is fine if it's dried out or tightly sealed.",
          link: { href: "/what-can-i-put-in-a-dumpster", label: "How to set them out" },
        },
      ],
    },
    {
      id: "property",
      title: "Driveway and property",
      items: [
        {
          id: "driveway",
          q: "Will the dumpster damage my driveway?",
          a: "We deliver with a hook-lift truck instead of a full-size roll-off truck, and we look at access, overhead clearance and the surface before we set the dumpster down. If something about your driveway worries you, tell us before delivery.",
        },
        {
          id: "permit",
          q: "Do I need a permit?",
          a: "A driveway on your own property is the simplest spot. If the dumpster will sit in the street or public right-of-way, check with your city first. Your HOA may have rules too.",
        },
      ],
    },
    {
      id: "area",
      title: "Service area",
      items: [
        {
          id: "where",
          q: "Do you deliver to my area?",
          a: "We're based in Peachtree City and deliver across Fayette and Coweta County and nearby South Atlanta communities. Enter your ZIP to check.",
          link: { href: "/service-areas", label: "Check your ZIP" },
          top: true,
        },
        {
          id: "not-listed",
          q: "What if my city isn't listed?",
          a: `We may still deliver there. Enter your ZIP, or call or text ${company.phoneDisplay}.`,
        },
      ],
    },
    {
      id: "booking",
      title: "Booking and payment",
      items: [
        {
          id: "how-book",
          q: "How do I book?",
          a: "Online, any time. Pick your size, your dates and where it goes, then pay. It takes a few minutes.",
          top: true,
        },
        {
          id: "phone",
          q: "Can I book by phone or text?",
          a: `Yes. Call or text ${company.phoneDisplay}, ${company.hoursDisplay}.`,
        },
        { id: "spanish", q: "¿Hablan español?", a: "Sí. Puede llamarnos o enviarnos un mensaje de texto en español." },
        {
          id: "junk-removal",
          q: "Do you haul away single items?",
          a: `We're a dumpster rental company, not a junk-removal crew. If you only have a few bulky items, text a photo of your pile to ${company.phoneDisplay} and we'll tell you if we can quote a pickup.`,
        },
      ],
    },
  ];
}
