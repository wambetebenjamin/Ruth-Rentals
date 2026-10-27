import "server-only";

const secret = process.env.RECAPTCHA_SECRET_KEY?.trim() ?? "";

export const captchaMode: "live" | "test" = secret ? "live" : "test";
export const TEST_CAPTCHA_TOKEN = "demo-pass";

export type CaptchaResult = { ok: true } | { ok: false; reason: string };

export async function verifyCaptcha(
  token: string | undefined,
  remoteIp?: string,
): Promise<CaptchaResult> {
  if (secret) {
    if (!token) {
      return { ok: false, reason: "Please complete the reCAPTCHA check." };
    }

    try {
      const body = new URLSearchParams({ secret, response: token });
      if (remoteIp) body.set("remoteip", remoteIp);

      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body,
        cache: "no-store",
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });

      if (!response.ok) {
        return { ok: false, reason: "reCAPTCHA is not responding. Please try again." };
      }

      const data = (await response.json()) as {
        success?: boolean;
        "error-codes"?: string[];
      };

      if (!data.success) {
        return {
          ok: false,
          reason: "reCAPTCHA could not verify this request. Please tick the box again.",
        };
      }

      return { ok: true };
    } catch {
      return { ok: false, reason: "Could not reach reCAPTCHA. Please try again." };
    }
  }

  // No keys configured: review builds and local demos use the test checkbox.
  // Set RECAPTCHA_SECRET_KEY and NEXT_PUBLIC_RECAPTCHA_SITE_KEY for live traffic.
  if (token === TEST_CAPTCHA_TOKEN) return { ok: true };
  return { ok: false, reason: "Please tick the reCAPTCHA checkbox." };
}
