import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import type { SanitySkill } from '../../../lib/sanity';
import { GRAPH_EDGES, GRAPH_NODES, type NodeRole, PACKET_LOOP_S } from './graphLayout';

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
  cx: number;
  cy: number;
}

interface Drawn {
  key: string;
  d: string;
  delay: number;
  label?: { text: string; x: number; y: number; beside: boolean };
}

// Shortest gap that still fits a label above a horizontal edge.
const MIN_LABEL_GAP = 52;

// Orthogonal route between two measured nodes: rightward if the target sits to the right,
// else downward. Returns the SVG path plus where its label reads best.
function route(a: Box, b: Box) {
  if (b.left >= a.right - 1) {
    const sx = a.right;
    const tx = b.left;
    if (Math.abs(a.cy - b.cy) < 2) {
      const fits = tx - sx >= MIN_LABEL_GAP;
      return { d: `M${sx},${a.cy}H${tx}`, lx: (sx + tx) / 2, ly: a.cy - 5, beside: false, fits };
    }
    const mx = Math.round((sx + tx) / 2);
    const d = `M${sx},${a.cy}H${mx}V${b.cy}H${tx}`;
    return { d, lx: mx + 8, ly: (a.cy + b.cy) / 2, beside: true, fits: true };
  }
  const sx = a.cx;
  if (sx >= b.left + 12 && sx <= b.right - 12) {
    const d = `M${sx},${a.bottom}V${b.top}`;
    return { d, lx: sx + 8, ly: (a.bottom + b.top) / 2, beside: true, fits: true };
  }
  const my = Math.round((a.bottom + b.top) / 2);
  const d = `M${sx},${a.bottom}V${my}H${b.cx}V${b.top}`;
  return { d, lx: sx + 8, ly: (a.bottom + my) / 2, beside: true, fits: true };
}

const ROLE_BOX: Record<NodeRole, string> = {
  service: 'border-line bg-base-100',
  hub: 'border-2 border-[color:var(--primary)] bg-[#0e1a14] py-3 font-medium lg:text-base',
  bus: 'border-[color:var(--primary)]/60 bg-base-100',
  agent: 'border-[color:var(--secondary)]/70 bg-[#1a1205]',
  tool: 'border-dashed border-[#3a3f48] text-ink/75',
};

function badgeStyle(role: NodeRole, color: string): CSSProperties {
  if (role === 'hub')
    return { background: 'var(--primary)', color: 'var(--color-primary-content)' };
  if (role === 'agent')
    return { background: 'var(--secondary)', color: 'var(--color-secondary-content)' };
  // CMS brand colour as a tint behind light text keeps the badge readable on any hue.
  return { background: `color-mix(in oklab, ${color} 28%, var(--color-base-300))` };
}

function NodeLabel({ skill, kind }: { skill: SanitySkill; kind: NodeRole }) {
  return (
    <>
      <span
        aria-hidden
        className="shrink-0 rounded px-1.5 py-1 font-mono text-[11px] leading-none text-ink"
        style={badgeStyle(kind, skill.color || '#f5a623')}
      >
        {skill.shortName || skill.name.slice(0, 2).toUpperCase()}
      </span>
      <span className="min-w-0 leading-tight">{skill.name}</span>
    </>
  );
}

export default function ServiceGraph({ services }: { services: SanitySkill[] }) {
  const reduce = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef(new Map<string, HTMLLIElement>());
  const [edges, setEdges] = useState<Drawn[]>([]);

  const byName = new Map(services.map((s) => [s.name, s]));
  const placed = GRAPH_NODES.filter((n) => byName.has(n.name));
  const unplaced = services.filter((s) => !GRAPH_NODES.some((n) => n.name === s.name));
  const placedKey = placed.map((n) => n.name).join('|');

  // Edges follow the real node boxes, so they stay attached at every width and font load.
  // biome-ignore lint/correctness/useExhaustiveDependencies: placedKey is the node set the refs track
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => {
      const base = host.getBoundingClientRect();
      const box = (name: string): Box | null => {
        const el = nodeEls.current.get(name);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const left = Math.round(r.left - base.left);
        const top = Math.round(r.top - base.top);
        const right = left + Math.round(r.width);
        const bottom = top + Math.round(r.height);
        return {
          left,
          top,
          right,
          bottom,
          cx: Math.round((left + right) / 2),
          cy: Math.round((top + bottom) / 2),
        };
      };
      const next: Drawn[] = [];
      for (const e of GRAPH_EDGES) {
        const a = box(e.from);
        const b = box(e.to);
        if (!a || !b) continue;
        const r = route(a, b);
        next.push({
          key: `${e.from}>${e.to}`,
          d: r.d,
          delay: e.delay,
          label:
            e.label && r.fits ? { text: e.label, x: r.lx, y: r.ly, beside: r.beside } : undefined,
        });
      }
      setEdges(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    for (const el of nodeEls.current.values()) ro.observe(el);
    return () => ro.disconnect();
  }, [placedKey]);

  return (
    <div ref={hostRef} className="relative">
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
        {edges.map((e) => (
          <path
            key={e.key}
            d={e.d}
            fill="none"
            stroke="var(--primary)"
            strokeOpacity={0.5}
            strokeWidth={1.5}
          />
        ))}
      </svg>
      {edges.map(
        (e) =>
          e.label && (
            <span
              key={`l-${e.key}`}
              aria-hidden
              className="pointer-events-none absolute font-mono text-[11px] whitespace-nowrap text-muted"
              style={{
                left: e.label.x,
                top: e.label.y,
                transform: e.label.beside ? 'translateY(-50%)' : 'translate(-50%, -100%)',
              }}
            >
              {e.label.text}
            </span>
          ),
      )}
      {!reduce &&
        edges.map((e) => (
          <span
            key={`p-${e.key}`}
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 size-2 rounded-full bg-[color:var(--secondary)] opacity-0"
            style={{
              offsetPath: `path('${e.d}')`,
              offsetRotate: '0deg',
              animation: `packetRun ${PACKET_LOOP_S}s linear ${e.delay}s infinite`,
            }}
          />
        ))}

      <ul
        aria-label="Cloud services, wired as an event-driven backend"
        className="relative grid grid-cols-2 items-center gap-x-5 gap-y-9 sm:gap-x-10 lg:grid-cols-[repeat(5,auto)] lg:justify-between lg:gap-x-12 lg:gap-y-8"
      >
        {placed.map((n) => {
          const skill = byName.get(n.name) as SanitySkill;
          const slot = {
            '--c': n.narrow.col,
            '--r': n.narrow.row,
            '--cs': n.narrow.span ?? 1,
            '--lc': n.wide.col,
            '--lr': n.wide.row,
            '--lcs': n.wide.span ?? 1,
          } as CSSProperties;
          return (
            <li
              key={n.name}
              ref={(el) => {
                if (el) nodeEls.current.set(n.name, el);
                else nodeEls.current.delete(n.name);
              }}
              style={slot}
              className={`flex items-center gap-2 rounded-[10px] border px-2.5 py-2.5 text-sm sm:gap-2.5 sm:px-3 text-ink [grid-column:var(--c)/span_var(--cs)] [grid-row:var(--r)] lg:[grid-column:var(--lc)/span_var(--lcs)] lg:[grid-row:var(--lr)] xl:text-[15px] ${ROLE_BOX[n.role]} ${n.role === 'agent' ? 'lg:justify-self-start' : ''}`}
            >
              <NodeLabel skill={skill} kind={n.role} />
            </li>
          );
        })}
      </ul>

      {unplaced.length > 0 && (
        <ul aria-label="More cloud services" className="relative mt-8 flex flex-wrap gap-2.5">
          {unplaced.map((s) => (
            <li
              key={s._id}
              className="flex items-center gap-2.5 rounded-[10px] border border-line bg-base-100 px-3 py-2.5 text-sm text-ink"
            >
              <NodeLabel skill={s} kind="service" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
