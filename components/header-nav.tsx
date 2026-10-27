"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { navLinks, site } from "@/lib/site";
import { IconClose, IconMenu, IconWhatsApp } from "./icons";

type Props = {
  user: { name: string; role: string } | null;
};

export function HeaderNav({ user }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        ref={toggleRef}
        className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-line text-ink"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <IconClose size={22} /> : <IconMenu size={22} />}
      </button>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-x-0 top-[68px] bottom-0 z-50 overflow-y-auto border-t border-line bg-paper"
        >
          <div className="wrap flex min-h-full flex-col py-6">
            <nav aria-label="Mobile" className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center border-b border-line py-3 font-display text-[22px] uppercase text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-line py-3 font-display text-[22px] uppercase text-ink"
              >
                Dashboard
              </Link>
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              {user ? (
                <>
                  <p className="text-sm text-copy">
                    Signed in as <strong className="text-ink">{user.name}</strong>
                  </p>
                  <Link
                    href="/list-item"
                    onClick={() => setOpen(false)}
                    className="btn-primary w-full"
                  >
                    List an item
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="btn-outline w-full">
                    Sign in
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="btn-primary w-full">
                    Create an account
                  </Link>
                </>
              )}
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-quiet w-full"
                onClick={() => setOpen(false)}
              >
                <IconWhatsApp size={18} />
                WhatsApp {site.whatsappDisplay}
              </a>
            </div>

            <p className="mt-auto pt-8 text-sm text-copy">
              {site.tagline}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
