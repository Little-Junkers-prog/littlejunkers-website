# Publishing a Blog Post

**Status:** Interim process, set November 22, 2026. STRATEGY-ARCHIVE §20.1 leaves the long-term authoring tool open; the target is still the phone-to-draft field publishing flow in the admin app (§20.4). Until that exists, posts are Markdown files in this repo, drafted by Claude from Marcus's notes and photos, reviewed on a Vercel preview and published by merging a PR.

## The short version

1. **Marcus sends the raw material** from his phone in a Claude chat: photos plus a few lines about the job or topic.
2. **Claude drafts the post** on its own branch, preps the photos and opens a draft PR.
3. **Marcus reviews it on the preview link** from his phone and asks for changes.
4. **Marcus says "merge"** and the post goes live. Claude also hands over the Facebook/Google Business Profile caption.

One post per PR. Nothing goes live without Marcus's OK.

## 1. What Marcus sends

For a **real job** post (the best kind, per §20):

- 3 or 4 photos from the job site.
- City or area, the dumpster size (or the unit's name), and what the job was (garage cleanout, roof tear-off, estate, etc.).
- What happened or what's worth knowing: a lesson, a surprise, a tip, a number you actually know (how many days, how full it got).
- Permission: is the customer OK with it? Anything to hide (house numbers, plates, faces, the street)?

For a **guide or how-to**: the question customers keep asking and your answer in your own words. A voice memo transcript or a few bullet points is plenty.

For an **event**: date, place, who it's with (only partners who've agreed to be named), and photos after.

## 2. What Claude does

- **Writes only what Marcus gave.** No invented customers, quotes, job details, weights, dates, partners or prices. If a fact is missing, Claude asks instead of guessing.
- **Voice:** Marcus talking to a neighbor. Short sentences, contractions, plain words, no AI filler. Blog posts read at about an 8th–9th grade level.
- **Prices:** never typed in. Use `<!--live-prices-->` on its own line to show the live rate table.
- **Links:** at least one link to a size, city, pricing or booking page. Booking links go to `/plan`, never the booking app (ADR-CX-004).
- **Photos:** `npm run blog:photos -- <post-slug> <photo files>` resizes them and strips all phone metadata, including GPS location, into `public/images/blog/<post-slug>/`. Every photo gets plain alt text describing what's in it.
- **INDEX or NOINDEX:** Claude recommends one with a one-line reason (§20.2). Real jobs, lessons and guides with lasting value get INDEX. Short promos, one-time announcements and thin updates get NOINDEX.
- **Distribution copy:** a short Facebook/Google Business Profile caption in the same voice, with the post link as the call to action (§20.3).
- **Branch and PR:** branch `blog/<post-slug>`, a draft PR titled `Blog: <title>`, with the preview link, the INDEX/NOINDEX call and the caption in the description.

## 3. Marcus reviews

Open the Vercel preview link in the PR on your phone and read it the way a customer would. Check:

- Every fact is right.
- Nothing shows that the customer wouldn't want shown.
- It sounds like you.
- The photos look good and the first one works as the cover.

Reply with changes in the chat or as PR comments. Claude updates the same PR.

## 4. Publish

When Marcus says merge, Claude marks the PR ready and squash-merges it. The post appears on `/blog`, in the sitemap if it's INDEX, and redirects from any old Odoo URL listed in `legacyPath`. Before cutover that's the preview site; after cutover it's www.littlejunkersllc.com.

Then post the caption on Facebook and Google Business Profile with the article link.

## The file

Copy `content/blog/_TEMPLATE.md` to `content/blog/<post-slug>.md`. The file name is the URL (`/blog/<post-slug>`): lowercase words with dashes, short and descriptive.

| Field | Notes |
| --- | --- |
| `title` | What a customer would search for or click on. No "ultimate guide". |
| `date` | Publish date, `YYYY-MM-DD`. |
| `updated` | Optional. Set when you make a real change to an older post. |
| `author` | `Marcus`, `Ivy` or `Little Junkers`. |
| `excerpt` | One or two sentences for the blog list. Under 200 characters. |
| `category` | `real-jobs`, `guides`, `events`, `neighborhoods` or `story`. |
| `status` | `draft` hides it everywhere. `published` shows it once merged. |
| `index` | `true` or `false`. Required. Never left to a default. |
| `featured` | `true` pins it to the top of `/blog`. |
| `hero` | `src` and `alt`. Must be a real Little Junkers photo. |
| `legacyPath` | Only for posts moved from Odoo. |
| `seoTitle`, `seoDescription` | Optional. Description 160 characters or less. |

## Checks

`npm run check:blog` runs on every PR and fails if a post:

- is missing a required field or the INDEX/NOINDEX decision;
- points to a photo or internal page that doesn't exist;
- has a typed dollar amount, a booking-app link, an em dash, placeholder text or stock AI phrases ("ultimate guide", "stress-free", "seamless" and the like);
- has no link to a size, city, pricing or booking page;
- reads above about a 9th grade level (published posts).

## Measuring

Judge posts by what they do, not how many there are (§20.5): Search Console impressions and clicks, clicks through to size/pricing/booking pages, booking starts and paid rentals.
