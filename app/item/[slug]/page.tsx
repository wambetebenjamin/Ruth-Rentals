import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingById, getBookings, getItemBySlug, getItems } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { itemBlockedDates } from "@/lib/availability";
import { categoryName } from "@/lib/catalog";
import { todayISO } from "@/lib/dates";
import { formatKES } from "@/lib/format";
import { site, waLink } from "@/lib/site";
import { Gallery } from "@/components/gallery";
import { BookingForm } from "@/components/booking-form";
import { Rating } from "@/components/rating";
import { ItemCard } from "@/components/item-card";
import { OwnerMessage } from "@/components/owner-message";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/reveal";
import {
  IconCalendar,
  IconCheck,
  IconInfo,
  IconMessage,
  IconPin,
  IconShield,
  IconWhatsApp,
} from "@/components/icons";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return { title: "Listing not found" };

  return {
    title: `${item.title} for hire in ${item.county}`,
    description: `${item.title} in ${item.area}, ${item.county}. ${formatKES(
      item.dailyRate,
    )} per day, deposit ${formatKES(item.deposit)}. ${item.description.slice(0, 110)}...`,
    alternates: { canonical: `/item/${item.slug}` },
    openGraph: {
      title: `${item.title} | Ruth Rentals`,
      description: `Hire from ${item.ownerName} in ${item.area}, ${item.county}.`,
      images: [{ url: item.image, width: 500, height: 375, alt: item.title }],
    },
  };
}

export default async function ItemPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const bookingId = typeof search.booking === "string" ? search.booking : "";

  const item = await getItemBySlug(slug);
  if (!item || item.status !== "live") notFound();

  const [bookings, user, allItems] = await Promise.all([
    getBookings(),
    getCurrentUser(),
    getItems(),
  ]);

  const blockedDates = itemBlockedDates(item, bookings);
  const related = allItems
    .filter(
      (entry) =>
        entry.id !== item.id &&
        entry.status === "live" &&
        (entry.category === item.category || entry.county === item.county),
    )
    .slice(0, 4);

  const confirmedBooking = bookingId ? await getBookingById(bookingId) : null;
  const canMessage =
    user && user.id !== item.ownerId ? user : null;

  const descriptionParts = item.description.split("\n\n");

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    image: `${site.url}${item.image}`,
    description: item.description,
    brand: { "@type": "Brand", name: "Ruth Rentals" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: item.rating,
      reviewCount: item.reviews,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: item.dailyRate,
      availability: "https://schema.org/InStock",
      url: `${site.url}/item/${item.slug}`,
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      seller: { "@type": "Person", name: item.ownerName },
    },
  };

  return (
    <>
      <div className="border-b border-line bg-wash">
        <div className="wrap py-3 text-[13px] text-copy">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/browse" className="hover:text-ink">
              Browse
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/browse?category=${item.category}`} className="hover:text-ink">
              {categoryName(item.category)}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{item.title}</span>
          </nav>
        </div>
      </div>

      <div className="wrap py-8">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/browse?category=${item.category}`} className="tag">
                {categoryName(item.category)}
              </Link>
              {item.promoted && <span className="tag tag-solid">Promoted</span>}
              <span className="tag">
                <IconPin size={13} />
                {item.area}, {item.county}
              </span>
            </div>

            <h1 className="mt-3 text-[30px] sm:text-[40px]">{item.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Rating rating={item.rating} reviews={item.reviews} size="md" label="Owner rating" />
              <span className="inline-flex items-center gap-1.5 text-[13px] text-copy">
                <IconCalendar size={15} />
                {blockedDates.filter((date) => date >= todayISO()).length} dates booked ahead
              </span>
              <span className="inline-flex items-center gap-1.5 text-[13px] text-copy">
                <IconCheck size={15} />
                Handover checklist included
              </span>
            </div>

            <div className="mt-5">
              <Gallery images={item.gallery} title={item.title} />
            </div>

            {confirmedBooking && confirmedBooking.itemId === item.id && (
              <div className="notice mt-5">
                This page was opened from booking <strong>{confirmedBooking.id}</strong>. It is{" "}
                {confirmedBooking.status}. You can track it on your{" "}
                <Link href={`/dashboard/booking/${confirmedBooking.id}`} className="link">
                  booking page
                </Link>
                .
              </div>
            )}

            <section className="mt-8" aria-labelledby="about-item">
              <h2 id="about-item" className="text-[24px]">
                About this gear
              </h2>
              <div className="mt-3 space-y-3 text-[16px] leading-relaxed text-copy">
                {descriptionParts.map((part) => (
                  <p key={part.slice(0, 24)}>{part}</p>
                ))}
              </div>
            </section>

            <section className="mt-8" aria-labelledby="specs">
              <h2 id="specs" className="text-[24px]">
                Details
              </h2>
              <dl className="mt-3 grid gap-x-8 gap-y-0 border-t border-line sm:grid-cols-2">
                {item.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                  >
                    <dt className="text-[14px] text-copy">{spec.label}</dt>
                    <dd className="text-right text-[15px] font-medium text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-8" aria-labelledby="handover">
              <h2 id="handover" className="text-[24px]">
                Handover and deposit
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="border border-line p-4">
                  <p className="flex items-center gap-2 font-medium text-ink">
                    <IconShield size={18} className="text-teal" /> Deposit
                  </p>
                  <p className="price mt-1 text-[19px]">{formatKES(item.deposit)}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-copy">
                    Agreed and handled directly between you and {item.ownerName}. Ruth Rentals
                    does not hold or refund deposits.
                  </p>
                </div>
                <div className="border border-line p-4">
                  <p className="flex items-center gap-2 font-medium text-ink">
                    <IconPin size={18} className="text-teal" /> Pickup
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed text-copy">{item.pickupNote}</p>
                  <p className="mt-1 text-[13px] text-copy">
                    {item.minDays === 1 ? "One day minimum" : `${item.minDays} day minimum`}. Bring
                    an ID and a phone number the owner can reach.
                  </p>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 text-[14px] text-copy">
                <li className="flex items-start gap-2">
                  <IconCheck size={16} className="mt-0.5 shrink-0 text-teal" />
                  Photograph the item together at pickup and at return.
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={16} className="mt-0.5 shrink-0 text-teal" />
                  Count accessories before you leave. Bits, cables and pegs are easy to lose.
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={16} className="mt-0.5 shrink-0 text-teal" />
                  Fuel, transport and cleaning are agreed before the handover, not after.
                </li>
              </ul>
            </section>

            <section className="mt-8" aria-labelledby="owner">
              <h2 id="owner" className="text-[24px]">
                The owner
              </h2>
              <div className="card mt-3 p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <Image
                    src={item.ownerAvatar}
                    alt=""
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[18px] font-medium text-ink">{item.ownerName}</p>
                    <p className="text-[13px] text-copy">
                      In {item.county} since {item.ownerSince}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <div className="text-right">
                      <p className="price text-[17px]">{item.ownerDeals}</p>
                      <p className="text-[12px] text-copy">hires</p>
                    </div>
                    <div className="text-right">
                      <Rating rating={item.ownerRating} label="Owner rating" />
                      <p className="mt-0.5 text-[12px] text-copy">Replies in about 2 hours</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-line pt-4">
                  {canMessage ? (
                    <OwnerMessage
                      toUserId={item.ownerId}
                      ownerName={item.ownerName}
                      itemId={item.id}
                      itemTitle={item.title}
                    />
                  ) : user?.id === item.ownerId ? (
                    <p className="text-[14px] text-copy">
                      This is your listing. Manage it from the{" "}
                      <Link href="/dashboard" className="link">
                        dashboard
                      </Link>
                      .
                    </p>
                  ) : (
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-[14px] text-copy">
                        <IconMessage size={16} />
                        Ask {item.ownerName} a question. Sign in to keep the thread in your
                        dashboard, or send an enquiry as a guest.
                      </p>
                      <EnquiryForm
                        subject={`Question about ${item.title}`}
                        itemSlug={item.slug}
                        defaultMessage={`Hi ${item.ownerName}, I am interested in ${item.title}. `}
                        compact
                        user={user ? { name: user.name, email: user.email, phone: user.phone } : null}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-[88px] lg:self-start" aria-label="Booking">
            <BookingForm
              item={{
                slug: item.slug,
                title: item.title,
                dailyRate: item.dailyRate,
                weeklyRate: item.weeklyRate,
                deposit: item.deposit,
                minDays: item.minDays,
                ownerName: item.ownerName,
              }}
              blockedDates={blockedDates}
              user={user ? { name: user.name, phone: user.phone, email: user.email } : null}
            />

            <div className="card mt-4 p-5">
              <p className="flex items-center gap-2 font-medium text-ink">
                <IconInfo size={18} className="text-teal" /> Not sure about something?
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-copy">
                Talk to a real person before you commit. We can help you compare rates, check a
                county or read a listing.
              </p>
              <a
                href={waLink(`Hi Ruth Rentals, I have a question about ${item.title}.`)}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-outline mt-3 w-full"
              >
                <IconWhatsApp size={18} />
                WhatsApp {site.whatsappDisplay}
              </a>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-12 border-t border-line pt-8" aria-labelledby="related">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 id="related" className="text-[24px]">
                Also near {item.county}
              </h2>
              <Link href={`/browse?county=${encodeURIComponent(item.county)}`} className="btn-outline btn-sm">
                See county
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((entry, index) => (
                <Reveal key={entry.id} delay={index * 50}>
                  <ItemCard item={entry} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
