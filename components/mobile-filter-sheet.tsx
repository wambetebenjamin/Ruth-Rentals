"use client";

import { useEffect, useRef, useState } from "react";
import { BrowseFilters, type FilterValues } from "./browse-filters";
import { IconClose, IconFilter } from "./icons";

type Props = {
  values: FilterValues;
  activeCount: number;
};

export function MobileFilterSheet({ values, activeCount }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!open && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="btn-outline btn-sm lg:hidden"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <IconFilter size={18} />
        Filters
        {activeCount > 0 && (
          <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] text-white">
            {activeCount}
          </span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        className="filter-sheet m-0 w-full max-w-none border-0 bg-transparent p-0 lg:hidden"
        aria-label="Filter listings"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.currentTarget === event.target) setOpen(false);
        }}
      >
        <div className="fixed inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[8px] border border-line bg-paper p-5 pb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[20px]">Filters</h2>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-line text-ink"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
            >
              <IconClose size={20} />
            </button>
          </div>
          <BrowseFilters values={values} onApplied={() => setOpen(false)} />
        </div>
      </dialog>

      <style>{`
        dialog.filter-sheet::backdrop {
          background: rgba(33, 37, 41, 0.55);
        }
      `}</style>
    </>
  );
}
