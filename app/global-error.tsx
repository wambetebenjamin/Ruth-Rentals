"use client";

import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-KE">
      <body>
        <main className="wrap py-20">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-display text-[80px] leading-none text-line">500</p>
            <h1 className="mt-2 text-[30px]">The site could not start this page</h1>
            <p className="mt-3 text-[16px] leading-relaxed text-copy">
              Something failed before the page could load. Try again. If it keeps happening,
              WhatsApp +254 112 272 061 and mention reference {error.digest ?? "unknown"}.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <button type="button" className="btn-primary" onClick={reset}>
                Try again
              </button>
              <a href="https://wa.me/254112272061" className="btn-outline">
                WhatsApp +254 112 272 061
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
