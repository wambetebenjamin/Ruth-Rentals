"use client";

import { useEffect, useRef, useState } from "react";
import { IconPlay, IconStop } from "./icons";

const transcript = [
  "Ruth Rentals is a simple way to borrow the tools you need and earn from the gear you already own.",
  "Start on the browse page, choose your county, and see what neighbours are lending.",
  "Pick your dates, send a request, and agree the handover on WhatsApp.",
  "Pay the owner directly. When you return the item, check it together, tick the handover list, and keep the record.",
  "Listing basic gear is free. A promoted slot is four hundred and ninety nine shillings, once.",
  "Ruth Rentals is a platform, not an insurer. Talk through the deposit before you hand over the keys.",
  "Practical, neighbourly, and that is how we keep kit moving.",
];

export function VoiceTour() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const next = new SpeechSynthesisUtterance(transcript.join(" "));
    next.lang = "en-KE";
    next.rate = 0.98;
    next.pitch = 1;

    const voices = synth.getVoices();
    const kenyan = voices.find((voice) => /en[-_]KE/i.test(voice.lang));
    const english = voices.find((voice) => voice.lang.startsWith("en"));
    const chosen = kenyan ?? english;
    if (chosen) next.voice = chosen;

    next.onend = () => setSpeaking(false);
    next.onerror = () => setSpeaking(false);
    utterance.current = next;
    setSpeaking(true);
    synth.speak(next);
  };

  const stop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Voice tour</p>
          <h2 className="mt-1 text-[22px] normal-case sm:text-[24px]">
            How peer rentals work, in under a minute
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-copy">
            Recorded in English with a Kenyan voice on your device. Prefer to read? The full
            transcript is below.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {speaking ? (
            <button type="button" className="btn-dark" onClick={stop}>
              <IconStop size={16} />
              Stop tour
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={speak}
              disabled={supported === false}
            >
              <IconPlay size={16} />
              Play voice tour
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-[13px] text-copy" role="status" aria-live="polite">
        {supported === false
          ? "This browser cannot play the voice tour. The transcript below has the same words."
          : speaking
            ? "Playing the voice tour."
            : "Press play to hear the tour. Turn your volume up."}
      </p>

      <details className="mt-4 border-t border-line pt-4">
        <summary className="cursor-pointer text-sm font-medium text-ink">
          Read the transcript
        </summary>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-copy">
          {transcript.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </details>
    </div>
  );
}
