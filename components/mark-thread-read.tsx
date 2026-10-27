"use client";

import { useEffect, useRef } from "react";

export function MarkThreadRead({ threadId }: { threadId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch("/api/messages/read", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ threadId }),
    }).catch(() => {
      // Read receipts are best effort.
    });
  }, [threadId]);

  return null;
}
