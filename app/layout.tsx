import type { Metadata, Viewport } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import MobileBar from "@/components/MobileBar";
import { company, siteUrl } from "@/lib/company";
import { indexable } from "@/lib/indexing";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Little Junkers | Dumpster Rental in Peachtree City, Newnan & Fayetteville, GA",
    template: "%s | Little Junkers",
  },
  description:
    "Locally owned dumpster rental in Fayette and Coweta County, Georgia. 11, 16 and 21-yard pink dumpsters. See prices for your ZIP and book online.",
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { siteName: "Little Junkers", type: "website", locale: "en_US" },
};

export const viewport: Viewport = {
  themeColor: "#1e1c19",
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#business`,
  name: company.name,
  legalName: company.legalName,
  description: "Locally owned roll-off dumpster rental company.",
  url: siteUrl,
  telephone: company.phoneE164,
  email: company.email,
  foundingDate: String(company.founded),
  // Service-area business. The mailing address is not published as a storefront.
  address: {
    "@type": "PostalAddress",
    addressLocality: company.locality,
    addressRegion: company.region,
    postalCode: company.postalCode,
    addressCountry: "US",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "08:00",
    closes: "18:00",
  },
  sameAs: company.social.map((profile) => profile.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {!indexable ? <p className="draft-banner">Draft preview. Not the live site.</p> : null}
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
        <JsonLd data={localBusiness} />
      </body>
    </html>
  );
}
