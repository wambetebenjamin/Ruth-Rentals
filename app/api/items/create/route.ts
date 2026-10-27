import { itemCreateSchema } from "@/lib/validation";
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
import { getCurrentUser } from "@/lib/auth";
import { addItem, getItemBySlug } from "@/lib/store";
import { slugify, shortId } from "@/lib/format";
import type { CategorySlug, Item } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ownerSince(createdAt: string) {
  const date = new Date(createdAt);
  return date.toLocaleDateString("en-KE", { month: "long", year: "numeric" });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Request blocked.", 403);

  const user = await getCurrentUser();
  if (!user) return jsonError("Sign in before listing an item.", 401);

  const ip = clientIp(request);
  const limit = rateLimit(`item-create:${user.id}:${ip}`, 8, 30 * 60 * 1000);
  if (!limit.ok) return tooMany(limit.retryAfter);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Send the form as JSON.");
  }

  const parsed = itemCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(firstError(parsed.error), 422, fieldErrors(parsed.error));
  }

  const data = parsed.data;
  if (data.company) return jsonError("Request blocked.", 400);

  const captcha = await verifyCaptcha(data.captchaToken, ip);
  if (!captcha.ok) {
    return jsonError(captcha.reason, 400, { captchaToken: captcha.reason });
  }

  const totalPhotoBytes = data.photos.reduce((total, photo) => total + photo.length, 0);
  if (totalPhotoBytes > 3_500_000) {
    return jsonError("Those photos are too large together. Use six photos or fewer.", 413, {
      photos: "Keep the total photo size under 3.5MB.",
    });
  }

  let slug = slugify(data.title);
  if (!slug) slug = shortId("item");
  const exists = await getItemBySlug(slug);
  if (exists) slug = `${slug}-${shortId("x").slice(-5)}`;

  const fallbackImage = "/images/listing-hand-tools.jpg";
  const gallery =
    data.photos.length > 0 ? data.photos : [fallbackImage];

  const item: Item = {
    id: shortId("it"),
    slug,
    title: data.title,
    category: data.category as CategorySlug,
    county: data.county,
    area: data.area,
    dailyRate: data.dailyRate,
    weeklyRate: data.weeklyRate,
    deposit: data.deposit,
    minDays: data.minDays,
    rating: 5,
    reviews: 0,
    image: gallery[0] ?? fallbackImage,
    gallery,
    description: data.description,
    specs: [
      { label: "Category", value: data.category.replace(/-/g, " ") },
      { label: "Location", value: `${data.area}, ${data.county}` },
      { label: "Minimum hire", value: `${data.minDays} ${data.minDays === 1 ? "day" : "days"}` },
      { label: "Deposit", value: `KES ${data.deposit.toLocaleString("en-KE")}` },
    ],
    ownerId: user.id,
    ownerName: user.name,
    ownerAvatar: user.avatar ?? "/images/owner-wanjiku.jpg",
    ownerSince: ownerSince(user.createdAt),
    ownerDeals: 0,
    ownerRating: 5,
    blockedDates: [],
    pickupNote: data.pickupNote,
    featured: false,
    promoted: data.promoted,
    status: "live",
    createdAt: new Date().toISOString(),
  };

  await addItem(item);

  return jsonOk({ item: { id: item.id, slug: item.slug, title: item.title } }, 201);
}
