import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { cities } from "@/lib/cities";
import { siteUrl } from "@/lib/company";
import { sizes } from "@/lib/sizes";

// INDEX routes only. Drafts and NOINDEX posts are excluded (TIER-1 spec §1.2).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/service-areas", "/what-can-i-put-in-a-dumpster", "/faq", "/about-us", "/blog"];
  const paths = [
    ...pages,
    ...sizes.map((size) => `/${size.slug}`),
    ...cities.map((city) => `/${city.slug}`),
    ...getPosts()
      .filter((post) => post.index)
      .map((post) => `/blog/${post.slug}`),
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
