import "server-only";

import type { Booking, Enquiry, Item, Message, Session, User } from "./types";
import { buildSeed } from "./seed";
import { randomToken } from "./password";

type Collections = {
  users: User[];
  items: Item[];
  bookings: Booking[];
  messages: Message[];
  enquiries: Enquiry[];
};

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export const hasKv = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
);

export const storageMode: "kv" | "memory" = hasKv ? "kv" : "memory";

const KEYS = {
  users: "rr:users",
  items: "rr:items",
  bookings: "rr:bookings",
  messages: "rr:messages",
  enquiries: "rr:enquiries",
} as const;

declare global {
  var __rrMemory: Collections | undefined;
  var __rrSessions: Map<string, Session> | undefined;
}

function memoryStore(): Collections {
  if (!globalThis.__rrMemory) {
    const seed = buildSeed();
    globalThis.__rrMemory = {
      users: seed.users,
      items: seed.items,
      bookings: seed.bookings,
      messages: seed.messages,
      enquiries: [],
    };
  }
  return globalThis.__rrMemory;
}

function sessionStore(): Map<string, Session> {
  if (!globalThis.__rrSessions) {
    globalThis.__rrSessions = new Map();
  }
  return globalThis.__rrSessions;
}

async function kv() {
  const mod = await import("@vercel/kv");
  return mod.kv;
}

async function readCollection<K extends keyof Collections>(
  key: K,
): Promise<Collections[K]> {
  if (hasKv) {
    const client = await kv();
    const existing = await client.get<Collections[K]>(KEYS[key]);
    if (existing) return existing;
    const seeded = memoryStore()[key];
    await client.set(KEYS[key], seeded);
    return seeded;
  }
  return memoryStore()[key];
}

async function writeCollection<K extends keyof Collections>(
  key: K,
  value: Collections[K],
): Promise<void> {
  if (hasKv) {
    const client = await kv();
    await client.set(KEYS[key], value);
    return;
  }
  memoryStore()[key] = value;
}

export async function getUsers(): Promise<User[]> {
  return readCollection("users");
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((user) => user.id === id) ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  const target = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === target) ?? null;
}

export async function addUser(user: User): Promise<User> {
  const users = await getUsers();
  const next = [...users, user];
  await writeCollection("users", next);
  return user;
}

export async function getItems(): Promise<Item[]> {
  return readCollection("items");
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
  const items = await getItems();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getItemById(id: string): Promise<Item | null> {
  const items = await getItems();
  return items.find((item) => item.id === id) ?? null;
}

export async function addItem(item: Item): Promise<Item> {
  const items = await getItems();
  await writeCollection("items", [item, ...items]);
  return item;
}

export async function updateItem(id: string, patch: Partial<Item>): Promise<Item | null> {
  const items = await getItems();
  let updated: Item | null = null;
  const next = items.map((item) => {
    if (item.id !== id) return item;
    updated = { ...item, ...patch };
    return updated;
  });
  if (updated) await writeCollection("items", next);
  return updated;
}

export async function getBookings(): Promise<Booking[]> {
  return readCollection("bookings");
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const bookings = await getBookings();
  return bookings.find((booking) => booking.id === id) ?? null;
}

export async function addBooking(booking: Booking): Promise<Booking> {
  const bookings = await getBookings();
  await writeCollection("bookings", [booking, ...bookings]);
  return booking;
}

export async function updateBooking(
  id: string,
  patch: Partial<Booking>,
): Promise<Booking | null> {
  const bookings = await getBookings();
  let updated: Booking | null = null;
  const next = bookings.map((booking) => {
    if (booking.id !== id) return booking;
    updated = { ...booking, ...patch, updatedAt: new Date().toISOString() };
    return updated;
  });
  if (updated) await writeCollection("bookings", next);
  return updated;
}

export async function getMessages(): Promise<Message[]> {
  return readCollection("messages");
}

export async function addMessage(message: Message): Promise<Message> {
  const messages = await getMessages();
  await writeCollection("messages", [...messages, message]);
  return message;
}

export async function markThreadRead(threadId: string, userId: string): Promise<void> {
  const messages = await getMessages();
  let changed = false;
  const next = messages.map((message) => {
    if (message.threadId !== threadId || message.readBy.includes(userId)) return message;
    changed = true;
    return { ...message, readBy: [...message.readBy, userId] };
  });
  if (changed) await writeCollection("messages", next);
}

export async function getEnquiries(): Promise<Enquiry[]> {
  return readCollection("enquiries");
}

export async function addEnquiry(enquiry: Enquiry): Promise<Enquiry> {
  const enquiries = await getEnquiries();
  await writeCollection("enquiries", [enquiry, ...enquiries]);
  return enquiry;
}

export async function createSession(userId: string): Promise<string> {
  const token = randomToken(32);
  const now = Date.now();
  const session: Session = {
    token,
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_SECONDS * 1000).toISOString(),
  };

  if (hasKv) {
    const client = await kv();
    await client.set(`rr:session:${token}`, userId, { ex: SESSION_TTL_SECONDS });
    return token;
  }

  sessionStore().set(token, session);
  return token;
}

export async function getSessionUser(token: string | undefined): Promise<User | null> {
  if (!token) return null;

  if (hasKv) {
    const client = await kv();
    const userId = await client.get<string>(`rr:session:${token}`);
    if (!userId) return null;
    return getUserById(userId);
  }

  const session = sessionStore().get(token);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    sessionStore().delete(token);
    return null;
  }
  return getUserById(session.userId);
}

export async function deleteSession(token: string | undefined): Promise<void> {
  if (!token) return;
  if (hasKv) {
    const client = await kv();
    await client.del(`rr:session:${token}`);
    return;
  }
  sessionStore().delete(token);
}
