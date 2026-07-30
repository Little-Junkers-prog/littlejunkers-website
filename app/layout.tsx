import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Little Junkers | Dumpster Rental in Peachtree City, GA",
  description:
    "Locally owned roll-off dumpster rental company based in Peachtree City, GA serving residential homeowners and contractors with driveway-safe delivery.",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Little Junkers LLC",
  description: "Locally owned roll-off dumpster rental company",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Peachtree City",
    addressRegion: "GA",
    postalCode: "30269",
    addressCountry: "US",
  },
  url: "https://littlejunkersllc.com",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script src="https://cdn.chatbot.com/widget/placeholder.js" async />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <GoogleTagManager gtmId="GTM-KQRXVZ4F" />
      </body>
    </html>
  );
}
