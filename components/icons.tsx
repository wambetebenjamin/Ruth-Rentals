import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s6-5.5 6-10.2A6 6 0 0 0 6 10.8C6 15.5 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <path d="m12 3.6 2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8Z" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function IconWhatsApp(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={1.5}>
      <path d="M20 11.6a8 8 0 0 1-11.9 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z" />
      <path d="M9.2 8.6c.3-.6.6-.6.9-.6h.5c.2 0 .4 0 .6.5l.7 1.6c.1.3 0 .5-.2.7l-.5.6c-.1.2-.2.3 0 .6.4.7 1.3 1.6 2.2 2 .3.1.5.1.6 0l.7-.8c.2-.2.4-.2.6-.1l1.5.7c.2.1.3.3.3.5 0 .9-.7 1.7-1.6 1.8-1.6.2-4.6-1.1-5.9-3.6-.7-1.3-.8-2.6-.4-3.9Z" />
    </svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 3.8h3l1.4 4-2 1.4a12 12 0 0 0 6.4 6.4l1.4-2 4 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function IconDrill(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 8h8.5a3 3 0 0 1 3 3v1H7.5A4.5 4.5 0 0 1 3 7.5Z" />
      <path d="M14.5 9h3.2l2.8 2.2v2.6h-6" />
      <path d="M7.5 12v6.5A1.5 1.5 0 0 0 9 20h2a1.5 1.5 0 0 0 1.5-1.5V15" />
      <path d="M3 9.8h1.5" />
    </svg>
  );
}

export function IconCamera(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 8.5h3l1.6-2h7.8l1.6 2h3v11h-17Z" />
      <circle cx="12" cy="13.4" r="3.4" />
      <path d="M17.6 11h.01" />
    </svg>
  );
}

export function IconTent(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 3 20h18L12 3Z" />
      <path d="M12 3v17M8.5 20l3.5-6 3.5 6" />
    </svg>
  );
}

export function IconSpeaker(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5.5" y="3" width="13" height="18" rx="2" />
      <circle cx="12" cy="8" r="2.4" />
      <circle cx="12" cy="15.5" r="3" />
    </svg>
  );
}

export function IconTractor(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="16" cy="16.5" r="4" />
      <circle cx="7" cy="17.5" r="3" />
      <path d="M4 14.5V8h5l2 4h5v4.5" />
      <path d="M9 8V5h5v3" />
      <path d="M16 12.5V9h2.5" />
    </svg>
  );
}

export function IconParty(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20 9.5 6l8.5 8.5L4 20Z" />
      <path d="M13.5 4v2M18 6l1.3-1.4M20 10.5h2M15.5 10.2l1.8-1" />
    </svg>
  );
}

export function IconBall(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m12 7 3 2.2-1.1 3.6h-3.8L9 9.2 12 7Z" />
      <path d="M12 3.5v3.4M4.6 9.6l4.4.6M8 19.6l1.7-4.2M16 19.6l-1.7-4.2M19.4 9.6l-4.4.6" />
    </svg>
  );
}

export function IconTruck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 6.5h10v10H3z" />
      <path d="M13 10h4l3 3.2v3.3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3 5 6v5.5c0 4.2 3 7.7 7 9.5 4-1.8 7-5.3 7-9.5V6l-7-3Z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </svg>
  );
}

export function IconMessage(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5h16v11H9.5L4 20.5v-15Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8.5" r="3.7" />
      <path d="M4.8 20c.9-3.4 3.7-5.4 7.2-5.4s6.3 2 7.2 5.4" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </svg>
  );
}

export function IconUpload(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 16V4.5M7.5 9 12 4.5 16.5 9" />
      <path d="M4.5 15v3.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V15" />
    </svg>
  );
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <path d="M8 5.5 18.5 12 8 18.5Z" />
    </svg>
  );
}

export function IconStop(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6.5h16M7 12h10M10 17.5h4" />
    </svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8h.01" />
    </svg>
  );
}

export function IconKey(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="15.5" r="3.5" />
      <path d="m10.6 13 8.4-8.4M16 7.4l2 2M13.6 9.8l2 2" />
    </svg>
  );
}

export function categoryIcon(slug: string) {
  switch (slug) {
    case "power-tools":
      return IconDrill;
    case "cameras":
      return IconCamera;
    case "event-tents":
      return IconTent;
    case "sound":
      return IconSpeaker;
    case "farm-equipment":
      return IconTractor;
    case "party-supplies":
      return IconParty;
    case "sports":
      return IconBall;
    case "vehicles":
      return IconTruck;
    default:
      return IconDrill;
  }
}
