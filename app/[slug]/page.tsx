import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cities, cityBySlug } from "@/lib/cities";
import { sizeBySlug, sizes } from "@/lib/sizes";
import CityPage from "./CityPage";
import SizePage from "./SizePage";

// Size and city pages keep their established root-level URLs
// (/16-yard-the-mighty-middler, /dumpster-rental-newnan-little-junkers).
// Only the slugs listed here exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...sizes, ...cities].map((entry) => ({ slug: entry.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const size = sizeBySlug(slug);
  if (size) {
    return { title: { absolute: `${size.metaTitle} | Little Junkers` }, description: size.metaDescription, alternates: { canonical: `/${slug}` } };
  }
  const city = cityBySlug(slug);
  if (city) {
    return {
      title: `Dumpster Rental in ${city.city}, GA`,
      description: city.metaDescription,
      alternates: { canonical: `/${slug}` },
    };
  }
  return {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const size = sizeBySlug(slug);
  if (size) return <SizePage size={size} />;
  const city = cityBySlug(slug);
  if (city) return <CityPage city={city} />;
  notFound();
}
