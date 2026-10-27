import type { CategorySlug } from "./types";

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  blurb: string;
  image: string;
  from: number;
}

export const categories: Category[] = [
  {
    slug: "power-tools",
    name: "Power Tools",
    short: "Drills, grinders, saws",
    blurb: "Drills, grinders, saws, generators and the bits that come with them.",
    image: "/images/listing-angle-grinder.jpg",
    from: 550,
  },
  {
    slug: "cameras",
    name: "Cameras",
    short: "Bodies, lenses, lights",
    blurb: "Bodies, lenses, lights and tripods for shoots and events.",
    image: "/images/listing-camera.jpg",
    from: 1800,
  },
  {
    slug: "event-tents",
    name: "Event Tents",
    short: "Marquees and gazebos",
    blurb: "Marquees, gazebos and stretch tents with sides and pegs.",
    image: "/images/listing-tent.jpg",
    from: 8500,
  },
  {
    slug: "sound",
    name: "Sound",
    short: "PA, mics, mixers",
    blurb: "PA systems, mixers, microphones and monitors for hire.",
    image: "/images/listing-sound.jpg",
    from: 2800,
  },
  {
    slug: "farm-equipment",
    name: "Farm Equipment",
    short: "Tractors and ploughs",
    blurb: "Tractors, ploughs, sprayers and pumps for the shamba.",
    image: "/images/listing-tractor.jpg",
    from: 4500,
  },
  {
    slug: "party-supplies",
    name: "Party Supplies",
    short: "Chairs, tables, decor",
    blurb: "Chairs, tables, cutlery and decor for gatherings of any size.",
    image: "/images/listing-chairs.jpg",
    from: 3500,
  },
  {
    slug: "sports",
    name: "Sports",
    short: "Team kits and training",
    blurb: "Team kits, training gear, cones, balls and hurdles.",
    image: "/images/listing-football.jpg",
    from: 700,
  },
  {
    slug: "vehicles",
    name: "Vehicles, light equipment",
    short: "Pickups and trailers",
    blurb: "Pickups, trailers and light carriers with or without a driver.",
    image: "/images/listing-pickup.jpg",
    from: 7500,
  },
];

export const categoryMap: Record<CategorySlug, Category> = categories.reduce(
  (acc, category) => {
    acc[category.slug] = category;
    return acc;
  },
  {} as Record<CategorySlug, Category>,
);

export const counties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos",
  "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a",
  "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu",
  "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana",
  "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
];

export const popularCounties = [
  "Nairobi", "Kiambu", "Mombasa", "Nakuru", "Uasin Gishu", "Machakos", "Kajiado", "Kisumu",
];

export const priceBands = [
  { label: "Any rate", min: 0, max: 0 },
  { label: "Under KES 1,000", min: 0, max: 1000 },
  { label: "KES 1,000 to 3,000", min: 1000, max: 3000 },
  { label: "KES 3,000 to 8,000", min: 3000, max: 8000 },
  { label: "Above KES 8,000", min: 8000, max: 0 },
];

export function categoryName(slug: string) {
  return categoryMap[slug as CategorySlug]?.name ?? "Gear";
}
