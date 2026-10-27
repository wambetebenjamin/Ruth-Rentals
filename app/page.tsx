import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getItems } from "@/lib/store";
import { categories, categoryMap, popularCounties } from "@/lib/catalog";
import { formatKES } from "@/lib/format";
import { site } from "@/lib/site";
import { ItemCard } from "@/components/item-card";
import { SearchBar } from "@/components/search-bar";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";
import { VoiceTour } from "@/components/voice-tour";
import { Rating } from "@/components/rating";
import {
  IconArrowRight,
  IconCamera,
  categoryIcon,
  IconKey,
  IconMessage,
  IconPin,
  IconShield,
  IconTent,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rent tools and gear near you",
  description:
    "Borrow drills, cameras, tents, sound gear, farm equipment and light vehicles from neighbours across Kenya. Book by the day, agree the handover, and return it in good shape.",
  alternates: { canonical: "/" },
};

const testimonials = [
  {
    name: "Joyce Wairimu",
    role: "Event planner, Thika",
    avatar: "/images/testimonial-joyce.jpg",
    rating: 5,
    quote:
      "I hired a tent and 80 chairs for a wedding in Ruiru. The owner delivered on Friday, we counted everything together, and I returned the same number on Monday. No drama.",
  },
  {
    name: "Brian Kimani",
    role: "Contractor, Nairobi",
    avatar: "/images/testimonial-brian.jpg",
    rating: 5,
    quote:
      "A rotary hammer costs a lot for one wardrobe job. I borrowed one for two days, paid less than a fifth of the price, and the case came with every bit I needed.",
  },
  {
    name: "Peter Njoroge",
    role: "Carpenter, Nakuru",
    avatar: "/images/testimonial-peter.jpg",
    rating: 4.5,
    quote:
      "I lend my grinder and my trailer when I am not using them. The booking notes tell me who is coming, and the handover list keeps the return simple.",
  },
];

const steps = [
  {
    number: "01",
    title: "Find the kit",
    body: "Search by category and county, check the daily rate, and look at the dates the owner has blocked out.",
    icon: IconPin,
  },
  {
    number: "02",
    title: "Book and agree",
    body: "Send your dates and phone number. Message the owner about the deposit, the condition and who collects.",
    icon: IconMessage,
  },
  {
    number: "03",
    title: "Collect and return",
    body: "Take photos at handover, tick the checklist on both sides, and return the item the way you found it.",
    icon: IconKey,
  },
];

export default async function HomePage() {
  const items = await getItems();
  const featured = items.filter((item) => item.status === "live").slice(0, 8);
  const weekendAverage =
    featured.length > 0
      ? Math.round(
          (featured.reduce((total, item) => total + item.dailyRate, 0) / featured.length) * 2,
        )
      : 0;
  const stats = [
    { value: 1240, suffix: "+", label: "Items listed" },
    { value: 8600, suffix: "+", label: "Hires completed" },
    { value: 31, suffix: "", label: "Counties active" },
    { value: 4.8, suffix: "/5", label: "Average hire rating", decimals: 1 },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-drill.jpg"
            alt="A carpenter using a power drill in a workshop"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-ink/75" aria-hidden="true" />
        </div>

        <div className="wrap relative py-14 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 border border-white/25 px-3 py-1 text-[12px] font-medium uppercase tracking-[0.14em] text-white">
              Peer to peer gear rental, Kenya
            </p>
            <h1 className="mt-5 text-[38px] leading-[1.05] text-white sm:text-[56px] lg:text-[64px]">
              Rent tools and gear near you
            </h1>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[#e4e6e9] sm:text-[19px]">
              {site.tagline} Find a drill, a camera, a tent or a tractor in your county, book it
              by the day, and deal directly with the person who owns it.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/browse" className="btn-primary px-6">
                Browse gear
                <IconArrowRight size={18} />
              </Link>
              <Link
                href="/list-item"
                className="btn inline-flex border-white/70 bg-transparent px-6 text-white hover:border-white hover:bg-white hover:text-ink"
              >
                List an item
              </Link>
            </div>

            <div className="mt-8 max-w-2xl">
              <SearchBar />
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#d5d8dc]">
              <li className="inline-flex items-center gap-1.5">
                <IconShield size={15} /> Phone checked accounts
              </li>
              <li className="inline-flex items-center gap-1.5">
                <IconKey size={15} /> Deposits agreed in writing
              </li>
              <li className="inline-flex items-center gap-1.5">
                <IconMessage size={15} /> WhatsApp support, {site.hours}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-wash" aria-label="Ruth Rentals in numbers">
        <div className="wrap grid grid-cols-2 gap-x-6 gap-y-6 py-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-[30px] leading-none text-ink sm:text-[36px]">
                <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
              </p>
              <p className="mt-1.5 text-[13px] text-copy">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="categories-heading">
        <div className="wrap">
          <SectionHeading
            eyebrow="Browse by category"
            title="What neighbours are lending"
            description="Eight groups of kit, from a 550 shilling grinder to a tractor with a driver. Pick a group and see what is free in your county."
            action={{ href: "/browse", label: "See all gear" }}
          />
          <h2 id="categories-heading" className="sr-only">
            Categories
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((category, index) => {
              const Icon = categoryIcon(category.slug);
              return (
                <Reveal key={category.slug} delay={index * 45}>
                  <Link
                    href={`/browse?category=${category.slug}`}
                    className="card group flex h-full flex-col overflow-hidden transition-colors hover:border-ink"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-wash">
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-3.5">
                      <div className="flex items-center gap-2 text-ink">
                        <Icon size={18} className="text-copy" />
                        <span className="font-display text-[16px] uppercase leading-tight">
                          {category.name}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] text-copy">{category.short}</p>
                      <p className="mt-2 text-[12px] text-copy">
                        From <span className="price text-[13px]">{formatKES(category.from)}</span>/day
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-copy">Popular counties:</span>
            {popularCounties.slice(0, 6).map((county) => (
              <Link
                key={county}
                href={`/browse?county=${encodeURIComponent(county)}`}
                className="tag hover:border-ink"
              >
                {county}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-shell" id="featured">
        <div className="wrap">
          <SectionHeading
            eyebrow="Featured listings"
            title="Gear free this week"
            description="Eight items with open dates, clear rates and owners who reply quickly. Every listing shows the deposit before you book."
            action={{ href: "/browse", label: "Browse all listings" }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((item, index) => (
              <Reveal key={item.id} delay={(index % 4) * 60}>
                <ItemCard item={item} priority={index < 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="wrap">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps, one handover"
            description="Ruth Rentals keeps the booking, the messages and the handover list in one place. Payment and deposits stay between you and the owner."
          />

          <ol className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal as="li" key={step.number} delay={index * 80} className="card relative p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[32px] leading-none text-line">
                      {step.number}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-[4px] bg-wash text-ink">
                      <Icon size={20} />
                    </span>
                  </div>
                  <h3 className="mt-5 text-[20px]">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-copy">{step.body}</p>
                </Reveal>
              );
            })}
          </ol>

          <div className="mt-6">
            <VoiceTour />
          </div>
        </div>
      </section>

      <section className="section border-y border-line bg-wash" aria-labelledby="testimonials-heading">
        <div className="wrap">
          <SectionHeading
            eyebrow="From the neighbourhood"
            title="People who borrow and lend here"
            description="Event planners, contractors and carpenters in Nairobi, Kiambu and Nakuru. Real hires, real handovers."
          />
          <h2 id="testimonials-heading" className="sr-only">
            Testimonials
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((entry, index) => (
              <Reveal as="figure" key={entry.name} delay={index * 70} className="card flex h-full flex-col p-5">
                <Rating rating={entry.rating} label={`${entry.name}'s hire`} size="md" />
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-charcoal">
                  {entry.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <Image
                    src={entry.avatar}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[15px] font-medium text-ink">{entry.name}</p>
                    <p className="text-[13px] text-copy">{entry.role}</p>
                  </div>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="lend">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">For owners</p>
            <h2 className="mt-2 text-[30px] sm:text-[38px]">
              A drill in the cupboard is money sitting still
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-copy">
              List basic gear for free. Set your own daily rate and deposit, choose the dates you
              are open, and approve every request before it is confirmed. We do not take a cut of
              your hire fee.
            </p>
            <ul className="mt-5 space-y-2.5 text-[15px] text-charcoal">
              <li className="flex items-start gap-2.5">
                <IconShield size={18} className="mt-0.5 text-teal" />
                Every renter signs in with a phone number you can call.
              </li>
              <li className="flex items-start gap-2.5">
                <IconCamera size={18} className="mt-0.5 text-teal" />
                Photo handover notes on both sides, kept with the booking.
              </li>
              <li className="flex items-start gap-2.5">
                <IconTent size={18} className="mt-0.5 text-teal" />
                Pause a listing for a season and switch it back on when you are ready.
              </li>
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/list-item" className="btn-primary">
                List an item
              </Link>
              <Link href="/pricing" className="btn-outline">
                See pricing
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-wash">
              <Image
                src="/images/about-workshop.jpg"
                alt="A craftsman working in his workshop in Kenya"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="card absolute -bottom-5 left-4 right-4 flex items-center justify-between gap-3 p-4 sm:left-6 sm:right-auto sm:w-[320px]">
              <div>
                <p className="text-[12px] uppercase tracking-wide text-copy">
                  Weekend of lending
                </p>
                <p className="price text-[20px]">{formatKES(weekendAverage)}</p>
                <p className="text-[12px] text-copy">
                  Average two day hire across the listings on this page
                </p>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] bg-teal text-ink">
                <IconArrowRight size={18} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-12 text-white">
        <div className="wrap flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-teal">
              Ready when you are
            </p>
            <h2 className="mt-2 text-[28px] text-white sm:text-[34px]">
              Find what you need, or lend what you own
            </h2>
            <p className="mt-2 text-[15px] text-[#d5d8dc]">
              {categoryMap["power-tools"].name}, tents, sound and more, across 31 counties.
              Questions? WhatsApp {site.whatsappDisplay}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/browse" className="btn-primary">
              Browse gear
            </Link>
            <Link
              href="/register"
              className="btn border-white/70 bg-transparent text-white hover:border-white hover:bg-white hover:text-ink"
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
