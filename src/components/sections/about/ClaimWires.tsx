import { type CSSProperties, type RefObject, useLayoutEffect, useState } from 'react';
import { type Claim, HOVER_HEX } from './claims';

interface Wire {
  n: number;
  d: string;
  x: number;
  y: number;
}

// Orthogonal wires from a gutter dot beside each footnoted phrase's line to its row in the
// proof rail. Wires start in the gutter so they never cross the bio text; the dot sits level
// with the phrase's last line box (where a wrapped phrase ends).
export default function ClaimWires({
  host,
  claims,
  active,
  selected,
  phase,
}: {
  host: RefObject<HTMLDivElement | null>;
  claims: Claim[];
  active: number | null; // hovered / focused: teal
  selected: number | null; // last claim clicked: amber, same as the back chip
  phase: 'hidden' | 'play' | 'static';
}) {
  const [wires, setWires] = useState<Wire[]>([]);
  const [gutter, setGutter] = useState<{ x: number; y1: number; y2: number } | null>(null);
  const key = claims.map((c) => c.n).join(',');

  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` is the claim set; `active` opens a peek card that moves rows
  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => {
      const base = el.getBoundingClientRect();
      const bio = el.querySelector('[data-bio]')?.getBoundingClientRect();
      if (!bio) return;
      const gx = Math.round(bio.right - base.left) + 18;
      const next: Wire[] = [];
      for (const c of claims) {
        const phrase = el.querySelector(`[data-claim="${c.n}"]`);
        const row = el.querySelector(`[data-rail="${c.n}"]`);
        const rects = phrase?.getClientRects();
        if (!rects?.length || !row) continue;
        const end = rects[rects.length - 1];
        const r = row.getBoundingClientRect();
        if (r.left <= end.right) continue; // rail stacked under the bio (narrow screens)
        const x = gx;
        const y = Math.round((end.top + end.bottom) / 2 - base.top);
        const rx = Math.round(r.left - base.left) - 6;
        const ry = Math.round(r.top - base.top + 22);
        // each wire gets its own lane in the gutter so verticals never overlap
        const lane = Math.round(rx - 40 + c.n * 7);
        next.push({ n: c.n, x, y, d: `M${x},${y}H${lane}V${ry}H${rx}` });
      }
      // Claims on the same text line would start on one point: fan their dots out vertically.
      const placed = next.map((w) => {
        const line = next.filter((o) => Math.abs(o.y - w.y) < 4);
        if (line.length < 2) return w;
        const y = w.y + (line.indexOf(w) - (line.length - 1) / 2) * 9;
        return { ...w, y, d: w.d.replace(/^M(-?\d+),(-?\d+)/, `M${w.x},${y}`) };
      });
      setWires(placed);
      setGutter(
        placed.length
          ? { x: gx, y1: Math.round(bio.top - base.top), y2: Math.round(bio.bottom - base.top) }
          : null,
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [host, key, active]);

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block"
    >
      {gutter && (
        <line
          x1={gutter.x}
          x2={gutter.x}
          y1={gutter.y1}
          y2={gutter.y2}
          stroke="var(--color-line, #262a33)"
        />
      )}
      {wires.map((w, i) => {
        const sel = selected === w.n;
        const on = sel || active === w.n;
        const color = sel ? 'var(--secondary)' : on ? HOVER_HEX : 'var(--primary-deep)';
        const draw = (
          phase === 'static'
            ? {}
            : {
                '--len': 1,
                strokeDasharray: 1,
                strokeDashoffset: 1,
                animation:
                  phase === 'play'
                    ? `traceDraw 0.7s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.15}s forwards`
                    : undefined,
              }
        ) as CSSProperties;
        return (
          <g key={w.n}>
            <path
              d={w.d}
              pathLength={1}
              fill="none"
              stroke={color}
              strokeOpacity={on ? 1 : 0.55}
              strokeWidth={on ? 1.5 : 1}
              style={{ ...draw, transition: 'stroke 0.2s, stroke-opacity 0.2s' }}
            />
            <circle cx={w.x} cy={w.y} r={3} fill={color} />
          </g>
        );
      })}
    </svg>
  );
}
