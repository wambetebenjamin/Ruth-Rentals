import { messageSendSchema } from "@/lib/validation";
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
import { addMessage, getBookingById, getItemById, getUserById } from "@/lib/store";
import { shortId } from "@/lib/format";
import type { Message } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Request blocked.", 403);

  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in to send a message.", 401);

  const ip = clientIp(request);
  const limit = rateLimit(`message:${user.id}:${ip}`, 20, 10 * 60 * 1000);
  if (!limit.ok) return tooMany(limit.retryAfter);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Send the form as JSON.");
  }

  const parsed = messageSendSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(firstError(parsed.error), 422, fieldErrors(parsed.error));
  }

  const { toUserId, itemId, bookingId, body, captchaToken, company } = parsed.data;
  if (company) return jsonError("Request blocked.", 400);

  const captcha = await verifyCaptcha(captchaToken, ip);
  if (!captcha.ok) {
    return jsonError(captcha.reason, 400, { captchaToken: captcha.reason });
  }

  if (toUserId === user.id) {
    return jsonError("You cannot message yourself.", 400);
  }

  const recipient = await getUserById(toUserId);
  if (!recipient) return jsonError("That owner could not be found.", 404);

  let itemTitle: string | undefined;
  if (itemId) {
    const item = await getItemById(itemId);
    if (!item) return jsonError("That listing could not be found.", 404);
    itemTitle = item.title;
  }

  if (bookingId) {
    const booking = await getBookingById(bookingId);
    if (!booking) return jsonError("That booking could not be found.", 404);
    if (booking.ownerId !== user.id && booking.renterId !== user.id) {
      return jsonError("You are not part of this booking.", 403);
    }
  }

  const pair = [user.id, toUserId].sort().join("-");
  const threadId = bookingId
    ? `thread-booking-${bookingId}`
    : `thread-${itemId ?? "general"}-${pair}`;

  const message: Message = {
    id: shortId("ms"),
    threadId,
    bookingId: bookingId || undefined,
    itemId: itemId || undefined,
    itemTitle,
    fromUserId: user.id,
    fromName: user.name,
    toUserId,
    toName: recipient.name,
    body,
    createdAt: new Date().toISOString(),
    readBy: [user.id],
  };

  await addMessage(message);

  return jsonOk({ message }, 201);
}
