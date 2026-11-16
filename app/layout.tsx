import type { Metadata, Viewport } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import MobileBar from "@/components/MobileBar";
import ConsentBanner from "@/components/ConsentBanner";
import RandyChat from "@/components/RandyChat";
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

// Google Tag Manager loads only where NEXT_PUBLIC_GTM_ID is set (production at
// cutover), so previews never send traffic into the live analytics property.
const gtmId = /^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID ?? "") ? process.env.NEXT_PUBLIC_GTM_ID : null;

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
      <head>
        {/* Consent Mode defaults: nothing optional is stored until the visitor agrees. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});",
          }}
        />
        {gtmId ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        ) : null}
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {!indexable ? <p className="draft-banner">Draft preview. Not the live site.</p> : null}
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <RandyChat />
        <MobileBar />
        <ConsentBanner />
        <JsonLd data={localBusiness} />
      </body>
    </html>
  );
}
