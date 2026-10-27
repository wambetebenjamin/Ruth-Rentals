export function todayISO(): string {
  return toISO(new Date());
}

export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromISO(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(value: string | Date, days: number): string {
  const base = typeof value === "string" ? fromISO(value) : new Date(value);
  base.setDate(base.getDate() + days);
  return toISO(base);
}

export function isValidISO(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(fromISO(value).getTime());
}

export function dayCount(startISO: string, endISO: string): number {
  const start = fromISO(startISO).getTime();
  const end = fromISO(endISO).getTime();
  return Math.max(0, Math.round((end - start) / 86_400_000) + 1);
}

export function formatDate(value: string): string {
  if (!isValidISO(value)) return value;
  return fromISO(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatShortDate(value: string): string {
  if (!isValidISO(value)) return value;
  return fromISO(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
  });
}

export function formatRange(startISO: string, endISO: string): string {
  if (startISO === endISO) return formatDate(startISO);
  return `${formatShortDate(startISO)} to ${formatDate(endISO)}`;
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-KE", {
    month: "long",
    year: "numeric",
  });
}

export function monthGrid(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(toISO(new Date(year, month, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function eachDate(startISO: string, endISO: string): string[] {
  const out: string[] = [];
  if (!isValidISO(startISO) || !isValidISO(endISO)) return out;
  let cursor = startISO;
  let guard = 0;
  while (cursor <= endISO && guard < 400) {
    out.push(cursor);
    cursor = addDays(cursor, 1);
    guard += 1;
  }
  return out;
}

export function rangesOverlap(startA: string, endA: string, startB: string, endB: string) {
  return startA <= endB && startB <= endA;
}

export function isBlocked(blockedDates: string[], startISO: string, endISO: string) {
  return eachDate(startISO, endISO).some((date) => blockedDates.includes(date));
}

export function relativeDays(days: number): string {
  return addDays(todayISO(), days);
}
