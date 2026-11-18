import { useEffect, useState } from 'react';

// Scrollspy: the section crossing the middle of the viewport is "active".
// `topId` (the hero) clears the highlight when scrolled back to the top.
export function useActiveSection(ids: readonly string[], topId = 'top'): string | undefined {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(entry.target.id === topId ? undefined : entry.target.id);
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );

    const watched = new Set<Element>();
    const observeAll = () => {
      for (const id of [topId, ...ids]) {
        const el = document.getElementById(id);
        if (el && !watched.has(el)) {
          watched.add(el);
          io.observe(el);
        }
      }
    };
    observeAll();
    // sections are lazy and swap placeholders for real content after Sanity loads
    const mo = new MutationObserver(observeAll);
    mo.observe(document.querySelector('main') ?? document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [ids, topId]);

  return active;
}
