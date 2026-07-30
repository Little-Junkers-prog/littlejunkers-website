import type { Metadata } from "next";
import ProductPageLayout from "@/components/ProductPageLayout";

export const metadata: Metadata = {
  title: "11-Yard Dumpster Rental | The Little Junker",
  description:
    "Rent The Little Junker, an 11-yard driveway-friendly dumpster with 1 ton included.",
};

export default function LittleJunkerPage() {
  return (
    <ProductPageLayout
      size={11}
      productName="The Little Junker"
      includedTons={1}
      featuredTierKey="2day_standard"
      imageAlt="Pink 11-yard Little Junkers roll-off dumpster on a residential driveway"
      bestFor={[
        "Garage and attic cleanouts",
        "Small bathroom or kitchen renovations",
        "Yard debris and household clutter",
      ]}
    />
  );
}
