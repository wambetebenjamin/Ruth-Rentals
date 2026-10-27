import type { BookingStatus, ItemStatus } from "@/lib/types";

const bookingLabels: Record<BookingStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  collected: "Collected",
  returned: "Returned",
  declined: "Declined",
};

const bookingClasses: Record<BookingStatus, string> = {
  requested: "border-line bg-wash text-charcoal",
  confirmed: "border-teal bg-teal/15 text-teal-ink",
  collected: "border-ink bg-ink text-white",
  returned: "border-line bg-paper text-copy",
  declined: "border-line bg-paper text-copy line-through",
};

export function BookingStatusTag({ status }: { status: BookingStatus }) {
  return (
    <span className={`tag ${bookingClasses[status]}`}>{bookingLabels[status]}</span>
  );
}

export function ItemStatusTag({ status }: { status: ItemStatus }) {
  return (
    <span className={`tag ${status === "live" ? "tag-teal" : "bg-wash text-copy"}`}>
      {status === "live" ? "Live" : "Paused"}
    </span>
  );
}

export const bookingStatusLabel = (status: BookingStatus) => bookingLabels[status];
