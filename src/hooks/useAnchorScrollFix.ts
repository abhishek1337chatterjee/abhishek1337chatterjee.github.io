import { useEffect } from 'react';
import { focusTarget } from '../utils/focusTarget';

// In-page anchor nav lands inaccurately because `content-visibility: auto`
// sections use a placeholder height (contain-intrinsic-size) until they render,
// so the browser mis-computes a target's offset and lands short (worst on cold
// long jumps). We intercept nav clicks and drive the scroll ourselves with a
// per-frame ease that RE-MEASURES the target every frame — each frame renders the
// sections it passes, so the measurement keeps getting truer and it converges on
// the correct position. Native smooth-scroll is suppressed during the animation
// (so it can't fight us), and any manual wheel/touch aborts it (so it never yanks
// the user).
const SCROLL_PAD = 64; // matches html { scroll-padding-top: 4rem }
const EASE = 0.22; // fraction of remaining distance per frame
const MAX_FRAMES = 180; // ~3s hard stop
const STALL_FRAMES = 3; // page stopped moving: the target sits past the scroll end

export function useAnchorScrollFix() {
  useEffect(() => {
    const html = document.documentElement;
    let raf = 0;
    let aborted = false;

    const onUserScroll = () => {
      aborted = true;
    };
    const arm = () => {
      window.addEventListener('wheel', onUserScroll, { passive: true });
      window.addEventListener('touchmove', onUserScroll, { passive: true });
      window.addEventListener('keydown', onUserScroll);
      html.style.scrollBehavior = 'auto'; // override CSS smooth → our scrollTo is instant
    };
    const disarm = () => {
      window.removeEventListener('wheel', onUserScroll);
      window.removeEventListener('touchmove', onUserScroll);
      window.removeEventListener('keydown', onUserScroll);
      html.style.scrollBehavior = ''; // restore CSS smooth for everything else
    };

    const converge = (id: string) => {
      if (!document.getElementById(id)) return;
      cancelAnimationFrame(raf);
      aborted = false;
      arm();
      // reduced motion: land in one step, still re-measured until the sections settle
      const ease = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : EASE;
      let frames = 0;
      let stalled = 0;
      let last = -1;
      const animate = () => {
        const el = document.getElementById(id);
        if (aborted || !el) {
          disarm();
          return;
        }
        const cur = window.scrollY;
        stalled = Math.abs(cur - last) < 0.5 ? stalled + 1 : 0;
        last = cur;
        const goal = Math.max(0, cur + el.getBoundingClientRect().top - SCROLL_PAD);
        const dist = goal - cur;
        if (Math.abs(dist) < 1.5 || stalled >= STALL_FRAMES || frames > MAX_FRAMES) {
          window.scrollTo(0, goal);
          disarm();
          return;
        }
        window.scrollTo(0, cur + dist * ease);
        frames += 1;
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const id = decodeURIComponent((a.getAttribute('href') || '').slice(1));
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      if (location.hash.slice(1) !== id) {
        history.pushState(null, '', `#${id}`);
        // notify hashchange listeners (e.g. the mobile menu close) without a native jump
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
      focusTarget(document.getElementById(id));
      converge(id);
    };

    const onPopState = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id) converge(id);
    };

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPopState);
    // correct an initial deep-link (no click fires for the first paint)
    if (location.hash) {
      window.setTimeout(() => converge(decodeURIComponent(location.hash.slice(1))), 300);
    }

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPopState);
      cancelAnimationFrame(raf);
      disarm();
    };
  }, []);
}
