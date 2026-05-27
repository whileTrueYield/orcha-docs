/**
 * Act 3 — "The Real Shape"
 *
 * Three sliders feeding a proper beta distribution (PERT-Beta method).
 * Shows the PDF curve, shaded area for P(finish ≤ most-likely), and
 * key stats (mean, median, 80th percentile). An optional triangular
 * overlay lets the reader compare the naive model side by side.
 *
 * Exports: BetaDistribution (default React component, no props)
 */
import { useState, useCallback, useMemo } from "react";
import { betaPDF, betaCDF, betaQuantile, pertBetaParams } from "../../lib/beta-math";

const CHART = { left: 40, right: 580, top: 20, bottom: 185, width: 600, height: 230 } as const;
const PDF_STEPS = 200;

export function BetaDistribution() {
  const [optimistic, setOptimistic] = useState(3);
  const [mostLikely, setMostLikely] = useState(7);
  const [pessimistic, setPessimistic] = useState(14);
  const [showBeta, setShowBeta] = useState(true);
  const [showTri, setShowTri] = useState(false);

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

  const range = pessimistic - optimistic;
  const { alpha, beta } = pertBetaParams(optimistic, mostLikely, pessimistic);

  // Compute PDF curve points and find max for y-scaling
  const { pathD, fillD, maxPDF } = useMemo(() => {
    if (range <= 0) return { pathD: "", fillD: "", maxPDF: 1 };
    let max = 0;
    const pts: { t: number; pdf: number }[] = [];
    for (let i = 0; i <= PDF_STEPS; i++) {
      const t = i / PDF_STEPS;
      const pdf = betaPDF(t, alpha, beta);
      if (pdf > max) max = pdf;
      pts.push({ t, pdf });
    }

    let path = "";
    let fill = `M ${CHART.left},${CHART.bottom} `;
    for (let i = 0; i < pts.length; i++) {
      const x = CHART.left + pts[i].t * (CHART.right - CHART.left);
      const y = CHART.bottom - (pts[i].pdf / max) * (CHART.bottom - CHART.top);
      const cmd = i === 0 ? "M" : " L";
      path += `${cmd} ${x},${y}`;
      fill += `L ${x},${y} `;
    }
    fill += `L ${CHART.right},${CHART.bottom} Z`;
    return { pathD: path, fillD: fill, maxPDF: max };
  }, [alpha, beta, range]);

  // Stats
  const muStd = range > 0 ? (optimistic + 4 * mostLikely + pessimistic) / 6 : optimistic;
  const betaMean = range > 0 ? muStd : optimistic;
  const betaMedian = range > 0 ? optimistic + betaQuantile(0.5, alpha, beta) * range : optimistic;
  const p80 = range > 0 ? optimistic + betaQuantile(0.8, alpha, beta) * range : optimistic;

  // P(finish ≤ most likely)
  const targetStd = range > 0 ? (mostLikely - optimistic) / range : 0.5;
  const probTarget = range > 0 ? betaCDF(targetStd, alpha, beta) : 0.5;

  // Mean line position
  const muStdNorm = range > 0 ? (muStd - optimistic) / range : 0.5;
  const meanX = CHART.left + muStdNorm * (CHART.right - CHART.left);
  const meanPDF = range > 0 ? betaPDF(muStdNorm, alpha, beta) : 0;
  const meanY = maxPDF > 0 ? CHART.bottom - (meanPDF / maxPDF) * (CHART.bottom - CHART.top) : CHART.top;

  // Shade clip: area from 0 to most-likely
  const shadeWidth = targetStd * (CHART.right - CHART.left);

  // Triangle overlay
  const rangeMin = Math.max(0, optimistic - 1);
  const rangeMax = pessimistic + 1;
  const triXO = CHART.left + ((optimistic - rangeMin) / (rangeMax - rangeMin)) * (CHART.right - CHART.left);
  const triXM = CHART.left + ((mostLikely - rangeMin) / (rangeMax - rangeMin)) * (CHART.right - CHART.left);
  const triXP = CHART.left + ((pessimistic - rangeMin) / (rangeMax - rangeMin)) * (CHART.right - CHART.left);
  const triPoints = `${triXO},${CHART.bottom} ${triXM},${CHART.top} ${triXP},${CHART.bottom}`;

  // Ticks
  const ticks: { x: number; label: string }[] = [];
  const placed: number[] = [];
  for (const { v, label } of [
    { v: optimistic, label: `${optimistic}d` },
    { v: mostLikely, label: `${mostLikely}d` },
    { v: pessimistic, label: `${pessimistic}d` },
  ]) {
    const x = CHART.left + ((v - rangeMin) / (rangeMax - rangeMin)) * (CHART.right - CHART.left);
    if (!placed.some((px) => Math.abs(px - x) < 25)) {
      placed.push(x);
      ticks.push({ x, label });
    }
  }

  return (
    <div style={{ maxWidth: 640, width: "100%", margin: "2rem auto" }}>
      <h3 style={{ color: "var(--white)", fontSize: "1.1rem", fontWeight: 600, marginBottom: 4 }}>
        The real shape of uncertainty
      </h3>
      <p style={{ color: "var(--gray-400)", fontSize: "0.85rem", marginBottom: 28 }}>
        Same three inputs — but now modeled as a beta distribution. The curve captures what the triangle hides.
      </p>

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <SliderInput label="Optimistic" value={optimistic} onChange={handleOpt} />
        <SliderInput label="Most Likely" value={mostLikely} onChange={handleML} />
        <SliderInput label="Pessimistic" value={pessimistic} onChange={handlePess} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, fontSize: "0.8rem", color: "var(--gray-400)" }}>
        Show:
        <ToggleButton label="Beta distribution" active={showBeta} onClick={() => setShowBeta(!showBeta)} color="#7c4dff" />
        <ToggleButton label="Triangular overlay" active={showTri} onClick={() => setShowTri(!showTri)} color="var(--brand)" />
      </div>

      <div style={{ background: "var(--gray-900)", border: "1px solid var(--gray-700)", borderRadius: 8, padding: "20px 20px 12px" }}>
        <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} style={{ width: "100%", height: 240, display: "block" }}>
          <defs>
            <linearGradient id="betaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c4dff" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#7c4dff" stopOpacity={0.03} />
            </linearGradient>
            <linearGradient id="triGhostGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.12} />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.02} />
            </linearGradient>
            <clipPath id="shadeClip">
              <rect x={CHART.left} y={0} width={shadeWidth} height={CHART.height} />
            </clipPath>
          </defs>

          {/* Grid */}
          <line x1={CHART.left} y1={40} x2={CHART.right} y2={40} stroke="var(--gray-700)" strokeWidth={0.5} strokeDasharray="2,4" />
          <line x1={CHART.left} y1={90} x2={CHART.right} y2={90} stroke="var(--gray-700)" strokeWidth={0.5} strokeDasharray="2,4" />
          <line x1={CHART.left} y1={140} x2={CHART.right} y2={140} stroke="var(--gray-700)" strokeWidth={0.5} strokeDasharray="2,4" />
          {/* Axes */}
          <line x1={CHART.left} y1={CHART.bottom} x2={CHART.right} y2={CHART.bottom} stroke="var(--gray-700)" strokeWidth={1} />
          <line x1={CHART.left} y1={10} x2={CHART.left} y2={CHART.bottom} stroke="var(--gray-700)" strokeWidth={1} />
          <text x={12} y={100} fill="var(--gray-400)" fontSize={9} textAnchor="middle" transform="rotate(-90,12,100)" fontFamily="Inter,sans-serif">probability density</text>

          {/* Triangle ghost (optional) */}
          {showTri && (
            <>
              <polygon points={triPoints} fill="url(#triGhostGrad)" />
              <polygon points={triPoints} fill="none" stroke="var(--brand)" strokeWidth={1.5} strokeDasharray="6,4" opacity={0.4} />
            </>
          )}

          {/* Beta shaded area */}
          {showBeta && fillD && <path d={fillD} fill="#7c4dff" opacity={0.15} clipPath="url(#shadeClip)" />}

          {/* Beta curve */}
          {showBeta && fillD && (
            <>
              <path d={fillD} fill="url(#betaGrad)" />
              <path d={pathD} fill="none" stroke="#7c4dff" strokeWidth={2.5} strokeLinejoin="round" />
            </>
          )}

          {/* Mean line */}
          {showBeta && <line x1={meanX} y1={meanY} x2={meanX} y2={CHART.bottom} stroke="#7c4dff" strokeWidth={1} strokeDasharray="4,3" opacity={0.6} />}

          {/* Ticks */}
          {ticks.map(({ x, label }) => (
            <g key={label}>
              <line x1={x} y1={CHART.bottom} x2={x} y2={CHART.bottom + 5} stroke="var(--gray-400)" strokeWidth={1} />
              <text x={x} y={CHART.bottom + 16} fill="var(--gray-400)" fontSize={10} textAnchor="middle" fontFamily="Inter,sans-serif">{label}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12, fontSize: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 16, height: 3, background: "#7c4dff", borderRadius: 1 }} />
          <span style={{ color: "var(--gray-300)" }}>Beta distribution</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: showTri ? 1 : 0.4 }}>
          <div style={{ width: 16, height: 3, background: "var(--brand)", opacity: 0.5, borderRadius: 1 }} />
          <span style={{ color: "var(--gray-400)" }}>Triangular (naive)</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 16, fontSize: "0.8rem", color: "var(--gray-400)" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 2 }}>Beta Mean</span>
          <span style={{ color: "#7c4dff", fontWeight: 600 }}>{betaMean.toFixed(1)}</span> days
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 2 }}>Beta Median</span>
          <span style={{ color: "#7c4dff", fontWeight: 600 }}>{betaMedian.toFixed(1)}</span> days
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 2 }}>80% Likely By</span>
          <span style={{ color: "#7c4dff", fontWeight: 600 }}>{p80.toFixed(1)}</span> days
        </div>
      </div>

      {/* Probability callout */}
      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          padding: "12px 16px",
          background: "rgba(124, 77, 255, 0.08)",
          border: "1px solid rgba(124, 77, 255, 0.2)",
          borderRadius: 8,
          fontSize: "0.85rem",
          color: "var(--gray-200)",
        }}
      >
        Probability of finishing in <strong>{mostLikely}</strong> days (your "most likely"):{" "}
        <span style={{ color: "#7c4dff", fontWeight: 700, fontSize: "1.1rem" }}>
          {Math.round(probTarget * 100)}%
        </span>
      </div>
    </div>
  );
}

function SliderInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ flex: 1, minWidth: 140 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: "0.7rem", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--white)" }}>{value}d</span>
      </div>
      <input
        type="range"
        min={1}
        max={30}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="estimate-slider estimate-slider--purple"
      />
    </div>
  );
}

function ToggleButton({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: 5,
        border: `1px solid ${active ? color : "var(--gray-700)"}`,
        background: active ? `${color}14` : "transparent",
        color: active ? color : "var(--gray-400)",
        fontSize: "0.75rem",
        fontFamily: "inherit",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}
