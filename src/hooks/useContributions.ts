import { useEffect, useState } from 'react';

interface ContributionData {
  total: number;
  weeks: number[];
  cells: { date: string; level: number }[];
}

interface ApiDay {
  date: string;
  count: number;
  level?: number;
}

// Real GitHub contribution activity (last year) for the hero sparkline + count.
// Public, CORS-enabled endpoint — no token needed.
export function useContributions(username: string): ContributionData {
  const [data, setData] = useState<ContributionData>({ total: 0, weeks: [], cells: [] });

  useEffect(() => {
    let alive = true;
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('contrib fetch failed'))))
      .then((d: { total?: { lastYear?: number }; contributions?: ApiDay[] }) => {
        if (!alive) return;
        const contrib = d.contributions ?? [];
        const counts = contrib.map((c) => c.count);
        const weeks: number[] = [];
        for (let i = 0; i < counts.length; i += 7) {
          weeks.push(counts.slice(i, i + 7).reduce((a, b) => a + b, 0));
        }
        const cells = contrib.map((c) => ({ date: c.date, level: c.level ?? 0 }));
        setData({ total: d.total?.lastYear ?? 0, weeks, cells });
      })
      .catch(() => {
        /* leave defaults — band degrades to em-dash + flat line */
      });
    return () => {
      alive = false;
    };
  }, [username]);

  return data;
}
