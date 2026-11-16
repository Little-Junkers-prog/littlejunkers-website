import Link from "next/link";
import { siteUrl } from "@/lib/company";
import JsonLd from "./JsonLd";

type Crumb = { label: string; href: string };

export default function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const all = [{ label: "Home", href: "/" }, ...trail];
  return (
    <nav className="breadcrumbs container" aria-label="Breadcrumb">
      <ol>
        {all.map((crumb, index) => (
          <li key={crumb.href}>
            {index === all.length - 1 ? <span aria-current="page">{crumb.label}</span> : <Link href={crumb.href}>{crumb.label}</Link>}
          </li>
        ))}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            item: `${siteUrl}${crumb.href === "/" ? "" : crumb.href}`,
          })),
        }}
      />
    </nav>
  );
}
