"use client";

import { useState } from "react";
import { Captcha } from "./captcha";
import { IconCheck } from "./icons";

type Props = {
  toUserId: string;
  ownerName: string;
  itemId: string;
  itemTitle: string;
};

export function OwnerMessage({ toUserId, ownerName, itemId, itemTitle }: Props) {
  const [body, setBody] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!captchaToken) {
      setError("Please tick the reCAPTCHA checkbox.");
      return;
    }
    if (body.trim().length < 2) {
      setError("Write a short message first.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ toUserId, itemId, body, captchaToken }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Message did not send. Please try again.");
        setCaptchaToken(null);
        return;
      }
      setSent(true);
      setBody("");
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="border border-teal bg-teal/10 p-4">
        <p className="flex items-center gap-2 font-medium text-ink">
          <IconCheck size={18} /> Message sent to {ownerName}
        </p>
        <p className="mt-1 text-[13px] text-copy">
          You will find the thread under Messages on your dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <div>
        <label className="label" htmlFor="owner-message">
          Message {ownerName} about {itemTitle}
        </label>
        <textarea
          id="owner-message"
          className="field min-h-[90px]"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Hi, is this free on Saturday? I can collect from town."
          maxLength={1200}
        />
      </div>
      <Captcha onToken={setCaptchaToken} />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn-outline w-full" disabled={submitting}>
        {submitting ? "Sending..." : "Send message"}
      </button>
      <p className="text-[12px] text-copy">
        Phone numbers are shared once the owner confirms a booking. Keep payments off this site.
      </p>
    </form>
  );
}
