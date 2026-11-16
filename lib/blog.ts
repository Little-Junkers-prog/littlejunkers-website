import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Blog content layer. Posts are Markdown files in /content/blog with
// frontmatter. This is an INTERIM authoring method: STRATEGY-ARCHIVE §20.1
// leaves the final choice (CMS, Admin screen or Git) open. The record shape
// below matches the fields §20.1 requires, so posts can move to another store
// without changing the templates.
//
// Every post must state `index: true|false` explicitly (§20.2). Drafts are
// never rendered, listed or put in the sitemap.

export type PostCategory = "story" | "real-jobs" | "guides" | "events" | "neighborhoods";

export type Post = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  author: string;
  excerpt: string;
  category: PostCategory;
  index: boolean;
  featured: boolean;
  hero?: { src: string; alt: string };
  legacyPaths: string[];
  seoTitle?: string;
  seoDescription?: string;
  html: string;
};

const DIR = path.join(process.cwd(), "content", "blog");
const CATEGORIES: PostCategory[] = ["story", "real-jobs", "guides", "events", "neighborhoods"];

function load(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  const posts: Post[] = [];
  for (const file of fs.readdirSync(DIR)) {
    if (!file.endsWith(".md") || file.startsWith("_")) continue;
    const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
    if (data.status !== "published") continue;
    const slug = file.replace(/\.md$/, "");
    if (typeof data.index !== "boolean") {
      throw new Error(`content/blog/${file}: frontmatter "index" must be true or false (INDEX/NOINDEX is a required decision).`);
    }
    if (!data.title || !data.date || !CATEGORIES.includes(data.category)) {
      throw new Error(`content/blog/${file}: title, date and a valid category are required.`);
    }
    posts.push({
      slug,
      title: String(data.title),
      date: new Date(data.date).toISOString().slice(0, 10),
      updated: data.updated ? new Date(data.updated).toISOString().slice(0, 10) : undefined,
      author: String(data.author ?? "Little Junkers"),
      excerpt: String(data.excerpt ?? ""),
      category: data.category,
      index: data.index,
      featured: data.featured === true,
      hero: data.hero,
      legacyPaths: legacyPathsOf(data),
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      html: marked.parse(content, { async: false }) as string,
    });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

// `legacyPath` may be one old URL or a list (English post plus its old Spanish mirror).
export function legacyPathsOf(data: Record<string, unknown>): string[] {
  const raw = data.legacyPath;
  if (typeof raw === "string") return [raw];
  if (Array.isArray(raw)) return raw.filter((item): item is string => typeof item === "string");
  return [];
}

// Marker an author puts in a post body to show the live rate table there.
export const LIVE_PRICES_MARKER = "<!--live-prices-->";

let cache: Post[] | null = null;
export function getPosts(): Post[] {
  cache ??= load();
  return cache;
}

export const getPost = (slug: string) => getPosts().find((post) => post.slug === slug);

export function formatDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
