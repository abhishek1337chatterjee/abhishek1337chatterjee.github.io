# LCP Performance Investigation - Deep Dive

> A complete walkthrough of how we investigated and optimized the Largest Contentful Paint (LCP)
> regression on mobile from 100 to 80 on PageSpeed Insights.

---

## Table of Contents

1. [The Problem](#the-problem)
2. [Understanding LCP](#understanding-lcp)
3. [Root Cause Analysis](#root-cause-analysis)
4. [Approach 1: Hardcoded Fallback URL](#approach-1-hardcoded-fallback-url)
5. [Approach 2: DOM Node Adoption](#approach-2-dom-node-adoption)
6. [Approach 3: Bundle Size Reduction (What Worked)](#approach-3-bundle-size-reduction)
7. [Key Learnings](#key-learnings)
8. [Remaining Opportunities](#remaining-opportunities)

---

## The Problem

After updating dependencies (`framer-motion` 12.29.2 -> 12.33.0, `@ai-sdk/react` 3.0.62 -> 3.0.75)
and adding the "Currently Exploring" feature to the About section, PageSpeed scores dropped:

```
Before:  Mobile 100 / Desktop 100
After:   Mobile 80  / Desktop 95
```

The biggest issue was **LCP (Largest Contentful Paint)** jumping from ~1.7s to **4.2s** on mobile.

---

## Understanding LCP

### What is LCP?

LCP measures when the **largest visible content element** finishes painting on screen.
Lighthouse identifies the largest element (usually a hero image or heading) and records
when it last painted.

### Critical Detail: LCP Tracks the LAST Paint

This is the most important thing to understand:

```
LCP = timestamp of the LAST time the largest element painted
```

If you have a hero image that paints at 1s, but then React creates a NEW image at the
same position at 4s, Lighthouse records **4s** as the LCP - not 1s. It doesn't matter
that the images look identical. A new DOM element = a new paint event = a new LCP candidate.

### LCP Breakdown (from PageSpeed)

PageSpeed shows four subparts for LCP:

```
| Subpart                | What it measures                                    |
|------------------------|-----------------------------------------------------|
| Time to First Byte     | Server response time                                |
| Resource Load Delay    | Time between TTFB and when image starts downloading |
| Resource Load Duration | How long the image takes to download                |
| Element Render Delay   | Time between image loaded and element painted        |
```

Our results showed:

```
Time to First Byte:     0 ms     (GitHub Pages is fast)
Resource Load Delay:    140 ms   (preload hint working)
Resource Load Duration: 10 ms    (image cached from preload)
Element Render Delay:   2,230 ms  <-- THIS IS THE PROBLEM
```

The image was fully downloaded in 150ms, but it took **2.2 seconds** before it actually
painted on screen. Why? Because it's a React-rendered `<img>` that can't paint until
React boots up.

---

## Root Cause Analysis

### The Architecture

Our site has a two-layer LCP strategy:

**Layer 1 - Static HTML (index.html)**
```html
<!-- Rendered immediately by the browser, no JS needed -->
<div id="lcp-hero-container" style="position:fixed; ...">
  <img id="lcp-profile-image"
       src="https://cdn.sanity.io/images/.../w=256&h=256&fm=webp"
       fetchpriority="high" decoding="sync" />
</div>
```

**Layer 2 - React (Hero.tsx)**
```tsx
// Only renders after: JS download + parse + React boot + Sanity API response
{about?.profileImage && (
  <img src={getProfileImageUrl(about.profileImage, 384)}
       className="absolute inset-0 w-full h-full object-cover" />
)}
```

### The Timeline on Slow 4G

```
0ms        HTML arrives, static image starts loading
150ms      Static image fully loaded + painted (potential LCP = 150ms)
150ms      JS bundles start downloading (424KB index + 122KB framer-motion + ...)
~1800ms    JS fully downloaded on Slow 4G (1.6 Mbps)
~2000ms    JS parsed + React boots
~2050ms    useEffect runs: removes static container (lcpContainer.remove())
~2100ms    useEffect runs: Sanity API fetch starts
~2500ms    Sanity API response arrives
~2500ms    React renders <img> with Sanity data
~2500ms    Browser paints the React image (NEW LCP event = 2500ms)
```

The static HTML image painted fast, but then:
1. React **removed** it (lcpContainer.remove())
2. React created a **new** `<img>` element after the API call
3. Lighthouse saw the new image as a new LCP paint at 2.5s+

### Why It Regressed

Previously with smaller bundles, React booted faster (~1.5s), so the React image
painted sooner. After the dependency updates increased bundle size:

```
framer-motion:  12.29.2 -> 12.33.0  (bigger)
@ai-sdk/react:  3.0.62  -> 3.0.75   (bigger)
About.tsx:      Added Currently Exploring section (more code in index chunk)
```

The extra ~50KB pushed React boot time past the LCP threshold on Slow 4G simulation.

---

## Approach 1: Hardcoded Fallback URL

### The Idea

Instead of waiting for the Sanity API to return `about?.profileImage`, render the
React `<img>` immediately with a hardcoded URL (same image from the Sanity CDN).

### What We Changed

```tsx
// BEFORE: Only renders after API call
{about?.profileImage && (
  <img src={getProfileImageUrl(about.profileImage, 384)} />
)}

// AFTER: Renders immediately with fallback, swaps when API responds
<img src={about?.profileImage
  ? getProfileImageUrl(about.profileImage, 384)
  : 'https://cdn.sanity.io/.../w=384&h=384&fm=webp'
} />
```

Also delayed static container removal until API data loaded:
```tsx
// BEFORE: Remove immediately on mount
useEffect(() => {
  document.getElementById('lcp-hero-container')?.remove();
}, []);  // <-- empty deps = runs on first mount

// AFTER: Remove only when Sanity data is ready
useEffect(() => {
  if (!about) return;  // Wait for API
  document.getElementById('lcp-hero-container')?.remove();
}, [about]);  // <-- depends on about state
```

### Result: FAILED

```
LCP: 4.2s -> 4.1s (barely improved)
Element render delay: 2,230ms (unchanged)
```

### Why It Failed

The React `<img>` is a **new DOM element**. Even though the URL is the same and the
browser has the image cached, React creating `<img>` in the virtual DOM and committing
it to the real DOM triggers a new paint event. The 2.2s delay is React's boot time,
not the Sanity API wait.

**Lesson: The bottleneck was JS execution, not the API call.**

---

## Approach 2: DOM Node Adoption

### The Idea

Instead of creating a NEW `<img>` in React, move the EXISTING static HTML image
into the React component tree using `appendChild`. Moving a DOM node should be
cheaper than creating a new one.

### What We Changed

```tsx
const imageContainerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const lcpImage = document.getElementById('lcp-profile-image');
  const target = imageContainerRef.current;

  if (lcpImage && target) {
    // Move existing image into React tree (no new element created)
    lcpImage.className = 'absolute inset-0 w-full h-full object-cover';
    lcpImage.removeAttribute('id');
    target.appendChild(lcpImage);  // <-- moves, doesn't clone
  }
  document.getElementById('lcp-hero-container')?.remove();
}, []);

// In JSX: container div receives the moved image
<div ref={imageContainerRef} />
```

### Result: FAILED

```
LCP: Still 4.2s
Element render delay: 2,170ms (barely improved)
```

### Why It Failed

When you `appendChild` an element from one parent to another, the browser must:
1. Remove it from the old parent's layout
2. Recalculate layout in the new parent
3. **Repaint the element in its new position**

That repaint counts as a new LCP candidate. Even though it's the "same" DOM node,
changing its position in the DOM tree triggers a layout recalculation and repaint.

Also, the `useEffect` can't run until React boots (~2.2s on Slow 4G), so the
`appendChild` happens at the same time as creating a new element would.

**Lesson: appendChild triggers repaint. DOM node reuse doesn't bypass LCP.**

---

## Approach 3: Bundle Size Reduction (What Worked)

### The Idea

Since the LCP bottleneck is React boot time (determined by JS download + parse),
reduce the amount of JS that needs to load before React can render the Hero section.

### What We Changed

Lazy-load all below-fold sections so they're NOT in the initial bundle:

```tsx
// BEFORE: All sections eagerly imported (included in 424KB index chunk)
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import GitHubStats from './components/sections/GitHubStats';
import Contact from './components/sections/Contact';

// AFTER: Lazy-loaded (separate chunks, loaded on demand)
const About = lazy(() => import('./components/sections/About'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Projects = lazy(() => import('./components/sections/Projects'));
const GitHubStats = lazy(() => import('./components/sections/GitHubStats'));
const Contact = lazy(() => import('./components/sections/Contact'));
```

Wrapped in Suspense:
```tsx
<Suspense fallback={null}>
  <About />
  <Skills />
  <Projects />
  {/* etc. */}
</Suspense>
```

### How React.lazy Works

```
WITHOUT lazy loading:
  index.js (424KB) = Hero + About + Skills + Projects + GitHubStats + Contact + deps
  Browser must download ALL 424KB before React can render ANYTHING

WITH lazy loading:
  index.js (359KB) = Hero + Navbar + SocialSidebar + core deps
  About.js (7KB)   = loaded when scrolled into view
  Skills.js (7KB)  = loaded when scrolled into view
  Projects.js (20KB) = loaded when scrolled into view
  etc.

  Browser only needs 359KB for the initial render (Hero section)
  Other sections load asynchronously later
```

### Bundle Size Impact

```
BEFORE lazy-loading:
  index chunk: 424KB

AFTER lazy-loading:
  index chunk: 359KB (-65KB / -15%)
  About:       6.95KB  (separate chunk)
  Skills:      7.45KB  (separate chunk)
  Projects:    20KB    (separate chunk)
  GitHubStats: 27KB    (separate chunk)
  Contact:     4.84KB  (separate chunk)
```

### Result: SUCCESS

```
| Metric      | Before | After  | Change  |
|-------------|--------|--------|---------|
| Performance | 80     | 83     | +3      |
| FCP         | 2.2s   | 2.1s   | -100ms  |
| LCP         | 4.2s   | 4.0s   | -200ms  |
| TBT         | 110ms  | 50ms   | -60ms   |
```

### Why It Worked

On Slow 4G (1.6 Mbps):
- 65KB less to download = ~330ms saved
- Less JS to parse = reduced main thread blocking
- React boots faster = Hero renders sooner
- TBT dropped from 110ms to 50ms (less JS parsing blocking the main thread)

**Lesson: On slow networks, every KB matters. Reducing the critical bundle is the
most reliable way to improve LCP for SPAs.**

---

## Key Learnings

### 1. LCP is About the Last Paint, Not the First

If you show an image fast but then replace it with a new DOM element, the replacement
becomes the LCP. The browser doesn't remember that "something similar was here before."

### 2. DOM Manipulation Triggers Repaints

Even `appendChild` (moving a node) triggers layout recalculation and repaint. There's
no way to silently move an element without the browser noticing.

### 3. The Real Bottleneck for SPAs is JS Boot Time

On Slow 4G, the bottleneck isn't the image (10ms to load), it's the JavaScript:
- Download: 360KB on 1.6 Mbps = ~1.8s
- Parse: ~300ms
- React boot + mount: ~200ms
- Total: ~2.3s before ANYTHING React renders

### 4. content-visibility != Code Splitting

We had `content-visibility: auto` on below-fold sections (CSS-level optimization).
This tells the browser to skip RENDERING those sections until scrolled into view.
But the JS code for those sections was still downloaded and parsed eagerly.

`React.lazy()` is different - it prevents the code from being DOWNLOADED at all
until needed. Both are useful, but they solve different problems:

```
content-visibility: auto  -> Skip rendering (CSS)
React.lazy()              -> Skip downloading + parsing (JS)
```

### 5. Dependency Updates Can Regress Performance

Minor version bumps (12.29 -> 12.33) can increase bundle size. Always check bundle
sizes after updating dependencies, especially heavy ones like framer-motion.

### 6. Lighthouse Simulates Slow 4G for Mobile

Mobile scores use "Slow 4G throttling" - 1.6 Mbps download, 150ms RTT. This makes
every KB of JavaScript ~5x more expensive than on desktop. A 65KB reduction that's
barely noticeable on desktop saves 330ms on simulated Slow 4G.

---

## Remaining Opportunities

These optimizations could push the score higher but require more invasive changes:

### Tier 1: High Impact (estimated +5-10 points)

1. **Replace typewriter with CSS animation** (save ~200-300ms)
   - `react-simple-typewriter` is JS-based, runs during LCP window
   - CSS `animation` with `steps()` can achieve the same effect with zero JS

2. **Defer framer-motion on mobile** (save ~300-400ms)
   - framer-motion is 122KB, loaded eagerly for Hero animations
   - Hero animations could use CSS `@keyframes` instead
   - Load framer-motion only when needed (scroll triggers, etc.)

### Tier 2: Medium Impact (estimated +2-5 points)

3. **Split Hero into shell/full components**
   - Render static text + image immediately (HeroShell)
   - Load animations and interactive elements after (HeroFull)

4. **Defer Sanity client initialization**
   - `createClient()` runs synchronously on import
   - Could be lazy-initialized on first query

### The Hard Truth for SPAs

Single-page applications have an inherent LCP disadvantage on slow connections because
the browser must download, parse, and execute JavaScript before rendering ANY content
(except what's in the static HTML). This is why:

- Server-side rendering (SSR) and static site generation (SSG) consistently score higher
- Our HTML-first pattern (static image in index.html) partially mitigates this
- But React still creates new DOM elements that reset LCP timing

For a portfolio site deployed on GitHub Pages (no SSR), the practical ceiling for
mobile performance on Slow 4G is around 85-90 with current architecture.

---

## Score History

```
100/100 - Original (before dep updates + Currently Exploring)
80/100  - After dep updates + new feature
81/100  - After hardcoded fallback URL (Approach 1)
80/100  - After DOM adoption (Approach 2)
83/100  - After lazy-loading below-fold sections (Approach 3) <- current
```
