"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { categories, counties } from "@/lib/catalog";
import { formatKES } from "@/lib/format";
import { site } from "@/lib/site";
import { Captcha } from "./captcha";
import {
  IconArrowRight,
  IconCheck,
  IconClose,
  IconInfo,
  IconUpload,
} from "./icons";

const steps = ["Item details", "Photos", "Rate and handover", "Review"];

type Values = {
  title: string;
  category: string;
  county: string;
  area: string;
  description: string;
  dailyRate: string;
  weeklyRate: string;
  deposit: string;
  minDays: string;
  pickupNote: string;
  promoted: boolean;
};

const initialValues: Values = {
  title: "",
  category: "power-tools",
  county: "Nairobi",
  area: "",
  description: "",
  dailyRate: "",
  weeklyRate: "",
  deposit: "",
  minDays: "1",
  pickupNote: "",
  promoted: false,
};

async function compressPhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxWidth = 1000;
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas not supported");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", 0.72);
}

export function ItemWizard({ ownerName }: { ownerName: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>(initialValues);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState<{ slug: string; title: string } | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const update = (patch: Partial<Values>) => setValues((current) => ({ ...current, ...patch }));

  const validateStep = (current: number): boolean => {
    const nextFields: Record<string, string> = {};
    if (current === 1) {
      if (values.title.trim().length < 6) nextFields.title = "Give the item a clear title.";
      if (values.area.trim().length < 2) nextFields.area = "Add the estate or town.";
      if (values.description.trim().length < 60)
        nextFields.description = "Write at least 60 characters.";
    }
    if (current === 3) {
      if (!values.dailyRate || Number(values.dailyRate) < 100)
        nextFields.dailyRate = "Daily rate starts at KES 100.";
      if (!values.deposit || Number(values.deposit) < 0)
        nextFields.deposit = "Add a deposit amount. Zero is allowed.";
      if (values.pickupNote.trim().length < 4)
        nextFields.pickupNote = "Say where the handover happens.";
      if (!values.minDays || Number(values.minDays) < 1)
        nextFields.minDays = "Minimum is one day.";
    }
    setFields(nextFields);
    return Object.keys(nextFields).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(4, current + 1));
  };

  const goBack = () => {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setPhotoError("");
    const room = 6 - photos.length;
    if (room <= 0) {
      setPhotoError("Six photos is the maximum.");
      return;
    }
    setUploading(true);
    try {
      const chosen = Array.from(files).slice(0, room);
      const next: string[] = [];
      for (const file of chosen) {
        if (!file.type.startsWith("image/")) {
          setPhotoError("Only image files are accepted.");
          continue;
        }
        if (file.size > 8_000_000) {
          setPhotoError(`${file.name} is over 8MB. Use a smaller photo.`);
          continue;
        }
        const dataUrl = await compressPhoto(file);
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ dataUrl, filename: file.name }),
        });
        const data = (await response.json()) as { ok: boolean; url?: string; error?: string };
        if (!response.ok || !data.ok || !data.url) {
          setPhotoError(data.error ?? "That photo did not upload. Try another one.");
          continue;
        }
        next.push(data.url);
      }
      setPhotos((current) => [...current, ...next]);
    } catch {
      setPhotoError("Could not read those photos. Try JPEG or PNG files.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const publish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!captchaToken) {
      setError("Please tick the reCAPTCHA checkbox.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/items/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          category: values.category,
          county: values.county,
          area: values.area,
          description: values.description,
          dailyRate: Number(values.dailyRate),
          weeklyRate: Number(values.weeklyRate || 0),
          deposit: Number(values.deposit || 0),
          minDays: Number(values.minDays || 1),
          photos,
          pickupNote: values.pickupNote,
          promoted: values.promoted,
          captchaToken,
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        fields?: Record<string, string>;
        item?: { slug: string; title: string };
      };
      if (!response.ok || !data.ok || !data.item) {
        setError(data.error ?? "The listing did not publish. Check the form and try again.");
        setFields(data.fields ?? {});
        setCaptchaToken(null);
        return;
      }
      setPublished(data.item);
      router.refresh();
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (published) {
    return (
      <div className="card p-6">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-teal text-ink">
          <IconCheck size={24} />
        </span>
        <h2 className="mt-3 text-[26px]">Your listing is live</h2>
        <p className="mt-2 text-[15px] text-copy">
          {published.title} is now visible in browse. Requests will appear on your dashboard, and
          you can pause the listing at any time.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href={`/item/${published.slug}`} className="btn-primary">
            View the listing
          </Link>
          <Link href="/dashboard" className="btn-outline">
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const progress = (step / steps.length) * 100;

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-line p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] font-medium text-ink" aria-live="polite">
            Step {step} of {steps.length}: {steps[step - 1]}
          </p>
          <p className="text-[12px] text-copy">Listing as {ownerName}</p>
        </div>
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-wash"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step}
          aria-label="Listing progress"
        >
          <div className="step-progress h-full bg-teal" style={{ width: `${progress}%` }} />
        </div>
        <ol className="mt-2 hidden grid-cols-4 gap-2 text-[11px] uppercase tracking-wide sm:grid">
          {steps.map((label, index) => (
            <li
              key={label}
              className={index + 1 <= step ? "text-ink" : "text-copy"}
              aria-current={index + 1 === step ? "step" : undefined}
            >
              {label}
            </li>
          ))}
        </ol>
      </div>

      <form onSubmit={publish} className="p-5" noValidate>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="wiz-title">
                What are you lending?
              </label>
              <input
                id="wiz-title"
                className="field"
                value={values.title}
                onChange={(event) => update({ title: event.target.value })}
                placeholder="Bosch rotary hammer with 12 bits"
                maxLength={90}
                aria-invalid={Boolean(fields.title)}
                required
              />
              <p className="hint mt-1">Be specific. Brand, size and what comes in the box.</p>
              {fields.title && <p className="error mt-1">{fields.title}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="wiz-category">
                  Category
                </label>
                <select
                  id="wiz-category"
                  className="field"
                  value={values.category}
                  onChange={(event) => update({ category: event.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="wiz-county">
                  County
                </label>
                <select
                  id="wiz-county"
                  className="field"
                  value={values.county}
                  onChange={(event) => update({ county: event.target.value })}
                >
                  {counties.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="wiz-area">
                Estate or town
              </label>
              <input
                id="wiz-area"
                className="field"
                value={values.area}
                onChange={(event) => update({ area: event.target.value })}
                placeholder="Kilimani"
                maxLength={60}
                aria-invalid={Boolean(fields.area)}
                required
              />
              <p className="hint mt-1">Neighbours search by county. This narrows it down.</p>
              {fields.area && <p className="error mt-1">{fields.area}</p>}
            </div>

            <div>
              <label className="label" htmlFor="wiz-description">
                Description
              </label>
              <textarea
                id="wiz-description"
                className="field min-h-[140px]"
                value={values.description}
                onChange={(event) => update({ description: event.target.value })}
                placeholder="What it does, what is included, and anything a renter should know before collecting."
                maxLength={2000}
                aria-invalid={Boolean(fields.description)}
                required
              />
              <p className="hint mt-1">
                {values.description.trim().length}/60 characters minimum. Two short paragraphs is
                plenty.
              </p>
              {fields.description && <p className="error mt-1">{fields.description}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-[20px]">Photos</h2>
              <p className="mt-1 text-[14px] text-copy">
                Up to six photos. Show the item clearly, plus any case or accessories. Photos are
                compressed before upload and stored on Vercel Blob when configured.
              </p>
            </div>

            <div className="rounded-[4px] border border-dashed border-line bg-shell p-5 text-center">
              <IconUpload size={26} className="mx-auto text-copy" />
              <label
                htmlFor="wiz-photos"
                className="btn-outline btn-sm mt-3 inline-flex cursor-pointer"
              >
                {uploading ? "Uploading..." : "Choose photos"}
              </label>
              <input
                id="wiz-photos"
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(event) => addPhotos(event.target.files)}
                disabled={uploading}
              />
              <p className="hint mt-2">JPEG, PNG or WebP. Maximum 6 photos.</p>
              {photoError && (
                <p className="error mt-2" role="alert">
                  {photoError}
                </p>
              )}
            </div>

            {photos.length > 0 ? (
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {photos.map((photo, index) => (
                  <li key={`${photo.slice(0, 40)}-${index}`} className="relative">
                    <div className="relative aspect-square overflow-hidden rounded-[4px] border border-line bg-wash">
                      <Image
                        src={photo}
                        alt={`Listing photo ${index + 1}`}
                        fill
                        sizes="140px"
                        className="object-cover"
                        unoptimized={photo.startsWith("data:")}
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-ink/90 text-white"
                      onClick={() =>
                        setPhotos((current) => current.filter((_, entry) => entry !== index))
                      }
                      aria-label={`Remove photo ${index + 1}`}
                    >
                      <IconClose size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="notice">
                No photos yet. Listings with at least two photos get about three times more
                requests. You can add them later from the dashboard.
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="wiz-daily">
                  Daily rate, KES
                </label>
                <input
                  id="wiz-daily"
                  className="field"
                  type="number"
                  inputMode="numeric"
                  min={100}
                  step={50}
                  value={values.dailyRate}
                  onChange={(event) => update({ dailyRate: event.target.value })}
                  placeholder="900"
                  aria-invalid={Boolean(fields.dailyRate)}
                  required
                />
                {fields.dailyRate && <p className="error mt-1">{fields.dailyRate}</p>}
              </div>
              <div>
                <label className="label" htmlFor="wiz-weekly">
                  Weekly rate, KES <span className="font-normal text-copy">(optional)</span>
                </label>
                <input
                  id="wiz-weekly"
                  className="field"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={100}
                  value={values.weeklyRate}
                  onChange={(event) => update({ weeklyRate: event.target.value })}
                  placeholder="5000"
                />
                <p className="hint mt-1">Used automatically for hires of 7 days or more.</p>
              </div>
              <div>
                <label className="label" htmlFor="wiz-deposit">
                  Deposit, KES
                </label>
                <input
                  id="wiz-deposit"
                  className="field"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={100}
                  value={values.deposit}
                  onChange={(event) => update({ deposit: event.target.value })}
                  placeholder="5000"
                  aria-invalid={Boolean(fields.deposit)}
                  required
                />
                <p className="hint mt-1">
                  Agreed and refunded directly by you. Ruth Rentals does not hold deposits.
                </p>
                {fields.deposit && <p className="error mt-1">{fields.deposit}</p>}
              </div>
              <div>
                <label className="label" htmlFor="wiz-mindays">
                  Minimum days
                </label>
                <input
                  id="wiz-mindays"
                  className="field"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={30}
                  value={values.minDays}
                  onChange={(event) => update({ minDays: event.target.value })}
                  aria-invalid={Boolean(fields.minDays)}
                  required
                />
                {fields.minDays && <p className="error mt-1">{fields.minDays}</p>}
              </div>
            </div>

            <div>
              <label className="label" htmlFor="wiz-pickup">
                Pickup and handover
              </label>
              <input
                id="wiz-pickup"
                className="field"
                value={values.pickupNote}
                onChange={(event) => update({ pickupNote: event.target.value })}
                placeholder="Pick up in Kilimani, evenings after 6pm."
                maxLength={160}
                aria-invalid={Boolean(fields.pickupNote)}
                required
              />
              {fields.pickupNote && <p className="error mt-1">{fields.pickupNote}</p>}
            </div>

            <label className="flex items-start gap-3 border border-line p-4 text-[14px]">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[#37cfa2]"
                checked={values.promoted}
                onChange={(event) => update({ promoted: event.target.checked })}
              />
              <span>
                <span className="font-medium text-ink">
                  Promote this listing for {formatKES(site.promotedPrice)}, once
                </span>
                <span className="mt-0.5 block text-copy">
                  Promoted listings appear above basic ones in browse and carry a plain label. No
                  gold badges, no flashing. Billing is arranged by invoice during the pilot.
                </span>
              </span>
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-[20px]">Review and publish</h2>
            <dl className="border-t border-line">
              <div className="flex justify-between gap-4 border-b border-line py-2.5">
                <dt className="text-[13px] text-copy">Title</dt>
                <dd className="text-right text-[14px] font-medium text-ink">{values.title || "Not set"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line py-2.5">
                <dt className="text-[13px] text-copy">Category</dt>
                <dd className="text-right text-[14px] text-ink">
                  {categories.find((entry) => entry.slug === values.category)?.name}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line py-2.5">
                <dt className="text-[13px] text-copy">Location</dt>
                <dd className="text-right text-[14px] text-ink">
                  {values.area}, {values.county}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line py-2.5">
                <dt className="text-[13px] text-copy">Rate</dt>
                <dd className="text-right text-[14px] text-ink">
                  {formatKES(Number(values.dailyRate || 0))} per day
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line py-2.5">
                <dt className="text-[13px] text-copy">Deposit</dt>
                <dd className="text-right text-[14px] text-ink">
                  {formatKES(Number(values.deposit || 0))}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line py-2.5">
                <dt className="text-[13px] text-copy">Photos</dt>
                <dd className="text-right text-[14px] text-ink">{photos.length} attached</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line py-2.5">
                <dt className="text-[13px] text-copy">Promoted</dt>
                <dd className="text-right text-[14px] text-ink">{values.promoted ? "Yes" : "No"}</dd>
              </div>
            </dl>

            <div className="notice flex items-start gap-2">
              <IconInfo size={17} className="mt-0.5 shrink-0" />
              <p>
                By publishing you confirm the item is yours to lend, it is safe to use, and the
                deposit terms are yours to honour. The platform is not an insurer.
              </p>
            </div>

            <Captcha onToken={setCaptchaToken} error={fields.captchaToken} />

            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-between">
          <button
            type="button"
            className="btn-outline"
            onClick={goBack}
            disabled={step === 1 || submitting}
          >
            Back
          </button>
          {step < 4 ? (
            <button type="button" className="btn-primary" onClick={goNext}>
              Continue
              <IconArrowRight size={18} />
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Publishing..." : "Publish listing"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
