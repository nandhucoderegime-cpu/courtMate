export type UserRole = 'player' | 'venue_owner';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SlotStatus = 'available' | 'booked' | 'blocked';
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';
export type NotificationType = 'booking' | 'match' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locality: string;
  sport: string;
  skill: SkillLevel;
  avatar: string;
}

export interface Venue {
  id: string;
  ownerId: string;
  name: string;
  sport: string;
  address: string;
  locality: string;
  pricePerHour: number;
  rating: number;
  image: string;
  distanceKm: number;
  amenities: string[];
}

export interface Slot {
  day: string;
  time: string;
  status: SlotStatus;
}

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  venueImage: string;
  playerName: string;
  day: string;
  date: string;
  time: string;
  price: number;
  commission: number;
  total: number;
  status: BookingStatus;
}

export interface PlayerProfile {
  id: string;
  name: string;
  sport: string;
  skill: SkillLevel;
  locality: string;
  avatar: string;
  bio: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

export interface ChatThread {
  id: string;
  participant: PlayerProfile;
  messages: ChatMessage[];
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}
