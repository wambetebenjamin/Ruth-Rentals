"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { demoAccounts } from "@/lib/demo";
import { Captcha } from "./captcha";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Those details did not match. Try again.");
        setFields(data.fields ?? {});
        setCaptchaToken(null);
        return;
      }
      router.push(next || "/dashboard");
      router.refresh();
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label className="label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          className="field"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(fields.email)}
          required
        />
        {fields.email && <p className="error mt-1">{fields.email}</p>}
      </div>

      <div>
        <label className="label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          className="field"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(fields.password)}
          required
        />
        {fields.password && <p className="error mt-1">{fields.password}</p>}
      </div>

      <Captcha onToken={setCaptchaToken} error={fields.captchaToken} />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-[14px] text-copy">
        New here?{" "}
        <Link href="/register" className="link">
          Create an account
        </Link>
      </p>

      <div className="border-t border-line pt-4">
        <p className="text-[12px] font-medium uppercase tracking-wide text-copy">
          Demo accounts, reuse on any review build
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              className="btn-quiet btn-sm flex-col items-start text-left"
              onClick={() => {
                setEmail(account.email);
                setPassword(account.password);
              }}
            >
              <span className="text-[13px] font-medium">{account.label}</span>
              <span className="text-[11px] font-normal text-copy">{account.email}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-copy">
          Password for all demo accounts is {demoAccounts[0]?.password}. These accounts are
          seeded with sample bookings.
        </p>
      </div>
    </form>
  );
}
