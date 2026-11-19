// Dates in the CMS are free text. These turn them into fractional years (2024.75 = Oct 2024)
// so Journey and the Work header place things from the same rules.

export type Span = { start: number; end: number; ongoing: boolean };

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const ONGOING = /^(present|now|current)$/i;

// "Mar 2026" → start of that month (or its end, for a span's end); null if not month + year.
export function monthYear(text: string, end: boolean): number | null {
  const m = text.trim().match(/^([a-z]{3})[a-z]*\.?\s+(\d{4})$/i);
  const mi = m ? MONTHS.indexOf(m[1].toLowerCase()) : -1;
  return m && mi >= 0 ? Number(m[2]) + (mi + (end ? 1 : 0)) / 12 : null;
}

// Role period: "2024 - Present", "Oct 2024 - Present" or "2023 - 2024". A month, when given,
// places the span exactly; a bare year keeps the old year-level meaning.
export function parsePeriod(period: string, now: number): Span {
  const [a = '', b = ''] = period.split(/\s+[–-]\s+|–/).map((s) => s.trim());
  const ongoing = ONGOING.test(b);
  const startMonth = monthYear(a, false);
  const startYear = Number.parseInt(a, 10);
  const start = startMonth ?? (Number.isNaN(startYear) ? now : startYear);
  const endYear = Number.parseInt(b, 10);
  const end = ongoing ? now : (monthYear(b, true) ?? (Number.isNaN(endYear) ? start + 1 : endYear));
  return { start, end: Math.max(end, start + (startMonth === null ? 1 : 1 / 12)), ongoing };
}

// Case-study timeline "Mar 2026 → Aug 2026" or "Nov 2024 → now"; undefined when unreadable,
// so the caller shows the span without inventing a position.
export function parseTimeline(timeline: string, now: number) {
  const [a = '', b = ''] = timeline.split(/→|->/).map((x) => x.trim());
  const start = monthYear(a, false);
  const end = ONGOING.test(b) ? now : monthYear(b, true);
  if (start === null || end === null) return undefined;
  return { start, end: Math.max(end, start + 1 / 12) };
}
