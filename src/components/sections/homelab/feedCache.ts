// Rules of the Go feed cache in front of the Glance dashboard (glance-docker repo:
// github-feed/internal/policy/policy.go + the cached URLs in config/*.render.yml).
export const FEEDS = 97;
export const WORKERS = 5; // policy.BatchSize
export const DEADLINE_S = 20; // policy.FetchTimeout
export const MISS_WAIT_S = 4; // policy.MissWait: Glance gives up after 5 s
export const REFRESH_MIN = 60; // policy.DefaultRefresh

// The replay's own story, not measured data: which feed Glance asks for, which site is slow.
const ASKED_FEED = 87; // shown as "feed 88"
const ASK_AT_S = 4;
const SLOW_FEED = 61;
const FIRST_OUT_S = 0.3;

export interface Job {
  feed: number;
  worker: number;
  start: number;
  end: number;
  ok: boolean; // false = hit the deadline
  askedAt?: number; // Glance requested it before a worker reached it in the queue
}

// Small seeded PRNG so every visitor sees the same replay.
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cold start, in simulated seconds: config-order queue, 5 workers, an urgent feed
// takes the next free worker, a fetch past the deadline is cut off.
export function simulate(): { jobs: Job[]; total: number } {
  const rand = rng(7);
  const took = Array.from({ length: FEEDS }, (_, i) => {
    if (i === SLOW_FEED) return DEADLINE_S + 5;
    const r = rand();
    return r < 0.85 ? 0.4 + r * 3 : 4 + r * 5;
  });
  const free = Array.from({ length: WORKERS }, () => FIRST_OUT_S);
  const started = new Set<number>();
  const jobs: Job[] = [];
  let next = 0;
  while (started.size < FEEDS) {
    const worker = free.indexOf(Math.min(...free));
    const now = free[worker];
    let feed: number;
    if (!started.has(ASKED_FEED) && now >= ASK_AT_S) feed = ASKED_FEED;
    else {
      while (started.has(next)) next++;
      feed = next;
    }
    started.add(feed);
    const dur = Math.min(took[feed], DEADLINE_S);
    jobs.push({
      feed,
      worker,
      start: now,
      end: now + dur,
      ok: took[feed] <= DEADLINE_S,
      askedAt: feed === ASKED_FEED ? ASK_AT_S : undefined,
    });
    free[worker] = now + dur;
  }
  return { jobs, total: Math.max(...free) };
}
