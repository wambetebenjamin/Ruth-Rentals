import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { IconCheck, IconShield, IconWhatsApp } from "@/components/icons";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to book gear, message owners and manage your Ruth Rentals listings.",
  alternates: { canonical: "/login" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const rawNext = typeof params.next === "string" ? params.next : "";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  if (user) redirect(next);

  return (
    <div className="wrap py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">Welcome back</p>
          <h1 className="mt-2 text-[34px] sm:text-[44px]">Sign in to Ruth Rentals</h1>
          <p className="mt-3 max-w-md text-[16px] leading-relaxed text-copy">
            Your bookings, messages and handover checklists live in one place. Use the phone
            number you gave the owner, so they know who is coming.
          </p>

          <ul className="mt-6 space-y-3 text-[15px] text-charcoal">
            <li className="flex items-start gap-2.5">
              <IconCheck size={18} className="mt-0.5 shrink-0 text-teal" />
              Track requests, confirmations and returns.
            </li>
            <li className="flex items-start gap-2.5">
              <IconCheck size={18} className="mt-0.5 shrink-0 text-teal" />
              Message owners without sharing your number publicly.
            </li>
            <li className="flex items-start gap-2.5">
              <IconShield size={18} className="mt-0.5 shrink-0 text-teal" />
              Pause a listing any time. Nothing is hired without your approval.
            </li>
          </ul>

          <div className="notice mt-6 max-w-md">
            Ruth Rentals is a platform, not an insurer. Deposits are agreed between you and the
            owner and handled off this site.
          </div>

          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-ink"
          >
            <IconWhatsApp size={18} />
            Trouble signing in? WhatsApp {site.whatsappDisplay}
          </a>
        </div>

        <div className="order-1 lg:order-2">
          <div className="card p-5 sm:p-7">
            <LoginForm next={next} />
          </div>
          <p className="mt-4 text-center text-[13px] text-copy">
            By signing in you accept the{" "}
            <Link href="/legal/terms" className="link">
              terms of use
            </Link>{" "}
            and the{" "}
            <Link href="/legal/kdpa" className="link">
              data protection notice
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
