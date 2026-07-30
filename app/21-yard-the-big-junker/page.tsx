import type { Metadata } from "next";
import ProductPageLayout from "@/components/ProductPageLayout";

export const metadata: Metadata = {
  title: "21-Yard Dumpster Rental | The Big Junker",
  description:
    "Rent The Big Junker, a 21-yard roll-off dumpster with 2 tons included for larger cleanups.",
};

export default function BigJunkerPage() {
  return (
    <ProductPageLayout
      size={21}
      productName="The Big Junker"
      includedTons={2}
      featuredTierKey="2day_standard"
      imageAlt="Pink 21-yard Little Junkers roll-off dumpster for a large cleanup project"
      bestFor={[
        "Large home and estate cleanouts",
        "Contractor renovation debris",
        "Bulky household and construction material",
      ]}
    />
  );
}
