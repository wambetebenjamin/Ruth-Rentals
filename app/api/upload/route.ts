import { clientIp, jsonError, jsonOk, sameOrigin, tooMany } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";
import { shortId } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 1_400_000;
const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Request blocked.", 403);

  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in before uploading photos.", 401);

  const ip = clientIp(request);
  const limit = rateLimit(`upload:${user.id}:${ip}`, 20, 20 * 60 * 1000);
  if (!limit.ok) return tooMany(limit.retryAfter);

  let payload: { dataUrl?: string; filename?: string };
  try {
    payload = (await request.json()) as { dataUrl?: string; filename?: string };
  } catch {
    return jsonError("Send the photo as JSON.");
  }

  const dataUrl = payload.dataUrl ?? "";
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) {
    return jsonError("Use a JPEG, PNG or WebP photo.", 415);
  }

  const [, contentType, base64] = match;
  if (!allowed.has(contentType)) return jsonError("Unsupported photo type.", 415);

  const bytes = Buffer.from(base64, "base64");
  if (bytes.byteLength > MAX_BYTES) {
    return jsonError("That photo is too large. Keep each photo under 1.4MB.", 413);
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    // Without Blob configured, the listing keeps the compressed photo inline.
    return jsonOk({ url: dataUrl, stored: "inline" });
  }

  try {
    const { put } = await import("@vercel/blob");
    const extension = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
    const pathname = `listings/${user.id}/${shortId("photo")}.${extension}`;
    const blob = await put(pathname, bytes, {
      access: "public",
      contentType,
      token,
      addRandomSuffix: false,
    });
    return jsonOk({ url: blob.url, stored: "blob" });
  } catch {
    return jsonError("Photo storage is not available right now. Try again later.", 502);
  }
}
