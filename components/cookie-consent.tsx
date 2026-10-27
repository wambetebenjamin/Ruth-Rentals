"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_NAME = "ruth-rentals-cookie-consent";

function readConsent(): string | null {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return entry ? decodeURIComponent(entry.split("=")[1] ?? "") : null;
}

function saveConsent(value: "all" | "essential") {
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`;
  document.documentElement.dataset.consentOpen = "false";
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = readConsent();
    if (!consent) {
      setVisible(true);
      document.documentElement.dataset.consentOpen = "true";
    }
    return () => {
      document.documentElement.dataset.consentOpen = "false";
    };
  }, []);

  if (!visible) return null;

  const choose = (value: "all" | "essential") => {
    saveConsent(value);
    setVisible(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper"
      role="dialog"
      aria-modal="false"
      aria-label="Cookie choices"
    >
      <div className="wrap py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl text-sm leading-relaxed text-copy">
            <p className="font-medium text-ink">Cookies on Ruth Rentals</p>
            <p className="mt-1">
              We use one essential cookie to keep you signed in and one to remember this choice.
              With your say so we also measure which pages help people find gear. Read the{" "}
              <Link href="/legal/cookies" className="link">
                cookie notice
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" className="btn-outline btn-sm" onClick={() => choose("essential")}>
              Essential only
            </button>
            <button type="button" className="btn-primary btn-sm" onClick={() => choose("all")}>
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
