"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconCheck } from "./icons";

type Props = {
  onToken: (token: string | null) => void;
  error?: string;
  id?: string;
};

type Grecaptcha = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => number;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function Captcha({ onToken, error, id = "captcha" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [testChecked, setTestChecked] = useState(false);
  const rendered = useRef(false);

  const renderWidget = useCallback(() => {
    if (!SITE_KEY || !window.grecaptcha || !containerRef.current || rendered.current) return;
    rendered.current = true;
    window.grecaptcha.render(containerRef.current, {
      sitekey: SITE_KEY,
      theme: "light",
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
    });
  }, [onToken]);

  useEffect(() => {
    if (scriptReady) renderWidget();
  }, [scriptReady, renderWidget]);

  if (!SITE_KEY) {
    return (
      <div id={id}>
        <button
          type="button"
          role="checkbox"
          aria-checked={testChecked}
          aria-label="I am not a robot"
          onClick={() => {
            const next = !testChecked;
            setTestChecked(next);
            onToken(next ? "demo-pass" : null);
          }}
          className="flex min-h-12 w-full max-w-sm items-center gap-3 rounded-[4px] border border-line bg-shell px-4 py-3 text-left text-[15px] text-ink"
        >
          <span
            className={`grid h-6 w-6 shrink-0 place-items-center border ${
              testChecked ? "border-teal bg-teal text-ink" : "border-line bg-paper text-transparent"
            }`}
            aria-hidden="true"
          >
            <IconCheck size={16} />
          </span>
          <span>
            I am not a robot
            <span className="mt-0.5 block text-[12px] text-copy">
              Test checkbox on this build. Add reCAPTCHA keys to go live.
            </span>
          </span>
        </button>
        {error && <p className="error mt-1.5">{error}</p>}
      </div>
    );
  }

  return (
    <div id={id}>
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          setScriptReady(true);
        }}
      />
      <div ref={containerRef} className="min-h-[78px]" />
      <p className="hint mt-1">
        Protected by reCAPTCHA. Google{" "}
        <a
          className="link"
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer noopener"
        >
          privacy
        </a>{" "}
        applies.
      </p>
      {error && <p className="error mt-1.5">{error}</p>}
    </div>
  );
}
