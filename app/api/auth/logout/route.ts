import { endSession } from "@/lib/auth";
import { jsonError, jsonOk, sameOrigin } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Request blocked.", 403);
  await endSession();
  return jsonOk({ signedOut: true });
}
