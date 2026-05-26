# Blog Section Design

## Overview

Add a blog section to the Orcha marketing and documentation site. Blog posts
support MDX with embedded interactive React components (client-side only).
The blog lives outside Starlight as standalone Astro pages, matching the
pattern established by the landing page (`src/pages/index.astro`).

## Goals

- `/blog` index page listing all published posts by date
- `/blog/[slug]` individual post pages rendered from MDX
- Interactive JS components (explanations, converters) embeddable in any post
- Simple to start, customizable as real content shapes the needs

## Architecture

### New Dependencies

- `@astrojs/mdx` — MDX support for `.mdx` content files
- `@astrojs/react` — React component islands with Astro hydration directives

### Content Collection

A new `blog` collection alongside the existing `docs` collection.

**Schema:**

| Field         | Type    | Required | Default | Purpose                                    |
|---------------|---------|----------|---------|--------------------------------------------|
| `title`       | string  | yes      | —       | Post title                                 |
| `description` | string  | yes      | —       | Summary for index page and SEO meta        |
| `date`        | date    | yes      | —       | Publication date, used for sorting         |
| `draft`       | boolean | no       | false   | When true, post is hidden from the index   |

Posts are `.mdx` files in `src/content/blog/`. The slug derives from the
filename (e.g., `monte-carlo-scheduling.mdx` → `/blog/monte-carlo-scheduling`).

Posts are sorted by `date` descending on the index page.

### File Structure

```
src/
├── content/
│   ├── blog/                          # Blog post MDX files
│   │   └── example-post.mdx
│   └── docs/                          # Existing docs (unchanged)
├── content.config.ts                  # Updated: adds blog collection schema
├── layouts/
│   └── BlogPost.astro                 # Shared layout for blog posts
├── pages/
│   ├── index.astro                    # Existing landing page (nav updated)
│   └── blog/
│       ├── index.astro                # Blog index — lists all posts
│       └── [slug].astro               # Individual post page
└── components/
    └── blog/                          # Interactive React components for posts
```

### How Interactive Components Work

A blog post imports a React component and uses an Astro hydration directive:

```mdx
---
title: "Understanding Monte Carlo Scheduling"
date: 2026-05-26
description: "How Orcha predicts delivery dates"
---

Here's how the simulation works...

import { SimulationDemo } from '../../components/blog/SimulationDemo';

<SimulationDemo client:visible />

As you can see, running more iterations converges...
```

- `client:visible` — JS loads when the component scrolls into view (recommended default)
- `client:load` — JS loads immediately on page load (use for above-the-fold interactivity)
- Components are standard React — no special wrappers needed

## Styling

### Blog Layout

The nav and footer markup currently live inline in `index.astro`. Since the
blog layout needs the same nav/footer, extract them into shared Astro
components (`src/components/Nav.astro`, `src/components/Footer.astro`) and
use them in both `index.astro` and `BlogPost.astro`. Same dark theme, same
brand CSS variables (`--brand`, `--dark`, etc.), same font stack.

### Prose Styling

Blog post content gets prose styles that mirror the Starlight `custom.css`
rules: heading sizes and weights, link colors and underlines, code block
treatment, image border-radius and shadows, list spacing, blockquote styling.
These are scoped to the blog layout as standalone rules.

### Blog Index

A simple vertical list: date, title, description per post. No cards, no grid —
clean and scannable with a handful of posts. Can evolve later.

### Interactive Components

Components style themselves. The blog layout provides no wrapper styling around
embedded components, keeping them portable and the layout simple.

## Navigation Changes

### Adding the Blog Link

The landing page nav gains a "Blog" link (Docs, Blog, GitHub, Try Orcha).
The blog layout uses the same nav. Starlight's header should also link to
the blog for discoverability from docs pages.

### Responsive Nav

The current nav links are already tight on mobile. With four links, they
won't fit on narrow viewports.

**Desktop (>768px):** All four links displayed inline as-is.

**Mobile (≤768px):** Links collapse into a hamburger menu. Tapping it reveals
a vertical list of all nav links. The "Try Orcha" CTA remains visually
distinct inside the menu.

Implementation: CSS + vanilla JS toggle in a `<script>` tag — no external
library. The hamburger is a simple three-line SVG/CSS icon.

## What's Explicitly Out of Scope

- Tags / categories
- Author metadata
- RSS feed
- Search within blog
- Pagination (not needed until there are many posts)
- Comments / reactions

All of these can be added later when real usage demands them.
