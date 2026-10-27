import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
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
import { addUser, getUserByEmail } from "@/lib/store";
import { hashPassword } from "@/lib/password";
import { publicUser, startSession } from "@/lib/auth";
import { shortId } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Request blocked.", 403);

  const ip = clientIp(request);
  const limit = rateLimit(`register:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.ok) return tooMany(limit.retryAfter);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Send the form as JSON.");
  }

  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(firstError(parsed.error), 422, fieldErrors(parsed.error));
  }

  const { name, email, phone, county, password, role, captchaToken, company } = parsed.data;

  if (company) {
    // Honeypot field was filled. Pretend success and do nothing.
    return jsonOk({ user: null }, 201);
  }

  const captcha = await verifyCaptcha(captchaToken, ip);
  if (!captcha.ok) {
    return jsonError(captcha.reason, 400, { captchaToken: captcha.reason });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      {
        ok: false,
        error: "An account with that email already exists.",
        fields: { email: "Use another email address, or sign in." },
      },
      { status: 409 },
    );
  }

  const user = await addUser({
    id: shortId("u"),
    name,
    email,
    phone: phone.replace(/\s+/g, ""),
    county,
    role,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  });

  await startSession(user.id);

  return jsonOk({ user: publicUser(user) }, 201);
}
