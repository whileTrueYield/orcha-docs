/**
 * The Why Tree
 *
 * The interactive centerpiece of "You Don't Build Software, You Discover It".
 * A felt pain ("I can't predict release dates") decomposes, one "why" at a
 * time, into a tree of smaller, more concrete causes.
 *
 * Visual: a mono-spaced "terminal" window. On scroll into view, the root
 * prompt scrambles in (matching the hero animation on the index page). The
 * three causes then scramble in below, each ending with a soft `ask` token.
 * Clicking `ask` scrambles in the leaves under that cause. Once every cause
 * has been unfolded, a summary line scrambles in: "1 problem became N".
 *
 * Tree characters (├── │ └──) are purely structural and never scramble —
 * only labels and prompts do.
 *
 * Exports: WhyTree (default React component, no props)
 */
import { useState, useCallback, useRef, useEffect } from "react";

interface Branch {
  id: string;
  label: string;
  leaves: string[];
}

const ROOT_LABEL = "I can't predict release dates";

const BRANCHES: Branch[] = [
  {
    id: "estimates",
    label: "estimates are unreliable",
    leaves: [
      "specs go unread",
      "optimist vs pessimist",
      "discovery, and dragons",
    ],
  },
  {
    id: "logging",
    label: "people forget to log time",
    leaves: ["logging is painful", "nothing reminds them"],
  },
  {
    id: "otherwork",
    label: "other projects get in the way",
    leaves: [
      "projects tracked separately",
      "priorities change",
      "everything is high priority",
    ],
  },
];

const TOTAL_LEAVES = BRANCHES.reduce((n, b) => n + b.leaves.length, 0);

// Mirror the hero scramble (src/pages/index.astro) so both reveals feel
// like the same machine talking.
const SCRAMBLE_CHARS = "0123456789∑∫∂πσμ±√∞≈≠";
const RESOLVE_STAGGER = 38;
const CYCLES_PER_CHAR = 9;
const CYCLE_INTERVAL = 40;

function randomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * ScrambleText
 *
 * Animates `text` from a stream of random math symbols into the final
 * characters, left-to-right. Spaces are kept as plain text nodes so word
 * breaks survive. Calls `onDone` once every character has resolved.
 *
 * Uses imperative DOM mutation instead of state for the per-frame cycle —
 * cheaper and matches the hero implementation 1:1.
 */
function ScrambleText({
  text,
  startDelay = 0,
  onDone,
}: {
  text: string;
  startDelay?: number;
  onDone?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = "";

    if (prefersReducedMotion()) {
      el.textContent = text;
      onDoneRef.current?.();
      return;
    }

    const finals: string[] = [];
    const charSpans: HTMLSpanElement[] = [];

    for (const ch of text) {
      if (ch === " ") {
        el.appendChild(document.createTextNode(" "));
        continue;
      }
      const s = document.createElement("span");
      s.className = "why-char scrambling";
      s.textContent = randomChar();
      el.appendChild(s);
      charSpans.push(s);
      finals.push(ch);
    }

    const intervals: number[] = [];
    const timeouts: number[] = [];
    let resolved = 0;

    charSpans.forEach((s, i) => {
      const resolveAt = startDelay + i * RESOLVE_STAGGER;

      const intv = window.setInterval(() => {
        s.textContent = randomChar();
      }, CYCLE_INTERVAL);
      intervals.push(intv);

      const to = window.setTimeout(
        () => {
          window.clearInterval(intv);
          s.textContent = finals[i];
          s.className = "why-char resolved";
          resolved++;
          if (resolved === charSpans.length) onDoneRef.current?.();
        },
        resolveAt + CYCLES_PER_CHAR * CYCLE_INTERVAL,
      );
      timeouts.push(to);
    });

    return () => {
      intervals.forEach(window.clearInterval);
      timeouts.forEach(window.clearTimeout);
    };
    // text and startDelay are stable per remount via the parent's `key`,
    // so this effect runs exactly once per scramble cycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span ref={ref} aria-label={text} />;
}

export function WhyTree() {
  const [started, setStarted] = useState(false);
  const [rootDone, setRootDone] = useState(false);
  const [rootAsked, setRootAsked] = useState(false);
  // branchCount = how many branch rows are currently mounted (revealed
  // sequentially: 0 → 1 → 2 → 3). branchesDone flips when the last one's
  // scramble settles.
  const [branchCount, setBranchCount] = useState(0);
  const [branchesDone, setBranchesDone] = useState(false);
  // opened = branches the user has clicked `ask why?` on. leafCount tracks
  // per-branch leaf reveal progress (same idea, one row at a time).
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const [leafCount, setLeafCount] = useState<Record<string, number>>({});
  const [fullyOpened, setFullyOpened] = useState<Set<string>>(new Set());
  const [summaryDone, setSummaryDone] = useState(false);
  const [session, setSession] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // First scroll-into-view triggers the whole reveal.
  useEffect(() => {
    if (started) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  const askRoot = useCallback(() => {
    setRootAsked(true);
    setBranchCount(1);
  }, []);

  const askBranch = useCallback((id: string) => {
    setOpened((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setLeafCount((prev) => ({ ...prev, [id]: 1 }));
  }, []);

  const replay = useCallback(() => {
    setRootDone(false);
    setRootAsked(false);
    setBranchCount(0);
    setBranchesDone(false);
    setOpened(new Set());
    setLeafCount({});
    setFullyOpened(new Set());
    setSummaryDone(false);
    setSession((n) => n + 1);
  }, []);

  const allFullyOpened = fullyOpened.size === BRANCHES.length;

  return (
    <div className="why-wrap" ref={containerRef}>
      <style>{`
        .why-wrap {
          max-width: 640px;
          width: 100%;
          margin: 2.5rem auto;
        }
        .why-terminal {
          position: relative;
          border-radius: 12px;
          background:
            radial-gradient(ellipse 70% 40% at 20% 0%, color-mix(in srgb, var(--brand) 7%, transparent), transparent 70%),
            linear-gradient(180deg, #0d0f14, #0a0b0f);
          border: 1px solid color-mix(in srgb, var(--brand) 18%, var(--gray-700));
          box-shadow:
            inset 0 1px 0 0 color-mix(in srgb, var(--brand) 14%, transparent),
            0 1px 0 0 rgba(0, 0, 0, 0.5),
            0 28px 60px -32px color-mix(in srgb, var(--brand) 28%, transparent),
            0 14px 32px -20px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }
        .why-titlebar {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 14px;
          background: linear-gradient(180deg, #15171c, #101218);
          border-bottom: 1px solid var(--gray-700);
        }
        .why-dot {
          width: 11px;
          height: 11px;
          border-radius: 999px;
          display: inline-block;
          box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.25);
        }
        .why-dot--red { background: #ff5f57; }
        .why-dot--yellow { background: #febc2e; }
        .why-dot--green { background: #28c840; }
        .why-titlebar-path {
          margin-left: 10px;
          font-family: 'JetBrains Mono', ui-monospace, 'Cascadia Code', 'Fira Code', Menlo, monospace;
          font-size: 0.72rem;
          color: var(--gray-400);
          letter-spacing: 0.02em;
        }
        .why-body {
          padding: 22px 24px 24px;
          font-family: 'JetBrains Mono', ui-monospace, 'Cascadia Code', 'Fira Code', Menlo, monospace;
          font-size: 0.86rem;
          line-height: 1.85;
          color: var(--gray-200);
          overflow-x: auto;
        }
        .why-row {
          display: flex;
          align-items: baseline;
          white-space: pre;
          min-width: max-content;
          animation: whyRowIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes whyRowIn {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .why-spacer { height: 0.55em; }
        .why-tree {
          color: color-mix(in srgb, var(--brand) 50%, var(--gray-400));
          user-select: none;
          flex-shrink: 0;
        }
        .why-prompt {
          color: var(--brand);
          margin-right: 0.7em;
          user-select: none;
          flex-shrink: 0;
        }
        .why-label {
          color: var(--white);
          font-weight: 500;
        }
        .why-leaf .why-label {
          color: var(--gray-300);
          font-weight: 400;
        }
        .why-char {
          display: inline-block;
          min-width: 0.55em;
        }
        .why-char.scrambling {
          color: var(--brand);
          opacity: 0.7;
        }
        .why-char.resolved {
          transition: color 0.3s, opacity 0.3s;
          opacity: 1;
        }
        .why-ask {
          margin-left: 1.4em;
          padding: 0;
          color: var(--gray-400);
          background: transparent;
          border: none;
          cursor: pointer;
          font: inherit;
          letter-spacing: 0.02em;
          transition: color 0.15s, opacity 0.2s;
          animation: whyAskIn 0.45s ease both;
        }
        .why-ask::before {
          content: '· ';
          opacity: 0.55;
          margin-right: 0.15em;
        }
        .why-ask:hover { color: var(--brand); }
        .why-ask:focus-visible {
          outline: 1px dashed color-mix(in srgb, var(--brand) 60%, transparent);
          outline-offset: 3px;
          border-radius: 2px;
        }
        @keyframes whyAskIn {
          from { opacity: 0; transform: translateY(-1px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .why-cursor {
          display: inline-block;
          width: 0.55em;
          height: 1em;
          background: var(--brand);
          vertical-align: -0.12em;
          animation: whyCursorBlink 1.1s steps(2) infinite;
        }
        @keyframes whyCursorBlink {
          50% { opacity: 0; }
        }
        .why-summary {
          color: var(--brand);
          font-weight: 600;
        }
        .why-replay {
          margin-top: 0.4em;
          margin-left: 0;
          padding: 0;
          color: var(--gray-400);
          background: transparent;
          border: none;
          cursor: pointer;
          font: inherit;
          letter-spacing: 0.02em;
          transition: color 0.15s;
          animation: whyAskIn 0.4s ease both;
        }
        .why-replay::before {
          content: '↻ ';
          opacity: 0.75;
          margin-right: 0.15em;
        }
        .why-replay:hover { color: var(--white); }
        .why-replay:focus-visible {
          outline: 1px dashed color-mix(in srgb, var(--brand) 60%, transparent);
          outline-offset: 3px;
          border-radius: 2px;
        }

        @media (max-width: 520px) {
          .why-body { font-size: 0.78rem; padding: 18px 18px 20px; }
          .why-titlebar { padding: 9px 12px; }
        }
      `}</style>

      <div className="why-terminal">
        <div className="why-titlebar" aria-hidden="true">
          <span className="why-dot why-dot--red" />
          <span className="why-dot why-dot--yellow" />
          <span className="why-dot why-dot--green" />
          <span className="why-titlebar-path">~ / why</span>
        </div>

        <div className="why-body">
          {/* Prompt: the felt pain */}
          <div className="why-row">
            <span className="why-prompt">$</span>
            <span className="why-label">
              {started ? (
                <ScrambleText
                  key={`root-${session}`}
                  text={`why "${ROOT_LABEL}"`}
                  onDone={() => setRootDone(true)}
                />
              ) : (
                <span className="why-cursor" aria-hidden="true" />
              )}
            </span>
            {rootDone && !rootAsked && (
              <button
                className="why-ask"
                onClick={askRoot}
                aria-label="Ask why"
              >
                ask why?
              </button>
            )}
          </div>

          {rootAsked && (
            <>
              <div className="why-spacer" />
              {BRANCHES.slice(0, branchCount).map((b, bi) => {
                const isLastBranch = bi === BRANCHES.length - 1;
                const branchTree = isLastBranch ? "└── " : "├── ";
                const leafContinuation = isLastBranch ? "    " : "│   ";
                const isOpened = opened.has(b.id);
                const leavesShown = leafCount[b.id] ?? 0;

                return (
                  <div key={b.id}>
                    <div className="why-row">
                      <span className="why-tree">{branchTree}</span>
                      <span className="why-label">
                        <ScrambleText
                          key={`b-${b.id}-${session}`}
                          text={b.label}
                          onDone={() => {
                            if (bi + 1 < BRANCHES.length) {
                              setBranchCount(bi + 2);
                            } else {
                              setBranchesDone(true);
                            }
                          }}
                        />
                      </span>
                      {branchesDone && !isOpened && (
                        <button
                          className="why-ask"
                          onClick={() => askBranch(b.id)}
                          aria-label={`Ask why: ${b.label}`}
                        >
                          ask why?
                        </button>
                      )}
                    </div>

                    {b.leaves.slice(0, leavesShown).map((leaf, li) => {
                      const isLastLeaf = li === b.leaves.length - 1;
                      const leafTree = isLastLeaf ? "└── " : "├── ";
                      return (
                        <div className="why-row why-leaf" key={li}>
                          <span className="why-tree">
                            {leafContinuation}
                            {leafTree}
                          </span>
                          <span className="why-label">
                            <ScrambleText
                              key={`l-${b.id}-${li}-${session}`}
                              text={leaf}
                              onDone={() => {
                                if (li + 1 < b.leaves.length) {
                                  setLeafCount((prev) => ({
                                    ...prev,
                                    [b.id]: li + 2,
                                  }));
                                } else {
                                  setFullyOpened((prev) => {
                                    const next = new Set(prev);
                                    next.add(b.id);
                                    return next;
                                  });
                                }
                              }}
                            />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}

          {allFullyOpened && (
            <>
              <div className="why-spacer" />
              <div className="why-row why-summary">
                <span className="why-prompt">→</span>
                <span className="why-label">
                  <ScrambleText
                    key={`sum-${session}`}
                    text={`1 problem became ${TOTAL_LEAVES} addresseable causes`}
                    startDelay={200}
                    onDone={() => setSummaryDone(true)}
                  />
                </span>
              </div>
              {summaryDone && (
                <button className="why-replay" onClick={replay}>
                  replay
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
