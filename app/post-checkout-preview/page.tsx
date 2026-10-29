import type { Metadata } from "next";
import ConfirmationExperience from "@/components/post-checkout/ConfirmationExperience";

export const metadata: Metadata = {
  title: "Booking Confirmation Concept | Little Junkers",
  description: "Internal design concept for the Little Junkers post-checkout experience.",
  robots: { index: false, follow: false },
};

// Static sample only: do not connect payment success or booking creation to this URL.
export default function ConfirmationPreviewPage() {
  return (
    <ConfirmationExperience
      isDesignPreview
      booking={{
        dumpster: "16-Yard Mighty Middler",
        rentalLength: "4 days",
        deliveryDate: "Example: Nov 4",
        pickupDate: "Example: Nov 8",
      }}
    />
  );
}
