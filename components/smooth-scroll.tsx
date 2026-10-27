"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let cancelled = false;
    let instance: { raf: (time: number) => void; destroy: () => void } | null = null;

    const start = async () => {
      const mod = await import("lenis");
      if (cancelled) return;
      const Lenis = mod.default;
      instance = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.3,
        anchors: { offset: -80 },
      });

      const loop = (time: number) => {
        instance?.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    };

    start().catch(() => {
      // Smooth scrolling is an enhancement. Native scrolling stays available.
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      instance?.destroy();
    };
  }, []);

  return null;
}
