"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <div className="hidden sm:block">
      <label htmlFor="sort-top" className="sr-only">
        Sort listings
      </label>
      <select
        id="sort-top"
        className="field min-h-11 w-auto py-2 text-sm"
        value={value}
        onChange={(event) => {
          const next = new URLSearchParams(params.toString());
          if (event.target.value === "recommended") next.delete("sort");
          else next.set("sort", event.target.value);
          router.push(`/browse${next.toString() ? `?${next.toString()}` : ""}`);
        }}
      >
        <option value="recommended">Recommended</option>
        <option value="price-asc">Price, low to high</option>
        <option value="price-desc">Price, high to low</option>
        <option value="rating">Highest rating</option>
      </select>
    </div>
  );
}
