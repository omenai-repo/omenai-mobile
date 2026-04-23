/** Minimum age (by calendar birth year) for a new roster artist entered manually. */
export const ROSTER_ARTIST_MIN_AGE = 18;

export const ROSTER_BIRTH_YEAR_MIN = 1000;

/** Latest allowed birth year: current calendar year minus minimum age. */
export function rosterBirthYearMaxYear(now: Date = new Date()): number {
  return now.getFullYear() - ROSTER_ARTIST_MIN_AGE;
}

/** `value` must already be trimmed. */
export function isValidRosterBirthYear(
  value: string,
  now: Date = new Date(),
): boolean {
  if (!/^\d{4}$/.test(value)) return false;
  const y = Number(value);
  const max = rosterBirthYearMaxYear(now);
  return y >= ROSTER_BIRTH_YEAR_MIN && y <= max;
}

export function rosterBirthYearValidationMessage(now: Date = new Date()): string {
  const max = rosterBirthYearMaxYear(now);
  return `Artist must be at least ${ROSTER_ARTIST_MIN_AGE} years old.`;
}
