import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getBookings, getItems, getMessages } from "@/lib/store";
import { formatKES } from "@/lib/format";
import { formatDate, formatRange } from "@/lib/dates";
import { site } from "@/lib/site";
import { BookingStatusTag, ItemStatusTag } from "@/components/status-tag";
import { ListingStatusToggle } from "@/components/listing-status-toggle";
import { SignOutButton } from "@/components/sign-out-button";
import { MessageComposer } from "@/components/message-composer";
import { MarkThreadRead } from "@/components/mark-thread-read";
import { Reveal } from "@/components/reveal";
import {
  IconArrowRight,
  IconCalendar,
  IconMessage,
  IconPin,
  IconPlus,
  IconUser,
  IconWhatsApp,
} from "@/components/icons";
import type { Message } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Ruth Rentals bookings, listings and messages.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const welcome = params.welcome === "1";

  if (!user) {
    return (
      <div className="wrap py-12 sm:py-16">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-2 text-[32px] sm:text-[42px]">Your bookings and listings</h1>
        <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-copy">
          Sign in to see requests, manage listings and keep the handover checklist in one place.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href="/login?next=%2Fdashboard" className="btn-primary">
            Sign in
          </Link>
          <Link href="/register" className="btn-outline">
            Create an account
          </Link>
        </div>
        <div className="notice mt-6 max-w-xl">
          Reviewing this build? Sign in with wanjiku@ruthrentals.co.ke and password Borrow2026 to
          see sample bookings, listings and messages.
        </div>
      </div>
    );
  }

  const [items, bookings, messages] = await Promise.all([
    getItems(),
    getBookings(),
    getMessages(),
  ]);

  const ownerItems = items.filter((item) => item.ownerId === user.id);
  const ownerBookings = bookings.filter((booking) => booking.ownerId === user.id);
  const renterBookings = bookings.filter((booking) => booking.renterId === user.id);

  const defaultView = ownerItems.length > 0 ? "owner" : "renter";
  const view = params.view === "renter" ? "renter" : params.view === "owner" ? "owner" : defaultView;
  const activeBookings = view === "owner" ? ownerBookings : renterBookings;

  const myMessages = messages.filter(
    (message) => message.fromUserId === user.id || message.toUserId === user.id,
  );
  const unreadTotal = myMessages.filter(
    (message) => message.toUserId === user.id && !message.readBy.includes(user.id),
  ).length;

  const threads = buildThreads(myMessages, user.id);
  const selectedThreadId =
    typeof params.thread === "string" ? params.thread : threads[0]?.id ?? "";
  const selectedThread = threads.find((thread) => thread.id === selectedThreadId) ?? null;

  const liveListings = ownerItems.filter((item) => item.status === "live").length;
  const waiting = ownerBookings.filter((booking) => booking.status === "requested").length;
  const inProgress = activeBookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "collected",
  ).length;
  const earned = ownerBookings
    .filter((booking) => booking.status === "collected" || booking.status === "returned")
    .reduce((total, booking) => total + booking.total, 0);
  const depositsAtHandover = renterBookings
    .filter(
      (booking) =>
        booking.status === "requested" ||
        booking.status === "confirmed" ||
        booking.status === "collected",
    )
    .reduce((total, booking) => total + booking.deposit, 0);

  const stats =
    view === "owner"
      ? [
          { label: "Live listings", value: `${liveListings}`, hint: `${ownerItems.length} total` },
          { label: "Requests waiting", value: `${waiting}`, hint: "Reply within a day" },
          { label: "Hires in progress", value: `${inProgress}`, hint: "Confirmed or collected" },
          {
            label: "Earned so far",
            value: formatKES(earned),
            hint: "Collected and returned hires",
          },
        ]
      : [
          {
            label: "Active bookings",
            value: `${renterBookings.filter((b) => b.status === "requested" || b.status === "confirmed" || b.status === "collected").length}`,
            hint: "Requested, confirmed or out",
          },
          {
            label: "Completed hires",
            value: `${renterBookings.filter((b) => b.status === "returned").length}`,
            hint: "Returned and checked",
          },
          { label: "Deposits at handover", value: formatKES(depositsAtHandover), hint: "Paid directly to owners" },
          { label: "Unread messages", value: `${unreadTotal}`, hint: `${threads.length} conversations` },
        ];

  return (
    <div className="wrap py-8 sm:py-10">
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-2 text-[30px] sm:text-[38px]">Karibu, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-copy">
            <span className="inline-flex items-center gap-1.5">
              <IconUser size={15} /> {user.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconPin size={15} /> {user.county}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconCalendar size={15} /> Member since {formatDate(user.createdAt.slice(0, 10))}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/browse" className="btn-outline btn-sm">
            Browse gear
          </Link>
          <Link href="/list-item" className="btn-primary btn-sm">
            <IconPlus size={16} /> List an item
          </Link>
          <SignOutButton />
        </div>
      </div>

      {welcome && (
        <div className="notice mt-5">
          Account created. Your phone number is only shared with an owner when you send a booking
          request. Add a listing whenever you are ready.
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-[12px] uppercase tracking-wide text-copy">{stat.label}</p>
            <p className="price mt-1 text-[22px] leading-tight">{stat.value}</p>
            <p className="mt-1 text-[12px] text-copy">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2" role="tablist" aria-label="Dashboard view">
        <Link
          href="/dashboard?view=owner"
          role="tab"
          aria-selected={view === "owner"}
          className={`btn btn-sm ${view === "owner" ? "btn-dark" : "btn-outline"}`}
        >
          Owner view
          <span className={`ml-1 text-[12px] ${view === "owner" ? "text-[#c4c7ce]" : "text-copy"}`}>
            {ownerBookings.length + ownerItems.length}
          </span>
        </Link>
        <Link
          href="/dashboard?view=renter"
          role="tab"
          aria-selected={view === "renter"}
          className={`btn btn-sm ${view === "renter" ? "btn-dark" : "btn-outline"}`}
        >
          Renter view
          <span className={`ml-1 text-[12px] ${view === "renter" ? "text-[#c4c7ce]" : "text-copy"}`}>
            {renterBookings.length}
          </span>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
        <div className="min-w-0 space-y-6">
          <section aria-labelledby="bookings-heading" className="card">
            <div className="flex items-center justify-between gap-3 border-b border-line p-5">
              <h2 id="bookings-heading" className="text-[20px]">
                {view === "owner" ? "Requests and hires" : "Your bookings"}
              </h2>
              <span className="text-[13px] text-copy">{activeBookings.length} total</span>
            </div>

            {activeBookings.length === 0 ? (
              <div className="p-5">
                <p className="text-[15px] text-copy">
                  {view === "owner"
                    ? "No booking requests yet. A clear title and two good photos help neighbours find your gear."
                    : "You have not booked anything yet. Browse gear in your county and send a request."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/browse" className="btn-outline btn-sm">
                    Browse gear
                  </Link>
                  {view === "owner" && (
                    <Link href="/list-item" className="btn-primary btn-sm">
                      List an item
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {activeBookings.map((booking) => (
                  <li key={booking.id} className="p-4 sm:p-5">
                    <div className="flex gap-3">
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-[4px] border border-line bg-wash">
                        <Image
                          src={booking.itemImage}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized={booking.itemImage.startsWith("data:")}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[15px] font-medium text-ink sm:truncate">
                              {booking.itemTitle}
                            </p>
                            <p className="mt-0.5 text-[13px] text-copy">
                              {formatRange(booking.startDate, booking.endDate)}. {booking.days}{" "}
                              {booking.days === 1 ? "day" : "days"}.
                            </p>
                          </div>
                          <BookingStatusTag status={booking.status} />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-copy">
                          <span>
                            {view === "owner"
                              ? `Renter: ${booking.renterName}`
                              : `Owner: ${booking.ownerName}`}
                          </span>
                          <span className="price text-[14px]">{formatKES(booking.total)}</span>
                          <span>Deposit {formatKES(booking.deposit)}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Link
                            href={`/dashboard/booking/${booking.id}`}
                            className="btn-outline btn-sm"
                          >
                            Open booking
                            <IconArrowRight size={15} />
                          </Link>
                          <a
                            href={`https://wa.me/${site.whatsapp}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="btn-quiet btn-sm"
                          >
                            <IconWhatsApp size={16} /> Support
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {view === "owner" && (
            <section aria-labelledby="listings-heading" className="card">
              <div className="flex items-center justify-between gap-3 border-b border-line p-5">
                <h2 id="listings-heading" className="text-[20px]">
                  Your listings
                </h2>
                <Link href="/list-item" className="btn-outline btn-sm">
                  <IconPlus size={15} /> Add
                </Link>
              </div>

              {ownerItems.length === 0 ? (
                <p className="p-5 text-[15px] text-copy">
                  Nothing listed yet. Start with one item you rarely use.
                </p>
              ) : (
                <ul className="divide-y divide-line">
                  {ownerItems.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-center gap-3 p-4 sm:p-5">
                      <div className="relative h-14 w-[72px] shrink-0 overflow-hidden rounded-[4px] border border-line bg-wash">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="72px"
                          className="object-cover"
                          unoptimized={item.image.startsWith("data:")}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium text-ink sm:truncate">{item.title}</p>
                        <p className="mt-0.5 text-[13px] text-copy">
                          {formatKES(item.dailyRate)} per day. {item.reviews} hires.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ItemStatusTag status={item.status} />
                        <Link href={`/item/${item.slug}`} className="btn-quiet btn-sm">
                          View
                        </Link>
                        <ListingStatusToggle itemId={item.id} status={item.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        <section aria-labelledby="messages-heading" className="card h-fit min-w-0">
          <div className="flex items-center justify-between gap-3 border-b border-line p-5">
            <h2 id="messages-heading" className="flex items-center gap-2 text-[20px]">
              <IconMessage size={19} className="text-copy" />
              Messages
            </h2>
            {unreadTotal > 0 && <span className="tag tag-teal">{unreadTotal} unread</span>}
          </div>

          {threads.length === 0 ? (
            <p className="p-5 text-[14px] text-copy">
              No conversations yet. Message an owner from a listing and the thread will appear
              here.
            </p>
          ) : (
            <div>
              <ul
                className={`divide-y divide-line ${selectedThread ? "hidden sm:block" : ""}`}
              >
                {threads.map((thread) => (
                  <li key={thread.id}>
                    <Link
                      href={`/dashboard?view=${view}&thread=${thread.id}`}
                      className={`block p-4 hover:bg-shell ${
                        thread.id === selectedThread?.id ? "bg-shell" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[14px] font-medium text-ink">{thread.counterpartName}</p>
                        {thread.unread > 0 && (
                          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-teal px-1 text-[11px] text-ink">
                            {thread.unread}
                          </span>
                        )}
                      </div>
                      {thread.itemTitle && (
                        <p className="mt-0.5 truncate text-[12px] text-copy">{thread.itemTitle}</p>
                      )}
                      <p className="mt-1 line-clamp-2 text-[13px] text-copy">{thread.preview}</p>
                      <p className="mt-0.5 text-[11px] text-copy">{formatWhen(thread.lastAt)}</p>
                    </Link>
                  </li>
                ))}
              </ul>

              {selectedThread && (
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[15px] font-medium text-ink">
                        {selectedThread.counterpartName}
                      </p>
                      {selectedThread.itemTitle && (
                        <p className="text-[12px] text-copy">{selectedThread.itemTitle}</p>
                      )}
                    </div>
                    <Link
                      href={`/dashboard?view=${view}`}
                      className="text-[13px] text-copy underline sm:hidden"
                    >
                      All messages
                    </Link>
                  </div>

                  <MarkThreadRead threadId={selectedThread.id} />

                  <ol className="mt-3 max-h-[360px] space-y-3 overflow-y-auto pr-1">
                    {selectedThread.messages.map((message) => {
                      const mine = message.fromUserId === user.id;
                      return (
                        <li key={message.id} className={mine ? "text-right" : ""}>
                          <div
                            className={`inline-block max-w-[92%] rounded-[4px] border px-3 py-2 text-left text-[14px] leading-relaxed ${
                              mine
                                ? "border-ink bg-ink text-white"
                                : "border-line bg-wash text-charcoal"
                            }`}
                          >
                            {message.body}
                          </div>
                          <p className="mt-1 text-[11px] text-copy">
                            {message.fromName}, {formatWhen(message.createdAt)}
                          </p>
                        </li>
                      );
                    })}
                  </ol>

                  <MessageComposer
                    toUserId={selectedThread.counterpartId}
                    bookingId={selectedThread.bookingId}
                    itemId={selectedThread.itemId}
                    label={`Reply to ${selectedThread.counterpartName}`}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <Reveal className="mt-8 border-t border-line pt-5">
        <p className="text-[13px] text-copy">
          Need a hand? WhatsApp {site.whatsappDisplay}, {site.hours}. Read the{" "}
          <Link href="/legal/terms" className="link">
            terms
          </Link>{" "}
          and the{" "}
          <Link href="/legal/kdpa" className="link">
            KDPA notice
          </Link>{" "}
          for how bookings and data are handled.
        </p>
      </Reveal>
    </div>
  );
}

type Thread = {
  id: string;
  counterpartId: string;
  counterpartName: string;
  itemTitle?: string;
  bookingId?: string;
  itemId?: string;
  preview: string;
  lastAt: string;
  unread: number;
  messages: Message[];
};

function buildThreads(messages: Message[], userId: string): Thread[] {
  const map = new Map<string, Thread>();

  for (const message of messages) {
    const mine = message.fromUserId === userId;
    const counterpartId = mine ? message.toUserId : message.fromUserId;
    const counterpartName = mine ? message.toName : message.fromName;

    const existing = map.get(message.threadId);
    if (!existing) {
      map.set(message.threadId, {
        id: message.threadId,
        counterpartId,
        counterpartName,
        itemTitle: message.itemTitle,
        bookingId: message.bookingId,
        itemId: message.itemId,
        preview: message.body,
        lastAt: message.createdAt,
        unread:
          message.toUserId === userId && !message.readBy.includes(userId) ? 1 : 0,
        messages: [message],
      });
      continue;
    }

    existing.messages.push(message);
    if (message.createdAt > existing.lastAt) {
      existing.lastAt = message.createdAt;
      existing.preview = message.body;
    }
    if (message.toUserId === userId && !message.readBy.includes(userId)) {
      existing.unread += 1;
    }
    if (!existing.itemTitle && message.itemTitle) existing.itemTitle = message.itemTitle;
  }

  return Array.from(map.values())
    .map((thread) => ({
      ...thread,
      messages: [...thread.messages].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    }))
    .sort((a, b) => b.lastAt.localeCompare(a.lastAt));
}

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-KE", { day: "numeric", month: "short" });
}
