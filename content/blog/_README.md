# Blog posts

One Markdown file per post. The file name is the URL: `my-post.md` → `/blog/my-post`.
Files starting with `_` are ignored.

**How to write and publish a post:** see [docs/BLOG-PUBLISHING.md](../../docs/BLOG-PUBLISHING.md).
Start from [`_TEMPLATE.md`](_TEMPLATE.md).

Quick rules:

- Real Little Junkers photos only. No invented customers, jobs, quotes or prices.
- Never type a dollar amount. Put `<!--live-prices-->` on its own line where the rate table
  should appear; it renders from canonical pricing and refreshes every 10 minutes.
- Booking links go to `/plan`, never the booking app (ADR-CX-004).
- Every post states `index: true` or `index: false`. Drafts never render, list or reach the sitemap.
- `legacyPath` (one path or a list) adds 301s from an old Odoo URL and its Spanish mirror
  (`/es/blog/viaje-1/<same slug>`). Old Odoo posts that were not migrated are redirected in
  `next.config.ts` (`retiredPosts`).
- `npm run check:blog` must pass.
