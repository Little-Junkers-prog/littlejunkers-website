// Single source for public company facts used across pages, schema and the footer.
// Interim: STRATEGY-ARCHIVE parks a Supabase "global company data" table. Until it
// exists, every page reads these values from here instead of hardcoding its own copy.

export const company = {
  name: "Little Junkers",
  legalName: "Little Junkers LLC",
  owners: "Marcus and Ivy",
  founded: 2024,
  phoneDisplay: "(470) 548-4733",
  phoneE164: "+14705484733",
  // Text line (owner direction, Nov 16): Text buttons open the Twilio number, which
  // is A2P 10DLC registered, logs messages and can auto-reply. The number above
  // stays the call number and the only number printed on the page.
  textE164: "+14707125079",
  email: "customer_service@littlejunkersllc.com",
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

// Origin of the booking app's server APIs (pricing, Randy). Customers never get sent
// there: every booking CTA stays inside this site (ADR-CX-004). The booking app's
// funnel pages retire once in-site checkout is live.
export const bookingOrigin = "https://book.littlejunkersllc.com";

export const telHref = `tel:${company.phoneE164}`;
export const smsHref = `sms:${company.textE164}`;
