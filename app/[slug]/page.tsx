import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cities, cityBySlug } from "@/lib/cities";
import { getLegalDoc, legalLinks } from "@/lib/legal";
import { indexable } from "@/lib/indexing";
import { sizeBySlug, sizes } from "@/lib/sizes";
import CityPage from "./CityPage";
import LegalPage from "./LegalPage";
import SizePage from "./SizePage";

// Size and city pages keep their established root-level URLs
// (/16-yard-the-mighty-middler, /dumpster-rental-newnan-little-junkers).
// Only the slugs listed here exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...sizes, ...cities, ...legalLinks].map((entry) => ({ slug: entry.slug }));
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
  const legal = getLegalDoc(slug);
  if (legal) {
    return {
      title: legal.title,
      alternates: { canonical: `/${slug}` },
      robots: indexable && legal.index ? { index: true, follow: true } : { index: false, follow: true },
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
  const legal = getLegalDoc(slug);
  if (legal) return <LegalPage doc={legal} />;
  notFound();
}
