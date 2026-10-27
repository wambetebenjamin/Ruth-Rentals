import { bookingStatusSchema } from "@/lib/validation";
import {
  fieldErrors,
  firstError,
  jsonError,
  jsonOk,
  sameOrigin,
} from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getBookingById, updateBooking } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request)) return jsonError("Request blocked.", 403);

  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in first.", 401);

  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) return jsonError("Booking not found.", 404);

  const isOwner = booking.ownerId === user.id;
  const isRenter = booking.renterId === user.id;
  if (!isOwner && !isRenter) return jsonError("You are not part of this booking.", 403);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Send the update as JSON.");
  }

  const parsed = bookingStatusSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(firstError(parsed.error), 422, fieldErrors(parsed.error));
  }

  const { status, checklist } = parsed.data;

  if (status === "declined" && !isOwner) {
    return jsonError("Only the owner can decline a request.", 403);
  }

  const updated = await updateBooking(id, {
    status,
    ...(checklist ? { checklist } : {}),
  });

  return jsonOk({ booking: updated });
}
