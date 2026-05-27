# Interactive Beta Distribution Components — Design Spec

**Date:** 2026-05-26
**Post:** `src/content/blog/beta-distributions-for-engineering-estimates.md` → `.mdx`
**Status:** Approved

## Overview

Add three progressive interactive components to the beta distributions blog post. Each component is placed inline after the section that introduces its concept, building the reader's understanding layer by layer: naive model → real-world distortion → proper probability distribution.

## File Changes

- **Rename** `beta-distributions-for-engineering-estimates.md` → `.mdx`
- **Create** `src/components/blog/ThreePointEstimate.tsx` (Act 1)
- **Create** `src/components/blog/RealityFactors.tsx` (Act 2)
- **Create** `src/components/blog/BetaDistribution.tsx` (Act 3)
- **Create** `src/lib/beta-math.ts` (shared beta distribution math)
- **Add dependency:** `d3-scale` (scales only, not full D3)

## Dependencies

- `d3-scale` — for linear scale mapping (values → SVG coordinates). Lightweight; avoids pulling in all of D3.
- All beta distribution math (PDF, CDF, quantile) is implemented from scratch in `src/lib/beta-math.ts` — no stats library needed. Uses Lanczos approximation for the gamma function and Lentz's continued fraction for the regularized incomplete beta.

## Component 1: ThreePointEstimate (Act 1)

**Placement:** After §The Hidden Assumption
**Purpose:** Let readers enter optimistic/most-likely/pessimistic estimates and see the resulting triangular distribution — the "textbook" model.

### Inputs
- Three range sliders: Optimistic (1–30 days), Most Likely (1–30 days), Pessimistic (1–30 days)
- Sliders are constrained: O ≤ M ≤ P
- Default values: O=3, M=7, P=14

### Visualization
- SVG chart with triangular distribution (polygon)
- Gradient fill: `--brand` (#00bcd4) at 35% opacity → 3% opacity
- Stroke: solid `--brand`, 2px
- Dashed vertical line at most-likely point
- X-axis tick marks at O, M, P values
- Y-axis label: "probability density"

### Stats Display
- PERT weighted mean: (O + 4M + P) / 6
- Standard deviation: (P - O) / 6
- Formula shown in muted text below

### Visual Style
- Slider thumbs: `--brand` (#00bcd4) with glow shadow
- Chart container: `--gray-900` background, `--gray-700` border, 8px radius
- Grid lines: dashed, `--gray-700`
- Matches blog theme tokens exactly

## Component 2: RealityFactors (Act 2)

**Placement:** After §What Three-Point Estimation Gets Wrong
**Purpose:** Show how real-world factors distort the clean triangular estimate. The original stays as a ghost; an adjusted triangle appears in orange.

### Inputs
- Four toggle switches (not sliders — binary on/off for clarity):

| Factor | Description | Effect |
|--------|-------------|--------|
| Split Availability | Shared across 2 projects, 60% available | ÷ 0.6 (all points) |
| Optimism Bias | Estimator underestimates by ~30% | × 1.3 (all points) |
| Context Switching | Meetings, interrupts — 20% productivity lost | × 1.25 (all points) |
| Discovery Risk | Unknown unknowns, skewed impact | × 1.1 / 1.2 / 1.8 (O/M/P) |

- Factors compound multiplicatively when multiple are active
- Base estimates: O=3, M=7, P=14 (hardcoded — carried from Act 1 narrative)

### Visualization
- **Ghost triangle:** Original estimate in cyan, dashed stroke, low-opacity fill
- **Adjusted triangle:** Orange (#ff9800), solid stroke, gradient fill — only appears when ≥1 factor is active
- Adjusted triangle peak height is proportional to concentration (wider spread = shorter peak)
- Both share the same x-axis scale (scale adjusts to fit the widest triangle)
- Orange x-axis tick marks for adjusted values, cyan for originals

### Stats Display
- Original PERT and Adjusted PERT side by side
- Shift callout message when ratio > 1.5×: "Your X-day estimate just became a Y-day estimate."

### Toggle Style
- Pill toggles with slide animation
- Active state: orange border, orange toggle, orange impact label
- Inactive state: gray-700 background, gray-400 text
- Each toggle row shows: name, description, impact percentage

## Component 3: BetaDistribution (Act 3)

**Placement:** After §Beta Distributions: Modeling Reality
**Purpose:** The payoff — same three inputs, but rendered as a proper beta distribution. Shows the real probability shape with quantile stats.

### Inputs
- Three range sliders: same as Act 1 (O, M, P; 1–30 days; constrained O ≤ M ≤ P)
- Default values: O=3, M=7, P=14
- Toggle buttons: "Beta distribution" (on by default), "Triangular overlay" (off by default)

### Beta Distribution Math (PERT-Beta method)
- Map three-point estimates to beta distribution parameters:
  - `alpha = 1 + 4 * (M - O) / (P - O)` (PERT lambda = 4)
  - `beta = 1 + 4 * (P - M) / (P - O)`
- PDF computed at 200 sample points across [0, 1] for smooth curve
- CDF via regularized incomplete beta function (Lentz's continued fraction)
- Quantile via bisection on CDF (60 iterations for precision)

### Visualization
- **Beta curve:** Purple (#7c4dff), 2.5px stroke, gradient fill
- **Shaded area:** Region from 0 to "most likely" value, 15% opacity — represents P(finish ≤ M)
- **Mean line:** Dashed vertical at beta mean
- **Triangular overlay (optional):** Same cyan dashed ghost from Act 1, toggled via button
- X-axis ticks at O, M, P

### Stats Display
- Beta Mean, Beta Median, 80th percentile ("80% Likely By")
- Probability callout box: "Probability of finishing in M days (your 'most likely'): X%"
  - Purple accent background, prominent percentage

### Color System
- Purple (#7c4dff) for beta distribution — distinct from cyan (Act 1) and orange (Act 2)
- Each act has its own color identity: cyan → orange → purple
- Slider thumbs match the act color (purple in Act 3)

## Shared: beta-math.ts

Extracted math utilities used by both Act 2 (for future extension) and Act 3:

```
lnGamma(z)        — Lanczos approximation of ln(Γ(z))
betaPDF(x, α, β)  — probability density function on [0,1]
betaCDF(x, α, β)  — cumulative distribution function
betaQuantile(p, α, β) — inverse CDF by bisection
pertBetaParams(o, m, p) — derive α, β from three-point estimates
```

## Responsive Behavior

- Sliders stack vertically on screens < 480px (3-column → 1-column)
- Toggle rows in Act 2 remain full-width (they read well stacked)
- SVG charts use viewBox and `preserveAspectRatio="xMidYMid meet"` — scale naturally
- Chart containers have 20px padding, reduce to 12px on mobile

## MDX Integration

Each component is imported at the top of the `.mdx` file and placed inline with `client:visible` directive (loads when the component scrolls into view — good for performance since there are three of them).

```mdx
import { ThreePointEstimate } from "../../components/blog/ThreePointEstimate";
import { RealityFactors } from "../../components/blog/RealityFactors";
import { BetaDistribution } from "../../components/blog/BetaDistribution";

... prose ...

<ThreePointEstimate client:visible />

... more prose ...

<RealityFactors client:visible />

... more prose ...

<BetaDistribution client:visible />
```

## Styling Strategy

- All components use CSS custom properties from `blog.css` (--brand, --gray-*, --dark, --white)
- Component-specific CSS is colocated (CSS modules or inline styles in the .tsx files)
- No Tailwind — consistent with existing pure-CSS approach
- Act-specific accent colors: cyan (#00bcd4), orange (#ff9800), purple (#7c4dff)

## What This Spec Does NOT Cover

- Act 2 does not have sliders — the base estimates are hardcoded at 3/7/14. This is intentional: the teaching moment is about *factors*, not about tweaking numbers. The reader already played with sliders in Act 1.
- No animation/transitions between states in this version. Toggles and slider changes are immediate. Smooth transitions are a polish item for later.
- No Monte Carlo simulation — the post's closing line teases "feeding distributions into something far more interesting" which is a future post.
