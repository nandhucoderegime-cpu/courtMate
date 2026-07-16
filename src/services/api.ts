import {
  courts,
  players,
  initialBookings,
  venueBookings,
  initialChats,
  initialNotifications,
  venueSlots,
} from '../data/mockData';
import { Venue, PlayerProfile, Booking, ChatThread, AppNotification, Slot } from '../types';

// ---------------------------------------------------------------------------
// MOCK API LAYER
// Every function here returns a Promise, on purpose, so screens already call
// this the way they'd call a real network request. When the Django REST API
// is ready, replace the body of each function with a real fetch()/axios call
// that hits your backend - the function signatures (and therefore every
// screen that imports `api`) should not need to change.
// ---------------------------------------------------------------------------

const LATENCY = 400;
function delay<T>(value: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), LATENCY));
}

export const api = {
  getCourts: (): Promise<Venue[]> => delay(courts),
  getCourtById: (id: string): Promise<Venue | undefined> => delay(courts.find(c => c.id === id)),
  getSlots: (venueId: string): Promise<Slot[]> => delay(venueSlots[venueId] || []),
  getPlayers: (): Promise<PlayerProfile[]> => delay(players),
  getMyBookings: (): Promise<Booking[]> => delay(initialBookings),
  getVenueBookings: (): Promise<Booking[]> => delay(venueBookings),
  getChats: (): Promise<ChatThread[]> => delay(initialChats),
  getNotifications: (): Promise<AppNotification[]> => delay(initialNotifications),
  createBooking: (booking: Booking): Promise<Booking> => delay(booking),
};
