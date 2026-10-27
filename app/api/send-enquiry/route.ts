import { enquirySchema } from "@/lib/validation";
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
import { addEnquiry } from "@/lib/store";
import { shortId } from "@/lib/format";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Request blocked.", 403);

  const ip = clientIp(request);
  const limit = rateLimit(`enquiry:${ip}`, 6, 15 * 60 * 1000);
  if (!limit.ok) return tooMany(limit.retryAfter);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Send the form as JSON.");
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(firstError(parsed.error), 422, fieldErrors(parsed.error));
  }

  const data = parsed.data;
  if (data.company) return jsonOk({}, 201);

  const captcha = await verifyCaptcha(data.captchaToken, ip);
  if (!captcha.ok) {
    return jsonError(captcha.reason, 400, { captchaToken: captcha.reason });
  }

  const enquiry = {
    id: shortId("enq"),
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    itemSlug: data.itemSlug,
    createdAt: new Date().toISOString(),
  };

  await addEnquiry(enquiry);

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${resendKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL ?? "enquiries@ruthrentals.co.ke",
          to: [process.env.ENQUIRY_EMAIL ?? site.email],
          reply_to: data.email,
          subject: `Ruth Rentals enquiry: ${data.subject}`,
          text: [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Phone: ${data.phone}`,
            data.itemSlug ? `Listing: ${data.itemSlug}` : "",
            "",
            data.message,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
    } catch {
      // The enquiry is already stored. Email delivery is best effort.
    }
  }

  return jsonOk({ enquiryId: enquiry.id }, 201);
}
