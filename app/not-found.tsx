import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { IconArrowRight, IconWhatsApp } from "@/components/icons";

export default function NotFound() {
  return (
    <>
      <div className="wrap py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-[76px] leading-none text-line sm:text-[110px]">404</p>
          <h1 className="mt-2 text-[30px] sm:text-[40px]">This page has gone on hire</h1>
          <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-copy">
            The link may be old, or the listing may have been paused by its owner. Try browse, or
            message us and we will point you to the right gear.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Link href="/browse" className="btn-primary">
              Browse gear
              <IconArrowRight size={18} />
            </Link>
            <Link href="/" className="btn-outline">
              Back to home
            </Link>
          </div>
          <div className="mt-8 border border-line bg-wash p-4 text-left">
            <p className="text-[14px] font-medium text-ink">Need a person?</p>
            <p className="mt-1 text-[14px] text-copy">
              WhatsApp or call {site.whatsappDisplay}, {site.hours}.
            </p>
            <a
              href={waLink("Hi Ruth Rentals, I hit a 404 on your site.")}
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
    </>
  );
}
