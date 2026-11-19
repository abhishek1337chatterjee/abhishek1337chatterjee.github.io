import { ChevronDown, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useCareerPhases, useCaseStudies } from '../../hooks/useSanityData';
import { parsePeriod } from '../../lib/period';
import type { SanityCaseStudy } from '../../lib/sanity';
import { peekPendingStudy, SELECT_STUDY, takePendingStudy } from '../../lib/studyEvents';
import { TAP_44 } from '../ui/tapArea';

// Fired by the "ask the chatbot about this" link; ChatBot listens and prefills.
export function askChatAbout(question: string) {
  window.dispatchEvent(new CustomEvent('tm-ask-chat', { detail: { question } }));
}

const DETAIL_ID = 'svc-detail';
// Highlights draw in one after another, like child spans landing on a trace.
const SPAN_DRAW_S = 0.5;
const SPAN_GAP_S = 0.35;

function DetailPane({ study, animate }: { study: SanityCaseStudy; animate: boolean }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-[color:var(--primary-deep)] bg-base-200 p-5 sm:p-6">
      <p className="flex items-center gap-2 font-mono text-[13px] text-muted">
        <span className="size-2 rounded-full" style={{ background: 'var(--primary)' }} />
        <span>
          svc/<span className="text-ink">{study.slug}</span>
        </span>
      </p>
      <h3 className="mt-2.5 font-display text-2xl leading-tight font-bold tracking-tight text-ink">
        {study.title}
      </h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-ink/75">{study.oneLiner}</p>

      <ol className="mt-5 grid gap-4">
        {study.highlights.map((h, i) => (
          <li key={h}>
            <span
              aria-hidden
              className="block h-1 rounded-full"
              style={{
                background: 'var(--primary)',
                animation: animate
                  ? `wipeIn ${SPAN_DRAW_S}s ease-out ${0.15 + i * SPAN_GAP_S}s both`
                  : undefined,
              }}
            />
            <span className="mt-2 block text-[15px] leading-snug text-ink">{h}</span>
          </li>
        ))}
      </ol>

      <p className="mt-5 font-mono text-xs leading-relaxed text-muted">{study.stack.join(' · ')}</p>
      <button
        type="button"
        onClick={() =>
          askChatAbout(study.chatPrompt ?? `Tell me about the "${study.title}" case study`)
        }
        className={`relative mt-3 mb-5 self-start font-mono text-[13px] text-muted transition-colors hover:text-ink ${TAP_44}`}
      >
        → <span style={{ color: 'var(--primary)' }}>ask the chatbot about this</span>
      </button>

      <p className="mt-auto flex flex-wrap justify-between gap-2 border-t border-line pt-4 font-mono text-xs text-muted">
        <span>{study.timeline}</span>
        <span>{study.role}</span>
      </p>
    </div>
  );
}

function Tile({ study, on, onPick }: { study: SanityCaseStudy; on: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      data-svc-row={study._id}
      aria-pressed={on}
      aria-controls={DETAIL_ID}
      onClick={onPick}
      className={`flex h-full w-full flex-col rounded-xl p-4 text-left transition-colors ${
        on
          ? 'border-2 border-[color:var(--primary)] bg-[#0e1a14]'
          : `border bg-base-200 hover:border-muted ${study.flagship ? 'border-[#3a3f48]' : 'border-line'}`
      } ${study.flagship ? 'min-h-32' : 'min-h-28'}`}
    >
      {study.flagship ? (
        <span className="flex items-center gap-1.5 font-mono text-xs text-[color:var(--secondary)]">
          <Star aria-hidden className="size-3 fill-current" />
          flagship
        </span>
      ) : (
        <span className="font-mono text-xs text-muted">svc/</span>
      )}
      <span
        className={`mt-1.5 font-display leading-tight font-bold tracking-tight text-ink ${study.flagship ? 'text-lg' : 'text-base'}`}
      >
        {study.title}
      </span>
      {study.domainTags && study.domainTags.length > 0 && (
        <span className="mt-auto pt-2 font-mono text-[11px] text-muted">
          {study.domainTags.slice(0, 2).join(' · ')}
        </span>
      )}
    </button>
  );
}

// Phone row: a node on the vertical service line. The full title only shows once opened,
// so every row keeps one height however long the title is.
function LineRow({
  study,
  open,
  onToggle,
}: {
  study: SanityCaseStudy;
  open: boolean;
  onToggle: (row: HTMLButtonElement) => void;
}) {
  return (
    <button
      type="button"
      data-svc-row={study._id}
      aria-expanded={open}
      aria-controls={`svc-line-${study.slug}`}
      onClick={(e) => onToggle(e.currentTarget)}
      className="flex min-h-12 w-full scroll-mt-16 items-center gap-3 text-left font-mono text-sm"
    >
      <span
        aria-hidden
        className={`relative size-3.5 flex-none rounded-full border-2 ${
          open
            ? 'border-[color:var(--primary)] bg-[color:var(--primary)]'
            : 'border-[#3a3f48] bg-base-100'
        }`}
      />
      <span className={`min-w-0 truncate ${open ? 'text-ink' : 'text-ink/75'}`}>{study.slug}</span>
      {study.flagship && (
        <span className="flex flex-none items-center gap-1 text-xs text-[color:var(--secondary)]">
          <Star aria-hidden className="size-3 fill-current" />
          flagship
        </span>
      )}
      <ChevronDown
        aria-hidden
        className={`ml-auto size-4 flex-none text-muted transition-transform ${open ? 'rotate-180' : ''}`}
      />
    </button>
  );
}

// The bus dot travels this long before the picked service's stub fills.
const BUS_MOVE_S = 0.45;

// Centre of grid column `c` (of `n`, 1rem gaps) as a CSS length, so bus marks line up with stubs.
const colCenter = (c: number, n: number) =>
  `calc((100% - ${n - 1}rem) / ${n} * ${c + 0.5} + ${c}rem)`;

// Vertical stub joining a tile to the bus. It fills from the bus toward the tile once the
// bus dot arrives, so the eye follows bus → stub → tile.
function Stub({ on, grow, delay }: { on: boolean; grow: 'up' | 'down'; delay: number }) {
  return (
    <div aria-hidden className="flex h-7 justify-center">
      <span className="relative w-0.5 bg-line">
        <span
          className={`absolute inset-0 bg-[color:var(--primary)] transition-transform duration-300 ease-out ${grow === 'up' ? 'origin-bottom' : 'origin-top'}`}
          style={{
            transform: `scaleY(${on ? 1 : 0})`,
            transitionDelay: on ? `${delay}s` : '0s',
          }}
        />
      </span>
    </div>
  );
}

export default function ServiceMap() {
  const { caseStudies } = useCaseStudies();
  // The header describes the current role, read from the CMS like Journey does
  const { careerPhases } = useCareerPhases();
  const current = careerPhases.find((p) => !p.isEducation && parsePeriod(p.period, 0).ongoing);
  const since = current && Math.floor(parsePeriod(current.period, 0).start);
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Phones can fold the open row away; desktop always shows one study.
  const [lineClosed, setLineClosed] = useState(false);
  // Last hop on the bus, so the trail can run from the old service to the new one.
  const [hop, setHop] = useState<{ from: string; to: string; n: number } | null>(null);

  // Flagships first, so they sit on the top row of the map.
  const ordered = useMemo(
    () => [...caseStudies].sort((a, b) => Number(!!b.flagship) - Number(!!a.flagship)),
    [caseStudies],
  );
  const selected = ordered.find((c) => c._id === selectedId) ?? ordered[0];

  useEffect(() => {
    const pick = (slug: string | null) => {
      const target = ordered.find((c) => c.slug === slug);
      if (!target || !selected) return false;
      takePendingStudy();
      if (target._id === selected._id) return true;
      setHop((h) => ({ from: selected._id, to: target._id, n: (h?.n ?? 0) + 1 }));
      setSelectedId(target._id);
      setLineClosed(false);
      return true;
    };
    pick(peekPendingStudy());
    const onSelect = (e: Event) => pick((e as CustomEvent<{ slug: string }>).detail?.slug);
    window.addEventListener(SELECT_STUDY, onSelect);
    return () => window.removeEventListener(SELECT_STUDY, onSelect);
  }, [ordered, selected]);

  // Arrow keys browse while a tile has focus.
  useEffect(() => {
    if (!ordered.length || !selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (!(e.target as HTMLElement)?.closest?.('[data-svc-list]')) return;
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const idx = ordered.findIndex((c) => c._id === selected._id);
      const target = ordered[(idx + step + ordered.length) % ordered.length];
      setHop((h) => ({ from: selected._id, to: target._id, n: (h?.n ?? 0) + 1 }));
      setSelectedId(target._id);
      // Each tile renders twice (phone grid + topology); focus the copy that is on screen.
      const copies = document.querySelectorAll<HTMLButtonElement>(`[data-svc-row="${target._id}"]`);
      [...copies].find((b) => b.offsetParent !== null)?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ordered, selected]);

  if (!ordered.length || !selected) return null;

  const top = ordered.slice(0, Math.ceil(ordered.length / 2));
  const bottom = ordered.slice(top.length);
  const cols = { gridTemplateColumns: `repeat(${top.length}, minmax(0, 1fr))` };
  const pick = (id: string) => {
    if (id === selected._id) return;
    setHop((h) => ({ from: selected._id, to: id, n: (h?.n ?? 0) + 1 }));
    setSelectedId(id);
  };
  const tile = (c: SanityCaseStudy) => (
    <Tile key={c._id} study={c} on={c._id === selected._id} onPick={() => pick(c._id)} />
  );

  // Bus geometry: each service hangs off a column; top and bottom rows share columns.
  const n = top.length;
  const colOf = (id: string) => {
    const i = ordered.findIndex((c) => c._id === id);
    return i < n ? i : i - n;
  };
  const here = colOf(selected._id);
  const trail = hop && hop.to === selected._id ? { a: colOf(hop.from), b: here } : null;
  const stubDelay = reduce || !trail || trail.a === trail.b ? 0 : BUS_MOVE_S;

  return (
    <section id="work" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Service map
          </h2>
          <p className="font-mono text-sm text-muted">
            {current && <>{current.companyName ?? current.title} · </>}
            <span className="text-ink">
              {ordered.length} services
              {current?.scaleNote && <> · {current.scaleNote}</>}
            </span>
            {since && <> · {since}→now</>}
          </p>
        </div>

        <div className="mt-8 grid items-stretch gap-8 xl:grid-cols-[minmax(0,1fr)_27rem]">
          <div data-svc-list>
            {/* phones: the bus turned vertical — tap a node and its study opens right under it */}
            <div className="md:hidden">
              <ol className="relative">
                <span aria-hidden className="absolute top-6 bottom-6 left-[6px] w-0.5 bg-line" />
                {ordered.map((c) => {
                  const open = c._id === selected._id && !lineClosed;
                  return (
                    <li key={c._id} className="relative">
                      <LineRow
                        study={c}
                        open={open}
                        onToggle={(row) => {
                          setLineClosed(open);
                          setSelectedId(c._id);
                          // Closing a row above shifts this one up; bring it back under the thumb.
                          requestAnimationFrame(() =>
                            row.scrollIntoView({
                              block: 'nearest',
                              behavior: reduce ? 'auto' : 'smooth',
                            }),
                          );
                        }}
                      />
                      {open && (
                        <div
                          id={`svc-line-${c.slug}`}
                          className="pb-3 pl-7"
                          style={reduce ? undefined : { animation: 'fadeIn 0.3s ease both' }}
                        >
                          <DetailPane study={c} animate={!reduce} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 pl-7 font-mono text-xs text-muted">
                tap a service to open it · or ask the chatbot
              </p>
            </div>

            {/* md+: service topology — two rows of services hanging off one platform bus */}
            <div className="hidden md:block">
              <div className="grid items-end gap-4" style={cols}>
                {top.map(tile)}
              </div>
              <div className="grid gap-4" style={cols}>
                {top.map((c) => (
                  <Stub key={c._id} on={c._id === selected._id} grow="up" delay={stubDelay} />
                ))}
              </div>
              <div aria-hidden className="relative h-1 rounded-full bg-line">
                {trail && trail.a !== trail.b && !reduce && (
                  <span
                    key={hop?.n}
                    className={`absolute inset-y-0 rounded-full bg-[color:var(--primary)] ${trail.b > trail.a ? 'origin-left' : 'origin-right'}`}
                    style={{
                      left: colCenter(Math.min(trail.a, trail.b), n),
                      width: `calc(${colCenter(Math.max(trail.a, trail.b), n)} - ${colCenter(Math.min(trail.a, trail.b), n)})`,
                      animation: `busTrail ${BUS_MOVE_S * 2.2}s ease-out both`,
                    }}
                  />
                )}
                <span
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--primary)] transition-[left] ease-in-out"
                  style={{ left: colCenter(here, n), transitionDuration: `${BUS_MOVE_S}s` }}
                />
              </div>
              <div className="grid gap-4" style={cols}>
                {bottom.map((c) => (
                  <Stub key={c._id} on={c._id === selected._id} grow="down" delay={stubDelay} />
                ))}
              </div>
              <div className="grid items-start gap-4" style={cols}>
                {bottom.map(tile)}
              </div>
              <p className="mt-6 font-mono text-xs text-muted">
                time.money platform bus · click a service · ↑↓ to browse · or ask the chatbot
              </p>
            </div>
          </div>

          <article id={DETAIL_ID} key={selected._id} className="hidden min-w-0 md:block">
            <DetailPane study={selected} animate={!reduce} />
          </article>
        </div>

        {/* Every non-selected study also lives in the DOM, hidden. The UI shows one
            at a time, so without this the build-time prerender froze only the default
            study and crawlers saw the other five as bare names. `hidden` also keeps
            them out of the accessibility tree so screen readers don't hear them twice. */}
        <div hidden data-prerender="crawl-only">
          {ordered
            .filter((c) => c._id !== selected._id)
            .map((c) => (
              <article key={c._id}>
                <DetailPane study={c} animate={false} />
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}
