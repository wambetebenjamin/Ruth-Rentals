import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Terms, data protection (KDPA), privacy and cookie notices for Ruth Rentals.",
  alternates: { canonical: "/legal" },
};

const entries = [
  {
    href: "/legal/terms",
    title: "Terms of use",
    body: "How the platform works, what owners and renters promise, and why the hire contract is between them.",
  },
  {
    href: "/legal/kdpa",
    title: "Data protection (KDPA)",
    body: "Lawful bases, retention, your rights under the Kenya Data Protection Act and how to make a request.",
  },
  {
    href: "/legal/privacy",
    title: "Privacy notice",
    body: "What we collect, the services we use, and how photos, messages and phone numbers are handled.",
  },
  {
    href: "/legal/cookies",
    title: "Cookie notice",
    body: "Two essential cookies, no advertising trackers, and how to change your choice.",
  },
];

export default function LegalIndexPage() {
  return (
    <div className="wrap py-10 sm:py-14">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 text-[32px] sm:text-[44px]">The paperwork, in plain language</h1>
      <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-copy">
        Ruth Rentals is a platform that introduces neighbours. We are not an insurer, we do not
        hold damage deposits, and we do not take a cut of your hire fee. These four notices explain
        the rest.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <Link key={entry.href} href={entry.href} className="card group p-5 transition-colors hover:border-ink">
            <h2 className="text-[22px]">{entry.title}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-copy">{entry.body}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
              Read
              <IconArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-8 border-t border-line pt-5 text-[13px] text-copy">
        Last updated 27 October 2026. Ruth Rentals, Nairobi, Kenya. Questions: hello@ruthrentals.co.ke
        or +254 112 272 061.
      </p>
    </div>
  );
}
