export const site = {
  name: "Ruth Rentals",
  tagline: "Borrow what you need. Lend what you own.",
  description:
    "Ruth Rentals is a neighbourly marketplace for tools, cameras, tents, sound gear, farm equipment and light vehicles across Kenya. Find kit near you, book by the day, and return it in good shape.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ruthrentals.co.ke",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254112272061",
  whatsappDisplay: "+254 112 272 061",
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+254112272061",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "hello@ruthrentals.co.ke",
  city: "Nairobi",
  country: "Kenya",
  hours: "Mon to Sat, 8am to 6pm EAT",
  promotedPrice: 499,
  currency: "KES",
};

export function waLink(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.whatsapp}${text}`;
}

export const navLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/list-item", label: "List an item" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export const footerLinks = {
  marketplace: [
    { href: "/browse", label: "Browse gear" },
    { href: "/list-item", label: "List an item" },
    { href: "/pricing", label: "Pricing" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  company: [
    { href: "/about", label: "About Ruth Rentals" },
    { href: "/about#safety", label: "Safety and handover" },
    { href: "/about#areas", label: "Areas we serve" },
    { href: "/login", label: "Sign in" },
  ],
  legal: [
    { href: "/legal/terms", label: "Terms of use" },
    { href: "/legal/kdpa", label: "Data protection (KDPA)" },
    { href: "/legal/privacy", label: "Privacy notice" },
    { href: "/legal/cookies", label: "Cookie notice" },
  ],
};
