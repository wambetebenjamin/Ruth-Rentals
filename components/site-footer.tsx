import Link from "next/link";
import { footerLinks, site, waLink } from "@/lib/site";
import { formatKES } from "@/lib/format";
import { IconMessage, IconPhone, IconWhatsApp } from "./icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-charcoal text-[#c4c7ce]">
      <div className="wrap grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label={`${site.name} home`}>
            <span className="grid h-9 w-9 place-items-center rounded-[4px] bg-teal text-ink" aria-hidden="true">
              <span className="font-display text-[20px] leading-none">R</span>
            </span>
            <span className="font-display text-[22px] uppercase tracking-wide text-white">
              Ruth Rentals
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed">
            Borrow what you need. Lend what you own. A neighbourly way to hire tools, gear and
            equipment across Kenya.
          </p>
          <div className="mt-5 space-y-2 text-[15px]">
            <a href={waLink("Hi Ruth Rentals, I have a question.")} className="flex items-center gap-2 hover:text-white" target="_blank" rel="noreferrer noopener">
              <IconWhatsApp size={18} />
              WhatsApp {site.whatsappDisplay}
            </a>
            <a href={`tel:${site.phone}`} className="flex items-center gap-2 hover:text-white">
              <IconPhone size={18} />
              Call {site.whatsappDisplay}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-white">
              <IconMessage size={18} />
              {site.email}
            </a>
          </div>
          <p className="mt-5 text-[13px]">
            {site.hours}. Support is in Nairobi, Kenya.
          </p>
        </div>

        <FooterColumn title="Marketplace" links={footerLinks.marketplace} />
        <FooterColumn title="Company" links={footerLinks.company} />

        <div>
          <h2 className="font-display text-[14px] uppercase tracking-[0.14em] text-white">
            Legal
          </h2>
          <ul className="mt-4 space-y-2 text-[15px]">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/image-credits.txt" className="hover:text-white">
                Photo credits
              </Link>
            </li>
          </ul>
          <div className="mt-6 border border-[#3b3f45] p-3 text-[13px] leading-relaxed">
            Promoted listings cost {formatKES(site.promotedPrice)} once. Listing basic gear is
            free. Ruth Rentals does not take a cut of your hire fee.
          </div>
        </div>
      </div>

      <div className="border-t border-[#3b3f45]">
        <div className="wrap flex flex-col gap-3 py-5 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>
            {new Date().getFullYear()} {site.name}. Built in Nairobi.
          </p>
          <p className="text-[#a9afb8]">
            Ruth Rentals is a platform, not an insurer. Damage deposits are agreed and handled
            between owner and renter.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="font-display text-[14px] uppercase tracking-[0.14em] text-white">{title}</h2>
      <ul className="mt-4 space-y-2 text-[15px]">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
