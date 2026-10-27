import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { counties, popularCounties } from "@/lib/catalog";
import { EnquiryForm } from "@/components/enquiry-form";
import { VoiceTour } from "@/components/voice-tour";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import {
  IconCalendar,
  IconCheck,
  IconMessage,
  IconPin,
  IconShield,
  IconWhatsApp,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "About Ruth Rentals",
  description:
    "A neighbourly marketplace for borrowing and lending tools in Kenya. Meet the idea, the safety steps and the counties we cover.",
  alternates: { canonical: "/about" },
};

const safety = [
  {
    title: "Before you book",
    points: [
      "Read the description and check the blocked dates on the calendar.",
      "Message the owner about the deposit, transport and who collects.",
      "Agree the condition in writing before money changes hands.",
    ],
  },
  {
    title: "At handover",
    points: [
      "Take photos of the item from four sides, plus any serial number.",
      "Count the accessories: bits, cables, pegs, keys, cases.",
      "Tick the handover checklist so both sides keep the same record.",
    ],
  },
  {
    title: "At return",
    points: [
      "Clean the item and return fuel or charge at the agreed level.",
      "Check it together before the deposit is refunded.",
      "If something broke, agree the repair cost in writing. The platform can share the record, not settle it.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-wash">
        <div className="wrap grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow">About</p>
            <h1 className="mt-2 text-[34px] sm:text-[48px]">
              Borrow what you need. Lend what you own.
            </h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-copy">
              Ruth Rentals started with a simple observation in Nairobi: most garages have a drill
              that gets used twice a year, and most estates have a neighbour who needs one this
              weekend. We built a place where those two people can find each other, agree dates
              and keep a record of the handover without paying a commission.
            </p>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-copy">
              The name comes from a neighbour who lent out her sewing machine for years and never
              wrote anything down. We made the paperwork, she kept the trust.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link href="/browse" className="btn-primary">
                Browse gear
              </Link>
              <Link href="/list-item" className="btn-outline">
                List an item
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line">
            <Image
              src="/images/about-street.jpg"
              alt="A cyclist on a busy street in Mombasa, Kenya"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <p className="eyebrow">What we do</p>
            <h2 className="mt-2 text-[28px] sm:text-[34px]">A marketplace, not a middleman</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-copy">
              Owners set their own rates, deposits and dates. Renters book directly with them.
              Ruth Rentals handles discovery, requests, messages and the handover record. Money
              moves between the two people involved, not through us.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-copy">
              That keeps rates honest and payouts immediate. It also means we will not pretend to
              be an insurer: the deposit and any damage agreement are yours to run.
            </p>
          </div>

          <Reveal className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: IconPin,
                  title: "Local first",
                  body: "Search by county and estate. Collect on foot, boda or pickup, whichever is cheaper.",
                },
                {
                  icon: IconCalendar,
                  title: "Dates you can see",
                  body: "Every listing shows booked days, so you do not waste a trip across town.",
                },
                {
                  icon: IconMessage,
                  title: "Plain messaging",
                  body: "Ask questions, agree the deposit, keep the thread on your dashboard.",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="card p-5">
                    <span className="grid h-10 w-10 place-items-center rounded-[4px] bg-wash text-ink">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-4 text-[17px]">{card.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-copy">{card.body}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <VoiceTour />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section border-y border-line bg-shell" id="safety">
        <div className="wrap">
          <SectionHeading
            eyebrow="Safety and handover"
            title="Three checkpoints that keep hires boring"
            description="Boring is good. These steps take ten minutes and prevent most arguments."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {safety.map((group, index) => (
              <Reveal key={group.title} delay={index * 70} className="card p-5">
                <h3 className="text-[19px]">{group.title}</h3>
                <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-copy">
                  {group.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <IconCheck size={16} className="mt-0.5 shrink-0 text-teal" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <div className="notice mt-6 flex items-start gap-2">
            <IconShield size={17} className="mt-0.5 shrink-0" />
            <p>
              Ruth Rentals is a platform, not an insurer. We do not cover damage, theft or injury,
              and we do not hold damage deposits. Agree the deposit and any damage value with the
              other person before the handover, and keep the photos and checklist from the booking.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="areas">
        <div className="wrap grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">Where we are</p>
            <h2 className="mt-2 text-[28px] sm:text-[34px]">31 counties and growing</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-copy">
              Most listings sit in Nairobi, Kiambu, Nakuru, Mombasa, Uasin Gishu and Machakos.
              Owners can list from any county, and renters can filter by their own.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {popularCounties.map((county) => (
                <li key={county}>
                  <Link href={`/browse?county=${encodeURIComponent(county)}`} className="tag hover:border-ink">
                    {county}
                  </Link>
                </li>
              ))}
            </ul>
            <details className="mt-4">
              <summary className="cursor-pointer text-[14px] font-medium text-ink">
                See all 47 counties on the platform
              </summary>
              <p className="mt-2 text-[13px] leading-relaxed text-copy">{counties.join(", ")}.</p>
            </details>

            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[4px] border border-line">
              <Image
                src="/images/about-farm.jpg"
                alt="A farmer feeding poultry on a smallholding in Kiambu County"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <div className="card p-5 sm:p-6" id="contact">
              <p className="eyebrow">Talk to a person</p>
              <h2 className="mt-2 text-[26px]">Questions, county by county</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-copy">
                Tell us what you need and where you are. If we do not have it listed, we will ask
                around the neighbourhood. We reply within one working day.
              </p>
              <dl className="mt-4 grid gap-2 text-[14px] sm:grid-cols-2">
                <div>
                  <dt className="text-copy">WhatsApp and calls</dt>
                  <dd>
                    <a href={waLink("Hi Ruth Rentals, I have a question.")} className="link">
                      {site.whatsappDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-copy">Email</dt>
                  <dd>
                    <a href={`mailto:${site.email}`} className="link">
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-copy">Hours</dt>
                  <dd>{site.hours}</dd>
                </div>
                <div>
                  <dt className="text-copy">Base</dt>
                  <dd>Nairobi, Kenya</dd>
                </div>
              </dl>
              <div className="mt-5 border-t border-line pt-5">
                <EnquiryForm subject="About Ruth Rentals" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink py-10 text-white">
        <div className="wrap flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[26px] text-white">Lend the thing that sits idle</h2>
            <p className="mt-1 text-[14px] text-[#d5d8dc]">
              Free to list. You approve every request. {site.tagline}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/list-item" className="btn-primary">
              List an item
            </Link>
            <a
              href={waLink("Hi Ruth Rentals, I want to list an item.")}
              target="_blank"
              rel="noreferrer noopener"
              className="btn border-white/70 bg-transparent text-white hover:border-white hover:bg-white hover:text-ink"
            >
              <IconWhatsApp size={17} />
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      <section className="wrap py-6" id="credits">
        <p className="text-[12px] leading-relaxed text-copy">
          Photography comes from Pexels photographers in Kenya, Uganda, Nigeria, South Africa and
          the wider East African region, plus a small number of Pexels editorial photographs taken
          elsewhere. Every file is credited with its Pexels photo ID in the{" "}
          <a href="/image-credits.txt" className="link">
            image credits
          </a>
          . No AI generated stock is used on this site.
        </p>
      </section>
    </>
  );
}
