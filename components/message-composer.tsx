"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Captcha } from "./captcha";

type Props = {
  toUserId: string;
  bookingId?: string;
  itemId?: string;
  label: string;
};

export function MessageComposer({ toUserId, bookingId, itemId, label }: Props) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!captchaToken) {
      setError("Please tick the reCAPTCHA checkbox.");
      return;
    }
    if (body.trim().length < 2) {
      setError("Write a message first.");
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ toUserId, bookingId, itemId, body, captchaToken }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Message did not send.");
        setCaptchaToken(null);
        return;
      }
      setBody("");
      setCaptchaToken(null);
      router.refresh();
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 border-t border-line pt-4" noValidate>
      <label className="label" htmlFor={`reply-${toUserId}`}>
        {label}
      </label>
      <textarea
        id={`reply-${toUserId}`}
        className="field min-h-[84px]"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        maxLength={1200}
        placeholder="Write a short, clear message."
      />
      <div className="mt-3">
        <Captcha onToken={setCaptchaToken} />
      </div>
      {error && (
        <p className="error mt-2" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn-primary btn-sm mt-3" disabled={sending}>
        {sending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
