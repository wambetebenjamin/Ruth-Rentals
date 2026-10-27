import { bookingCreateSchema } from "@/lib/validation";
import {
  clientIp,
  fieldErrors,
  firstError,
  jsonError,
  jsonOk,
  sameOrigin,
  tooMany,
} from "@/lib/api";
import { verifyCaptcha } from "@/lib/captcha";
import { rateLimit } from "@/lib/ratelimit";
import { getCurrentUser } from "@/lib/auth";
import { addBooking, getBookings, getItemBySlug } from "@/lib/store";
import { checkAvailability } from "@/lib/availability";
import { dayCount } from "@/lib/dates";
import { shortId } from "@/lib/format";
import type { Booking } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function quote(dailyRate: number, weeklyRate: number, days: number) {
  if (weeklyRate > 0 && days >= 7) {
    const weeks = Math.floor(days / 7);
    const rest = days % 7;
    return weeks * weeklyRate + rest * dailyRate;
  }
  return days * dailyRate;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Request blocked.", 403);

  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in to send a booking request.", 401);

  const ip = clientIp(request);
  const limit = rateLimit(`booking:${user.id}:${ip}`, 10, 30 * 60 * 1000);
  if (!limit.ok) return tooMany(limit.retryAfter);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Send the form as JSON.");
  }

  const parsed = bookingCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(firstError(parsed.error), 422, fieldErrors(parsed.error));
  }

  const data = parsed.data;
  if (data.company) return jsonError("Request blocked.", 400);

  const captcha = await verifyCaptcha(data.captchaToken, ip);
  if (!captcha.ok) {
    return jsonError(captcha.reason, 400, { captchaToken: captcha.reason });
  }

  const item = await getItemBySlug(data.itemSlug);
  if (!item || item.status !== "live") {
    return jsonError("That listing is not available any more.", 404);
  }

  if (item.ownerId === user.id) {
    return jsonError("This is your own listing.", 400);
  }

  const bookings = await getBookings();
  const availability = checkAvailability(item, bookings, data.startDate, data.endDate);
  if (!availability.available) {
    return jsonError(
      `Those dates are taken. Free from ${availability.blocked[availability.blocked.length - 1]} onwards.`,
      409,
      { startDate: "Pick dates outside the blocked range." },
    );
  }

  const days = dayCount(data.startDate, data.endDate);
  if (days < item.minDays) {
    return jsonError(`The owner asks for a minimum of ${item.minDays} days.`, 422, {
      endDate: `Extend the hire to ${item.minDays} days or more.`,
    });
  }

  const total = quote(item.dailyRate, item.weeklyRate, days);

  const booking: Booking = {
    id: shortId("bk"),
    itemId: item.id,
    itemSlug: item.slug,
    itemTitle: item.title,
    itemImage: item.image,
    ownerId: item.ownerId,
    ownerName: item.ownerName,
    renterId: user.id,
    renterName: user.name,
    renterPhone: data.phone.replace(/\s+/g, ""),
    renterEmail: user.email,
    startDate: data.startDate,
    endDate: data.endDate,
    days,
    dailyRate: item.dailyRate,
    deposit: item.deposit,
    total,
    status: "requested",
    checklist: {
      photosBefore: false,
      conditionNotes: false,
      accessoriesCounted: false,
      bothSigned: false,
    },
    note: data.note ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await addBooking(booking);

  return jsonOk({ booking }, 201);
}
