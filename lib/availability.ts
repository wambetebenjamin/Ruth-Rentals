import type { Booking, Item } from "./types";
import { eachDate, isBlocked } from "./dates";

const blockingStatuses = new Set(["requested", "confirmed", "collected"]);

export function itemBlockedDates(item: Item, bookings: Booking[]): string[] {
  const dates = new Set(item.blockedDates);
  for (const booking of bookings) {
    if (booking.itemId !== item.id) continue;
    if (!blockingStatuses.has(booking.status)) continue;
    for (const date of eachDate(booking.startDate, booking.endDate)) {
      dates.add(date);
    }
  }
  return Array.from(dates).sort();
}

export function checkAvailability(
  item: Item,
  bookings: Booking[],
  startDate: string,
  endDate: string,
): { available: boolean; blocked: string[] } {
  const blockedDates = itemBlockedDates(item, bookings);
  const blockedForRange = eachDate(startDate, endDate).filter((date) =>
    blockedDates.includes(date),
  );
  return { available: blockedForRange.length === 0, blocked: blockedForRange };
}

export function itemIsFreeForRange(
  item: Item,
  bookings: Booking[],
  startDate: string,
  endDate: string,
): boolean {
  return !isBlocked(itemBlockedDates(item, bookings), startDate, endDate);
}
