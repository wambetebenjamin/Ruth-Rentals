import { z } from "zod";
import { categories, counties } from "./catalog";
import { isValidISO, dayCount, todayISO } from "./dates";

const phoneRegex = /^(\+254|0)[17]\d{8}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const categoryValues = categories.map((category) => category.slug) as [
  string,
  ...string[],
];

export const countySchema = z.string().refine((value) => counties.includes(value), {
  message: "Choose a county from the list.",
});

export const phoneSchema = z
  .string()
  .trim()
  .regex(phoneRegex, "Use a Kenyan number, for example 0712 345 678 or +254712345678.");

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Keep the password under 72 characters.");

export const captchaSchema = z.string().optional();
export const honeypotSchema = z.string().max(0).optional().or(z.literal(""));

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Tell us your name.").max(80),
    email: z.string().trim().toLowerCase().email("Enter a valid email address."),
    phone: phoneSchema,
    county: countySchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(["owner", "renter", "both"]).default("both"),
    captchaToken: captchaSchema,
    company: honeypotSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "The two passwords do not match.",
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  captchaToken: captchaSchema,
  company: honeypotSchema,
});

export const itemCreateSchema = z.object({
  title: z.string().trim().min(6, "Give the item a clear title.").max(90),
  category: z.enum(categoryValues),
  county: countySchema,
  area: z.string().trim().min(2, "Add the estate or town.").max(60),
  description: z
    .string()
    .trim()
    .min(60, "Write at least 60 characters so renters know what to expect.")
    .max(2000),
  dailyRate: z.coerce.number().int().min(100, "Daily rate starts at KES 100.").max(200000),
  weeklyRate: z.coerce.number().int().min(0).max(1000000),
  deposit: z.coerce.number().int().min(0).max(500000),
  minDays: z.coerce.number().int().min(1).max(30),
  photos: z.array(z.string().min(8)).max(6).default([]),
  pickupNote: z.string().trim().min(4, "Say where the handover happens.").max(160),
  promoted: z.boolean().optional().default(false),
  captchaToken: captchaSchema,
  company: honeypotSchema,
});

export const bookingCreateSchema = z
  .object({
    itemSlug: z.string().trim().min(1, "Choose an item."),
    startDate: z.string().regex(dateRegex, "Choose a start date."),
    endDate: z.string().regex(dateRegex, "Choose an end date."),
    phone: phoneSchema,
    note: z.string().trim().max(500).optional().default(""),
    captchaToken: captchaSchema,
    company: honeypotSchema,
  })
  .superRefine((data, ctx) => {
    if (!isValidISO(data.startDate) || !isValidISO(data.endDate)) {
      ctx.addIssue({ code: "custom", path: ["startDate"], message: "Use a valid date." });
      return;
    }
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "The return date must be on or after the pickup date.",
      });
    }
    if (data.startDate < todayISO()) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Pickup cannot be in the past.",
      });
    }
    if (dayCount(data.startDate, data.endDate) > 60) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "For hires over 60 days, message the owner first.",
      });
    }
  });

export const messageSendSchema = z.object({
  toUserId: z.string().trim().min(1, "Choose who you are writing to."),
  itemId: z.string().trim().optional(),
  bookingId: z.string().trim().optional(),
  body: z.string().trim().min(2, "Write a message.").max(1200),
  captchaToken: captchaSchema,
  company: honeypotSchema,
});

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: phoneSchema,
  subject: z.string().trim().min(2, "Add a subject.").max(120),
  message: z.string().trim().min(10, "Tell us a little more.").max(2000),
  itemSlug: z.string().trim().optional(),
  captchaToken: captchaSchema,
  company: honeypotSchema,
});

export const bookingStatusSchema = z.object({
  status: z.enum(["requested", "confirmed", "collected", "returned", "declined"]),
  checklist: z
    .object({
      photosBefore: z.boolean(),
      conditionNotes: z.boolean(),
      accessoriesCounted: z.boolean(),
      bothSigned: z.boolean(),
    })
    .optional(),
});

export const itemStatusSchema = z.object({
  status: z.enum(["live", "paused"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ItemCreateInput = z.infer<typeof itemCreateSchema>;
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type MessageSendInput = z.infer<typeof messageSendSchema>;
export type EnquiryInput = z.infer<typeof enquirySchema>;
