// Pure, browser-safe copy helper. This only drafts a message; it never sends
// texts, writes to storage, or creates an inquiry.
export const COMPARISON_EXIT_REASONS = [
  ["price", "Price"],
  ["weight", "Included weight or disposal fees"],
  ["duration", "Rental length"],
  ["size", "Dumpster size"],
  ["availability", "Availability or service area"],
  ["unsure", "I'm still figuring it out"],
] as const;

export type ExitReason = (typeof COMPARISON_EXIT_REASONS)[number][0] | "";

export function createComparisonText(
  providerName: string,
  firstName: string,
  reason: ExitReason,
  context: { size: 11 | 16 | 21; days: number; location: string }
): string {
  const reasonLabel = COMPARISON_EXIT_REASONS.find(([id]) => id === reason)?.[1]
    ?? "the differences between offers";
  const name = firstName.trim().replace(/[^a-zA-Z '-]/g, "").slice(0, 40);
  // Location must be a validated city or ZIP supplied by the caller; do not
  // put arbitrary street addresses or contact information into the draft.
  const location = context.location.trim().slice(0, 60);
  const parts = [
    "Hi Little Junkers!",
    name ? "I'm " + name + "." : "",
    "I'm comparing " + providerName + " while looking for a " + context.size +
      "-yard dumpster for " + context.days + " days" + (location ? " around " + location : "") + ".",
    "Could you help me compare " + reasonLabel.toLowerCase() + "?"
  ];
  return parts.filter(Boolean).join(" ");
}
