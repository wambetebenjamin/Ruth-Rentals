import type { BookingStatus } from "@/lib/types";
import { formatDate } from "@/lib/dates";
import { IconCheck } from "./icons";

const stages: { key: BookingStatus; label: string; hint: string }[] = [
  { key: "requested", label: "Requested", hint: "Dates and phone number sent to the owner." },
  { key: "confirmed", label: "Confirmed", hint: "Owner agreed the dates and the deposit." },
  { key: "collected", label: "Collected", hint: "Handover done. Photos and checklist saved." },
  { key: "returned", label: "Returned", hint: "Item back, checked together, deposit settled." },
];

const order: Record<BookingStatus, number> = {
  requested: 0,
  confirmed: 1,
  collected: 2,
  returned: 3,
  declined: -1,
};

type Props = {
  status: BookingStatus;
  startDate: string;
  endDate: string;
  updatedAt: string;
};

export function BookingTimeline({ status, startDate, endDate, updatedAt }: Props) {
  const current = order[status] ?? 0;

  if (status === "declined") {
    return (
      <div className="border border-line bg-wash p-4">
        <p className="font-medium text-ink">This request was declined</p>
        <p className="mt-1 text-[14px] text-copy">
          The owner could not take these dates. Message them to ask about another week, or{" "}
          <a className="link" href="/browse">
            browse similar gear
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <ol className="grid gap-0 md:grid-cols-4">
        {stages.map((stage, index) => {
          const done = index <= current;
          const active = index === current;
          return (
            <li key={stage.key} className="relative flex gap-3 pb-6 last:pb-0 md:block md:pb-0 md:pr-4">
              <div className="relative flex flex-col items-center md:flex-row">
                <span
                  className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border ${
                    done ? "border-ink bg-ink text-white" : "border-line bg-paper text-line"
                  }`}
                  aria-hidden="true"
                >
                  {done ? <IconCheck size={16} /> : <span className="text-[12px]">{index + 1}</span>}
                </span>
                {index < stages.length - 1 && (
                  <span
                    className="absolute left-4 top-8 h-full w-px bg-line md:left-8 md:top-4 md:h-px md:w-full"
                    aria-hidden="true"
                  >
                    <span
                      className={`timeline-draw block h-full w-full ${
                        index < current ? "bg-ink" : "bg-line"
                      }`}
                    />
                  </span>
                )}
              </div>
              <div className="md:mt-3">
                <p className={`text-[15px] font-medium ${active ? "text-ink" : "text-charcoal"}`}>
                  {stage.label}
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-copy">{stage.hint}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <dl className="mt-4 grid gap-2 border-t border-line pt-4 text-[13px] text-copy sm:grid-cols-3">
        <div>
          <dt className="uppercase tracking-wide">Pickup</dt>
          <dd className="text-ink">{formatDate(startDate)}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide">Return</dt>
          <dd className="text-ink">{formatDate(endDate)}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide">Last update</dt>
          <dd className="text-ink">{new Date(updatedAt).toLocaleDateString("en-KE")}</dd>
        </div>
      </dl>
    </div>
  );
}
