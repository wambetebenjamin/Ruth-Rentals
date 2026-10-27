import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { formatKES } from "@/lib/format";
import { SectionHeading } from "@/components/section-heading";
import { IconCheck, IconClose, IconInfo, IconShield, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free basic listings on Ruth Rentals. An optional promoted listing is KES 499, paid once. No commission on your hire fee.",
  alternates: { canonical: "/pricing" },
};

const rows = [
  { label: "Basic listing", free: true, promoted: true },
  { label: "Photos and description", free: true, promoted: true },
  { label: "Booking requests and messages", free: true, promoted: true },
  { label: "Handover checklist", free: true, promoted: true },
  { label: "Position in browse results", free: false, promoted: true },
  { label: "Promoted label on the listing", free: false, promoted: true },
  { label: "Commission taken from your hire fee", free: false, promoted: false },
  { label: "Card payments handled by Ruth Rentals", free: false, promoted: false },
];

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-line bg-wash">
        <div className="wrap py-10 sm:py-14">
          <p className="eyebrow">Pricing</p>
          <h1 className="mt-2 max-w-3xl text-[32px] sm:text-[46px]">
            Free to list. Pay only if you want to be seen first
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-copy">
            Ruth Rentals does not take a cut of your hire fee. List basic gear for nothing, keep
            every shilling you agree with the renter, and choose a promoted slot only when it is
            worth it to you.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card flex flex-col p-6">
              <p className="eyebrow">Basic</p>
              <h2 className="mt-2 text-[26px]">Free listing</h2>
              <p className="price mt-3 text-[36px]">
                KES 0
                <span className="text-[14px] font-normal text-copy"> forever</span>
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-copy">
                For most owners. Put the item up, take requests, and agree the hire directly with
                your neighbour.
              </p>
              <ul className="mt-5 space-y-2.5 text-[15px] text-charcoal">
                <li className="flex items-start gap-2">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-teal" />
                  Unlimited listings on your account
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-teal" />
                  Up to six photos per item
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-teal" />
                  Booking requests, messages and handover checklist
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-teal" />
                  Pause and resume whenever you need the kit
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-teal" />
                  No commission on any hire
                </li>
              </ul>
              <Link href="/list-item" className="btn-outline mt-6">
                List an item free
              </Link>
            </div>

            <div className="card flex flex-col border-ink p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="eyebrow">Promoted</p>
                <span className="tag tag-teal">Optional</span>
              </div>
              <h2 className="mt-2 text-[26px]">Promoted listing</h2>
              <p className="price mt-3 text-[36px]">
                KSh {site.promotedPrice}
                <span className="text-[14px] font-normal text-copy"> paid once</span>
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-copy">
                For gear that people search for by name. Your listing moves above basic listings
                in browse and gets a small plain label. No colour upgrade, no flashing badges.
              </p>
              <ul className="mt-5 space-y-2.5 text-[15px] text-charcoal">
                <li className="flex items-start gap-2">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-teal" />
                  Everything in the free plan
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-teal" />
                  Above basic listings in browse and category pages
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-teal" />
                  Promoted label in search results
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-teal" />
                  Runs for 30 days, then returns to a basic listing
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={17} className="mt-0.5 shrink-0 text-teal" />
                  Invoice during the pilot
                </li>
              </ul>
              <Link href="/list-item" className="btn-primary mt-6">
                Promote while listing
              </Link>
            </div>
          </div>

          <div className="mt-8 hidden sm:block">
            <table className="w-full border-collapse text-left text-[14px]">
              <caption className="sr-only">Compare basic and promoted listings</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="py-3 pr-4 font-medium text-ink">
                    What you get
                  </th>
                  <th scope="col" className="py-3 px-3 text-center font-medium text-ink">
                    Basic
                  </th>
                  <th scope="col" className="py-3 px-3 text-center font-medium text-ink">
                    Promoted
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-line">
                    <th scope="row" className="py-3 pr-4 font-normal text-copy">
                      {row.label}
                    </th>
                    <td className="py-3 px-3 text-center">
                      {row.free ? (
                        <IconCheck size={18} className="mx-auto text-teal" />
                      ) : (
                        <IconClose size={16} className="mx-auto text-line" />
                      )}
                      <span className="sr-only">{row.free ? "Included" : "Not included"}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {row.promoted ? (
                        <IconCheck size={18} className="mx-auto text-teal" />
                      ) : (
                        <IconClose size={16} className="mx-auto text-line" />
                      )}
                      <span className="sr-only">{row.promoted ? "Included" : "Not included"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-8 divide-y divide-line border-y border-line sm:hidden">
            {rows.map((row) => (
              <li key={row.label} className="py-3">
                <p className="text-[14px] font-medium text-ink">{row.label}</p>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-copy">
                  <span className="w-[62px] shrink-0">Basic</span>
                  {row.free ? (
                    <IconCheck size={16} className="text-teal" />
                  ) : (
                    <IconClose size={14} className="text-line" />
                  )}
                  <span className="sr-only">{row.free ? "Included" : "Not included"}</span>
                </p>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-copy">
                  <span className="w-[62px] shrink-0">Promoted</span>
                  {row.promoted ? (
                    <IconCheck size={16} className="text-teal" />
                  ) : (
                    <IconClose size={14} className="text-line" />
                  )}
                  <span className="sr-only">{row.promoted ? "Included" : "Not included"}</span>
                </p>
              </li>
            ))}
          </ul>

          <div className="notice mt-6 flex items-start gap-2">
            <IconInfo size={17} className="mt-0.5 shrink-0" />
            <p>
              Promoted placement is an advertising slot, not a guarantee of a booking. Renters
              still check dates, condition and price. Payment is by invoice during the pilot, and
              no card is charged on this site.
            </p>
          </div>
        </div>
      </section>

      <section className="section border-y border-line bg-shell">
        <div className="wrap">
          <SectionHeading
            eyebrow="Questions"
            title="The money questions, answered plainly"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                q: "When do I get paid?",
                a: "Directly from the renter at handover. Ruth Rentals does not collect hire fees, so there is no payout delay and no commission.",
              },
              {
                q: "How does the deposit work?",
                a: `You agree the deposit with the renter before pickup. ${formatKES(
                  5000,
                )} is a common figure for power tools. The deposit is returned when the item comes back in the agreed condition. This is handled off platform.`,
              },
              {
                q: "Is the promoted fee refundable?",
                a: "If we cannot show the listing, we refund the slot. If your item is simply not booked, the slot is not refundable, the same as any advertising.",
              },
              {
                q: "Do you charge renters?",
                a: "No. Browsing, booking requests and messages are free for renters. You only pay the owner for the hire.",
              },
            ].map((entry) => (
              <div key={entry.q} className="card p-5">
                <h3 className="text-[17px] normal-case">{entry.q}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-copy">{entry.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-[26px]">Still deciding?</h2>
            <p className="mt-2 text-[15px] text-copy">
              Start with the free listing. Six photos, a clear description and a fair daily rate
              do more for your bookings than any badge.
            </p>
            <p className="mt-2 flex items-center gap-2 text-[13px] text-copy">
              <IconShield size={16} className="text-teal" />
              Platform, not insurer. Deposits and damage are agreed between owner and renter.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/list-item" className="btn-primary">
              List an item
            </Link>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-outline"
            >
              <IconWhatsApp size={17} />
              WhatsApp {site.whatsappDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
