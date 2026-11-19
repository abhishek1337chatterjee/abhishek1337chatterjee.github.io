import { useEffect, useState } from 'react';

interface ContributionData {
  total: number;
  weeks: number[];
  days: { date: string; count: number }[]; // daily counts, oldest first
}

type ApiResponse = { total?: { lastYear?: number }; contributions?: ApiDay[] };

// Hero and GitHub section both read this; share one request per username.
const requests = new Map<string, Promise<ApiResponse>>();
function load(username: string) {
  let req = requests.get(username);
  if (!req) {
    req = fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`).then((r) =>
      r.ok ? r.json() : Promise.reject(new Error('contrib fetch failed')),
    );
    req.catch(() => requests.delete(username)); // let a later mount retry
    requests.set(username, req);
  }
  return req;
}

interface ApiDay {
  date: string;
  count: number;
}

// Real GitHub contribution activity (last year) for the hero sparkline + count.
// Public, CORS-enabled endpoint — no token needed.
export function useContributions(username: string): ContributionData {
  const [data, setData] = useState<ContributionData>({
    total: 0,
    weeks: [],
    days: [],
  });

  useEffect(() => {
    let alive = true;
    load(username)
      .then((d) => {
        if (!alive) return;
        const contrib = d.contributions ?? [];
        const counts = contrib.map((c) => c.count);
        const weeks: number[] = [];
        for (let i = 0; i < counts.length; i += 7) {
          weeks.push(counts.slice(i, i + 7).reduce((a, b) => a + b, 0));
        }
        const days = contrib.map((c) => ({ date: c.date, count: c.count }));
        setData({ total: d.total?.lastYear ?? 0, weeks, days });
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
