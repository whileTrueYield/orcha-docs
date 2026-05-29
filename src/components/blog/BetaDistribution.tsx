/**
 * Act 3, "Your three points already are a beta"
 *
 * Three sliders feeding a proper beta distribution (PERT-Beta method).
 * Shows the PDF curve and shaded area for P(finish <= most-likely).
 * The hero is the probability callout: even with the best possible
 * task-vacuum inputs, the "most likely" estimate rarely beats a coin flip.
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

  // P(finish <= most likely)
  const targetStd = range > 0 ? (mostLikely - optimistic) / range : 0.5;
  const probTarget = range > 0 ? betaCDF(targetStd, alpha, beta) : 0.5;

  // Mean line position
  const muStdNorm = range > 0 ? (muStd - optimistic) / range : 0.5;
  const meanX = CHART.left + muStdNorm * (CHART.right - CHART.left);
  const meanPDF = range > 0 ? betaPDF(muStdNorm, alpha, beta) : 0;
  const meanY = maxPDF > 0 ? CHART.bottom - (meanPDF / maxPDF) * (CHART.bottom - CHART.top) : CHART.top;

  // Shade clip: area from optimistic to most-likely
  const shadeWidth = targetStd * (CHART.right - CHART.left);

  // Ticks aligned with the beta curve's x-range [optimistic, pessimistic]
  const ticks: { x: number; label: string }[] = [];
  const placed: number[] = [];
  for (const { v, label } of [
    { v: optimistic, label: `${optimistic}d` },
    { v: mostLikely, label: `${mostLikely}d` },
    { v: pessimistic, label: `${pessimistic}d` },
  ]) {
    const x = range > 0
      ? CHART.left + ((v - optimistic) / range) * (CHART.right - CHART.left)
      : CHART.left;
    if (!placed.some((px) => Math.abs(px - x) < 25)) {
      placed.push(x);
      ticks.push({ x, label });
    }
  }

  return (
    <div style={{ maxWidth: 640, width: "100%", margin: "2rem auto" }}>
      <h3 style={{ color: "var(--white)", fontSize: "1.1rem", fontWeight: 600, marginBottom: 4 }}>
        Your three points already are a beta
      </h3>
      <p style={{ color: "var(--gray-400)", fontSize: "0.85rem", marginBottom: 28 }}>
        Drag the sliders. PERT is doing this math whether you draw the curve or not. Notice how unlikely your "most likely" actually is.
      </p>

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <SliderInput label="Optimistic" value={optimistic} onChange={handleOpt} />
        <SliderInput label="Most Likely" value={mostLikely} onChange={handleML} />
        <SliderInput label="Pessimistic" value={pessimistic} onChange={handlePess} />
      </div>

      <div style={{ background: "var(--gray-900)", border: "1px solid var(--gray-700)", borderRadius: 8, padding: "20px 20px 12px" }}>
        <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} style={{ width: "100%", height: 240, display: "block" }}>
          <defs>
            <linearGradient id="betaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c4dff" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#7c4dff" stopOpacity={0.03} />
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

          {/* Beta shaded area (<= most likely) */}
          {fillD && <path d={fillD} fill="#7c4dff" opacity={0.15} clipPath="url(#shadeClip)" />}

          {/* Beta curve */}
          {fillD && (
            <>
              <path d={fillD} fill="url(#betaGrad)" />
              <path d={pathD} fill="none" stroke="#7c4dff" strokeWidth={2.5} strokeLinejoin="round" />
            </>
          )}

          {/* Mean line */}
          <line x1={meanX} y1={meanY} x2={meanX} y2={CHART.bottom} stroke="#7c4dff" strokeWidth={1} strokeDasharray="4,3" opacity={0.6} />

          {/* Ticks */}
          {ticks.map(({ x, label }) => (
            <g key={label}>
              <line x1={x} y1={CHART.bottom} x2={x} y2={CHART.bottom + 5} stroke="var(--gray-400)" strokeWidth={1} />
              <text x={x} y={CHART.bottom + 16} fill="var(--gray-400)" fontSize={10} textAnchor="middle" fontFamily="Inter,sans-serif">{label}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Hero callout: P(finish <= most likely) */}
      <div
        style={{
          textAlign: "center",
          marginTop: 20,
          padding: "22px 16px",
          background: "rgba(124, 77, 255, 0.08)",
          border: "1px solid rgba(124, 77, 255, 0.25)",
          borderRadius: 8,
        }}
      >
        <div style={{ color: "#7c4dff", fontSize: "2.75rem", fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>
          {Math.round(probTarget * 100)}%
        </div>
        <div style={{ color: "var(--gray-300)", fontSize: "0.9rem", lineHeight: 1.4 }}>
          probability the work finishes within your{" "}
          <strong style={{ color: "var(--white)" }}>{mostLikely}-day</strong> "most likely" estimate
        </div>
      </div>

      {/* Secondary stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 14, fontSize: "0.75rem", color: "var(--gray-500)" }}>
        <span>mean <span style={{ color: "var(--gray-300)" }}>{betaMean.toFixed(1)}d</span></span>
        <span>median <span style={{ color: "var(--gray-300)" }}>{betaMedian.toFixed(1)}d</span></span>
        <span>80% by <span style={{ color: "var(--gray-300)" }}>{p80.toFixed(1)}d</span></span>
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
