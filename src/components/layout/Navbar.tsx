import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAbout, useSiteSettings } from '../../hooks/useSanityData';

const LINKS = ['about', 'skills', 'journey', 'work', 'homelab', 'github'];
const teal = 'var(--primary)';

// Brand — static "ac❯" prompt with a live terminal caret that loops:
// types the name, holds, erases, pauses, retypes. Starts after `start` (loader
// done) so the first pass isn't hidden behind the boot screen; loops forever
// after so it's always visibly "alive". Reduced-motion → static full name.
const TYPE_MS = 80; // per-char while typing
const ERASE_MS = 40; // per-char while erasing
const HOLD_MS = 3000; // pause at the full name
const PAUSE_MS = 800; // pause at the empty prompt

function NavBrand({ name, start }: { name: string; start: boolean }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const len = name.length;

  useEffect(() => {
    if (reduced) {
      setN(len);
      return;
    }
    if (!start) {
      setN(0);
      return;
    }
    let timer = 0;
    let i = 0;
    let dir = 1; // 1 = typing, -1 = erasing
    const tick = () => {
      i += dir;
      setN(i);
      let delay: number;
      if (dir === 1 && i >= len) {
        dir = -1;
        delay = HOLD_MS;
      } else if (dir === -1 && i <= 0) {
        dir = 1;
        delay = PAUSE_MS;
      } else {
        delay = dir === 1 ? TYPE_MS : ERASE_MS;
      }
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, TYPE_MS);
    return () => window.clearTimeout(timer);
  }, [reduced, start, len]);

  return (
    <span className="inline-flex items-center font-mono text-[14px] tracking-tight text-ink">
      <span className="font-bold">ac</span>
      <span className="font-bold" style={{ color: teal }}>
        ❯
      </span>
      <span className="ml-1">{name.slice(0, n)}</span>
      <span
        className="ml-0.5 inline-block h-[0.9em] w-[0.4ch] align-[-0.1em]"
        style={{ background: teal, animation: 'blink 1s step-end infinite' }}
      />
    </span>
  );
}

export default function Navbar({ booted }: { booted: boolean }) {
  const { about } = useAbout();
  const { settings } = useSiteSettings();
  const name = (about?.name ?? 'Abhishek Chatterjee').toLowerCase().replace(/\s+/g, '.');
  const resume = settings?.resumeUrl ?? '/Abhishek-Chatterjee-Resume.pdf';
  const [menuOpen, setMenuOpen] = useState(false);

  // close the mobile menu on Escape or on any in-page navigation (hash change)
  useEffect(() => {
    const close = () => setMenuOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', close);
    };
  }, []);

  return (
    <header
      className="sticky top-0 z-40 border-b border-line/70 px-5 backdrop-blur-md sm:px-8 lg:px-16"
      style={{ background: 'rgba(14,15,19,0.72)' }}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 py-2.5">
        {/* brand — typed terminal command */}
        <a href="#top" className="flex flex-none items-center">
          <NavBrand name={name} start={booted} />
        </a>

        {/* desktop links */}
        <div className="hidden items-center gap-1 font-mono text-[12.5px] sm:flex">
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l}`}
              className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-base-200/60 hover:text-ink"
            >
              {l}
            </a>
          ))}
          <a
            href={resume}
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-muted transition-colors hover:bg-base-200/60 hover:text-ink"
          >
            resume
          </a>
          <a
            href="#contact"
            className="ml-1 whitespace-nowrap rounded-md border px-3 py-1.5 font-medium transition-colors hover:bg-[color:var(--primary)]/10"
            style={{
              color: 'var(--primary)',
              borderColor: 'color-mix(in srgb, var(--primary) 35%, transparent)',
            }}
          >
            contact
          </a>
        </div>

        {/* mobile menu toggle — hamburger that morphs to ✕ */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          className="flex flex-none items-center justify-center rounded-md border border-line p-2 text-ink transition-colors hover:border-[color:var(--primary)]/50 sm:hidden"
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
      </nav>

      {/* mobile dropdown — in-flow accordion */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden sm:hidden"
          >
            <div className="flex flex-col gap-1 border-t border-line/70 py-3 font-mono text-sm">
              {LINKS.map((l) => (
                <a
                  key={l}
                  href={`#${l}`}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-muted transition-colors hover:bg-base-200/60 hover:text-ink"
                >
                  <span style={{ color: teal }}>›</span> {l}
                </a>
              ))}
              <a
                href={resume}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-md px-2 py-2 text-muted transition-colors hover:bg-base-200/60 hover:text-ink"
              >
                <span style={{ color: teal }}>›</span> resume
              </a>
              <a
                href="#contact"
                className="mt-1 flex items-center gap-2 rounded-md border px-2 py-2 font-medium"
                style={{
                  color: 'var(--primary)',
                  borderColor: 'color-mix(in srgb, var(--primary) 35%, transparent)',
                }}
              >
                <span>›</span> contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
