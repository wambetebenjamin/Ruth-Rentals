import "server-only";

import { cookies } from "next/headers";
import type { User } from "./types";
import { createSession, deleteSession, getSessionUser } from "./store";

export const SESSION_COOKIE = "ruth_session";
export const CONSENT_COOKIE = "ruth-rentals-cookie-consent";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getSessionUser(token);
}

export async function startSession(userId: string): Promise<void> {
  const token = await createSession(userId);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  await deleteSession(token);
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function publicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    county: user.county,
    role: user.role,
    avatar: user.avatar ?? null,
  };
}
