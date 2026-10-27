import { site, waLink } from "@/lib/site";
import { IconWhatsApp } from "./icons";

export function WhatsAppFab() {
  return (
    <a
      href={waLink("Hi Ruth Rentals, I need help with a booking.")}
      target="_blank"
      rel="noreferrer noopener"
      className="wa-fab grid h-14 w-14 place-items-center rounded-full bg-teal text-ink shadow-none ring-1 ring-ink/10 transition-colors hover:bg-ink hover:text-white"
      aria-label={`Chat with ${site.name} on WhatsApp at ${site.whatsappDisplay}`}
      title={`WhatsApp ${site.whatsappDisplay}`}
    >
      <IconWhatsApp size={26} />
    </a>
  );
}
