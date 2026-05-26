# Orcha Website

Marketing site and documentation for [Orcha](https://github.com/whileTrueYield/orcha), the project manager powered by Monte Carlo simulation.

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## Structure

- `src/pages/index.astro` — Marketing landing page
- `src/content/docs/` — Documentation (Starlight, markdown)
- `src/assets/screenshots/` — Product screenshots
- `src/styles/custom.css` — Brand colors and overrides

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # Static output to ./dist/
npm run preview  # Preview the build locally
```

## Deployment

The site builds to static HTML. Deploy `./dist/` to any static host:
DigitalOcean App Platform, Cloudflare Pages, GitHub Pages, Netlify, etc.
