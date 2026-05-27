/**
 * Act 1 — "The Naive Model"
 *
 * Three sliders (optimistic / most likely / pessimistic) that render a
 * triangular distribution and the PERT weighted mean. Introduces the
 * reader to three-point estimation in its textbook form.
 *
 * Exports: ThreePointEstimate (default React component, no props)
 */
import { useState, useCallback } from "react";

const CHART = { left: 40, right: 580, top: 25, bottom: 170, width: 600, height: 200 } as const;

function xScale(val: number, min: number, max: number): number {
  if (max === min) return (CHART.left + CHART.right) / 2;
  return CHART.left + ((val - min) / (max - min)) * (CHART.right - CHART.left);
}

const styles = {
  container: { maxWidth: 640, width: "100%", margin: "2rem auto" } as const,
  heading: { color: "var(--white)", fontSize: "1.1rem", fontWeight: 600, marginBottom: 4 } as const,
  subtitle: { color: "var(--gray-400)", fontSize: "0.85rem", marginBottom: 28 } as const,
  sliders: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" } as const,
  sliderGroup: { flex: 1, minWidth: 140 } as const,
  sliderLabel: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 } as const,
  label: { fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 } as const,
  value: { fontSize: "0.85rem", fontWeight: 600, color: "var(--white)" } as const,
  chartBox: { background: "var(--gray-900)", border: "1px solid var(--gray-700)", borderRadius: 8, padding: "20px 20px 12px" } as const,
  stats: { textAlign: "center", marginTop: 16, fontSize: "0.8rem", color: "var(--gray-400)" } as const,
  highlight: { color: "var(--brand)", fontWeight: 600 } as const,
  formula: { marginTop: 6, fontSize: "0.7rem", color: "var(--gray-700)", textAlign: "center", fontStyle: "italic" } as const,
};

export function ThreePointEstimate() {
  const [optimistic, setOptimistic] = useState(3);
  const [mostLikely, setMostLikely] = useState(7);
  const [pessimistic, setPessimistic] = useState(14);

  const handleOpt = useCallback((v: number) => {
    setOptimistic(v);
    setMostLikely((m) => Math.max(m, v));
    setPessimistic((p) => Math.max(p, Math.max(v, mostLikely)));
  }, [mostLikely]);

  const handleML = useCallback((v: number) => {
    setMostLikely(v);
    if (v < optimistic) setOptimistic(v);
    setPessimistic((p) => Math.max(p, v));
  }, [optimistic]);

  const handlePess = useCallback((v: number) => {
    setPessimistic(v);
    if (v < mostLikely) setMostLikely(v);
    if (v < optimistic) setOptimistic(v);
  }, [optimistic, mostLikely]);

  const rangeMin = Math.max(0, optimistic - 1);
  const rangeMax = pessimistic + 1;

  const xO = xScale(optimistic, rangeMin, rangeMax);
  const xM = xScale(mostLikely, rangeMin, rangeMax);
  const xP = xScale(pessimistic, rangeMin, rangeMax);

  const pert = (optimistic + 4 * mostLikely + pessimistic) / 6;
  const sigma = (pessimistic - optimistic) / 6;

  const triPoints = `${xO},${CHART.bottom} ${xM},${CHART.top} ${xP},${CHART.bottom}`;

  // Deduplicate ticks that would overlap
  const ticks: { x: number; label: string }[] = [];
  const placed: number[] = [];
  for (const { v, label } of [
    { v: optimistic, label: `${optimistic}d` },
    { v: mostLikely, label: `${mostLikely}d` },
    { v: pessimistic, label: `${pessimistic}d` },
  ]) {
    const x = xScale(v, rangeMin, rangeMax);
    if (!placed.some((px) => Math.abs(px - x) < 25)) {
      placed.push(x);
      ticks.push({ x, label });
    }
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Try it: Three-Point Estimate</h3>
      <p style={styles.subtitle}>
        Drag the sliders to set your optimistic, most likely, and pessimistic estimates.
      </p>

      <div style={styles.sliders}>
        <SliderInput label="Optimistic" value={optimistic} onChange={handleOpt} />
        <SliderInput label="Most Likely" value={mostLikely} onChange={handleML} />
        <SliderInput label="Pessimistic" value={pessimistic} onChange={handlePess} />
      </div>

      <div style={styles.chartBox}>
        <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} style={{ width: "100%", height: 200, display: "block" }}>
          <defs>
            <linearGradient id="triGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.03} />
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
          {/* Triangle */}
          <polygon points={triPoints} fill="url(#triGrad)" />
          <polygon points={triPoints} fill="none" stroke="var(--brand)" strokeWidth={2} strokeLinejoin="round" />
          {/* Most-likely dashed line */}
          <line x1={xM} y1={CHART.top} x2={xM} y2={CHART.bottom} stroke="var(--brand)" strokeWidth={1} strokeDasharray="4,3" opacity={0.5} />
          {/* Ticks */}
          {ticks.map(({ x, label }) => (
            <g key={label}>
              <line x1={x} y1={CHART.bottom} x2={x} y2={CHART.bottom + 5} stroke="var(--gray-400)" strokeWidth={1} />
              <text x={x} y={CHART.bottom + 16} fill="var(--gray-400)" fontSize={10} textAnchor="middle" fontFamily="Inter,sans-serif">{label}</text>
            </g>
          ))}
        </svg>
      </div>

      <div style={styles.stats}>
        PERT estimate: <span style={styles.highlight}>{pert.toFixed(1)}</span> days &nbsp;·&nbsp; σ = {sigma.toFixed(1)} days
      </div>
      <div style={styles.formula}>(O + 4M + P) / 6</div>
    </div>
  );
}

function SliderInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={styles.sliderGroup}>
      <div style={styles.sliderLabel}>
        <span style={styles.label}>{label}</span>
        <span style={styles.value}>{value}d</span>
      </div>
      <input
        type="range"
        min={1}
        max={30}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="estimate-slider estimate-slider--cyan"
      />
    </div>
  );
}
