"use client";

import { useState } from "react";
import { fromISO, monthGrid, monthLabel, todayISO } from "@/lib/dates";
import { IconChevronLeft, IconChevronRight } from "./icons";

type Props = {
  blockedDates: string[];
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
};

export function AvailabilityCalendar({ blockedDates, start, end, onChange }: Props) {
  const [cursor, setCursor] = useState(() => {
    const base = fromISO(start || todayISO());
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const today = todayISO();
  const cells = monthGrid(cursor.year, cursor.month);
  const blocked = new Set(blockedDates);

  const shift = (delta: number) => {
    setCursor((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const choose = (date: string) => {
    if (blocked.has(date) || date < today) return;
    if (!start || (start && end)) {
      onChange(date, "");
      return;
    }
    if (date < start) {
      onChange(date, "");
      return;
    }
    onChange(start, date);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-line text-ink hover:border-ink"
          aria-label="Previous month"
        >
          <IconChevronLeft size={18} />
        </button>
        <p className="font-display text-[16px] uppercase tracking-wide text-ink" aria-live="polite">
          {monthLabel(cursor.year, cursor.month)}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-line text-ink hover:border-ink"
          aria-label="Next month"
        >
          <IconChevronRight size={18} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-copy">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, index) => {
          if (!date) return <span key={`empty-${index}`} className="h-11" aria-hidden="true" />;
          const day = Number(date.slice(-2));
          const isPast = date < today;
          const isBlocked = blocked.has(date);
          const isStart = date === start;
          const isEnd = date === end;
          const inRange = Boolean(start && end && date >= start && date <= end);
          const disabled = isPast || isBlocked;

          const classes = [
            "flex h-11 w-full items-center justify-center rounded-[4px] border text-[14px] tabular-nums",
            disabled
              ? "cursor-not-allowed border-transparent text-line"
              : "border-line text-ink hover:border-ink",
            isStart || isEnd ? "border-ink bg-ink text-white hover:border-ink" : "",
            inRange && !isStart && !isEnd ? "border-teal bg-teal/15" : "",
            isBlocked ? "line-through decoration-1" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={date}
              type="button"
              className={classes}
              onClick={() => choose(date)}
              disabled={disabled}
              aria-pressed={isStart || isEnd}
              aria-label={`${date}${isBlocked ? ", booked" : isPast ? ", past" : ""}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-copy">
        <li className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 border border-line bg-paper" aria-hidden="true" /> Free
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 border border-transparent bg-wash" aria-hidden="true" /> Booked
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 bg-ink" aria-hidden="true" /> Your dates
        </li>
      </ul>
    </div>
  );
}
