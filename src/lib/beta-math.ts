/**
 * Beta distribution math for PERT estimation visualizations.
 *
 * Provides PDF, CDF, and quantile functions for the beta distribution,
 * plus a helper to derive alpha/beta parameters from three-point estimates
 * using the PERT-Beta method (lambda = 4).
 *
 * All functions operate on the standard [0, 1] interval. Callers map
 * real-world values (e.g., days) to/from [0, 1] using the optimistic
 * and pessimistic bounds as the interval endpoints.
 */

// Lanczos approximation coefficients (g = 7)
const LANCZOS_G = 7;
const LANCZOS_C = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];

export function lnGamma(z: number): number {
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - lnGamma(1 - z);
  }
  z -= 1;
  let x = LANCZOS_C[0];
  for (let i = 1; i < LANCZOS_G + 2; i++) {
    x += LANCZOS_C[i] / (z + i);
  }
  const t = z + LANCZOS_G + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

export function betaPDF(x: number, alpha: number, beta: number): number {
  if (x <= 0 || x >= 1) return 0;
  const lnB = lnGamma(alpha) + lnGamma(beta) - lnGamma(alpha + beta);
  return Math.exp((alpha - 1) * Math.log(x) + (beta - 1) * Math.log(1 - x) - lnB);
}

/**
 * Regularized incomplete beta function via Lentz's continued fraction.
 * Only valid for x <= (a+1)/(a+b+2); callers should use the symmetry
 * relation I(x,a,b) = 1 - I(1-x,b,a) for larger x.
 */
function betaIncomplete(x: number, a: number, b: number): number {
  const lnB = lnGamma(a) + lnGamma(b) - lnGamma(a + b);
  const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lnB);

  const maxIter = 200;
  const eps = 1e-10;
  let f = 1;
  let c = 1;
  let d = 0;

  for (let k = 0; k <= maxIter; k++) {
    let numerator: number;
    if (k === 0) {
      numerator = 1;
    } else if (k % 2 === 0) {
      const m = k / 2;
      numerator = (m * (b - m) * x) / ((a + k - 1) * (a + k));
    } else {
      const m = Math.floor(k / 2);
      numerator = -((a + m) * (a + b + m) * x) / ((a + k) * (a + k + 1));
    }

    d = 1 + numerator * d;
    if (Math.abs(d) < eps) d = eps;
    d = 1 / d;

    c = 1 + numerator / c;
    if (Math.abs(c) < eps) c = eps;

    f *= c * d;
    if (Math.abs(c * d - 1) < eps && k > 0) break;
  }

  return (front * f) / a;
}

export function betaCDF(x: number, alpha: number, beta: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  if (x > (alpha + 1) / (alpha + beta + 2)) {
    return 1 - betaIncomplete(1 - x, beta, alpha);
  }
  return betaIncomplete(x, alpha, beta);
}

/** Inverse CDF by bisection — 60 iterations gives ~1e-18 precision. */
export function betaQuantile(p: number, alpha: number, beta: number): number {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (betaCDF(mid, alpha, beta) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Derive beta distribution parameters from three-point estimates (PERT lambda = 4). */
export function pertBetaParams(o: number, m: number, p: number): { alpha: number; beta: number } {
  const range = p - o;
  if (range <= 0) return { alpha: 2, beta: 2 };
  return {
    alpha: 1 + 4 * ((m - o) / range),
    beta: 1 + 4 * ((p - m) / range),
  };
}
