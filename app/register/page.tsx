import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "@/components/register-form";
import { site } from "@/lib/site";
import { formatKES } from "@/lib/format";
import { IconShield, IconKey, IconMessage } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Join Ruth Rentals to borrow tools and gear from neighbours in Kenya, or to lend what you own.",
  alternates: { canonical: "/register" },
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="wrap py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">Join the neighbourhood</p>
          <h1 className="mt-2 text-[34px] sm:text-[44px]">Borrow what you need</h1>
          <p className="mt-3 max-w-md text-[16px] leading-relaxed text-copy">
            One account works for borrowing and lending. Listing basic gear is free, and you keep
            every shilling of your hire fee.
          </p>

          <dl className="mt-7 space-y-4">
            <div className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] bg-wash text-ink">
                <IconKey size={20} />
              </span>
              <div>
                <dt className="font-medium text-ink">You approve every request</dt>
                <dd className="text-[14px] text-copy">
                  Nothing is confirmed until you say yes. Pause a listing when you need the kit
                  yourself.
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] bg-wash text-ink">
                <IconShield size={20} />
              </span>
              <div>
                <dt className="font-medium text-ink">Free basic listing</dt>
                <dd className="text-[14px] text-copy">
                  Optional promoted placement is {formatKES(site.promotedPrice)}, paid once. No
                  commission on your hires.
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] bg-wash text-ink">
                <IconMessage size={20} />
              </span>
              <div>
                <dt className="font-medium text-ink">Support that answers</dt>
                <dd className="text-[14px] text-copy">
                  WhatsApp {site.whatsappDisplay}, {site.hours}. A person in Nairobi replies.
                </dd>
              </div>
            </div>
          </dl>

          <p className="mt-6 text-[13px] text-copy">
            Already registered?{" "}
            <Link href="/login" className="link">
              Sign in instead
            </Link>
            .
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="card p-5 sm:p-7">
            <h2 className="text-[24px]">Create your account</h2>
            <p className="mt-1 text-[14px] text-copy">
              Takes about a minute. We only ask for what an owner needs to reach you.
            </p>
            <div className="mt-5">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
