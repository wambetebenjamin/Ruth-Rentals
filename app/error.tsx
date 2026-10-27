"use client";

import Link from "next/link";
import { useEffect } from "react";
import { site, waLink } from "@/lib/site";
import { IconArrowRight, IconWhatsApp } from "@/components/icons";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Ruth Rentals error:", error);
  }, [error]);

  return (
    <div className="wrap py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-[76px] leading-none text-line sm:text-[110px]">500</p>
        <h1 className="mt-2 text-[30px] sm:text-[40px]">Something jammed</h1>
        <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-copy">
          A page failed to load. Nothing has been charged and your booking data is safe. Try again,
          or talk to us on WhatsApp and we will sort it out.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button type="button" className="btn-primary" onClick={reset}>
            Try again
            <IconArrowRight size={18} />
          </button>
          <Link href="/" className="btn-outline">
            Back to home
          </Link>
        </div>
        <div className="mt-8 border border-line bg-wash p-4 text-left">
          <p className="text-[14px] font-medium text-ink">Tell us what happened</p>
          <p className="mt-1 text-[14px] text-copy">
            WhatsApp {site.whatsappDisplay} with the page you were on. Reference:{" "}
            {error.digest ?? "no digest"}.
          </p>
          <a
            href={waLink("Hi Ruth Rentals, I hit a 500 error on your site.")}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-outline btn-sm mt-3"
          >
            <IconWhatsApp size={17} />
            WhatsApp {site.whatsappDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
