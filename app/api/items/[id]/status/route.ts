import { itemStatusSchema } from "@/lib/validation";
import {
  fieldErrors,
  firstError,
  jsonError,
  jsonOk,
  sameOrigin,
} from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getItemById, updateItem } from "@/lib/store";

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
  const item = await getItemById(id);
  if (!item) return jsonError("Listing not found.", 404);
  if (item.ownerId !== user.id) return jsonError("You do not own this listing.", 403);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Send the update as JSON.");
  }

  const parsed = itemStatusSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(firstError(parsed.error), 422, fieldErrors(parsed.error));
  }

  const updated = await updateItem(item.id, { status: parsed.data.status });
  return jsonOk({ item: updated });
}
