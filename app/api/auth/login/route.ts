import { loginSchema } from "@/lib/validation";
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
import { getUserByEmail } from "@/lib/store";
import { verifyPassword } from "@/lib/password";
import { publicUser, startSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Request blocked.", 403);

  const ip = clientIp(request);
  const limit = rateLimit(`login:${ip}`, 10, 10 * 60 * 1000);
  if (!limit.ok) return tooMany(limit.retryAfter);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Send the form as JSON.");
  }

  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(firstError(parsed.error), 422, fieldErrors(parsed.error));
  }

  const { email, password, captchaToken, company } = parsed.data;
  if (company) return jsonError("Request blocked.", 400);

  const captcha = await verifyCaptcha(captchaToken, ip);
  if (!captcha.ok) {
    return jsonError(captcha.reason, 400, { captchaToken: captcha.reason });
  }

  const user = await getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return jsonError("The email and password did not match.", 401, {
      email: "Check the email and password.",
    });
  }

  await startSession(user.id);

  return jsonOk({ user: publicUser(user) });
}
