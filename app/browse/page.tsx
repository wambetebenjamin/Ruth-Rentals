import type { Metadata } from "next";
import Link from "next/link";
import { getBookings, getItems } from "@/lib/store";
import { categoryMap } from "@/lib/catalog";
import { itemIsFreeForRange } from "@/lib/availability";
import { ItemCard } from "@/components/item-card";
import { BrowseFilters, type FilterValues } from "@/components/browse-filters";
import { MobileFilterSheet } from "@/components/mobile-filter-sheet";
import { Reveal } from "@/components/reveal";
import { SortSelect } from "@/components/sort-select";
import { IconClose } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse gear for hire",
  description:
    "Filter tools, cameras, tents, sound systems, farm equipment and light vehicles by category, county, daily rate and available dates.",
  alternates: { canonical: "/browse" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pick(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function BrowsePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters: FilterValues = {
    category: pick(params.category),
    county: pick(params.county),
    min: pick(params.min),
    max: pick(params.max),
    from: pick(params.from),
    to: pick(params.to),
    sort: pick(params.sort) || "recommended",
  };

  const [allItems, bookings] = await Promise.all([getItems(), getBookings()]);

  let items = allItems.filter((item) => item.status === "live");

  if (filters.category) {
    items = items.filter((item) => item.category === filters.category);
  }
  if (filters.county) {
    items = items.filter((item) => item.county === filters.county);
  }
  const min = Number(filters.min);
  if (filters.min && Number.isFinite(min)) {
    items = items.filter((item) => item.dailyRate >= min);
  }
  const max = Number(filters.max);
  if (filters.max && Number.isFinite(max)) {
    items = items.filter((item) => item.dailyRate <= max);
  }
  if (filters.from && filters.to) {
    items = items.filter((item) =>
      itemIsFreeForRange(item, bookings, filters.from, filters.to),
    );
  }

  if (filters.sort === "price-asc") {
    items = [...items].sort((a, b) => a.dailyRate - b.dailyRate);
  } else if (filters.sort === "price-desc") {
    items = [...items].sort((a, b) => b.dailyRate - a.dailyRate);
  } else if (filters.sort === "rating") {
    items = [...items].sort((a, b) => b.rating - a.rating);
  } else {
    items = [...items].sort((a, b) => {
      if (a.promoted !== b.promoted) return a.promoted ? -1 : 1;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.rating - a.rating;
    });
  }

  const activeChips: { label: string; href: string }[] = [];
  const without = (key: keyof FilterValues) => {
    const next = { ...filters };
    next[key] = key === "sort" ? "recommended" : "";
    if (key === "category" || key === "county") {
      // keep other filters
    }
    const search = new URLSearchParams();
    if (next.category) search.set("category", next.category);
    if (next.county) search.set("county", next.county);
    if (next.min) search.set("min", next.min);
    if (next.max) search.set("max", next.max);
    if (next.from) search.set("from", next.from);
    if (next.to) search.set("to", next.to);
    if (next.sort && next.sort !== "recommended") search.set("sort", next.sort);
    return `/browse${search.toString() ? `?${search.toString()}` : ""}`;
  };

  if (filters.category) {
    activeChips.push({
      label: categoryMap[filters.category as keyof typeof categoryMap]?.name ?? "Category",
      href: without("category"),
    });
  }
  if (filters.county) {
    activeChips.push({ label: filters.county, href: without("county") });
  }
  if (filters.min || filters.max) {
    activeChips.push({
      label: `KES ${filters.min || 0} to ${filters.max || "any"}`,
      href: without("max"),
    });
  }
  if (filters.from || filters.to) {
    activeChips.push({
      label: `${filters.from || "any"} to ${filters.to || "any"}`,
      href: without("from"),
    });
  }

  const title = filters.category
    ? `${categoryMap[filters.category as keyof typeof categoryMap]?.name ?? "Gear"} for hire`
    : "Browse gear for hire";

  return (
    <>
      <section className="border-b border-line bg-wash">
        <div className="wrap py-10 sm:py-12">
          <nav aria-label="Breadcrumb" className="text-[13px] text-copy">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Browse</span>
          </nav>
          <h1 className="mt-3 text-[32px] sm:text-[44px]">{title}</h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-copy">
            {filters.county ? `Showing kit in ${filters.county}. ` : ""}
            {items.length} {items.length === 1 ? "listing" : "listings"} with clear daily rates,
            deposits and blocked dates. Message the owner before you pay anything.
          </p>
        </div>
      </section>

      <div className="wrap py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-[88px] card p-5">
              <h2 className="mb-4 text-[20px]">Filters</h2>
              <BrowseFilters values={filters} />
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-copy" aria-live="polite">
                <span className="price text-ink">{items.length}</span> of {allItems.length} listings
              </p>
              <div className="flex items-center gap-2">
                <MobileFilterSheet values={filters} activeCount={activeChips.length} />
                <SortSelect value={filters.sort} />
              </div>
            </div>

            {activeChips.length > 0 && (
              <ul className="mb-5 flex flex-wrap gap-2">
                {activeChips.map((chip) => (
                  <li key={chip.label}>
                    <Link
                      href={chip.href}
                      className="tag tag-teal hover:border-ink"
                      aria-label={`Remove filter ${chip.label}`}
                    >
                      {chip.label}
                      <IconClose size={13} />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/browse" className="tag hover:border-ink">
                    Clear all
                  </Link>
                </li>
              </ul>
            )}

            {items.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item, index) => (
                  <Reveal key={item.id} delay={(index % 4) * 50}>
                    <ItemCard item={item} priority={index < 4} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <h2 className="text-[22px]">No gear matches those filters yet</h2>
                <p className="mx-auto mt-2 max-w-md text-[15px] text-copy">
                  Try a wider date range, another county, or a higher daily rate. Owners add new
                  listings every week.
                </p>
                <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                  <Link href="/browse" className="btn-primary">
                    Clear filters
                  </Link>
                  <Link href="/list-item" className="btn-outline">
                    List your gear
                  </Link>
                </div>
                <div className="mt-6 border-t border-line pt-4">
                  <p className="text-[13px] text-copy">Busy counties right now</p>
                  <ul className="mt-2 flex flex-wrap justify-center gap-2">
                    {["Nairobi", "Kiambu", "Nakuru", "Mombasa"].map((county) => (
                      <li key={county}>
                        <Link
                          href={`/browse?county=${encodeURIComponent(county)}`}
                          className="tag hover:border-ink"
                        >
                          {county}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-line pt-6 text-sm text-copy">
              <p>
                Looking for something specific?{" "}
                <Link href="/about#contact" className="link">
                  Send us an enquiry
                </Link>{" "}
                and we will ask around the neighbourhood.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
