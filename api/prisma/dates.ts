/**
 * Always-ahead departure date engine.
 *
 * Every date below is derived from "today" at seed time, so the calendar can
 * never hold a past departure. Weekly departures start next Monday; seasonal
 * windows (Christmas/New Year/Easter/Valentine/school breaks) and group
 * departures are computed from the calendar and auto-roll to the next
 * occurrence once a season passes. Nothing is hardcoded to a year — the
 * content cannot go stale between seasons.
 */

/** Recurring themes. Each turns into seasonal/group departure windows. */
export type ThemeTag =
  | 'CHRISTMAS'
  | 'NEW_YEAR'
  | 'EASTER'
  | 'VALENTINE'
  | 'SCHOOL_HOLIDAY'
  | 'GROUP_DEPARTURE';

export interface PlannedDeparture {
  startDate: Date;
  price: number;
  isGuaranteed: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;
/** Plan seasonal windows up to ~16 months ahead so "next season" is always visible. */
const LOOKAHEAD_MS = 16 * 30 * DAY_MS;

/** Themes that command peak-season pricing (peak = maxPrice instead of minPrice). */
const PEAK_THEMES: ReadonlySet<ThemeTag> = new Set<ThemeTag>(['CHRISTMAS', 'NEW_YEAR', 'EASTER']);

export function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function addDays(d: Date, days: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + days);
  return c;
}

export function nextMonday(weeksAhead = 0): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? 1 : 8 - day; // days until next Monday
  d.setDate(d.getDate() + diff + weeksAhead * 7);
  return d;
}

/** Next occurrence of (month, day) strictly after `after` — rolls to next year once passed. */
export function nextOccurrence(month: number, day: number, after: Date): Date {
  const a = startOfDay(after);
  const candidate = new Date(a.getFullYear(), month - 1, day);
  if (candidate.getTime() <= a.getTime()) {
    candidate.setFullYear(a.getFullYear() + 1);
  }
  return candidate;
}

/** Gregorian computus — the date of Easter Sunday for a given year. */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function nextEaster(after: Date): Date {
  const a = startOfDay(after);
  let e = easterSunday(a.getFullYear());
  if (e.getTime() <= a.getTime()) {
    e = easterSunday(a.getFullYear() + 1);
  }
  return e;
}

/** Kenyan school breaks (approximate): April ~10th, August ~10th, November ~25th. */
const SCHOOL_BREAK_STARTS: ReadonlyArray<[number, number]> = [
  [3, 10], // April
  [7, 10], // August
  [10, 25], // Late November / December
];

export function nextSchoolBreak(after: Date): Date {
  const a = startOfDay(after);
  const candidates: Date[] = [];
  for (const [month, day] of SCHOOL_BREAK_STARTS) {
    candidates.push(new Date(a.getFullYear(), month, day));
    candidates.push(new Date(a.getFullYear() + 1, month, day));
  }
  return candidates
    .filter((c) => c.getTime() > a.getTime())
    .sort((x, y) => x.getTime() - y.getTime())[0];
}

/** Compute a safari's forward departure calendar (weekly + themed windows). */
export function planDepartures(
  safari: { themes?: ThemeTag[]; minPrice: number; maxPrice: number },
  after: Date,
): PlannedDeparture[] {
  const now = startOfDay(after);
  const horizon = new Date(now.getTime() + LOOKAHEAD_MS);
  const windows: Array<{ date: Date; peak: boolean; guaranteed: boolean }> = [];

  const push = (d: Date, opts: { peak?: boolean; guaranteed?: boolean } = {}) => {
    const c = startOfDay(new Date(d));
    if (c.getTime() > now.getTime() && c.getTime() <= horizon.getTime()) {
      windows.push({ date: c, peak: !!opts.peak, guaranteed: !!opts.guaranteed });
    }
  };

  // Weekly departures for every safari.
  for (let i = 0; i < 8; i++) {
    push(nextMonday(i));
  }

  // Themed windows — only for safaris flagged with themes. Peak themes command
  // peak-season pricing on their window dates only; group departures are
  // guaranteed on their shared-departure dates only.
  for (const theme of safari.themes ?? []) {
    const peak = PEAK_THEMES.has(theme);
    const guaranteed = theme === 'GROUP_DEPARTURE';
    switch (theme) {
      case 'CHRISTMAS': {
        const xmas = nextOccurrence(12, 25, now);
        push(new Date(xmas.getFullYear(), 11, 23), { peak }); // arrive just before the day
        push(xmas, { peak }); // Christmas Day start
        push(new Date(xmas.getFullYear(), 11, 28), { peak }); // post-Christmas week
        break;
      }
      case 'NEW_YEAR': {
        const ny = nextOccurrence(1, 1, now);
        push(new Date(ny.getFullYear() - 1, 11, 28), { peak }); // NYE week
        push(ny, { peak }); // New Year's Day start
        break;
      }
      case 'EASTER': {
        const e = nextEaster(now);
        push(new Date(e.getFullYear(), e.getMonth(), e.getDate() - 3), { peak }); // Maundy Thursday
        push(e, { peak }); // Easter Sunday
        break;
      }
      case 'VALENTINE': {
        const v = nextOccurrence(2, 14, now);
        push(v);
        push(new Date(v.getFullYear(), 1, 15));
        break;
      }
      case 'SCHOOL_HOLIDAY': {
        const b = nextSchoolBreak(now);
        push(b); // first week of the break
        push(new Date(b.getFullYear(), b.getMonth(), b.getDate() + 7)); // mid-break
        break;
      }
      case 'GROUP_DEPARTURE': {
        // Next Saturday, then every fortnight — a simple guaranteed shared-departure cadence.
        const offset = (6 - now.getDay() + 7) % 7;
        const sat = addDays(now, offset === 0 ? 7 : offset);
        push(sat, { guaranteed });
        push(addDays(sat, 14), { guaranteed });
        push(addDays(sat, 28), { guaranteed });
        break;
      }
    }
  }

  // Merge with first-wins dedupe, prioritising peak (0) then guaranteed (1)
  // then regular (2) so a date that lands in a festive window and on a weekly
  // Monday is priced as the festive departure it belongs to.
  const rank = (w: { peak: boolean; guaranteed: boolean }): number =>
    w.peak ? 0 : w.guaranteed ? 1 : 2;
  windows.sort((a, b) => rank(a) - rank(b));

  const byDate = new Map<number, PlannedDeparture>();
  for (const w of windows) {
    const t = w.date.getTime();
    if (byDate.has(t)) continue;
    byDate.set(t, {
      startDate: w.date,
      price: w.peak ? safari.maxPrice : safari.minPrice,
      isGuaranteed: w.guaranteed,
    });
  }

  return [...byDate.values()].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}