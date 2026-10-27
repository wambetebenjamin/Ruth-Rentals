"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { addDays, dayCount, formatRange, todayISO } from "@/lib/dates";
import { formatKES } from "@/lib/format";
import { AvailabilityCalendar } from "./availability-calendar";
import { Captcha } from "./captcha";
import { IconArrowRight, IconCalendar, IconCheck, IconInfo, IconShield } from "./icons";

type Props = {
  item: {
    slug: string;
    title: string;
    dailyRate: number;
    weeklyRate: number;
    deposit: number;
    minDays: number;
    ownerName: string;
  };
  blockedDates: string[];
  user: { name: string; phone: string; email: string } | null;
};

export function quote(dailyRate: number, weeklyRate: number, days: number) {
  if (days <= 0) return 0;
  if (weeklyRate > 0 && days >= 7) {
    const weeks = Math.floor(days / 7);
    const rest = days % 7;
    return weeks * weeklyRate + rest * dailyRate;
  }
  return days * dailyRate;
}

export function BookingForm({ item, blockedDates, user }: Props) {
  const router = useRouter();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [note, setNote] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: string; total: number } | null>(null);

  const days = start && end ? dayCount(start, end) : start ? 1 : 0;
  const total = useMemo(
    () => quote(item.dailyRate, item.weeklyRate, days),
    [item.dailyRate, item.weeklyRate, days],
  );

  const blockedInRange = useMemo(() => {
    if (!start) return [];
    const endDate = end || start;
    return blockedDates.filter((date) => date >= start && date <= endDate);
  }, [blockedDates, start, end]);

  const tooShort = days > 0 && days < item.minDays;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setFields({});

    if (!start || !end) {
      setError("Choose your pickup and return dates on the calendar.");
      return;
    }
    if (blockedInRange.length > 0) {
      setError("Some of those dates are already booked. Pick another range.");
      return;
    }
    if (tooShort) {
      setError(`${item.ownerName} asks for a minimum of ${item.minDays} days.`);
      return;
    }
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA check.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          itemSlug: item.slug,
          startDate: start,
          endDate: end,
          phone,
          note,
          captchaToken,
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        fields?: Record<string, string>;
        booking?: { id: string; total: number };
      };

      if (!response.ok || !data.ok || !data.booking) {
        setError(data.error ?? "The booking did not go through. Please try again.");
        setFields(data.fields ?? {});
        setCaptchaToken(null);
        return;
      }

      setSuccess({ id: data.booking.id, total: data.booking.total });
      router.refresh();
    } catch {
      setError("Network problem. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="card p-5">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-teal text-ink">
          <IconCheck size={22} />
        </span>
        <h2 className="mt-3 text-[22px]">Request sent to {item.ownerName}</h2>
        <p className="mt-2 text-[15px] text-copy">
          Booking <strong className="text-ink">{success.id}</strong> is waiting for confirmation.
          The deposit of {formatKES(item.deposit)} is agreed directly with the owner at handover.
        </p>
        <p className="price mt-3 text-[20px]">{formatKES(success.total)}</p>
        <p className="text-[13px] text-copy">Hire fee, payable to the owner</p>
        <div className="mt-4 flex flex-col gap-2">
          <Link href={`/dashboard/booking/${success.id}`} className="btn-primary">
            Open the booking
          </Link>
          <Link href="/dashboard" className="btn-outline">
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-line p-5">
        <p className="price text-[26px]">
          {formatKES(item.dailyRate)}
          <span className="text-[14px] font-normal text-copy"> / day</span>
        </p>
        <p className="mt-1 text-[13px] text-copy">
          {item.weeklyRate > 0
            ? `${formatKES(item.weeklyRate)} for 7 days. Minimum ${item.minDays} ${
                item.minDays === 1 ? "day" : "days"
              }.`
            : `Minimum ${item.minDays} ${item.minDays === 1 ? "day" : "days"}.`}
        </p>
      </div>

      <div className="p-5">
        <h2 className="flex items-center gap-2 text-[18px]">
          <IconCalendar size={18} className="text-copy" />
          Check dates
        </h2>
        <div className="mt-3">
          <AvailabilityCalendar
            blockedDates={blockedDates}
            start={start}
            end={end}
            onChange={(nextStart, nextEnd) => {
              setStart(nextStart);
              setEnd(nextEnd);
              setError("");
            }}
          />
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3" noValidate>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label" htmlFor="booking-start">
                Pickup
              </label>
              <input
                id="booking-start"
                type="date"
                className="field"
                min={todayISO()}
                value={start}
                onChange={(event) => {
                  const value = event.target.value;
                  setStart(value);
                  if (end && value && end < value) setEnd(value);
                }}
                aria-invalid={Boolean(fields.startDate)}
                required
              />
              {fields.startDate && <p className="error mt-1">{fields.startDate}</p>}
            </div>
            <div>
              <label className="label" htmlFor="booking-end">
                Return
              </label>
              <input
                id="booking-end"
                type="date"
                className="field"
                min={start || addDays(todayISO(), 1)}
                value={end}
                onChange={(event) => setEnd(event.target.value)}
                aria-invalid={Boolean(fields.endDate)}
                required
              />
              {fields.endDate && <p className="error mt-1">{fields.endDate}</p>}
            </div>
          </div>

          {start && end && (
            <div className="border border-line bg-shell p-3">
              <p className="text-[13px] text-copy">
                {formatRange(start, end)}. {days} {days === 1 ? "day" : "days"}.
              </p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-[13px] text-copy">Hire fee</span>
                <span className="price text-[18px]">{formatKES(total)}</span>
              </div>
              <div className="mt-1 flex items-end justify-between">
                <span className="text-[13px] text-copy">Deposit at handover</span>
                <span className="price text-[15px]">{formatKES(item.deposit)}</span>
              </div>
            </div>
          )}

          {blockedInRange.length > 0 && (
            <p className="notice">
              {blockedInRange.length} of those dates are already taken. Free days start after{" "}
              {blockedInRange[blockedInRange.length - 1]}.
            </p>
          )}

          {!user ? (
            <div className="border-t border-line pt-4">
              <p className="text-[14px] text-copy">
                Sign in with your phone number to send this request. You can keep browsing
                without an account.
              </p>
              <Link
                href={`/login?next=${encodeURIComponent(`/item/${item.slug}`)}`}
                className="btn-primary mt-3 w-full"
              >
                Sign in to book
              </Link>
              <Link href="/register" className="btn-outline mt-2 w-full">
                Create a free account
              </Link>
            </div>
          ) : (
            <>
              <div>
                <label className="label" htmlFor="booking-phone">
                  Your phone number
                </label>
                <input
                  id="booking-phone"
                  className="field"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  aria-invalid={Boolean(fields.phone)}
                  placeholder="0712 345 678"
                  required
                />
                {fields.phone && <p className="error mt-1">{fields.phone}</p>}
              </div>

              <div>
                <label className="label" htmlFor="booking-note">
                  Note for the owner <span className="font-normal text-copy">(optional)</span>
                </label>
                <textarea
                  id="booking-note"
                  className="field min-h-[84px]"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="What are you working on? Who is collecting?"
                  maxLength={500}
                />
                {fields.note && <p className="error mt-1">{fields.note}</p>}
              </div>

              <Captcha onToken={setCaptchaToken} error={fields.captchaToken} />

              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? "Sending request..." : "Request this booking"}
                {!submitting && <IconArrowRight size={18} />}
              </button>
            </>
          )}

          <p className="flex items-start gap-2 text-[12px] leading-relaxed text-copy">
            <IconShield size={15} className="mt-0.5 shrink-0" />
            You will not be charged on this site. Pay the owner at handover and agree the deposit
            with them in writing.
          </p>
          <p className="flex items-start gap-2 text-[12px] leading-relaxed text-copy">
            <IconInfo size={15} className="mt-0.5 shrink-0" />
            Ruth Rentals is a platform, not an insurer. Photos and the handover checklist protect
            both sides.
          </p>
        </form>
      </div>
    </div>
  );
}
