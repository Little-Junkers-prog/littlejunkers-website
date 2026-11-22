// Prepare job photos for a blog post (docs/BLOG-PUBLISHING.md).
// Usage: npm run blog:photos -- <post-slug> <photo> [photo...]
//
// Each photo is turned upright, resized to at most 1600 px wide, saved as a JPEG
// in public/images/blog/<post-slug>/ and stripped of all metadata. Stripping matters:
// phone photos carry GPS coordinates that would publish a customer's home location.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [slug, ...inputs] = process.argv.slice(2);
if (!slug || inputs.length === 0 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error("Usage: npm run blog:photos -- <post-slug> <photo> [photo...]");
  process.exit(1);
}

const outDir = path.join("public", "images", "blog", slug);
fs.mkdirSync(outDir, { recursive: true });

for (const [i, input] of inputs.entries()) {
  const base = path.basename(input, path.extname(input)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const name = `${String(i + 1).padStart(2, "0")}-${base || "photo"}.jpg`;
  const out = path.join(outDir, name);
  // sharp drops EXIF/GPS unless .withMetadata() is called, so nothing location-related is kept.
  const info = await sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(out);
  console.log(`/images/blog/${slug}/${name}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
