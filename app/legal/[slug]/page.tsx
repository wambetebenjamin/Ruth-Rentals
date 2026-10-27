import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { site, waLink } from "@/lib/site";
import { IconWhatsApp } from "@/components/icons";

type Section = { heading: string; body: ReactNode };

type Doc = {
  title: string;
  summary: string;
  updated: string;
  sections: Section[];
};

const docs: Record<string, Doc> = {
  terms: {
    title: "Terms of use",
    summary:
      "The rules for using Ruth Rentals. The short version: we introduce owners and renters, the hire contract is between them, and we are not an insurer.",
    updated: "27 October 2026",
    sections: [
      {
        heading: "1. Who we are",
        body: (
          <>
            <p>
              Ruth Rentals is a peer to peer listings platform operated in Kenya. We help people
              find tools, gear and light equipment nearby, send booking requests, message each
              other and keep a handover record.
            </p>
            <p>
              By creating an account or using the site you agree to these terms. If you do not
              agree, please do not use the service.
            </p>
          </>
        ),
      },
      {
        heading: "2. The platform is not a party to the hire",
        body: (
          <>
            <p>
              Every hire is a direct agreement between the owner and the renter. Ruth Rentals is
              not the owner, the renter, an agent, a payment processor or an insurer. We do not
              inspect items, guarantee condition, guarantee availability or guarantee that a
              person will pay.
            </p>
            <p>
              <strong>We are not an insurer.</strong> We do not cover loss, theft, damage, injury
              or loss of income. Any insurance is arranged separately by the owner or renter.
            </p>
          </>
        ),
      },
      {
        heading: "3. Damage deposits are handled off platform",
        body: (
          <>
            <p>
              Owners may ask for a refundable damage deposit. The amount is shown on the listing
              and agreed between the two parties. <strong>Ruth Rentals does not collect, hold,
              refund or arbitrate damage deposits.</strong> Deposits are paid and returned
              directly between owner and renter, outside this platform.
            </p>
            <p>
              If there is a dispute about damage, the parties handle it between themselves. We can
              provide the booking record, including photos and the handover checklist, on request
              from either party.
            </p>
          </>
        ),
      },
      {
        heading: "4. Accounts and eligibility",
        body: (
          <>
            <ul>
              <li>You must be at least 18 years old and able to enter a contract in Kenya.</li>
              <li>Use your real name and a phone number you answer.</li>
              <li>One person per account. Do not share credentials.</li>
              <li>We may suspend an account for fraud, abuse, unsafe items or repeated no-shows.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "5. Owners: what you promise",
        body: (
          <>
            <ul>
              <li>You own the item, or have permission from the owner to lend it.</li>
              <li>The item is safe, clean, complete and in the condition described.</li>
              <li>You have the right to set the rate, the minimum days and the deposit.</li>
              <li>You will not list prohibited items (see section 7).</li>
              <li>You will tell the renter about known faults before handover.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "6. Renters: what you promise",
        body: (
          <>
            <ul>
              <li>You will use the item for its intended purpose, safely and lawfully.</li>
              <li>You will return it on the agreed date, in the agreed condition.</li>
              <li>You will pay the hire fee and deposit directly to the owner as agreed.</li>
              <li>You will not sublet, resell or take the item outside Kenya without written agreement.</li>
              <li>You will report damage or loss immediately, in the booking thread.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "7. Prohibited items",
        body: (
          <>
            <p>
              Do not list firearms, ammunition, explosives, drugs, stolen property, live animals,
              human remains, hazardous chemicals, unregistered vehicles or anything illegal in
              Kenya. Do not list an item you do not have the right to lend. We may remove a listing
              without notice.
            </p>
          </>
        ),
      },
      {
        heading: "8. Fees and promoted listings",
        body: (
          <>
            <p>
              Basic listings are free. An optional promoted listing costs KSh {site.promotedPrice},
              paid once, and runs for 30 days. Promoted placement is advertising: it changes
              position and adds a label, but it does not guarantee a booking. Ruth Rentals does not
              charge commission on hire fees.
            </p>
            <p>
              Payments for promoted slots are by invoice during the pilot. If we cannot display the
              promotion, we refund that slot. If your item is simply not booked, the slot is not
              refundable.
            </p>
          </>
        ),
      },
      {
        heading: "9. Bookings, changes and cancellations",
        body: (
          <>
            <p>
              A booking is a request until the owner confirms it. Either side may decline or cancel
              before the handover. If a booking is cancelled after the item has been collected,
              the owner and renter agree any refund directly.
            </p>
            <p>
              Dates are blocked on the calendar once a request is pending, confirmed or collected.
              Owners should keep the calendar accurate and pause listings when an item is
              unavailable.
            </p>
          </>
        ),
      },
      {
        heading: "10. Safety and disputes",
        body: (
          <>
            <p>
              Meet in a safe, public place or at the owner&apos;s premises during daylight where
              possible. Take photographs at handover. Keep messages on the platform so both sides
              have the same record.
            </p>
            <p>
              We can share booking records to help resolve a disagreement, but we do not arbitrate
              payments, deposits or damage claims. Where the law gives you a right to a remedy, use
              it directly.
            </p>
          </>
        ),
      },
      {
        heading: "11. Liability",
        body: (
          <>
            <p>
              To the extent permitted by Kenyan law, Ruth Rentals is not liable for indirect or
              consequential loss, loss of profit, damage to property, injury, or losses arising
              from a hire arranged through the platform. Nothing in these terms limits liability
              that cannot be limited by law.
            </p>
          </>
        ),
      },
      {
        heading: "12. Changes, law and contact",
        body: (
          <>
            <p>
              We may update these terms. Material changes will be announced on this page with a new
              date. These terms are governed by the laws of Kenya.
            </p>
            <p>
              Questions: WhatsApp {site.whatsappDisplay} or email{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>
              .
            </p>
          </>
        ),
      },
    ],
  },
  kdpa: {
    title: "Data protection (KDPA)",
    summary:
      "How Ruth Rentals handles personal data under the Kenya Data Protection Act, 2019, and what you can ask us to do with your information.",
    updated: "27 October 2026",
    sections: [
      {
        heading: "Who is responsible",
        body: (
          <>
            <p>
              Ruth Rentals is the data controller for account, listing and booking data collected on
              this site. For data an owner adds about a renter (for example a phone number shared
              in a message), each party also has obligations under the Act.
            </p>
          </>
        ),
      },
      {
        heading: "Lawful bases",
        body: (
          <>
            <ul>
              <li>
                <strong>Contract:</strong> to create your account, publish listings, send booking
                requests and keep the handover record.
              </li>
              <li>
                <strong>Consent:</strong> optional analytics cookies and marketing messages. You can
                withdraw consent at any time.
              </li>
              <li>
                <strong>Legitimate interest:</strong> fraud prevention, safety, service messages and
                improving the platform.
              </li>
              <li>
                <strong>Legal obligation:</strong> keeping records where Kenyan law requires it.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "What we collect",
        body: (
          <>
            <ul>
              <li>Account data: name, email, phone number, county, role and password hash.</li>
              <li>Listing data: item details, rates, photos, pickup notes and blocked dates.</li>
              <li>Booking data: dates, messages, phone numbers, handover checklist and status.</li>
              <li>Technical data: IP address, browser type, pages viewed and security logs.</li>
            </ul>
            <p>We do not ask for ID scans, payment card numbers or location tracking.</p>
          </>
        ),
      },
      {
        heading: "Why we use it",
        body: (
          <>
            <ul>
              <li>To operate accounts, listings, bookings and messages.</li>
              <li>To share contact details between the two parties in a confirmed booking.</li>
              <li>To prevent spam, fraud and abuse, including reCAPTCHA checks.</li>
              <li>To send service emails and, where you agree, occasional updates.</li>
              <li>To meet legal and accounting obligations.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "Who we share with",
        body: (
          <>
            <ul>
              <li>
                The other party in a booking: your name and phone number, once you send a request.
              </li>
              <li>Our hosting and storage providers: Vercel (KV store and Blob), in the EU.</li>
              <li>Google reCAPTCHA, to stop automated abuse.</li>
              <li>Resend, for transactional email delivery.</li>
              <li>Law enforcement or regulators, where the law requires it.</li>
            </ul>
            <p>We do not sell personal data.</p>
          </>
        ),
      },
      {
        heading: "Retention",
        body: (
          <>
            <p>
              Account data is kept while your account is open. Booking and handover records are
              kept for up to three years after a hire, so either party can refer back to them, then
              deleted or anonymised. Security logs are kept for up to 12 months. Promoted slot
              invoices are kept for seven years as required for tax.
            </p>
          </>
        ),
      },
      {
        heading: "Your rights",
        body: (
          <>
            <p>
              Under the Kenya Data Protection Act you can ask to access your data, correct it,
              delete it, restrict or object to processing, and receive a portable copy. You can
              also withdraw consent for optional cookies or marketing.
            </p>
            <p>
              Write to{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>{" "}
              or WhatsApp {site.whatsappDisplay}. We reply within 30 days. If you are not satisfied,
              you can complain to the Office of the Data Protection Commissioner in Kenya.
            </p>
          </>
        ),
      },
      {
        heading: "Security and cross border transfer",
        body: (
          <>
            <p>
              Passwords are stored as salted scrypt hashes, sessions use HTTP only cookies, and
              production traffic is encrypted. Our infrastructure providers process data outside
              Kenya, mainly in the European Union, under contractual safeguards. Contact us if you
              need details of those safeguards.
            </p>
          </>
        ),
      },
      {
        heading: "Children",
        body: (
          <>
            <p>
              Ruth Rentals is for people aged 18 and over. We do not knowingly collect data about
              children. If a child has created an account, contact us and we will remove it.
            </p>
          </>
        ),
      },
    ],
  },
  privacy: {
    title: "Privacy notice",
    summary:
      "Plain language on the information Ruth Rentals keeps, why we keep it, and the third party services involved.",
    updated: "27 October 2026",
    sections: [
      {
        heading: "What the site collects",
        body: (
          <>
            <p>
              When you create an account we collect your name, email, phone number, county and
              the role you choose. When you list an item we add the item details, photos, rates and
              pickup notes. When you book, we record the dates, the phone number you confirm, the
              message to the owner and the handover checklist.
            </p>
            <p>
              Server logs record your IP address, browser and the pages requested, to keep the site
              secure and to fix faults.
            </p>
          </>
        ),
      },
      {
        heading: "Cookies and analytics",
        body: (
          <>
            <p>
              The site sets one essential sign in cookie, <code>ruth_session</code>, and remembers
              your cookie choice in <code>ruth-rentals-cookie-consent</code>. If you choose Accept
              all, we may load privacy friendly analytics to count visits. We do not run
              advertising networks or cross-site trackers. See the{" "}
              <Link href="/legal/cookies" className="link">
                cookie notice
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Services we rely on",
        body: (
          <>
            <ul>
              <li>Vercel for hosting, the KV store and photo storage.</li>
              <li>Google reCAPTCHA on sign up, sign in and booking forms.</li>
              <li>Resend for enquiry emails, when configured.</li>
              <li>WhatsApp if you choose to message us, governed by Meta&apos;s terms.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "Your photos",
        body: (
          <>
            <p>
              Listing photos are public. Handover photos are attached to the booking and visible
              only to the owner, the renter and platform support. Do not upload photos that show
              faces, IDs or documents unless everyone agrees.
            </p>
          </>
        ),
      },
      {
        heading: "Messages and phone numbers",
        body: (
          <>
            <p>
              Messages stay on the platform. Phone numbers are shared with the other party once a
              booking request is sent, so they can arrange the handover. We do not publish phone
              numbers on listings.
            </p>
          </>
        ),
      },
      {
        heading: "Your choices",
        body: (
          <>
            <p>
              You can edit your profile, pause a listing, delete an account or ask for a copy of
              your data by writing to {site.email}. Essential cookies are needed for sign in and
              cannot be switched off while you are signed in.
            </p>
          </>
        ),
      },
      {
        heading: "Changes",
        body: (
          <>
            <p>
              If this notice changes, the date above changes too. Significant changes will be
              announced by email or in the dashboard.
            </p>
          </>
        ),
      },
    ],
  },
  cookies: {
    title: "Cookie notice",
    summary:
      "Two cookies by default. No advertising trackers. Here is exactly what is stored and how to change your choice.",
    updated: "27 October 2026",
    sections: [
      {
        heading: "Essential cookies",
        body: (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="py-2 pr-4 font-medium text-ink">
                      Name
                    </th>
                    <th scope="col" className="py-2 pr-4 font-medium text-ink">
                      Purpose
                    </th>
                    <th scope="col" className="py-2 font-medium text-ink">
                      Lifetime
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line">
                    <th scope="row" className="py-2 pr-4 font-normal text-copy">
                      <code>ruth_session</code>
                    </th>
                    <td className="py-2 pr-4 text-copy">
                      Keeps you signed in. HTTP only, not readable by scripts.
                    </td>
                    <td className="py-2 text-copy">7 days</td>
                  </tr>
                  <tr className="border-b border-line">
                    <th scope="row" className="py-2 pr-4 font-normal text-copy">
                      <code>ruth-rentals-cookie-consent</code>
                    </th>
                    <td className="py-2 pr-4 text-copy">
                      Remembers whether you chose essential only or accept all.
                    </td>
                    <td className="py-2 text-copy">180 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              These are needed for the site to work. Blocking them means you cannot sign in or
              keep a booking.
            </p>
          </>
        ),
      },
      {
        heading: "Optional measurement",
        body: (
          <>
            <p>
              If you choose Accept all we may load a privacy friendly analytics script to count
              visits and see which pages help people find gear. It does not follow you across other
              sites and we do not run advertising cookies. Declining does not affect any feature.
            </p>
          </>
        ),
      },
      {
        heading: "Third party content",
        body: (
          <>
            <p>
              Google reCAPTCHA sets cookies when a form loads, to tell humans from bots. Its use is
              covered by Google&apos;s privacy policy. Photos are served from our own domain.
            </p>
          </>
        ),
      },
      {
        heading: "Changing your choice",
        body: (
          <>
            <p>
              Clear the cookies for this site in your browser and the banner will ask again. Most
              browsers also let you block cookies per site. On mobile, use the browser settings under
              privacy.
            </p>
          </>
        ),
      },
      {
        heading: "Questions",
        body: (
          <>
            <p>
              Ask us at {site.email} or WhatsApp {site.whatsappDisplay} if anything here is unclear.
            </p>
          </>
        ),
      },
    ],
  },
};

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const doc = docs[slug];
  if (!doc) return { title: "Legal" };
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/legal/${slug}` },
  };
}

const links = [
  { slug: "terms", label: "Terms of use" },
  { slug: "kdpa", label: "Data protection (KDPA)" },
  { slug: "privacy", label: "Privacy notice" },
  { slug: "cookies", label: "Cookie notice" },
];

export default async function LegalPage({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = docs[slug];
  if (!doc) notFound();

  return (
    <div className="wrap py-9 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <p className="eyebrow">Legal</p>
          <nav aria-label="Legal pages" className="mt-3">
            <ul className="space-y-1">
              {links.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/legal/${entry.slug}`}
                    className={`flex min-h-11 items-center rounded-[4px] px-3 text-[14px] ${
                      entry.slug === slug
                        ? "bg-ink text-white"
                        : "text-copy hover:bg-wash hover:text-ink"
                    }`}
                    aria-current={entry.slug === slug ? "page" : undefined}
                  >
                    {entry.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 border border-line p-4">
            <p className="text-[13px] leading-relaxed text-copy">
              Need help with a booking or a data request?
            </p>
            <a
              href={waLink("Hi Ruth Rentals, I have a legal or data question.")}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-outline btn-sm mt-3 w-full"
            >
              <IconWhatsApp size={16} />
              WhatsApp us
            </a>
          </div>
        </aside>

        <article>
          <h1 className="text-[32px] sm:text-[42px]">{doc.title}</h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-copy">{doc.summary}</p>
          <div className="mt-4 border-y border-line py-2 text-[12px] text-copy">
            <p>
              Last updated {doc.updated}. Ruth Rentals, Nairobi, Kenya. Contact{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>{" "}
              or {site.whatsappDisplay}.
            </p>
          </div>

          <div className="prose-rr mt-6">
            <div className="notice mb-6">
              The short version: Ruth Rentals introduces neighbours. The hire agreement is
              between owner and renter. We are not an insurer and we do not hold damage deposits.
            </div>
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body}
              </section>
            ))}
          </div>

          <div className="mt-8 border-t border-line pt-5 text-[13px] text-copy">
            <p>
              Read the{" "}
              <Link href="/legal/terms" className="link">
                terms
              </Link>
              ,{" "}
              <Link href="/legal/kdpa" className="link">
                KDPA notice
              </Link>
              ,{" "}
              <Link href="/legal/privacy" className="link">
                privacy notice
              </Link>{" "}
              and{" "}
              <Link href="/legal/cookies" className="link">
                cookie notice
              </Link>
              .
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
