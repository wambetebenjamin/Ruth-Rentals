"use client";

import { useState } from "react";
import { Captcha } from "./captcha";
import { IconCheck } from "./icons";

type Props = {
  subject?: string;
  itemSlug?: string;
  defaultMessage?: string;
  compact?: boolean;
  user?: { name: string; email: string; phone: string } | null;
};

export function EnquiryForm({ subject, itemSlug, defaultMessage = "", compact = false, user }: Props) {
  const [values, setValues] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    subject: subject ?? "General enquiry",
    message: defaultMessage,
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (patch: Partial<typeof values>) => {
    setValues((current) => ({ ...current, ...patch }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setFields({});
    if (!captchaToken) {
      setError("Please tick the reCAPTCHA checkbox.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/send-enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, itemSlug, captchaToken }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "We could not send that. Please try again.");
        setFields(data.fields ?? {});
        setCaptchaToken(null);
        return;
      }
      setSent(true);
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="border border-teal bg-teal/10 p-5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-teal text-ink">
          <IconCheck size={20} />
        </span>
        <p className="mt-3 font-medium text-ink">Message sent</p>
        <p className="mt-1 text-[14px] text-copy">
          The team replies within one working day, Monday to Saturday. For anything urgent,
          WhatsApp us on +254 112 272 061.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      {!compact && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="enq-name">
              Your name
            </label>
            <input
              id="enq-name"
              className="field"
              value={values.name}
              onChange={(event) => update({ name: event.target.value })}
              autoComplete="name"
              aria-invalid={Boolean(fields.name)}
              required
            />
            {fields.name && <p className="error mt-1">{fields.name}</p>}
          </div>
          <div>
            <label className="label" htmlFor="enq-email">
              Email
            </label>
            <input
              id="enq-email"
              className="field"
              type="email"
              value={values.email}
              onChange={(event) => update({ email: event.target.value })}
              autoComplete="email"
              aria-invalid={Boolean(fields.email)}
              required
            />
            {fields.email && <p className="error mt-1">{fields.email}</p>}
          </div>
          <div>
            <label className="label" htmlFor="enq-phone">
              Phone
            </label>
            <input
              id="enq-phone"
              className="field"
              type="tel"
              value={values.phone}
              onChange={(event) => update({ phone: event.target.value })}
              autoComplete="tel"
              placeholder="0712 345 678"
              aria-invalid={Boolean(fields.phone)}
              required
            />
            {fields.phone && <p className="error mt-1">{fields.phone}</p>}
          </div>
          <div>
            <label className="label" htmlFor="enq-subject">
              Subject
            </label>
            <input
              id="enq-subject"
              className="field"
              value={values.subject}
              onChange={(event) => update({ subject: event.target.value })}
              aria-invalid={Boolean(fields.subject)}
              required
            />
            {fields.subject && <p className="error mt-1">{fields.subject}</p>}
          </div>
        </div>
      )}

      {compact && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="enq-name-compact">
              Your name
            </label>
            <input
              id="enq-name-compact"
              className="field"
              value={values.name}
              onChange={(event) => update({ name: event.target.value })}
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="enq-phone-compact">
              Phone
            </label>
            <input
              id="enq-phone-compact"
              className="field"
              type="tel"
              value={values.phone}
              onChange={(event) => update({ phone: event.target.value })}
              autoComplete="tel"
              placeholder="0712 345 678"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="enq-email-compact">
              Email
            </label>
            <input
              id="enq-email-compact"
              className="field"
              type="email"
              value={values.email}
              onChange={(event) => update({ email: event.target.value })}
              autoComplete="email"
              required
            />
          </div>
        </div>
      )}

      <div>
        <label className="label" htmlFor="enq-message">
          Message
        </label>
        <textarea
          id="enq-message"
          className="field min-h-[110px]"
          value={values.message}
          onChange={(event) => update({ message: event.target.value })}
          aria-invalid={Boolean(fields.message)}
          required
          maxLength={2000}
        />
        {fields.message && <p className="error mt-1">{fields.message}</p>}
      </div>

      <Captcha onToken={setCaptchaToken} error={fields.captchaToken} />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
