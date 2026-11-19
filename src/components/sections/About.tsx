import { CornerUpLeft } from 'lucide-react';
import { type MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAbout, useCareerPhases, useCaseStudies, useSkills } from '../../hooks/useSanityData';
import type { HighlightedPhrase } from '../../lib/sanity';
import { selectStudy } from '../../lib/studyEvents';
import { focusTarget } from '../../utils/focusTarget';
import Reveal from '../ui/Reveal';
import ClaimWires from './about/ClaimWires';
import { buildClaims, type Claim, COLOR_HEX, HOVER_HEX } from './about/claims';
import ExploringStrip from './about/ExploringStrip';
import PeekCard, { PEEK_H } from './about/PeekCard';

// How long the "back to About" chip waits for the visitor before quietly leaving.
const BACK_CHIP_MS = 12000;

export default function About() {
  const { about } = useAbout();
  const { skills } = useSkills();
  const { caseStudies } = useCaseStudies();
  const { careerPhases } = useCareerPhases();
  const reduce = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null); // hover / focus = teal
  const [selected, setSelected] = useState<number | null>(null); // last clicked = amber
  const [back, setBack] = useState<number | null>(null);
  const [seen, setSeen] = useState(false);

  const bio = about?.bio ?? '';
  const phrases = about?.highlightedPhrases ?? [];
  const claims = useMemo(
    () => buildClaims(bio, phrases, { skills, caseStudies, careerPhases }),
    [bio, phrases, skills, caseStudies, careerPhases],
  );

  // Wires draw once, the first time the bio is on screen.
  const observeRef = useCallback((el: HTMLDivElement | null) => {
    gridRef.current = el;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
  }, []);

  useEffect(() => {
    if (back === null) return;
    const t = window.setTimeout(() => setBack(null), BACK_CHIP_MS);
    return () => window.clearTimeout(t);
  }, [back]);

  // full-height placeholder: About sits right under the hero, so collapsing it while
  // Sanity loads would pull later sections into view and then push them away (CLS)
  if (!about) return <section id="about" className="min-h-screen" aria-busy="true" />;

  const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
  const jump = (e: MouseEvent, c: Claim) => {
    e.preventDefault();
    if (c.study) selectStudy(c.study);
    const target = document.getElementById(c.target);
    target?.scrollIntoView({ behavior });
    focusTarget(target);
    setActive(null);
    setSelected(c.n);
    setBack(c.n);
  };
  const returnTo = (n: number) => {
    const claim = gridRef.current?.querySelector(`[data-claim="${n}"]`);
    claim?.scrollIntoView({ behavior, block: 'center' });
    focusTarget(claim);
    setBack(null);
  };
  const hover = (n: number | null) => () => setActive(n);
  const byPhrase = new Map(claims.map((c) => [c.phrase, c]));
  const peekOpen = claims.some((c) => c.n === active);

  return (
    <section id="about" className="content-defer px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              About
            </h2>
            <p className="font-mono text-sm text-muted">
              <span className="text-ink">{about.name}</span>
              {about.location && ` · ${about.location}`}
              {about.experience && ` · ${about.experience}`}
              {claims.length > 0 && (
                <span className="text-[color:var(--primary)]">
                  {' · '}
                  {claims.length} claims · each linked to its proof
                </span>
              )}
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <div
            ref={observeRef}
            className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-28"
          >
            <ClaimWires
              host={gridRef}
              claims={claims}
              active={active}
              selected={selected}
              phase={reduce ? 'static' : seen ? 'play' : 'hidden'}
            />

            {/* the bio, with each provable claim footnoted and linked */}
            <div
              data-bio
              className="space-y-5 self-start text-lg leading-relaxed text-ink/80 sm:text-xl sm:leading-relaxed"
            >
              {bio
                .split('\n\n')
                .filter(Boolean)
                .map((para) => (
                  <p key={para.slice(0, 32)}>
                    {renderBio(para, phrases, byPhrase, active, selected, hover, jump)}
                  </p>
                ))}
            </div>

            {/* proof rail */}
            {claims.length > 0 && (
              <div className="relative">
                <p className="border-b border-line pb-2.5 font-mono text-xs text-muted">
                  claim → where this page proves it
                </p>
                <ol>
                  {claims.map((c) => {
                    const sel = selected === c.n;
                    const open = active === c.n;
                    const tone = sel ? 'text-[color:var(--secondary)]' : 'text-muted';
                    return (
                      <li key={c.n}>
                        <a
                          href={`#${c.target}`}
                          data-rail={c.n}
                          onMouseEnter={hover(c.n)}
                          onMouseLeave={hover(null)}
                          onFocus={hover(c.n)}
                          onBlur={hover(null)}
                          onClick={(e) => jump(e, c)}
                          aria-current={sel ? 'true' : undefined}
                          className={`grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-baseline gap-x-2 py-3 transition-colors ${open ? 'rounded-t-lg border border-b-0' : 'border-b border-line'} ${sel ? 'bg-[#1a1205] shadow-[inset_2px_0_0_var(--secondary)]' : ''}`}
                          style={
                            open
                              ? {
                                  borderColor: `${HOVER_HEX}99`,
                                  background: sel
                                    ? undefined
                                    : `color-mix(in srgb, ${HOVER_HEX} 6%, transparent)`,
                                }
                              : undefined
                          }
                        >
                          <span className="pl-1 font-mono text-xs text-muted">{c.n}</span>
                          <span className="min-w-0">
                            <span className="block font-medium text-ink">{c.phrase}</span>
                            <span
                              className={`block font-mono text-xs leading-relaxed ${tone}`}
                              style={open && !sel ? { color: HOVER_HEX } : undefined}
                            >
                              {c.section} · {c.proof}
                            </span>
                          </span>
                          <span
                            className={`min-w-[8ch] pr-1 text-right font-mono text-xs ${tone}`}
                            style={open && !sel ? { color: HOVER_HEX } : undefined}
                          >
                            {open ? 'enter ↵' : `#${c.target}`}
                          </span>
                        </a>
                        {open && <PeekCard peek={c.peek} target={c.target} />}
                      </li>
                    );
                  })}
                </ol>
                {/* the closed card keeps its space, so a hover never moves the page below */}
                {!peekOpen && (
                  <p
                    aria-hidden
                    className="flex items-center font-mono text-xs text-muted"
                    style={{ height: PEEK_H }}
                  >
                    hover a claim to peek at its proof
                  </p>
                )}
              </div>
            )}
          </div>
        </Reveal>

        <ExploringStrip about={about} />
      </div>

      {back !== null &&
        createPortal(
          <button
            type="button"
            onClick={() => returnTo(back)}
            className="fixed top-[4.25rem] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[color:var(--secondary)] bg-[#1a1205] px-4 py-2 font-mono text-xs text-[color:var(--secondary)] shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            style={reduce ? undefined : { animation: 'fadeIn 0.25s ease both' }}
          >
            <CornerUpLeft aria-hidden className="size-3.5" />
            back to About · claim {back}
          </button>,
          document.body,
        )}
    </section>
  );
}

// Tint each highlighted phrase; the ones with a proof become footnoted links.
function renderBio(
  text: string,
  phrases: HighlightedPhrase[],
  byPhrase: Map<string, Claim>,
  active: number | null,
  selected: number | null,
  hover: (n: number | null) => () => void,
  jump: (e: MouseEvent, c: Claim) => void,
) {
  if (!phrases.length) return text;
  const sorted = [...phrases].sort((a, b) => b.text.length - a.text.length);
  const pattern = sorted.map((p) => p.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return text.split(new RegExp(`(${pattern})`, 'g')).map((part, i) => {
    const hit = sorted.find((p) => p.text === part);
    if (!hit) return part;
    const color = COLOR_HEX[hit.color] ?? 'var(--primary)';
    const claim = byPhrase.get(part);
    if (!claim) {
      return (
        <span key={`${part}-${i}`} className="font-medium" style={{ color }}>
          {part}
        </span>
      );
    }
    const sel = selected === claim.n;
    const on = !sel && active === claim.n;
    return (
      <a
        key={`${part}-${i}`}
        href={`#${claim.target}`}
        data-claim={claim.n}
        onMouseEnter={hover(claim.n)}
        onMouseLeave={hover(null)}
        onFocus={hover(claim.n)}
        onBlur={hover(null)}
        onClick={(e) => jump(e, claim)}
        className={`font-medium underline decoration-2 underline-offset-[6px] transition-colors ${on || sel ? 'decoration-solid' : 'decoration-dotted'}`}
        style={{
          color: sel ? 'var(--secondary)' : color,
          backgroundColor: sel
            ? 'color-mix(in srgb, var(--secondary) 16%, transparent)'
            : on
              ? `color-mix(in srgb, ${HOVER_HEX} 12%, transparent)`
              : undefined,
        }}
      >
        {part}
        <sup className="ml-0.5 font-mono text-[11px] text-muted">{claim.n}</sup>
      </a>
    );
  });
}
