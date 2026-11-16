import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { legalLinks } from "./legal-links";

export { legalLinks };

// Legal pages are rendered from /content/legal. The wording is owner-approved
// legal copy and is never edited in code.

export type LegalDoc = { slug: string; title: string; index: boolean; html: string };

const DIR = path.join(process.cwd(), "content", "legal");


export function getLegalDoc(slug: string): LegalDoc | undefined {
  if (!legalLinks.some((link) => link.slug === slug)) return undefined;
  const { data, content } = matter(fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8"));
  return { slug, title: String(data.title), index: data.index === true, html: marked.parse(content, { async: false }) as string };
}
