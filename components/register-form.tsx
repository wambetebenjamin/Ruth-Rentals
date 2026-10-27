"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { counties } from "@/lib/catalog";
import { Captcha } from "./captcha";

const roles = [
  { value: "both", label: "Borrow and lend", hint: "Most people start here" },
  { value: "renter", label: "Borrow only", hint: "Find gear near you" },
  { value: "owner", label: "Lend only", hint: "Earn from your kit" },
];

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    county: "Nairobi",
    password: "",
    confirmPassword: "",
    role: "both",
    terms: false,
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (patch: Partial<typeof values>) =>
    setValues((current) => ({ ...current, ...patch }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setFields({});

    if (!values.terms) {
      setError("Please accept the terms and the privacy notice.");
      return;
    }
    if (!captchaToken) {
      setError("Please tick the reCAPTCHA checkbox.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, captchaToken }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "We could not create the account. Check the form and try again.");
        setFields(data.fields ?? {});
        setCaptchaToken(null);
        return;
      }
      router.push("/dashboard?welcome=1");
      router.refresh();
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="reg-name">
            Full name
          </label>
          <input
            id="reg-name"
            className="field"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update({ name: event.target.value })}
            aria-invalid={Boolean(fields.name)}
            required
          />
          {fields.name && <p className="error mt-1">{fields.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="reg-phone">
            Phone number
          </label>
          <input
            id="reg-phone"
            className="field"
            type="tel"
            autoComplete="tel"
            placeholder="0712 345 678"
            value={values.phone}
            onChange={(event) => update({ phone: event.target.value })}
            aria-invalid={Boolean(fields.phone)}
            required
          />
          {fields.phone && <p className="error mt-1">{fields.phone}</p>}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="reg-email">
          Email
        </label>
        <input
          id="reg-email"
          className="field"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => update({ email: event.target.value })}
          aria-invalid={Boolean(fields.email)}
          required
        />
        {fields.email && <p className="error mt-1">{fields.email}</p>}
      </div>

      <div>
        <label className="label" htmlFor="reg-county">
          County
        </label>
        <select
          id="reg-county"
          className="field"
          value={values.county}
          onChange={(event) => update({ county: event.target.value })}
          aria-invalid={Boolean(fields.county)}
        >
          {counties.map((county) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
        {fields.county && <p className="error mt-1">{fields.county}</p>}
      </div>

      <fieldset>
        <legend className="label">How will you use Ruth Rentals?</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {roles.map((role) => {
            const active = values.role === role.value;
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => update({ role: role.value })}
                className={`min-h-12 rounded-[4px] border px-3 py-2 text-left ${
                  active ? "border-ink bg-ink text-white" : "border-line bg-paper text-ink hover:border-ink"
                }`}
                aria-pressed={active}
              >
                <span className="block text-[14px] font-medium">{role.label}</span>
                <span className={`block text-[12px] ${active ? "text-[#c4c7ce]" : "text-copy"}`}>
                  {role.hint}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="reg-password">
            Password
          </label>
          <input
            id="reg-password"
            className="field"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(event) => update({ password: event.target.value })}
            aria-invalid={Boolean(fields.password)}
            required
            minLength={8}
          />
          {fields.password && <p className="error mt-1">{fields.password}</p>}
        </div>
        <div>
          <label className="label" htmlFor="reg-confirm">
            Confirm password
          </label>
          <input
            id="reg-confirm"
            className="field"
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(event) => update({ confirmPassword: event.target.value })}
            aria-invalid={Boolean(fields.confirmPassword)}
            required
            minLength={8}
          />
          {fields.confirmPassword && <p className="error mt-1">{fields.confirmPassword}</p>}
        </div>
      </div>

      <label className="flex items-start gap-2.5 text-[14px] text-copy">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 accent-[#37cfa2]"
          checked={values.terms}
          onChange={(event) => update({ terms: event.target.checked })}
        />
        <span>
          I accept the{" "}
          <Link href="/legal/terms" className="link">
            terms of use
          </Link>{" "}
          and the{" "}
          <Link href="/legal/privacy" className="link">
            privacy notice
          </Link>
          , including how my data is handled under the Kenya Data Protection Act.
        </span>
      </label>

      <Captcha onToken={setCaptchaToken} error={fields.captchaToken} />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-[14px] text-copy">
        Already have an account?{" "}
        <Link href="/login" className="link">
          Sign in
        </Link>
      </p>
    </form>
  );
}
