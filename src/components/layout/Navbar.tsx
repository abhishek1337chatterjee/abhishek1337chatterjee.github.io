import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAbout, useSiteSettings } from '../../hooks/useSanityData';
import { downloadResume } from '../../utils/resume';

const LINKS = ['about', 'skills', 'journey', 'work', 'homelab', 'github'];
// contact is a separate CTA link, but must still take over the highlight at the bottom
const SPY_IDS = [...LINKS, 'contact'];
const teal = 'var(--primary)';
// current section: brighter text plus a teal underline (not colour alone)
const CURRENT_LINK =
  'aria-[current=true]:text-ink aria-[current=true]:underline aria-[current=true]:decoration-[color:var(--primary)] aria-[current=true]:decoration-2 aria-[current=true]:underline-offset-[6px]';

// mobile menu: current row gets an amber tint plus the amber dot glyph (not colour alone)
const MENU_CURRENT =
  'aria-[current=true]:bg-[color:var(--secondary)]/10 aria-[current=true]:text-ink';

function MenuRow({
  href,
  n,
  current = false,
  external = false,
  onClick,
  children,
}: {
  href: string;
  n: number;
  current?: boolean;
  external?: boolean;
  onClick?: () => void;
  children: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={current ? 'true' : undefined}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`flex min-h-11 items-center gap-2.5 rounded-md px-3 text-muted transition-colors hover:bg-base-200/60 hover:text-ink ${MENU_CURRENT}`}
    >
      <span aria-hidden style={{ color: current ? 'var(--secondary)' : teal }}>
        {current ? '●' : '›'}
      </span>
      {children}
      <span aria-hidden className="ml-auto text-[11px] text-[#5d6472]">
        {String(n).padStart(2, '0')}
      </span>
    </a>
  );
}

// Brand — "ac❯" prompt that types the name once after the loader, then stays still so the
// identity is always readable. Hover or focus replays one erase + retype, like re-running a
// trace. The caret is the favicon's ink block. Reduced motion → static full name, no replay.
const TYPE_MS = 80; // per-char while typing
const ERASE_MS = 30; // per-char while erasing (replay only)
const PAUSE_MS = 250; // beat at the empty prompt before retyping

function NavBrand({ name, start }: { name: string; start: boolean }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const len = name.length;
  const timer = useRef(0);
  const busy = useRef(false);

  const play = useCallback(
    (erase: boolean) => {
      window.clearTimeout(timer.current);
      busy.current = true;
      let i = erase ? len : 0;
      let dir = erase ? -1 : 1;
      const tick = () => {
        i += dir;
        setN(i);
        if (dir === -1 && i <= 0) {
          dir = 1;
          timer.current = window.setTimeout(tick, PAUSE_MS);
        } else if (dir === 1 && i >= len) {
          busy.current = false;
        } else {
          timer.current = window.setTimeout(tick, dir === 1 ? TYPE_MS : ERASE_MS);
        }
      };
      timer.current = window.setTimeout(tick, erase ? ERASE_MS : TYPE_MS);
    },
    [len],
  );

  useEffect(() => {
    if (reduced) {
      setN(len);
      return;
    }
    if (!start) {
      setN(0);
      return;
    }
    play(false);
    return () => window.clearTimeout(timer.current);
  }, [reduced, start, len, play]);

  // A replay never interrupts a pass already running.
  const retrace = () => {
    if (!reduced && start && !busy.current) play(true);
  };

  return (
    <a href="#top" onMouseEnter={retrace} onFocus={retrace} className="flex flex-none items-center">
      {/* the visible name is mid-typing at times; screen readers get it whole */}
      <span className="sr-only">{name}, back to top</span>
      <span
        aria-hidden
        className="inline-flex items-center font-mono text-[14px] tracking-tight text-ink"
      >
        <span className="font-bold">ac</span>
        <span className="font-bold" style={{ color: teal }}>
          ❯
        </span>
        <span className="ml-1">{name.slice(0, n)}</span>
        <span
          className="mb-[0.2em] ml-1 inline-block h-[0.32em] w-[0.8em] self-end rounded-[2px] bg-ink"
          style={{ animation: 'blink 1.1s step-end infinite' }}
        />
      </span>
    </a>
  );
}

export default function Navbar({ booted }: { booted: boolean }) {
  const { about } = useAbout();
  const { settings } = useSiteSettings();
  const name = (about?.name ?? 'Abhishek Chatterjee').toLowerCase().replace(/\s+/g, '.');
  const resume = settings?.resumeUrl;
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection(SPY_IDS);
  const reduceMotion = useReducedMotion();

  const toggleRef = useRef<HTMLButtonElement>(null);
  const fade = reduceMotion
    ? { duration: 0 }
    : { duration: 0.16, ease: [0.2, 0.7, 0.2, 1] as [number, number, number, number] };

  // close the mobile menu on any in-page navigation (hash change)
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  // Escape closes; focus goes back to the toggle so it is not lost with the unmounted links
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      className="sticky top-0 z-40 border-b border-line/70 px-5 backdrop-blur-md sm:px-8 lg:px-16"
      style={{ background: 'rgba(14,15,19,0.72)' }}
    >
      <nav
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 py-2.5"
        onBlur={(e) => {
          // tabbing past the open menu would land on content hidden under the scrim
          const next = e.relatedTarget as Node | null;
          if (menuOpen && next && !e.currentTarget.contains(next)) setMenuOpen(false);
        }}
      >
        {/* brand — typed terminal command */}
        <NavBrand name={name} start={booted} />

        {/* desktop links */}
        <div className="hidden items-center gap-1 font-mono text-[12.5px] min-[840px]:flex">
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l}`}
              aria-current={activeSection === l ? 'true' : undefined}
              className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-base-200/60 hover:text-ink ${CURRENT_LINK}`}
            >
              {l}
            </a>
          ))}
          {resume && (
            <a
              href={resume}
              target="_blank"
              rel="noreferrer"
              onClick={() => downloadResume(resume)}
              className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-base-200/60 hover:text-ink"
            >
              resume
            </a>
          )}
          <a
            href="#contact"
            aria-current={activeSection === 'contact' ? 'true' : undefined}
            className={`ml-1 whitespace-nowrap rounded-md border px-3 py-1.5 font-medium transition-colors hover:bg-[color:var(--primary)]/10 ${CURRENT_LINK}`}
            style={{
              color: 'var(--primary)',
              borderColor: 'color-mix(in srgb, var(--primary) 35%, transparent)',
            }}
          >
            contact
          </a>
        </div>

        {/* mobile menu toggle — hamburger that morphs to ✕ */}
        {/* the before: layer widens the tap area to 44 px without making the header taller */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="relative flex flex-none items-center justify-center rounded-md border border-line p-2 text-ink transition-colors before:absolute before:-inset-[7px] hover:border-[color:var(--primary)]/50 min-[840px]:hidden"
        >
          <span className="relative flex h-3.5 w-4 flex-col justify-between">
            <span
              className="h-[1.5px] w-full origin-center bg-current transition-transform duration-200"
              style={{ transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}
            />
            <span
              className="h-[1.5px] w-full bg-current transition-opacity duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="h-[1.5px] w-full origin-center bg-current transition-transform duration-200"
              style={{ transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
            />
          </span>
        </button>

        {/* mobile menu: drops over the page instead of pushing it down (WAI disclosure).
            Absolute, not fixed: the header's backdrop-filter traps fixed children. */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.button
                type="button"
                tabIndex={-1}
                aria-hidden
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fade}
                className="absolute inset-x-0 top-full h-[calc(100dvh-100%)] cursor-default touch-none bg-[rgba(6,7,9,0.6)] min-[840px]:hidden"
              />
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                transition={fade}
                className="absolute inset-x-0 top-full flex flex-col gap-0.5 border-b border-line bg-[#111318] px-5 pt-2 pb-3.5 font-mono text-sm shadow-[0_18px_40px_rgba(0,0,0,0.5)] sm:right-8 sm:left-auto sm:w-80 sm:rounded-b-lg sm:border-x min-[840px]:hidden"
              >
                {LINKS.map((l, i) => (
                  <MenuRow key={l} href={`#${l}`} n={i + 1} current={activeSection === l}>
                    {l}
                  </MenuRow>
                ))}
                {resume && (
                  <MenuRow
                    href={resume}
                    n={LINKS.length + 1}
                    external
                    onClick={() => {
                      downloadResume(resume);
                      setMenuOpen(false);
                    }}
                  >
                    resume
                  </MenuRow>
                )}
                <a
                  href="#contact"
                  aria-current={activeSection === 'contact' ? 'true' : undefined}
                  className={`mt-1.5 flex min-h-11 items-center gap-2.5 rounded-md border px-3 font-medium ${MENU_CURRENT}`}
                  style={{
                    color: 'var(--primary)',
                    borderColor: 'color-mix(in srgb, var(--primary) 35%, transparent)',
                  }}
                >
                  <span aria-hidden>›</span> contact
                </a>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
