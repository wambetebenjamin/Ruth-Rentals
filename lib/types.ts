export type CategorySlug =
  | "power-tools"
  | "cameras"
  | "event-tents"
  | "sound"
  | "farm-equipment"
  | "party-supplies"
  | "sports"
  | "vehicles";

export type ItemStatus = "live" | "paused";

export type BookingStatus =
  | "requested"
  | "confirmed"
  | "collected"
  | "returned"
  | "declined";

export type Role = "owner" | "renter" | "both";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  county: string;
  role: Role;
  passwordHash: string;
  avatar?: string;
  createdAt: string;
}

export interface ItemSpec {
  label: string;
  value: string;
}

export interface Item {
  id: string;
  slug: string;
  title: string;
  category: CategorySlug;
  county: string;
  area: string;
  dailyRate: number;
  weeklyRate: number;
  deposit: number;
  minDays: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  description: string;
  specs: ItemSpec[];
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerSince: string;
  ownerDeals: number;
  ownerRating: number;
  blockedDates: string[];
  pickupNote: string;
  featured: boolean;
  promoted: boolean;
  status: ItemStatus;
  createdAt: string;
}

export interface ChecklistState {
  photosBefore: boolean;
  conditionNotes: boolean;
  accessoriesCounted: boolean;
  bothSigned: boolean;
}

export interface Booking {
  id: string;
  itemId: string;
  itemSlug: string;
  itemTitle: string;
  itemImage: string;
  ownerId: string;
  ownerName: string;
  renterId: string;
  renterName: string;
  renterPhone: string;
  renterEmail: string;
  startDate: string;
  endDate: string;
  days: number;
  dailyRate: number;
  deposit: number;
  total: number;
  status: BookingStatus;
  checklist: ChecklistState;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  bookingId?: string;
  itemId?: string;
  itemTitle?: string;
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  body: string;
  createdAt: string;
  readBy: string[];
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  itemSlug?: string;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}
