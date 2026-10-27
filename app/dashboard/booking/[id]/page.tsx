import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getBookingById, getItemById, getUserById } from "@/lib/store";
import { formatKES } from "@/lib/format";
import { formatRange, formatDate } from "@/lib/dates";
import { site, waLink } from "@/lib/site";
import { BookingStatusTag } from "@/components/status-tag";
import { BookingTimeline } from "@/components/booking-timeline";
import { BookingActions } from "@/components/booking-actions";
import { TimelineVisible } from "@/components/timeline-visible";
import { MessageComposer } from "@/components/message-composer";
import {
  IconArrowRight,
  IconInfo,
  IconPhone,
  IconPin,
  IconShield,
  IconWhatsApp,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking",
  robots: { index: false, follow: false },
};

type Params = Promise<{ id: string }>;

export default async function BookingDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="wrap py-12">
        <h1 className="text-[30px]">Sign in to open this booking</h1>
        <p className="mt-2 max-w-lg text-[15px] text-copy">
          Booking details are private to the owner and the renter involved.
        </p>
        <Link href={`/login?next=${encodeURIComponent(`/dashboard/booking/${id}`)}`} className="btn-primary mt-5">
          Sign in
        </Link>
      </div>
    );
  }

  const booking = await getBookingById(id);
  if (!booking) notFound();

  const isOwner = booking.ownerId === user.id;
  const isRenter = booking.renterId === user.id;
  if (!isOwner && !isRenter) notFound();

  const [item, counterpart] = await Promise.all([
    getItemById(booking.itemId),
    getUserById(isOwner ? booking.renterId : booking.ownerId),
  ]);

  const counterpartName = isOwner ? booking.renterName : booking.ownerName;
  const counterpartRole = isOwner ? "Renter" : "Owner";
  const counterpartPhone = counterpart?.phone ?? (isOwner ? booking.renterPhone : "");

  return (
    <div className="wrap py-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="text-[13px] text-copy">
        <Link href="/dashboard" className="hover:text-ink">
          Dashboard
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{booking.id}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Booking {booking.id}</p>
          <h1 className="mt-1.5 text-[28px] sm:text-[36px]">
            {isOwner ? `Hire request from ${booking.renterName.split(" ")[0]}` : booking.itemTitle}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px] text-copy">
            <BookingStatusTag status={booking.status} />
            <span>
              {formatRange(booking.startDate, booking.endDate)}. {booking.days}{" "}
              {booking.days === 1 ? "day" : "days"}.
            </span>
            <span className="inline-flex items-center gap-1">
              <IconPin size={14} />
              {item ? `${item.area}, ${item.county}` : "Kenya"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard" className="btn-outline btn-sm">
            Back to dashboard
          </Link>
          {item && (
            <Link href={`/item/${item.slug}`} className="btn-quiet btn-sm">
              View listing
              <IconArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
        <div className="space-y-6">
          <section className="card" aria-labelledby="item-heading">
            <h2 id="item-heading" className="sr-only">
              Item and money
            </h2>
            <div className="flex flex-col gap-4 p-5 sm:flex-row">
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[4px] border border-line bg-wash sm:h-24 sm:w-32">
                <Image
                  src={booking.itemImage}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 128px, 100vw"
                  className="object-cover"
                  unoptimized={booking.itemImage.startsWith("data:")}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[18px] leading-snug">{booking.itemTitle}</h3>
                <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-[14px] sm:grid-cols-2">
                  <div className="flex justify-between gap-2 border-b border-line py-1 sm:border-0">
                    <dt className="text-copy">Daily rate</dt>
                    <dd className="text-ink">{formatKES(booking.dailyRate)}</dd>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-line py-1 sm:border-0">
                    <dt className="text-copy">Hire fee</dt>
                    <dd className="price">{formatKES(booking.total)}</dd>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-line py-1 sm:border-0">
                    <dt className="text-copy">Deposit</dt>
                    <dd className="text-ink">{formatKES(booking.deposit)}</dd>
                  </div>
                  <div className="flex justify-between gap-2 py-1">
                    <dt className="text-copy">Requested</dt>
                    <dd className="text-ink">{formatDate(booking.createdAt.slice(0, 10))}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="border-t border-line bg-wash p-4 text-[13px] leading-relaxed text-charcoal">
              <span className="flex items-start gap-2">
                <IconInfo size={16} className="mt-0.5 shrink-0" />
                The hire fee goes to the owner at handover. The deposit is agreed between both
                sides and handled off platform. Keep the photos and checklist below as your
                record.
              </span>
            </div>
          </section>

          <section className="card p-5" aria-labelledby="timeline-heading">
            <h2 id="timeline-heading" className="text-[20px]">
              Status timeline
            </h2>
            <p className="mt-1 text-[13px] text-copy">
              Each stage is recorded on the booking. Vertical on a phone, horizontal on a wider
              screen.
            </p>
            <div className="mt-5">
              <TimelineVisible>
                <BookingTimeline
                  status={booking.status}
                  startDate={booking.startDate}
                  endDate={booking.endDate}
                  updatedAt={booking.updatedAt}
                />
              </TimelineVisible>
            </div>
          </section>

          <section className="card p-5" aria-labelledby="checklist-heading">
            <h2 id="checklist-heading" className="text-[20px]">
              Handover checklist
            </h2>
            <p className="mt-1 text-[13px] text-copy">
              {isOwner
                ? "Run through this with the renter before they leave with the item."
                : "Run through this with the owner before you leave, and again at return."}
            </p>
            <div className="mt-4">
              <BookingActions
                bookingId={booking.id}
                status={booking.status}
                checklist={booking.checklist}
                canManageStatus={isOwner}
              />
            </div>
          </section>

          {booking.note && (
            <section className="border border-line p-5" aria-labelledby="note-heading">
              <h2 id="note-heading" className="text-[18px]">
                Note from the {isOwner ? "renter" : "owner"}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-copy">{booking.note}</p>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="card p-5" aria-labelledby="people-heading">
            <h2 id="people-heading" className="text-[18px]">
              {counterpartRole} details
            </h2>
            <p className="mt-2 text-[16px] font-medium text-ink">{counterpartName}</p>
            <p className="text-[13px] text-copy">
              {counterpart?.county ?? item?.county ?? "Kenya"}
              {counterpart?.createdAt
                ? `. On Ruth Rentals since ${formatDate(counterpart.createdAt.slice(0, 10))}`
                : ""}
            </p>

            {counterpartPhone ? (
              <a
                href={`tel:${counterpartPhone}`}
                className="mt-3 flex min-h-11 items-center gap-2 border border-line px-3 text-[14px] text-ink"
              >
                <IconPhone size={17} />
                {counterpartPhone}
              </a>
            ) : (
              <p className="mt-3 text-[13px] text-copy">
                Phone number is shared once the booking is confirmed.
              </p>
            )}

            <a
              href={waLink(
                `Hi ${counterpartName.split(" ")[0]}, this is about booking ${booking.id} on Ruth Rentals.`,
              )}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-outline btn-sm mt-2 w-full"
            >
              <IconWhatsApp size={17} />
              WhatsApp support
            </a>

            {counterpart && (
              <MessageComposer
                toUserId={counterpart.id}
                bookingId={booking.id}
                itemId={booking.itemId}
                label={`Message ${counterpartName}`}
              />
            )}
          </section>

          <section className="border border-line p-5" aria-labelledby="deposit-heading">
            <h2 id="deposit-heading" className="flex items-center gap-2 text-[16px]">
              <IconShield size={18} className="text-teal" />
              Deposit and damage
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-copy">
              The deposit of {formatKES(booking.deposit)} is paid directly to the{" "}
              {isOwner ? "you" : "owner"} and refunded on return. Ruth Rentals is a platform, not
              an insurer. Agree in writing how damage is valued before the handover.
            </p>
            <p className="mt-2 text-[13px] text-copy">
              Disputes? WhatsApp {site.whatsappDisplay}. We can share the booking record, but we
              do not settle payments.
            </p>
          </section>

          <section className="bg-wash p-5">
            <h2 className="text-[16px]">Next steps</h2>
            <ul className="mt-2 space-y-2 text-[13px] text-charcoal">
              <li className="flex items-start gap-2">
                <IconPin size={15} className="mt-0.5 shrink-0 text-teal" />
                {item?.pickupNote ?? "Agree a pickup point in the messages."}
              </li>
              <li className="flex items-start gap-2">
                <IconShield size={15} className="mt-0.5 shrink-0 text-teal" />
                Take photos before the item leaves and when it comes back.
              </li>
              <li className="flex items-start gap-2">
                <IconInfo size={15} className="mt-0.5 shrink-0 text-teal" />
                Return on {formatDate(booking.endDate)} or message the owner early.
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
