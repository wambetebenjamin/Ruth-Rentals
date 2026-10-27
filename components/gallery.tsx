"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IconClose } from "./icons";

type Props = {
  images: string[];
  title: string;
};

export function Gallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (zoom && !dialog.open) dialog.showModal();
    if (!zoom && dialog.open) dialog.close();
  }, [zoom]);

  const safeImages = images.length > 0 ? images : ["/images/listing-hand-tools.jpg"];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-wash">
        <Image
          src={safeImages[active]}
          alt={`${title}, photo ${active + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          unoptimized={safeImages[active].startsWith("data:")}
        />
        <button
          type="button"
          onClick={() => setZoom(true)}
          className="absolute bottom-3 right-3 min-h-11 rounded-[4px] border border-line bg-paper px-3 text-[13px] font-medium text-ink hover:border-ink"
        >
          View larger
        </button>
        <span className="absolute bottom-3 left-3 rounded-[4px] bg-ink/85 px-2 py-1 text-[12px] text-white">
          {active + 1} of {safeImages.length}
        </span>
      </div>

      {safeImages.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {safeImages.map((image, index) => (
            <li key={`${image}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className={`relative block aspect-[4/3] w-full overflow-hidden rounded-[4px] border ${
                  index === active ? "border-ink" : "border-line hover:border-copy"
                }`}
                aria-label={`Show photo ${index + 1}`}
                aria-pressed={index === active}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="140px"
                  className="object-cover"
                  unoptimized={image.startsWith("data:")}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        className="max-h-[92vh] w-[94vw] max-w-4xl overflow-hidden rounded-[4px] border border-line bg-paper p-0"
        aria-label={`${title} photo viewer`}
        onClose={() => setZoom(false)}
        onClick={(event) => {
          if (event.currentTarget === event.target) setZoom(false);
        }}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2">
          <p className="text-[13px] text-copy">
            Photo {active + 1} of {safeImages.length}
          </p>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-[4px] text-ink hover:bg-wash"
            onClick={() => setZoom(false)}
            aria-label="Close photo viewer"
          >
            <IconClose size={20} />
          </button>
        </div>
        <div className="relative aspect-[4/3] w-full bg-wash">
          <Image
            src={safeImages[active]}
            alt={`${title}, photo ${active + 1}`}
            fill
            sizes="90vw"
            className="object-contain"
            unoptimized={safeImages[active].startsWith("data:")}
          />
        </div>
      </dialog>

      <style>{`
        dialog::backdrop {
          background: rgba(33, 37, 41, 0.7);
        }
      `}</style>
    </div>
  );
}
