/**
 * Act 2 — "Reality Bites"
 *
 * Four toggle switches for real-world factors (availability, bias,
 * context switching, discovery risk) that distort a baseline triangular
 * estimate. The original stays as a cyan ghost; the adjusted estimate
 * renders in orange, stretching further right with each factor enabled.
 *
 * Base estimates are hardcoded at O=3, M=7, P=14 — the reader already
 * played with sliders in Act 1; here the teaching is about *factors*.
 *
 * Exports: RealityFactors (default React component, no props)
 */
import { useState, useCallback } from "react";

const CHART = { left: 40, right: 580, top: 25, bottom: 170, width: 600, height: 210 } as const;
const BASE = { o: 3, m: 7, p: 14 } as const;

interface Factor {
  id: string;
  name: string;
  description: string;
  impact: string;
  apply: (o: number, m: number, p: number) => { o: number; m: number; p: number };
}

const FACTORS: Factor[] = [
  {
    id: "avail",
    name: "Split Availability",
    description: "Person is shared across 2 projects — only 60% available",
    impact: "+67% duration",
    apply: (o, m, p) => ({ o: o / 0.6, m: m / 0.6, p: p / 0.6 }),
  },
  {
    id: "bias",
    name: "Optimism Bias",
    description: "Estimator historically underestimates by ~30%",
    impact: "+30% to all points",
    apply: (o, m, p) => ({ o: o * 1.3, m: m * 1.3, p: p * 1.3 }),
  },
  {
    id: "context",
    name: "Context Switching",
    description: "Meetings, interruptions, Slack — 20% productivity lost",
    impact: "+25% duration",
    apply: (o, m, p) => ({ o: o * 1.25, m: m * 1.25, p: p * 1.25 }),
  },
  {
    id: "discovery",
    name: "Discovery Risk",
    description: "Unknown unknowns — pessimistic estimate grows more than optimistic",
    impact: "+10%/+20%/+80% skewed",
    apply: (o, m, p) => ({ o: o * 1.1, m: m * 1.2, p: p * 1.8 }),
  },
];

function xScale(val: number, min: number, max: number): number {
  if (max === min) return (CHART.left + CHART.right) / 2;
  return CHART.left + ((val - min) / (max - min)) * (CHART.right - CHART.left);
}

function pert(o: number, m: number, p: number): number {
  return (o + 4 * m + p) / 6;
}

export function RealityFactors() {
  const [active, setActive] = useState<Record<string, boolean>>({});

  const toggle = useCallback((id: string) => {
    setActive((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Compute adjusted estimates by compounding active factors
  let adj = { o: BASE.o, m: BASE.m, p: BASE.p };
  const anyActive = FACTORS.some((f) => active[f.id]);
  for (const f of FACTORS) {
    if (active[f.id]) adj = f.apply(adj.o, adj.m, adj.p);
  }

  const rangeMin = Math.max(0, BASE.o - 1);
  const rangeMax = (anyActive ? Math.max(BASE.p, adj.p) : BASE.p) + 2;

  // Ghost triangle (original)
  const gO = xScale(BASE.o, rangeMin, rangeMax);
  const gM = xScale(BASE.m, rangeMin, rangeMax);
  const gP = xScale(BASE.p, rangeMin, rangeMax);
  const ghostPoints = `${gO},${CHART.bottom} ${gM},${CHART.top} ${gP},${CHART.bottom}`;

  // Adjusted triangle — peak height scales down as the spread widens
  const origSpan = BASE.p - BASE.o;
  const adjSpan = adj.p - adj.o;
  const heightRatio = origSpan / adjSpan;
  const adjPeakY = Math.min(CHART.top + (CHART.bottom - CHART.top) * (1 - heightRatio) * 0.6, CHART.bottom - 20);

  const aO = xScale(adj.o, rangeMin, rangeMax);
  const aM = xScale(adj.m, rangeMin, rangeMax);
  const aP = xScale(adj.p, rangeMin, rangeMax);
  const adjPoints = `${aO},${CHART.bottom} ${aM},${adjPeakY} ${aP},${CHART.bottom}`;

  const origPert = pert(BASE.o, BASE.m, BASE.p);
  const adjPert = pert(adj.o, adj.m, adj.p);

  // Build tick marks, deduplicating overlaps
  type Tick = { x: number; label: string; color: string };
  const allTicks: Tick[] = [];
  const baseTicks = [
    { v: BASE.o, label: `${BASE.o}d` },
    { v: BASE.m, label: `${BASE.m}d` },
    { v: BASE.p, label: `${BASE.p}d` },
  ];
  const adjTicks = anyActive
    ? [
        { v: adj.o, label: `${Math.round(adj.o)}d` },
        { v: adj.m, label: `${Math.round(adj.m)}d` },
        { v: adj.p, label: `${Math.round(adj.p)}d` },
      ]
    : [];

  const placed: number[] = [];
  for (const { v, label } of baseTicks) {
    const x = xScale(v, rangeMin, rangeMax);
    if (!placed.some((px) => Math.abs(px - x) < 25)) {
      placed.push(x);
      allTicks.push({ x, label, color: "var(--brand)" });
    }
  }
  for (const { v, label } of adjTicks) {
    const x = xScale(v, rangeMin, rangeMax);
    if (!placed.some((px) => Math.abs(px - x) < 25)) {
      placed.push(x);
      allTicks.push({ x, label, color: "#ff9800" });
    }
  }

  return (
    <div style={{ maxWidth: 640, width: "100%", margin: "2rem auto" }}>
      <h3 style={{ color: "var(--white)", fontSize: "1.1rem", fontWeight: 600, marginBottom: 4 }}>
        Now add reality
      </h3>
      <p style={{ color: "var(--gray-400)", fontSize: "0.85rem", marginBottom: 28 }}>
        Toggle real-world factors and watch the estimate shift. The original triangle stays as a ghost.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {FACTORS.map((f) => (
          <FactorToggle key={f.id} factor={f} isActive={!!active[f.id]} onToggle={toggle} />
        ))}
      </div>

      <div style={{ background: "var(--gray-900)", border: "1px solid var(--gray-700)", borderRadius: 8, padding: "20px 20px 12px" }}>
        <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} style={{ width: "100%", height: 220, display: "block" }}>
          <defs>
            <linearGradient id="ghostGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.12} />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9800" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ff9800" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          {/* Grid */}
          <line x1={CHART.left} y1={40} x2={CHART.right} y2={40} stroke="var(--gray-700)" strokeWidth={0.5} strokeDasharray="2,4" />
          <line x1={CHART.left} y1={80} x2={CHART.right} y2={80} stroke="var(--gray-700)" strokeWidth={0.5} strokeDasharray="2,4" />
          <line x1={CHART.left} y1={120} x2={CHART.right} y2={120} stroke="var(--gray-700)" strokeWidth={0.5} strokeDasharray="2,4" />
          {/* Axes */}
          <line x1={CHART.left} y1={CHART.bottom} x2={CHART.right} y2={CHART.bottom} stroke="var(--gray-700)" strokeWidth={1} />
          <line x1={CHART.left} y1={10} x2={CHART.left} y2={CHART.bottom} stroke="var(--gray-700)" strokeWidth={1} />
          <text x={12} y={95} fill="var(--gray-400)" fontSize={9} textAnchor="middle" transform="rotate(-90,12,95)" fontFamily="Inter,sans-serif">probability density</text>
          {/* Ghost triangle */}
          <polygon points={ghostPoints} fill="url(#ghostGrad)" />
          <polygon points={ghostPoints} fill="none" stroke="var(--brand)" strokeWidth={1.5} strokeDasharray="6,4" opacity={0.4} />
          {/* Adjusted triangle */}
          {anyActive && (
            <>
              <polygon points={adjPoints} fill="url(#activeGrad)" />
              <polygon points={adjPoints} fill="none" stroke="#ff9800" strokeWidth={2} strokeLinejoin="round" />
            </>
          )}
          {/* Ticks */}
          {allTicks.map(({ x, label, color }) => (
            <g key={`${label}-${color}`}>
              <line x1={x} y1={CHART.bottom} x2={x} y2={CHART.bottom + 5} stroke={color} strokeWidth={1} />
              <text x={x} y={CHART.bottom + 16} fill={color} fontSize={10} textAnchor="middle" fontFamily="Inter,sans-serif">{label}</text>
            </g>
          ))}
        </svg>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16, fontSize: "0.8rem", color: "var(--gray-400)" }}>
        <div>
          <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 2 }}>Original PERT</span>
          <span style={{ color: "var(--brand)", fontWeight: 600 }}>{origPert.toFixed(1)}</span> days
        </div>
        {anyActive && (
          <div style={{ color: "#ff9800" }}>
            <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 2 }}>Adjusted PERT</span>
            <span style={{ fontWeight: 600 }}>{adjPert.toFixed(1)}</span> days
          </div>
        )}
      </div>

      {anyActive && adjPert / origPert > 1.5 && (
        <div style={{ textAlign: "center", marginTop: 12, fontSize: "0.8rem", fontWeight: 600, color: "#ff9800" }}>
          Your {Math.round(origPert)}-day estimate just became a {Math.round(adjPert)}-day estimate.
        </div>
      )}
    </div>
  );
}

function FactorToggle({ factor, isActive, onToggle }: { factor: Factor; isActive: boolean; onToggle: (id: string) => void }) {
  return (
    <div
      onClick={() => onToggle(factor.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: isActive ? "rgba(255, 152, 0, 0.06)" : "var(--gray-900)",
        border: `1px solid ${isActive ? "#ff9800" : "var(--gray-700)"}`,
        borderRadius: 8,
        cursor: "pointer",
        userSelect: "none",
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      {/* Toggle pill */}
      <div
        style={{
          width: 36,
          height: 20,
          background: isActive ? "#ff9800" : "var(--gray-700)",
          borderRadius: 10,
          position: "relative",
          flexShrink: 0,
          transition: "background 0.2s",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 16,
            height: 16,
            background: "var(--white)",
            borderRadius: "50%",
            top: 2,
            left: isActive ? 18 : 2,
            transition: "left 0.2s",
          }}
        />
      </div>
      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--white)" }}>{factor.name}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: 2 }}>{factor.description}</div>
      </div>
      {/* Impact badge */}
      <div
        style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          color: isActive ? "#ff9800" : "var(--gray-400)",
          whiteSpace: "nowrap",
          transition: "color 0.2s",
        }}
      >
        {factor.impact}
      </div>
    </div>
  );
}
