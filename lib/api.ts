import "server-only";

import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function jsonError(message: string, status = 400, fields?: Record<string, string>) {
  return NextResponse.json({ ok: false, error: message, fields: fields ?? {} }, { status });
}

export function fieldErrors(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

export function firstError(error: ZodError): string {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const host = request.headers.get("host");
    return originHost === host;
  } catch {
    return false;
  }
}

export function tooMany(retryAfter: number) {
  return NextResponse.json(
    {
      ok: false,
      error: `Too many attempts. Please wait ${Math.ceil(retryAfter / 60)} minutes and try again.`,
    },
    { status: 429, headers: { "retry-after": `${retryAfter}` } },
  );
}
