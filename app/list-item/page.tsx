import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ItemWizard } from "@/components/item-wizard";
import { site } from "@/lib/site";
import { formatKES } from "@/lib/format";
import { IconCheck, IconInfo, IconShield, IconWhatsApp } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "List an item",
  description:
    "List a drill, camera, tent, sound system or tractor on Ruth Rentals. Basic listings are free, and you keep your whole hire fee.",
  alternates: { canonical: "/list-item" },
};

export default async function ListItemPage() {
  const user = await getCurrentUser();

  return (
    <div className="wrap py-9 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
        <div>
          <p className="eyebrow">For owners</p>
          <h1 className="mt-2 text-[32px] sm:text-[42px]">List an item</h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-copy">
            Four short steps. Describe the kit, add a few photos, set your rate and deposit, then
            publish. Basic listings are free. You approve every request before it is confirmed.
          </p>

          <div className="mt-6">
            {user ? (
              <ItemWizard ownerName={user.name} />
            ) : (
              <div className="card p-6">
                <h2 className="text-[24px]">Sign in to list your gear</h2>
                <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-copy">
                  We ask for a name and a phone number so renters know who they are dealing with.
                  It takes about a minute, and you can pause a listing whenever you need the item
                  yourself.
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Link href="/login?next=%2Flist-item" className="btn-primary">
                    Sign in
                  </Link>
                  <Link href="/register" className="btn-outline">
                    Create an account
                  </Link>
                </div>
                <p className="mt-4 text-[13px] text-copy">
                  Demo builds: sign in as wanjiku@ruthrentals.co.ke with Borrow2026 and try the
                  full flow.
                </p>
              </div>
            )}
          </div>

          {!user && (
            <div className="mt-6">
              <h2 className="text-[20px]">What neighbours list here</h2>
              <ul className="mt-3 grid gap-2 text-[14px] text-copy sm:grid-cols-2">
                {[
                  "Power tools: drills, grinders, saws, compressors",
                  "Cameras, lenses, lighting and tripods",
                  "Event tents, chairs, tables and linens",
                  "Sound systems, mixers, mics and speakers",
                  "Farm equipment: ploughs, sprayers, chaff cutters",
                  "Sports kit, party supplies and light vehicles",
                ].map((entry) => (
                  <li key={entry} className="flex items-start gap-2 border border-line bg-shell px-3 py-2.5">
                    <IconCheck size={16} className="mt-0.5 shrink-0 text-teal" />
                    {entry}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[13px] text-copy">
                Anything safe, legal and in working order. The rate you set is the rate renters see,
                and you approve every request yourself.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-[18px]">What a good listing has</h2>
            <ul className="mt-3 space-y-2.5 text-[14px] text-copy">
              <li className="flex items-start gap-2">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-teal" />
                A clear title: brand, size and what is included.
              </li>
              <li className="flex items-start gap-2">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-teal" />
                Two or more photos, including the case or accessories.
              </li>
              <li className="flex items-start gap-2">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-teal" />
                A daily rate that matches other kit in your county.
              </li>
              <li className="flex items-start gap-2">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-teal" />
                A deposit that covers repair or replacement, agreed at handover.
              </li>
              <li className="flex items-start gap-2">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-teal" />
                A pickup point that is easy to find, with a time window.
              </li>
            </ul>
          </div>

          <div className="card p-5">
            <p className="flex items-center gap-2 font-medium text-ink">
              <IconShield size={18} className="text-teal" /> Pricing, plainly
            </p>
            <ul className="mt-2 space-y-1.5 text-[14px] text-copy">
              <li>Basic listing: free.</li>
              <li>Promoted listing: {formatKES(site.promotedPrice)}, paid once.</li>
              <li>Commission on your hire fee: none.</li>
              <li>Payments: direct between you and the renter.</li>
            </ul>
            <Link href="/pricing" className="link mt-3 inline-block text-[14px]">
              Read the pricing page
            </Link>
          </div>

          <div className="border border-line p-5">
            <p className="flex items-start gap-2 text-[14px] text-charcoal">
              <IconInfo size={17} className="mt-0.5 shrink-0 text-teal" />
              Ruth Rentals is a platform, not an insurer. You set the deposit, you inspect the
              item, and you agree any damage costs directly with the renter.
            </p>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-outline btn-sm mt-4 w-full"
            >
              <IconWhatsApp size={17} />
              WhatsApp {site.whatsappDisplay}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
