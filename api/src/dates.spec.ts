import {
  addDays,
  easterSunday,
  nextEaster,
  nextMonday,
  nextOccurrence,
  nextSchoolBreak,
  planDepartures,
  startOfDay,
  ThemeTag,
} from '../prisma/dates';

// Fixed reference "today" matching the environment date: Tue 13 Oct 2026.
const REF = new Date(2026, 9, 13, 14, 30, 0);

const iso = (d: Date) => {
  const c = startOfDay(d);
  return `${c.getFullYear()}-${String(c.getMonth() + 1).padStart(2, '0')}-${String(
    c.getDate(),
  ).padStart(2, '0')}`;
};

describe('dates engine — holidays', () => {
  it('rolls Christmas forward to the upcoming season', () => {
    expect(iso(nextOccurrence(12, 25, REF))).toBe('2026-12-25');
    const afterXmas = new Date(2027, 0, 5, 9, 0, 0);
    expect(iso(nextOccurrence(12, 25, afterXmas))).toBe('2027-12-25');
  });

  it('computes Easter Sunday (Gregorian computus) and rolls it', () => {
    expect(iso(easterSunday(2026))).toBe('2026-04-05');
    expect(iso(easterSunday(2027))).toBe('2027-03-28');
    expect(iso(nextEaster(REF))).toBe('2027-03-28'); // this year's Easter already passed
    expect(iso(nextEaster(new Date(2027, 4, 1)))).toBe('2028-04-16');
  });

  it('picks the next Kenyan school break and rolls to the next one', () => {
    expect(iso(nextSchoolBreak(REF))).toBe('2026-11-25');
    expect(iso(nextSchoolBreak(new Date(2026, 11, 15)))).toBe('2027-04-10');
    expect(iso(nextSchoolBreak(new Date(2027, 3, 11)))).toBe('2027-08-10');
  });

  it('exposes the upcoming Monday helper used for weekly departures', () => {
    expect(nextMonday().getDay()).toBe(1);
    expect(iso(nextMonday(0))).toBe('2026-10-19');
    expect(iso(addDays(nextMonday(0), 7))).toBe('2026-10-26');
  });
});

describe('dates engine — always-ahead departures', () => {
  const safari = (themes?: ThemeTag[]) => ({ themes, minPrice: 100, maxPrice: 250 });

  it('never plans a departure in the past', () => {
    for (const themes of [
      undefined,
      ['CHRISTMAS'] as ThemeTag[],
      ['CHRISTMAS', 'NEW_YEAR', 'EASTER', 'VALENTINE', 'SCHOOL_HOLIDAY', 'GROUP_DEPARTURE'] as ThemeTag[],
    ]) {
      const planned = planDepartures(safari(themes), REF);
      expect(planned.length).toBeGreaterThan(0);
      for (const p of planned) {
        expect(p.startDate.getTime()).toBeGreaterThan(REF.getTime());
      }
    }
  });

  it('adds weekly departures for every safari', () => {
    const planned = planDepartures(safari(undefined), REF);
    expect(planned).toHaveLength(8);
    expect(planned.every((p) => p.startDate.getDay() === 1)).toBe(true);
    expect(planned.every((p) => p.price === 100 && !p.isGuaranteed)).toBe(true);
  });

  it('prices Christmas-window departures at peak and plain Mondays at base', () => {
    const planned = planDepartures(safari(['CHRISTMAS', 'NEW_YEAR']), REF);
    const byIso = new Map(planned.map((p) => [iso(p.startDate), p]));
    // Christmas window dates (peak):
    expect(byIso.get('2026-12-23')?.price).toBe(250);
    expect(byIso.get('2026-12-25')?.price).toBe(250);
    expect(byIso.get('2026-12-28')?.price).toBe(250); // Monday collision — peak wins
    expect(byIso.get('2027-01-01')?.price).toBe(250);
    // A plain Monday far from the window stays at base price:
    expect(byIso.get('2026-10-19')?.price).toBe(100);
    expect(byIso.get('2026-11-30')?.price).toBe(100);
    expect(planned).toHaveLength(12); // 8 weekly + 3 Christmas + 1 New Year
  });

  it('marks group-departure Saturdays as guaranteed at base price', () => {
    const planned = planDepartures(safari(['GROUP_DEPARTURE']), REF);
    const guaranteed = planned.filter((p) => p.isGuaranteed);
    expect(guaranteed).toHaveLength(3);
    expect(guaranteed.every((p) => p.startDate.getDay() === 6)).toBe(true); // Saturdays
    expect(guaranteed.every((p) => p.price === 100)).toBe(true);
    // Weekly Mondays stay open, not guaranteed:
    expect(planned.filter((p) => !p.isGuaranteed && p.startDate.getDay() === 1)).toHaveLength(8);
  });

  it('produces a stable, deduplicated ascending calendar', () => {
    const all = ['CHRISTMAS', 'NEW_YEAR', 'EASTER', 'VALENTINE', 'SCHOOL_HOLIDAY', 'GROUP_DEPARTURE'] as ThemeTag[];
    const planned = planDepartures(safari(all), REF);
    const stamps = planned.map((p) => p.startDate.getTime());
    const unique = new Set(stamps);
    expect(unique.size).toBe(stamps.length); // no dupes (unique safariId+startDate)
    expect(stamps).toEqual([...stamps].sort((a, b) => a - b)); // ascending
  });
});