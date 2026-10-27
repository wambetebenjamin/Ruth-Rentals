"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BookingStatus, ChecklistState } from "@/lib/types";
import { IconCheck } from "./icons";

type Props = {
  bookingId: string;
  status: BookingStatus;
  checklist: ChecklistState;
  canManageStatus: boolean;
};

const items: { key: keyof ChecklistState; label: string; hint: string }[] = [
  {
    key: "photosBefore",
    label: "Photos taken at handover",
    hint: "Front, back, serial number and any existing scratches.",
  },
  {
    key: "conditionNotes",
    label: "Condition noted",
    hint: "Fuel level, charge, missing parts, anything already worn.",
  },
  {
    key: "accessoriesCounted",
    label: "Accessories counted",
    hint: "Bits, cables, pegs, keys, cases and manuals.",
  },
  {
    key: "bothSigned",
    label: "Both sides confirmed",
    hint: "Owner and renter agree the item is as described.",
  },
];

const nextStatus: Partial<Record<BookingStatus, { value: BookingStatus; label: string }>> = {
  requested: { value: "confirmed", label: "Confirm request" },
  confirmed: { value: "collected", label: "Mark collected" },
  collected: { value: "returned", label: "Mark returned" },
};

export function BookingActions({ bookingId, status, checklist, canManageStatus }: Props) {
  const router = useRouter();
  const [state, setState] = useState<ChecklistState>(checklist);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const send = async (payload: { status: BookingStatus; checklist?: ChecklistState }) => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Could not save that change.");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Network problem. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveChecklist = async () => {
    const ok = await send({ status, checklist: state });
    if (ok) setMessage("Checklist saved to this booking.");
  };

  const advance = async (value: BookingStatus, label: string) => {
    const ok = await send({ status: value, checklist: state });
    if (ok) setMessage(`${label}. Both sides can see the update.`);
  };

  return (
    <div>
      <fieldset>
        <legend className="sr-only">Handover checklist</legend>
        <div className="space-y-2">
          {items.map((item) => {
            const checked = state[item.key];
            return (
              <label
                key={item.key}
                className={`flex cursor-pointer items-start gap-3 border p-3 ${
                  checked ? "border-teal bg-teal/10" : "border-line bg-paper"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[#37cfa2]"
                  checked={checked}
                  onChange={(event) =>
                    setState((current) => ({ ...current, [item.key]: event.target.checked }))
                  }
                />
                <span>
                  <span className="block text-[14px] font-medium text-ink">{item.label}</span>
                  <span className="block text-[12px] leading-relaxed text-copy">{item.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-outline btn-sm" onClick={saveChecklist} disabled={saving}>
          <IconCheck size={16} />
          {saving ? "Saving..." : "Save checklist"}
        </button>
        {canManageStatus && nextStatus[status] && (
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => advance(nextStatus[status]!.value, nextStatus[status]!.label)}
            disabled={saving}
          >
            {nextStatus[status]!.label}
          </button>
        )}
        {canManageStatus && status === "requested" && (
          <button
            type="button"
            className="btn-quiet btn-sm"
            onClick={() => advance("declined", "Request declined")}
            disabled={saving}
          >
            Decline request
          </button>
        )}
      </div>

      <p className="mt-2 text-[13px] text-copy" role="status" aria-live="polite">
        {message}
      </p>
      {error && (
        <p className="error mt-1" role="alert">
          {error}
        </p>
      )}
      {!canManageStatus && (
        <p className="mt-2 text-[12px] text-copy">
          The owner moves the booking through each stage. You can still tick the checklist and
          message them.
        </p>
      )}
    </div>
  );
}
