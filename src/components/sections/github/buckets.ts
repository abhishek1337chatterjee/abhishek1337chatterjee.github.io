// Turn daily GitHub counts into the buckets each graph view draws.

export interface Bucket {
  value: number;
  tip: string; // crosshair readout, e.g. "week of 3 Mar" or "Nov 2026 (so far)"
  tick?: string; // axis label under this bucket, if any
  partial?: boolean; // bucket covers only part of its period
}

type Day = { date: string; count: number };

// "2026-03-02" → Date at UTC midnight, so labels never shift a day with the viewer's timezone.
const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);
const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  utc(iso).toLocaleString('en', { ...opts, timeZone: 'UTC' });

// 7-day buckets from the first day; ticks where a week starts a new month.
export function weekly(days: Day[]): Bucket[] {
  const out: Bucket[] = [];
  let lastMonth = '';
  for (let i = 0; i < days.length; i += 7) {
    const start = days[i].date;
    const month = start.slice(0, 7);
    out.push({
      value: days.slice(i, i + 7).reduce((a, d) => a + d.count, 0),
      tip: `week of ${fmt(start, { day: 'numeric', month: 'short' })}`,
      tick: i > 0 && month !== lastMonth ? fmt(start, { month: 'short' }) : undefined,
    });
    lastMonth = month;
  }
  return out;
}

// Calendar months. The rolling year starts and ends mid-month, so the first and last
// buckets are partial; they are kept (bars still sum to the header total) and marked.
export function monthly(days: Day[]): Bucket[] {
  const groups = new Map<string, Day[]>();
  for (const d of days) {
    const key = d.date.slice(0, 7);
    groups.set(key, [...(groups.get(key) ?? []), d]);
  }
  const keys = [...groups.keys()];
  const repeated = new Set(keys.map((k) => k.slice(5)).filter((m, i, all) => all.indexOf(m) !== i));
  return keys.map((key, i) => {
    const list = groups.get(key) as Day[];
    const first = list[0].date;
    const name = fmt(first, { month: 'short' });
    const year = fmt(first, { year: 'numeric' });
    const isFirst = i === 0 && first.slice(8) !== '01';
    const isLast = i === keys.length - 1;
    const note = isFirst
      ? ` (from ${Number(first.slice(8))}${ordinal(Number(first.slice(8)))})`
      : isLast
        ? ' (so far)'
        : '';
    return {
      value: list.reduce((a, d) => a + d.count, 0),
      tip: `${name} ${year}${note}`,
      tick: repeated.has(key.slice(5)) ? `${name} ’${year.slice(2)}` : name,
      partial: isFirst || isLast,
    };
  });
}

function ordinal(n: number) {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th';
  return ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th';
}
