import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: { href: string; label: string };
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, action, align = "left" }: Props) {
  return (
    <div
      className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
        align === "center" ? "text-center sm:flex-col sm:items-center" : ""
      }`}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 text-[28px] sm:text-[36px]">{title}</h2>
        {description && <p className="mt-3 text-[16px] leading-relaxed text-copy">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn-outline btn-sm shrink-0 self-start sm:self-auto">
          {action.label}
        </Link>
      )}
    </div>
  );
}
