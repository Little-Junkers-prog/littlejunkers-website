// Guardrail for blog posts (docs/BLOG-PUBLISHING.md). Run with `npm run check:blog`.
// Checks every post in content/blog, drafts included, so a draft can't hide a problem
// until the day it's published.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DIR = "content/blog";
const CATEGORIES = ["story", "real-jobs", "guides", "events", "neighborhoods"];
const MAX_GRADE = 9; // Owner decision Nov 22, 2026: blog and guides may read at 8th–9th grade.

// Internal links must point at a route that exists.
const routes = new Set(["/", "/plan", "/pricing", "/compare", "/faq", "/about-us", "/blog",
  "/service-areas", "/long-term-rental", "/what-can-i-put-in-a-dumpster", "/privacy", "/terms",
  "/cookie-policy", "/texting-communications-policy"]);
for (const src of ["lib/sizes.ts", "lib/cities.ts"]) {
  const text = fs.readFileSync(src, "utf8");
  for (const m of text.matchAll(/"(\d{2}-yard-the-[a-z-]+)"/g)) routes.add("/" + m[1]);
}
for (const m of fs.readFileSync("lib/cities.ts", "utf8").matchAll(/slugFor\("([^"]+)"\)/g)) {
  routes.add(`/dumpster-rental-${m[1].toLowerCase().replace(/\s+/g, "-")}-little-junkers`);
}
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
for (const f of files) routes.add("/blog/" + f.replace(/\.md$/, ""));

function syllables(word) {
  let w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  return Math.max(1, (w.match(/[aeiouy]{1,2}/g) ?? []).length);
}
function grade(markdown) {
  // Score prose sentences only: drop links' URLs, headings, quotes markers and short list labels.
  const text = markdown
    .replace(/\]\([^)]*\)/g, "]")
    .split("\n")
    .filter((line) => !/^\s*(#|<!--|\|)/.test(line))
    .map((line) => line.replace(/^\s*([-*>]|\d+\.)\s*/, "").replace(/[*_[\]]/g, ""))
    .filter((line) => line.split(/\s+/).length >= 6)
    .join(" ");
  const sentences = text.split(/[.!?:]+\s/).filter((s) => s.trim()).length || 1;
  const words = text.match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
  if (words.length === 0) return 0;
  const syl = words.reduce((sum, w) => sum + syllables(w), 0);
  return 0.39 * (words.length / sentences) + 11.8 * (syl / words.length) - 15.59;
}

const problems = [];
const legacy = new Map();
for (const file of files) {
  const slug = file.replace(/\.md$/, "");
  const where = `content/blog/${file}`;
  const fail = (msg) => problems.push(`${where}: ${msg}`);
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail("file name must be lowercase-words-with-dashes (it becomes the URL)");
  for (const key of ["title", "date", "author", "excerpt"]) if (!data[key]) fail(`frontmatter "${key}" is required`);
  if (!CATEGORIES.includes(data.category)) fail(`category must be one of ${CATEGORIES.join(", ")}`);
  if (!["draft", "published"].includes(data.status)) fail('status must be "draft" or "published"');
  if (typeof data.index !== "boolean") fail("index must be true or false: every post needs an explicit INDEX/NOINDEX decision (STRATEGY-ARCHIVE §20.2)");
  if (data.excerpt && String(data.excerpt).length > 200) fail("excerpt should be under 200 characters");
  if (data.seoDescription && String(data.seoDescription).length > 160) fail("seoDescription should be 160 characters or less");
  if (!data.hero?.src || !data.hero?.alt) fail("hero.src and hero.alt are required (real Little Junkers photo with a plain description)");
  else if (!fs.existsSync(path.join("public", data.hero.src))) fail(`hero image not found: public${data.hero.src}`);
  for (const p of [].concat(data.legacyPath ?? [])) {
    if (legacy.has(p)) fail(`legacyPath ${p} is also used by ${legacy.get(p)}`);
    legacy.set(p, file);
  }

  const body = content;
  if (/\$\s?\d/.test(body)) fail("no typed dollar amounts; put <!--live-prices--> on its own line for live rates");
  if (/book\.littlejunkersllc\.com/.test(body)) fail("booking links must stay in the site; link to /plan (ADR-CX-004)");
  if (/—/.test(body) || /—/.test(String(data.title ?? ""))) fail("no em dashes; rewrite the sentence");
  if (/draft note|placeholder|lorem ipsum|TODO|TBD|as an ai/i.test(body)) fail("leftover draft or placeholder text");
  if (/ultimate guide|stress-free|hassle-free|seamless|game[- ]changer|look no further|elevate your|unlock the/i.test(body + " " + data.title))
    fail("stock AI/marketing phrase; say it plainly");
  for (const m of body.matchAll(/\]\((\/[^)#?\s]*)/g)) {
    const target = m[1].replace(/\/$/, "") || "/";
    if (!routes.has(target)) fail(`internal link goes nowhere: ${m[1]}`);
  }
  for (const m of body.matchAll(/!\[[^\]]*\]\((\/images\/[^)\s]+)\)/g)) {
    if (!fs.existsSync(path.join("public", m[1]))) fail(`image not found: public${m[1]}`);
  }
  if (!/\]\(\/(plan|pricing|#sizes|\d{2}-yard-|dumpster-rental-|service-areas|compare)/.test(body))
    fail("add at least one link to a size, city, pricing or booking page");
  if (data.status === "published") {
    const g = grade(body);
    if (g > MAX_GRADE) fail(`reads at about grade ${g.toFixed(1)}; the blog limit is ${MAX_GRADE}. Use shorter sentences and plainer words`);
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} blog problem(s).`);
  process.exit(1);
}
console.log(`Blog check passed (${files.length} posts).`);
