import { formatRating } from "@/lib/format";
import { IconStar } from "./icons";

type Props = {
  rating: number;
  reviews?: number;
  size?: "sm" | "md";
  label?: string;
};

export function Rating({ rating, reviews, size = "sm", label }: Props) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5"
      aria-label={`${label ? `${label}: ` : ""}rated ${formatRating(rating)} out of 5${
        reviews ? ` from ${reviews} hires` : ""
      }`}
    >
      <IconStar size={size === "sm" ? 14 : 16} className="text-teal" />
      <span className={`price ${size === "sm" ? "text-[13px]" : "text-[15px]"}`}>
        {formatRating(rating)}
      </span>
      {typeof reviews === "number" && (
        <span className="text-[12px] text-copy">({reviews})</span>
      )}
    </span>
  );
}
