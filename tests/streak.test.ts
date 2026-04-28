import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStats, hasCompletionOnDate } from '../lib/streak.ts';

test('daily streak counts consecutive calendar days', () => {
  const stats = calculateStats(['2026-04-28', '2026-04-27', '2026-04-26'], {
    frequency: 'daily',
    asOf: new Date('2026-04-28T15:00:00Z')
  });

  assert.equal(stats.streak, 3);
  assert.equal(stats.totalCompletedDays, 3);
  assert.equal(stats.totalCompletedPeriods, 3);
});

test('daily streak allows previous day if today is not completed yet', () => {
  const stats = calculateStats(['2026-04-27', '2026-04-26'], {
    frequency: 'daily',
    asOf: new Date('2026-04-28T09:00:00Z')
  });

  assert.equal(stats.streak, 2);
});

test('weekly streak counts consecutive ISO weeks', () => {
  const stats = calculateStats(['2026-04-28', '2026-04-20', '2026-04-14'], {
    frequency: 'weekly',
    asOf: new Date('2026-04-29T12:00:00Z')
  });

  assert.equal(stats.streak, 3);
  assert.equal(stats.totalCompletedPeriods, 3);
});

test('weekly streak breaks on missing week gap', () => {
  const stats = calculateStats(['2026-04-28', '2026-04-10'], {
    frequency: 'weekly',
    asOf: new Date('2026-04-29T12:00:00Z')
  });

  assert.equal(stats.streak, 1);
});

test('duplicate date completions are not double counted and can be detected', () => {
  const stats = calculateStats(['2026-04-28', '2026-04-28', '2026-04-27'], {
    frequency: 'daily',
    asOf: new Date('2026-04-28T12:00:00Z')
  });

  assert.equal(stats.totalCompletedDays, 2);
  assert.equal(hasCompletionOnDate(['2026-04-28', '2026-04-27'], '2026-04-28'), true);
  assert.equal(hasCompletionOnDate(['2026-04-27'], '2026-04-28'), false);
});
