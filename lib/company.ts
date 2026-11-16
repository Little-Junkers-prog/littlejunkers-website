// Single source for public company facts used across pages, schema and the footer.
// Interim: STRATEGY-ARCHIVE parks a Supabase "global company data" table. Until it
// exists, every page reads these values from here instead of hardcoding its own copy.

export const company = {
  name: "Little Junkers",
  legalName: "Little Junkers LLC",
  owners: "Marcus and Ivy Griffin",
  founded: 2024,
  phoneDisplay: "(470) 548-4733",
  phoneE164: "+14705484733",
  // Text line. Owner direction (Nov 16): text buttons go to the Twilio number so
  // messages are logged and can get automated replies; the number above stays the
  // call number and the only number printed on the page. Set NEXT_PUBLIC_TEXT_NUMBER
  // (E.164) once the Twilio number is confirmed. Until then texts go to the main line.
  textE164: process.env.NEXT_PUBLIC_TEXT_NUMBER ?? "+14705484733",
  email: "info@littlejunkersllc.com",
  // Mailing address only (charter §7.6). Never present it as a storefront.
  locality: "Peachtree City",
  region: "GA",
  postalCode: "30269",
  // D-002: 8 AM–6 PM, seven days. Online booking is open any time.
  hoursDisplay: "8 AM–6 PM, every day",
  googleReviewsUrl: "https://g.page/r/CWD9hcXTJqniEBM",
  // Profiles confirmed on the live site. LinkedIn, Bluesky and Alignable are approved
  // (STRATEGY-ARCHIVE §2.15) but their URLs still need to be supplied.
  social: [
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61556700863067" },
    { label: "Instagram", href: "https://www.instagram.com/littlejunkers/" },
    { label: "YouTube", href: "https://www.youtube.com/@LittleJunkers" },
    { label: "Nextdoor", href: "https://nextdoor.com/page/little-junkers-peachtree-city-ga/" },
  ],
} as const;

export const siteUrl = "https://www.littlejunkersllc.com";

// The booking app stays the transaction authority (D-007). Until the rebuilt
// flow ships, CTAs hand off to the live funnel with the context it already reads.
export const bookingOrigin = "https://book.littlejunkersllc.com";

export function bookingUrl(context: { size?: 11 | 16 | 21; zip?: string } = {}): string {
  const params = new URLSearchParams();
  if (context.size) params.set("size", String(context.size));
  if (context.zip && /^\d{5}$/.test(context.zip)) params.set("zip", context.zip);
  const query = params.toString();
  return `${bookingOrigin}/rent-a-dumpster${query ? `?${query}` : ""}`;
}

export const telHref = `tel:${company.phoneE164}`;
export const smsHref = `sms:${company.textE164}`;
