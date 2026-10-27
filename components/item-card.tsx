import Image from "next/image";
import Link from "next/link";
import type { Item } from "@/lib/types";
import { categoryName } from "@/lib/catalog";
import { formatKES } from "@/lib/format";
import { IconPin } from "./icons";
import { Rating } from "./rating";

type Props = {
  item: Item;
  priority?: boolean;
  sizes?: string;
};

export function ItemCard({ item, priority = false, sizes }: Props) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-colors hover:border-ink">
      <Link href={`/item/${item.slug}`} className="block" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[4/3] overflow-hidden bg-wash">
          <Image
            src={item.image}
            alt=""
            fill
            priority={priority}
            sizes={sizes ?? "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized={item.image.startsWith("data:")}
          />
          <span className="tag absolute left-3 top-3">{categoryName(item.category)}</span>
          {item.promoted && <span className="tag tag-solid absolute right-3 top-3">Promoted</span>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[16px] font-normal leading-snug">
          <Link href={`/item/${item.slug}`} className="hover:underline">
            {item.title}
          </Link>
        </h3>

        <div className="mb-3 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-copy">
          <Rating rating={item.rating} reviews={item.reviews} />
          <span className="flex min-w-0 items-center gap-1">
            <IconPin size={14} className="shrink-0" />
            <span className="truncate">
              {item.area}, {item.county}
            </span>
          </span>
        </div>

        <div className="mt-auto border-t border-line pt-3">
          <p className="price text-[18px] leading-none">
            {formatKES(item.dailyRate)}
            <span className="text-[12px] font-normal text-copy"> / day</span>
          </p>
          <p className="mt-1.5 text-[12px] text-copy">Deposit {formatKES(item.deposit)}</p>
        </div>
      </div>
    </article>
  );
}
