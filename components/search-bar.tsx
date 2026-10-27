"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories, counties } from "@/lib/catalog";
import { IconSearch } from "./icons";

type Props = {
  defaultCategory?: string;
  defaultCounty?: string;
  compact?: boolean;
};

export function SearchBar({ defaultCategory = "", defaultCounty = "", compact = false }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState(defaultCategory);
  const [county, setCounty] = useState(defaultCounty);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (county) params.set("county", county);
    router.push(`/browse${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      className={`grid gap-2 rounded-[4px] border border-line bg-paper p-3 sm:grid-cols-[1fr_1fr_auto] ${
        compact ? "" : "sm:p-3.5"
      }`}
      role="search"
      aria-label="Find gear"
    >
      <div>
        <label htmlFor="hero-category" className="sr-only">
          Category
        </label>
        <select
          id="hero-category"
          className="field"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((entry) => (
            <option key={entry.slug} value={entry.slug}>
              {entry.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="hero-county" className="sr-only">
          County
        </label>
        <select
          id="hero-county"
          className="field"
          value={county}
          onChange={(event) => setCounty(event.target.value)}
        >
          <option value="">All counties</option>
          {counties.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-primary">
        <IconSearch size={18} />
        Find gear
      </button>
    </form>
  );
}
