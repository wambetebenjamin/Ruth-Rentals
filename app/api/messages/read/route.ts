import { jsonError, jsonOk, sameOrigin } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { markThreadRead } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Request blocked.", 403);

  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in first.", 401);

  let payload: { threadId?: string };
  try {
    payload = (await request.json()) as { threadId?: string };
  } catch {
    return jsonError("Send the request as JSON.");
  }

  if (!payload.threadId) return jsonError("Missing thread.");

  await markThreadRead(payload.threadId, user.id);
  return jsonOk({ read: true });
}
