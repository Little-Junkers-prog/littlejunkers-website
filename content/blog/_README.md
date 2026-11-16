# Blog posts

One Markdown file per post. The file name is the URL: `my-post.md` → `/blog/my-post`.
Files starting with `_` are ignored.

```yaml
---
title: "Post title"
date: 2026-11-16
author: "Marcus Griffin"
excerpt: "One or two sentences for the blog index."
category: real-jobs        # story | real-jobs | guides | events | neighborhoods
status: draft              # draft | published. Drafts never render.
index: true                # REQUIRED. true = INDEX, false = NOINDEX (STRATEGY-ARCHIVE §20.2)
featured: false            # true pins the post at the top of /blog
hero:
  src: /images/blog/my-post/hero.jpg
  alt: "What the photo shows"
legacyPath: /blog/our-blog-1/old-odoo-slug-12   # optional. Adds a 301 from the old Odoo URL.
seoTitle: ""               # optional
seoDescription: ""         # optional
---

Post body in Markdown.
```

Rules: real Little Junkers photos only. No invented customers, jobs, quotes or prices.
