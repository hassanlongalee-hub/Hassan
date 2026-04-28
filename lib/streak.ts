export type HabitFrequency = 'daily' | 'weekly';

type CalculateStatsOptions = {
  frequency?: HabitFrequency;
  asOf?: Date;
};

function normalizeDate(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function parseDate(value: string) {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date string: ${value}`);
  }

  return normalizeDate(parsed);
}

function shiftDays(date: Date, days: number) {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return normalizeDate(shifted);
}

function startOfIsoWeek(date: Date) {
  const normalized = normalizeDate(date);
  const day = normalized.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return shiftDays(normalized, diffToMonday);
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function uniqueDateKeys(dates: string[]) {
  return [...new Set(dates.filter(Boolean))].sort((a, b) => (a < b ? 1 : -1));
}

function toPeriodKey(dateStr: string, frequency: HabitFrequency) {
  if (frequency === 'daily') {
    return dateStr;
  }

  return toDateKey(startOfIsoWeek(parseDate(dateStr)));
}

function buildPeriodSet(dates: string[], frequency: HabitFrequency) {
  return new Set(uniqueDateKeys(dates).map((date) => toPeriodKey(date, frequency)));
}

function getCurrentPeriodKey(periodSet: Set<string>, frequency: HabitFrequency, asOf: Date) {
  const normalizedAsOf = normalizeDate(asOf);
  const currentPeriodDate = frequency === 'daily' ? normalizedAsOf : startOfIsoWeek(normalizedAsOf);
  const currentKey = toDateKey(currentPeriodDate);

  if (periodSet.has(currentKey)) {
    return currentKey;
  }

  const previousPeriodDate = frequency === 'daily' ? shiftDays(currentPeriodDate, -1) : shiftDays(currentPeriodDate, -7);
  const previousKey = toDateKey(previousPeriodDate);

  return periodSet.has(previousKey) ? previousKey : null;
}

function previousPeriodKey(periodKey: string, frequency: HabitFrequency) {
  const date = parseDate(periodKey);
  return frequency === 'daily' ? toDateKey(shiftDays(date, -1)) : toDateKey(shiftDays(date, -7));
}

export function hasCompletionOnDate(dates: string[], date: string) {
  return dates.includes(date);
}

export function calculateStats(dates: string[], options: CalculateStatsOptions = {}) {
  const frequency = options.frequency ?? 'daily';
  const asOf = options.asOf ?? new Date();

  const uniqueDates = uniqueDateKeys(dates);
  const periodSet = buildPeriodSet(uniqueDates, frequency);
  const periodCount = periodSet.size;

  const startKey = getCurrentPeriodKey(periodSet, frequency, asOf);

  let streak = 0;
  let cursor = startKey;

  while (cursor && periodSet.has(cursor)) {
    streak += 1;
    cursor = previousPeriodKey(cursor, frequency);
  }

  return {
    streak,
    totalCompletedDays: uniqueDates.length,
    totalCompletedPeriods: periodCount
  };
}
