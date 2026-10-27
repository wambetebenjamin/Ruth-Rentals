import type { Metadata, Viewport } from "next";
import "@fontsource/oswald/300.css";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/500.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { CookieConsent } from "@/components/cookie-consent";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Ruth Rentals | Borrow what you need. Lend what you own.",
    template: "%s | Ruth Rentals",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "tool rental Kenya",
    "hire equipment Nairobi",
    "camera hire Kenya",
    "tent hire Nairobi",
    "peer to peer rental",
    "Ruth Rentals",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: site.url,
    siteName: site.name,
    title: "Ruth Rentals | Borrow what you need. Lend what you own.",
    description: site.description,
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "Ruth Rentals" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruth Rentals",
    description: site.tagline,
    images: ["/images/og-default.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#212529",
};

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  slogan: site.tagline,
  email: site.email,
  telephone: site.phone,
  areaServed: "Kenya",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  sameAs: [`https://wa.me/${site.whatsapp}`],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <WhatsAppFab />
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
        />
      </body>
    </html>
  );
}
