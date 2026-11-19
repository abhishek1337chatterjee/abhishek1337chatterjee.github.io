import type { CSSProperties } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import type { SanityAbout } from '../../../lib/sanity';
import type { ExploringItem } from '../../../types';
import Reveal from '../../ui/Reveal';
import { COLOR_HEX } from './claims';

// Things being learned now, drawn as open trace spans: a start, no end, dashes still moving.
// Dashed + amber is this site's "in flight, not finished" language (see the journey's ongoing tail).
export default function ExploringStrip({ about }: { about: SanityAbout }) {
  const reduce = useReducedMotion();
  const items = about.currentlyExploring ?? [];
  // highlights are left out on purpose: they repeat the hero and the About meta line
  const interests = about.interests ?? [];
  if (!items.length && !interests.length) return null;
  // one shared category tells the visitor nothing; show it only when items differ
  const showCategory = new Set(items.map((i) => i.category)).size > 1;
  const cols = { '--n': Math.min(items.length, 3) } as CSSProperties;

  return (
    <Reveal delay={0.05} className="mt-14">
      {items.length > 0 && (
        <>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Currently learning
            </h3>
            <p className="font-mono text-xs text-balance text-muted sm:text-sm">
              <span className="text-[color:var(--secondary)]">
                {items.length} open {items.length === 1 ? 'span' : 'spans'}
              </span>{' '}
              · learning by building, not yet core skills
            </p>
          </div>
          <ul
            className="mt-5 grid border-b border-dashed border-[color:var(--secondary)]/40 bg-[color:var(--secondary)]/[0.035] md:grid-cols-[repeat(var(--n),minmax(0,1fr))] md:divide-x md:divide-dashed md:divide-[color:var(--secondary)]/25"
            style={cols}
          >
            {items.map((item) => (
              <Exploring key={item.name} item={item} reduce={reduce} showCategory={showCategory} />
            ))}
          </ul>
        </>
      )}
      {interests.length > 0 && (
        <p className="mt-4 text-sm leading-relaxed text-balance">
          <span className="mr-2 font-mono text-xs text-muted">interests</span>
          <span className="text-ink/75">{interests.join(' · ')}</span>
        </p>
      )}
    </Reveal>
  );
}

function Exploring({
  item,
  reduce,
  showCategory,
}: {
  item: ExploringItem;
  reduce: boolean;
  showCategory: boolean;
}) {
  const color = COLOR_HEX[item.color] ?? '#34e5ff';
  return (
    <li className="relative px-4 pt-6 pb-5 sm:px-6">
      {/* the open span is the column's top edge: a start mark and no end, so it never
          claims how far along the learning is */}
      <div aria-hidden className="absolute inset-x-0 top-0 flex h-3 -translate-y-1/2 items-center">
        <span className="h-3 w-0.5" style={{ background: color }} />
        <span
          className="h-0.5 flex-1"
          style={{
            backgroundImage: `linear-gradient(90deg, ${color} 0 6px, transparent 6px)`,
            backgroundSize: '12px 100%',
            maskImage: 'linear-gradient(90deg, #000 30%, transparent 92%)',
            animation: reduce ? undefined : 'spanOpen 1.4s linear infinite',
          }}
        />
      </div>

      <p className="flex items-baseline gap-3">
        <span className="min-w-0 font-display text-lg font-semibold text-ink">{item.name}</span>
        {showCategory && (
          <span className="ml-auto flex-none font-mono text-[11px] text-muted">
            {item.category}
          </span>
        )}
      </p>

      {item.description && (
        <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{item.description}</p>
      )}
    </li>
  );
}
