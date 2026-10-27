"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories, counties, priceBands } from "@/lib/catalog";
import { todayISO } from "@/lib/dates";

export type FilterValues = {
  category: string;
  county: string;
  min: string;
  max: string;
  from: string;
  to: string;
  sort: string;
};

type Props = {
  values: FilterValues;
  onApplied?: () => void;
};

export const emptyFilters: FilterValues = {
  category: "",
  county: "",
  min: "",
  max: "",
  from: "",
  to: "",
  sort: "recommended",
};

export function BrowseFilters({ values, onApplied }: Props) {
  const router = useRouter();
  const [state, setState] = useState<FilterValues>(values);
  const [error, setError] = useState("");

  const update = (patch: Partial<FilterValues>) => {
    setState((current) => ({ ...current, ...patch }));
  };

  const applyBand = (label: string) => {
    const band = priceBands.find((entry) => entry.label === label);
    if (!band || (band.min === 0 && band.max === 0)) {
      update({ min: "", max: "" });
      return;
    }
    update({ min: band.min ? `${band.min}` : "", max: band.max ? `${band.max}` : "" });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (state.from && state.to && state.to < state.from) {
      setError("The return date must be after the pickup date.");
      return;
    }

    const params = new URLSearchParams();
    if (state.category) params.set("category", state.category);
    if (state.county) params.set("county", state.county);
    if (state.min) params.set("min", state.min);
    if (state.max) params.set("max", state.max);
    if (state.from) params.set("from", state.from);
    if (state.to) params.set("to", state.to);
    if (state.sort && state.sort !== "recommended") params.set("sort", state.sort);

    router.push(`/browse${params.toString() ? `?${params.toString()}` : ""}`);
    onApplied?.();
  };

  const clear = () => {
    setState(emptyFilters);
    router.push("/browse");
    onApplied?.();
  };

  return (
    <form onSubmit={submit} className="space-y-6" aria-label="Filter listings">
      <fieldset>
        <legend className="label">Category</legend>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => update({ category: "" })}
            className={`min-h-11 rounded-[4px] border px-2 py-2 text-left text-[13px] leading-tight ${
              state.category === ""
                ? "border-ink bg-ink text-white"
                : "border-line bg-paper text-ink hover:border-ink"
            }`}
            aria-pressed={state.category === ""}
          >
            All categories
          </button>
          {categories.map((category) => {
            const active = state.category === category.slug;
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => update({ category: active ? "" : category.slug })}
                className={`min-h-11 rounded-[4px] border px-2 py-2 text-left text-[13px] leading-tight ${
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-paper text-ink hover:border-ink"
                }`}
                aria-pressed={active}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label className="label" htmlFor="filter-county">
          County
        </label>
        <select
          id="filter-county"
          className="field"
          value={state.county}
          onChange={(event) => update({ county: event.target.value })}
        >
          <option value="">All counties</option>
          {counties.map((county) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="label">Price per day</legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="hint" htmlFor="filter-min">
              Minimum KES
            </label>
            <input
              id="filter-min"
              className="field mt-1"
              inputMode="numeric"
              type="number"
              min={0}
              step={50}
              placeholder="0"
              value={state.min}
              onChange={(event) => update({ min: event.target.value })}
            />
          </div>
          <div>
            <label className="hint" htmlFor="filter-max">
              Maximum KES
            </label>
            <input
              id="filter-max"
              className="field mt-1"
              inputMode="numeric"
              type="number"
              min={0}
              step={50}
              placeholder="No limit"
              value={state.max}
              onChange={(event) => update({ max: event.target.value })}
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="hint" htmlFor="filter-band">
            Or pick a band
          </label>
          <select
            id="filter-band"
            className="field mt-1"
            defaultValue=""
            onChange={(event) => applyBand(event.target.value)}
          >
            <option value="">Choose a band</option>
            {priceBands.slice(1).map((band) => (
              <option key={band.label} value={band.label}>
                {band.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Availability</legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="hint" htmlFor="filter-from">
              From
            </label>
            <input
              id="filter-from"
              type="date"
              className="field mt-1"
              min={todayISO()}
              value={state.from}
              onChange={(event) => update({ from: event.target.value })}
            />
          </div>
          <div>
            <label className="hint" htmlFor="filter-to">
              To
            </label>
            <input
              id="filter-to"
              type="date"
              className="field mt-1"
              min={state.from || todayISO()}
              value={state.to}
              onChange={(event) => update({ to: event.target.value })}
            />
          </div>
        </div>
        {error && <p className="error mt-1.5">{error}</p>}
      </fieldset>

      <div>
        <label className="label" htmlFor="filter-sort">
          Sort by
        </label>
        <select
          id="filter-sort"
          className="field"
          value={state.sort}
          onChange={(event) => update({ sort: event.target.value })}
        >
          <option value="recommended">Recommended</option>
          <option value="price-asc">Price, low to high</option>
          <option value="price-desc">Price, high to low</option>
          <option value="rating">Highest rating</option>
        </select>
      </div>

      <div className="flex flex-col gap-2 border-t border-line pt-4">
        <button type="submit" className="btn-primary w-full">
          Apply filters
        </button>
        <button type="button" className="btn-outline w-full" onClick={clear}>
          Clear all
        </button>
      </div>
    </form>
  );
}
