import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { navLinks, site } from "@/lib/site";
import { HeaderNav } from "./header-nav";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <span
        className="grid h-9 w-9 place-items-center rounded-[4px] bg-ink text-paper"
        aria-hidden="true"
      >
        <span className="font-display text-[20px] leading-none">R</span>
      </span>
      <span className="leading-none">
        <span className="block font-display text-[20px] uppercase tracking-wide text-ink sm:text-[22px]">
          Ruth Rentals
        </span>
        <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-copy">
          Kit and gear, Kenya
        </span>
      </span>
    </Link>
  );
}

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="wrap flex h-[68px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center rounded-[4px] px-3 text-[15px] font-medium text-ink transition-colors hover:bg-wash"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-outline btn-sm">
                Dashboard
              </Link>
              <Link href="/list-item" className="btn-primary btn-sm">
                List an item
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline btn-sm">
                Sign in
              </Link>
              <Link href="/list-item" className="btn-primary btn-sm">
                List an item
              </Link>
            </>
          )}
        </div>

        <HeaderNav
          user={user ? { name: user.name, role: user.role } : null}
        />
      </div>
    </header>
  );
}
