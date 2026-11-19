import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { monthYear, parsePeriod, parseTimeline } from '../src/lib/period.ts';

const NOW = 2026 + 10 / 12; // November 2026

describe('monthYear', () => {
  it('reads short and long month names, start or end of the month', () => {
    assert.equal(monthYear('Oct 2024', false), 2024 + 9 / 12);
    assert.equal(monthYear('October 2024', true), 2024 + 10 / 12);
  });
  it('returns null for a bare year or nonsense', () => {
    assert.equal(monthYear('2024', false), null);
    assert.equal(monthYear('Foo 2024', false), null);
  });
});

describe('parsePeriod', () => {
  it('keeps year-only periods at year level', () => {
    assert.deepEqual(parsePeriod('2023 - 2024', NOW), { start: 2023, end: 2024, ongoing: false });
    assert.deepEqual(parsePeriod('2024 - Present', NOW), { start: 2024, end: NOW, ongoing: true });
  });
  it('places a period with a start month exactly', () => {
    assert.deepEqual(parsePeriod('Oct 2024 - Present', NOW), {
      start: 2024 + 9 / 12,
      end: NOW,
      ongoing: true,
    });
  });
  it('accepts an en dash between the two sides', () => {
    assert.equal(parsePeriod('2022 – 2023', NOW).end, 2023);
  });
});

describe('parseTimeline', () => {
  it('spans from the start of the first month to the end of the last', () => {
    assert.deepEqual(parseTimeline('Mar 2026 → Aug 2026', NOW), {
      start: 2026 + 2 / 12,
      end: 2026 + 8 / 12,
    });
  });
  it('runs an open timeline to now', () => {
    assert.equal(parseTimeline('Nov 2024 → now', NOW)?.end, NOW);
  });
  it('gives up on text it cannot read instead of guessing', () => {
    assert.equal(parseTimeline('since 2024', NOW), undefined);
  });
});
