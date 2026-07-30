import type { Metadata } from "next";
import ProductPageLayout from "@/components/ProductPageLayout";

export const metadata: Metadata = {
  title: "16-Yard Dumpster Rental | The Mighty Middler",
  description:
    "Rent The Mighty Middler, a 16-yard driveway-friendly dumpster with 1.5 tons included.",
};

export default function MightyMiddlerPage() {
  return (
    <ProductPageLayout
      size={16}
      productName="The Mighty Middler"
      includedTons={1.5}
      featuredTierKey="2day_standard"
      imageAlt="Pink 16-yard Little Junkers roll-off dumpster ready for a home renovation"
      bestFor={[
        "Flooring and roofing projects",
        "Medium home renovations",
        "Estate and multi-room cleanouts",
      ]}
    />
  );
}
