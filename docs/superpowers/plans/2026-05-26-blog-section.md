# Blog Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/blog` section with MDX support and React component islands for interactive posts.

**Architecture:** A `blog` content collection alongside the existing Starlight `docs` collection, with standalone Astro pages for the index and post routes. Nav and footer extracted from the landing page into shared components, with a responsive hamburger menu for mobile.

**Tech Stack:** Astro 6, @astrojs/mdx, @astrojs/react, Zod (bundled with Astro)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `package.json` | Modify | Add mdx + react dependencies |
| `astro.config.mjs` | Modify | Register mdx and react integrations |
| `tsconfig.json` | Modify | Add React JSX config |
| `src/content.config.ts` | Modify | Add blog collection with schema |
| `src/components/Nav.astro` | Create | Shared nav with responsive hamburger |
| `src/components/Footer.astro` | Create | Shared footer |
| `src/pages/index.astro` | Modify | Use Nav/Footer components, remove inline markup |
| `src/styles/blog.css` | Create | Blog prose and layout styles |
| `src/layouts/BlogPost.astro` | Create | Blog post page shell (head, nav, prose, footer) |
| `src/pages/blog/index.astro` | Create | Blog index listing all posts |
| `src/pages/blog/[slug].astro` | Create | Dynamic route rendering individual posts |
| `src/content/blog/hello-world.mdx` | Create | Seed post to verify the pipeline works |

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Modify: `tsconfig.json`

- [ ] **Step 1: Install MDX and React integrations**

```bash
cd /Users/sms/Code/orcha-website && npx astro add mdx react --yes
```

This installs `@astrojs/mdx`, `@astrojs/react`, `react`, `react-dom`, and their type definitions. It also auto-updates `astro.config.mjs` to register the integrations.

- [ ] **Step 2: Verify astro.config.mjs was updated**

Open `astro.config.mjs` and confirm the imports and integrations array include `mdx()` and `react()`. The file should look like:

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
	site: 'https://orcha.run',
	integrations: [
		starlight({
			// ... existing starlight config unchanged ...
		}),
		mdx(),
		react(),
	],
});
```

If `astro add` placed them inside `starlight()`, move them to the top-level `integrations` array as siblings of `starlight()`.

- [ ] **Step 3: Update tsconfig.json for React JSX**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

- [ ] **Step 4: Verify the dev server starts**

```bash
cd /Users/sms/Code/orcha-website && npm run dev
```

Expected: Dev server starts without errors. The landing page and docs still work.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json
git commit -m "add MDX and React integrations for blog support"
```

---

### Task 2: Add Blog Content Collection

**Files:**
- Modify: `src/content.config.ts`

- [ ] **Step 1: Add blog collection with schema**

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		draft: z.boolean().default(false),
	}),
});

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	blog,
};
```

- [ ] **Step 2: Create the blog content directory**

```bash
mkdir -p /Users/sms/Code/orcha-website/src/content/blog
```

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "add blog content collection with schema"
```

---

### Task 3: Extract Nav Component (with Responsive Hamburger)

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Create the Nav component**

Extract the nav from `index.astro` into a standalone component with the "Blog" link added and a hamburger menu for mobile.

```astro
---
/*
 * Shared site navigation used by the landing page and blog layouts.
 *
 * Exports: default Astro component (no props).
 *
 * On viewports ≤768px the link list collapses behind a hamburger toggle.
 * Uses vanilla JS — no framework dependency.
 */
import { Image } from 'astro:assets';
import logo from '../assets/logo-with-text.png';
---

<nav>
	<a href="/" class="nav-brand">
		<Image src={logo} alt="Orcha" height={36} />
	</a>
	<button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
		<span class="nav-toggle-icon"></span>
	</button>
	<div class="nav-links">
		<a href="/what-is-orcha">Docs</a>
		<a href="/blog">Blog</a>
		<a href="https://github.com/whileTrueYield/orcha">GitHub</a>
		<a href="https://app.orcha.run" class="btn btn-primary">Try Orcha</a>
	</div>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 2rem;
		max-width: 1200px;
		margin: 0 auto;
		position: relative;
	}
	.nav-brand {
		display: flex;
		align-items: center;
		text-decoration: none;
	}
	.nav-brand :global(img) {
		height: 36px;
	}
	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}
	.nav-links a {
		color: var(--gray-200);
		font-size: 0.95rem;
	}

	/* Hamburger button — hidden on desktop */
	.nav-toggle {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		z-index: 10;
	}
	.nav-toggle-icon,
	.nav-toggle-icon::before,
	.nav-toggle-icon::after {
		display: block;
		width: 22px;
		height: 2px;
		background: var(--gray-200);
		border-radius: 1px;
		transition: transform 0.25s ease, opacity 0.25s ease;
		position: relative;
	}
	.nav-toggle-icon::before,
	.nav-toggle-icon::after {
		content: '';
		position: absolute;
		left: 0;
	}
	.nav-toggle-icon::before {
		top: -7px;
	}
	.nav-toggle-icon::after {
		top: 7px;
	}

	/* Animate to X when open */
	.nav-toggle[aria-expanded='true'] .nav-toggle-icon {
		background: transparent;
	}
	.nav-toggle[aria-expanded='true'] .nav-toggle-icon::before {
		top: 0;
		transform: rotate(45deg);
	}
	.nav-toggle[aria-expanded='true'] .nav-toggle-icon::after {
		top: 0;
		transform: rotate(-45deg);
	}

	@media (max-width: 768px) {
		.nav-toggle {
			display: block;
		}
		.nav-links {
			display: none;
			flex-direction: column;
			position: absolute;
			top: 100%;
			right: 0;
			left: 0;
			background: var(--dark);
			border-top: 1px solid var(--gray-700);
			padding: 1.5rem 2rem;
			gap: 1rem;
			align-items: flex-start;
		}
		.nav-links.is-open {
			display: flex;
		}
	}
</style>

<script>
	const toggle = document.querySelector('.nav-toggle');
	const links = document.querySelector('.nav-links');
	if (toggle && links) {
		toggle.addEventListener('click', () => {
			const isOpen = toggle.getAttribute('aria-expanded') === 'true';
			toggle.setAttribute('aria-expanded', String(!isOpen));
			links.classList.toggle('is-open');
		});
	}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "extract nav into shared component with responsive hamburger"
```

---

### Task 4: Extract Footer Component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create the Footer component**

```astro
---
/*
 * Shared site footer used by the landing page and blog layouts.
 *
 * Exports: default Astro component (no props).
 */
---

<footer>
	<p>
		Orcha is open source under <a href="https://github.com/whileTrueYield/orcha/blob/main/LICENSE">FSL-1.1-MIT</a>.
		Built by <a href="https://github.com/whileTrueYield">whileTrueYield</a>.
	</p>
</footer>

<style>
	footer {
		border-top: 1px solid var(--gray-700);
		padding: 2rem;
		text-align: center;
		color: var(--gray-400);
		font-size: 0.9rem;
	}
	footer a {
		color: var(--gray-400);
	}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "extract footer into shared component"
```

---

### Task 5: Update Landing Page to Use Shared Components

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace inline nav/footer with components**

In the frontmatter, add the imports:

```astro
---
import { Image } from 'astro:assets';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import logo from '../assets/logo-with-text.png';
import simulator from '../assets/screenshots/schedule_simulation_predictor.png';
import swimlanes from '../assets/screenshots/scheduler_swimlanes.png';
import gantt from '../assets/screenshots/scheduler_gantt_chart.png';
import taskSwitcher from '../assets/screenshots/task_switcher.png';
---
```

Remove the `logo` import if it's no longer used directly (the Nav component imports it internally). Keep it only if it's used elsewhere in the page — it isn't, so remove it.

```astro
---
import { Image } from 'astro:assets';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import simulator from '../assets/screenshots/schedule_simulation_predictor.png';
import swimlanes from '../assets/screenshots/scheduler_swimlanes.png';
import gantt from '../assets/screenshots/scheduler_gantt_chart.png';
import taskSwitcher from '../assets/screenshots/task_switcher.png';
---
```

In the `<body>`, replace the inline `<nav>...</nav>` block (lines 280–289) with:

```astro
<Nav />
```

Replace the inline `<footer>...</footer>` block (lines 443–448) with:

```astro
<Footer />
```

In the `<style>` block, remove the nav-related rules (the `/* Nav */` section, lines 59–103) and the footer rules (lines 258–267). Also remove the `.nav-links { gap: 1rem; }` from the mobile media query. These styles now live inside the components.

- [ ] **Step 2: Verify the landing page still looks correct**

```bash
cd /Users/sms/Code/orcha-website && npm run dev
```

Open `http://localhost:4321/` in a browser. Verify:
- Nav shows all four links (Docs, Blog, GitHub, Try Orcha)
- On mobile viewport (≤768px), hamburger menu appears and toggles
- Footer renders identically
- Rest of the page is unchanged

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "use shared Nav and Footer components in landing page"
```

---

### Task 6: Create Blog Styles

**Files:**
- Create: `src/styles/blog.css`

- [ ] **Step 1: Create blog prose and layout styles**

These mirror the Starlight prose rules from `custom.css` but are standalone for the blog layout.

```css
/*
 * Blog-specific styles: page layout, prose typography, and index listing.
 *
 * Mirrors the Starlight custom.css prose treatment so blog posts feel
 * visually consistent with docs, while remaining independent of Starlight.
 */

/* ─── Shared tokens (same as landing page) ─── */

:root {
	--brand: #00bcd4;
	--brand-dark: #00838f;
	--dark: #17181c;
	--gray-900: #1e2028;
	--gray-800: #24272f;
	--gray-700: #353841;
	--gray-400: #888b96;
	--gray-300: #a0a3ab;
	--gray-200: #c0c2c7;
	--white: #ffffff;
}

/* ─── Base ─── */

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	background: var(--dark);
	color: var(--gray-200);
	line-height: 1.6;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

a {
	color: var(--brand);
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}

/* ─── Blog layout ─── */

.blog-container {
	max-width: 720px;
	margin: 0 auto;
	padding: 3rem 2rem 6rem;
}

/* ─── Blog post header ─── */

.blog-header {
	margin-bottom: 3rem;
}

.blog-header h1 {
	font-size: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);
	font-weight: 700;
	color: var(--white);
	line-height: 1.2;
	letter-spacing: -0.025em;
	margin-bottom: 0.75rem;
}

.blog-header time {
	font-size: 0.9rem;
	color: var(--gray-400);
}

/* ─── Blog prose ─── */

.blog-prose > * + * {
	margin-top: 1.5em;
}

.blog-prose h2 {
	font-size: clamp(1.35rem, 1.2rem + 0.75vw, 1.65rem);
	font-weight: 650;
	color: var(--white);
	letter-spacing: -0.02em;
	line-height: 1.25;
	margin-top: 2.5em;
	padding-bottom: 0.25em;
	border-bottom: 1px solid var(--gray-700);
}

.blog-prose h3 {
	font-size: clamp(1.1rem, 1rem + 0.5vw, 1.3rem);
	font-weight: 600;
	color: var(--white);
	letter-spacing: -0.015em;
	line-height: 1.35;
	margin-top: 2em;
}

.blog-prose h2 + *,
.blog-prose h3 + * {
	margin-top: 0.75em;
}

.blog-prose p {
	text-wrap: pretty;
}

.blog-prose a:not([class]) {
	color: var(--brand);
	text-decoration: underline;
	text-decoration-color: color-mix(in srgb, var(--brand) 40%, transparent);
	text-underline-offset: 0.15em;
	text-decoration-thickness: 1px;
	transition: text-decoration-color 0.15s ease;
}

.blog-prose a:not([class]):hover {
	text-decoration-color: var(--brand);
}

.blog-prose ul,
.blog-prose ol {
	padding-left: 1.5em;
}

.blog-prose li {
	margin-top: 0.35em;
}

.blog-prose li::marker {
	color: var(--gray-400);
}

.blog-prose blockquote {
	border-left: 3px solid var(--brand);
	background: var(--gray-900);
	border-radius: 0 0.5rem 0.5rem 0;
	padding: 1em 1.25em;
	font-size: 0.925rem;
}

.blog-prose blockquote p {
	opacity: 0.85;
}

.blog-prose :not(pre) > code {
	background: color-mix(in srgb, var(--gray-400) 15%, transparent);
	border: 1px solid color-mix(in srgb, var(--gray-400) 30%, transparent);
	border-radius: 0.3rem;
	padding: 0.15em 0.35em;
	font-size: 0.875em;
	font-weight: 450;
	color: var(--brand);
	word-break: break-word;
}

.blog-prose pre {
	background: var(--gray-900);
	border: 1px solid var(--gray-700);
	border-radius: 0.6rem;
	font-size: 0.875rem;
	line-height: 1.7;
	padding: 1em 1.25em;
	overflow-x: auto;
}

.blog-prose img {
	border-radius: 0.6rem;
	border: 1px solid color-mix(in srgb, var(--gray-400) 30%, transparent);
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
	max-width: 100%;
	height: auto;
}

.blog-prose hr {
	border: none;
	border-top: 1px solid var(--gray-700);
	margin: 2.5em 0;
}

.blog-prose strong {
	font-weight: 600;
	color: var(--white);
}

/* ─── Blog index ─── */

.blog-index-header {
	margin-bottom: 3rem;
}

.blog-index-header h1 {
	font-size: 2.2rem;
	font-weight: 700;
	color: var(--white);
	letter-spacing: -0.025em;
}

.blog-post-list {
	list-style: none;
	padding: 0;
}

.blog-post-item {
	padding: 1.5rem 0;
	border-bottom: 1px solid var(--gray-700);
}

.blog-post-item:first-child {
	padding-top: 0;
}

.blog-post-item:last-child {
	border-bottom: none;
}

.blog-post-item time {
	font-size: 0.85rem;
	color: var(--gray-400);
}

.blog-post-item h2 {
	font-size: 1.25rem;
	font-weight: 600;
	margin: 0.25rem 0 0.4rem;
}

.blog-post-item h2 a {
	color: var(--white);
	text-decoration: none;
}

.blog-post-item h2 a:hover {
	color: var(--brand);
	text-decoration: none;
}

.blog-post-item p {
	font-size: 0.925rem;
	color: var(--gray-400);
	line-height: 1.55;
}

/* ─── Shared button styles (for nav CTA) ─── */

.btn {
	display: inline-block;
	padding: 0.6rem 1.4rem;
	border-radius: 6px;
	font-weight: 600;
	font-size: 0.95rem;
	transition: opacity 0.2s;
}

.btn:hover {
	text-decoration: none;
	opacity: 0.9;
}

.btn-primary {
	background: var(--brand-dark);
	color: var(--white);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/blog.css
git commit -m "add blog stylesheet with prose and index styles"
```

---

### Task 7: Create Blog Post Layout

**Files:**
- Create: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Create the layout**

```astro
---
/*
 * Layout shell for individual blog posts.
 *
 * Receives `title`, `description`, and `date` from the post frontmatter
 * via the page that renders it ([slug].astro). Wraps the MDX content in
 * a consistent page structure with nav, header, prose container, and footer.
 */
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/blog.css';

interface Props {
	title: string;
	description: string;
	date: Date;
}

const { title, description, date } = Astro.props;
const formattedDate = date.toLocaleDateString('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
});
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>{title} — Orcha Blog</title>
		<meta name="description" content={description} />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	</head>
	<body>
		<Nav />
		<main class="blog-container">
			<header class="blog-header">
				<h1>{title}</h1>
				<time datetime={date.toISOString().slice(0, 10)}>{formattedDate}</time>
			</header>
			<article class="blog-prose">
				<slot />
			</article>
		</main>
		<Footer />
	</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BlogPost.astro
git commit -m "add blog post layout with nav, prose container, and footer"
```

---

### Task 8: Create Blog Index Page

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Create the index page**

```astro
---
/*
 * Blog index page — lists all published posts sorted by date descending.
 *
 * Filters out draft posts in production builds. In dev mode, drafts are
 * included so authors can preview them.
 */
import { getCollection } from 'astro:content';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
import '../../styles/blog.css';

const posts = (await getCollection('blog', ({ data }) => {
	return import.meta.env.PROD ? !data.draft : true;
})).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Blog — Orcha</title>
		<meta name="description" content="Updates, insights, and technical deep-dives from the Orcha team." />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	</head>
	<body>
		<Nav />
		<main class="blog-container">
			<div class="blog-index-header">
				<h1>Blog</h1>
			</div>
			{posts.length === 0 ? (
				<p>No posts yet. Check back soon.</p>
			) : (
				<ul class="blog-post-list">
					{posts.map((post) => {
						const formattedDate = post.data.date.toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						});
						return (
							<li class="blog-post-item">
								<time datetime={post.data.date.toISOString().slice(0, 10)}>{formattedDate}</time>
								<h2><a href={`/blog/${post.id}`}>{post.data.title}</a></h2>
								<p>{post.data.description}</p>
							</li>
						);
					})}
				</ul>
			)}
		</main>
		<Footer />
	</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "add blog index page with post listing"
```

---

### Task 9: Create Blog Post Dynamic Route

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create the dynamic route**

```astro
---
/*
 * Dynamic route for individual blog posts.
 *
 * Uses Astro's content collection API to generate a static page for each
 * blog entry. The MDX content is rendered inside the BlogPost layout.
 */
import { getCollection, render } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: { post },
	}));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<BlogPost title={post.data.title} description={post.data.description} date={post.data.date}>
	<Content />
</BlogPost>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/blog/\\[slug\\].astro
git commit -m "add dynamic route for individual blog posts"
```

---

### Task 10: Add Seed Post and Verify End-to-End

**Files:**
- Create: `src/content/blog/hello-world.mdx`

- [ ] **Step 1: Create a seed post with a simple interactive component**

First, create the blog content directory and the post:

```bash
mkdir -p /Users/sms/Code/orcha-website/src/content/blog
mkdir -p /Users/sms/Code/orcha-website/src/components/blog
```

Create `src/components/blog/Counter.tsx`:

```tsx
/*
 * Simple counter to verify React hydration works in blog posts.
 * Delete this once real interactive components exist.
 */
import { useState } from 'react';

export function Counter() {
	const [count, setCount] = useState(0);
	return (
		<button
			onClick={() => setCount(count + 1)}
			style={{
				background: '#00838f',
				color: '#fff',
				border: 'none',
				borderRadius: '6px',
				padding: '0.6rem 1.4rem',
				fontSize: '1rem',
				fontWeight: 600,
				cursor: 'pointer',
			}}
		>
			Clicked {count} {count === 1 ? 'time' : 'times'}
		</button>
	);
}
```

Create `src/content/blog/hello-world.mdx`:

```mdx
---
title: "Hello, World"
description: "The first post on the Orcha blog — testing MDX with interactive components."
date: 2026-05-26
---

This is the first post on the Orcha blog. It exists to verify the blog pipeline works end-to-end: content collection, MDX rendering, prose styling, and interactive React components.

## A Live Component

Here's a React component hydrated on the client:

import { Counter } from '../../components/blog/Counter';

<Counter client:visible />

If the button above responds to clicks, the blog is working.
```

- [ ] **Step 2: Start the dev server and verify everything**

```bash
cd /Users/sms/Code/orcha-website && npm run dev
```

Verify in browser:

1. `http://localhost:4321/blog` — index page shows "Hello, World" post with date and description
2. Click the post title — navigates to `http://localhost:4321/blog/hello-world`
3. Post page shows: title, date, prose content, and the Counter button
4. Click the Counter button — it increments (proves React hydration works)
5. `http://localhost:4321/` — landing page still works, nav now has Blog link
6. Resize to mobile width — hamburger menu appears and toggles correctly
7. `http://localhost:4321/what-is-orcha` — docs still work normally

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/hello-world.mdx src/components/blog/Counter.tsx
git commit -m "add seed blog post with interactive counter to verify pipeline"
```

---

### Task 11: Add Blog Link to Starlight Header

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Add blog to Starlight's social links**

Starlight's `social` config supports custom links. Add a blog entry so it's discoverable from docs pages:

```javascript
social: [
	{ icon: 'github', label: 'GitHub', href: 'https://github.com/whileTrueYield/orcha' },
	{ icon: 'pen', label: 'Blog', href: '/blog' },
],
```

- [ ] **Step 2: Verify the link appears in the Starlight header**

```bash
cd /Users/sms/Code/orcha-website && npm run dev
```

Navigate to any docs page and confirm the blog icon/link appears in the header.

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "add blog link to Starlight header for discoverability"
```

---

### Task 12: Build Check

- [ ] **Step 1: Run a production build**

```bash
cd /Users/sms/Code/orcha-website && npm run build
```

Expected: Build succeeds. Output includes `/blog/index.html` and `/blog/hello-world/index.html`.

- [ ] **Step 2: Preview the production build**

```bash
cd /Users/sms/Code/orcha-website && npm run preview
```

Verify the same checklist from Task 10 Step 2 against the production build at `http://localhost:4321`.

- [ ] **Step 3: Commit any fixes if needed, otherwise done**
