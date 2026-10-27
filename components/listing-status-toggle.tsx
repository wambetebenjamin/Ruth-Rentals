"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ItemStatus } from "@/lib/types";

export function ListingStatusToggle({
  itemId,
  status,
}: {
  itemId: string;
  status: ItemStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/items/${itemId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: status === "live" ? "paused" : "live" }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "Could not update the listing.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button type="button" className="btn-quiet btn-sm" onClick={toggle} disabled={busy}>
        {busy ? "Updating..." : status === "live" ? "Pause listing" : "Make live"}
      </button>
      {error && <p className="error mt-1">{error}</p>}
    </div>
  );
}
