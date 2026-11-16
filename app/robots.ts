import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/company";
import { indexable } from "@/lib/indexing";

export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
