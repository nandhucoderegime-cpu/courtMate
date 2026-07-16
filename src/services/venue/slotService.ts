// ---------------------------------------------------------------------------
// SLOT CALENDAR SERVICE
// Weekly availability grid — get, toggle, and bulk-update slots for a venue.
// This is the "Slot calendar" box in the architecture diagram.
// ---------------------------------------------------------------------------

import { Slot } from '../../types';
import { venueSlots } from '../../data/mockData';
import { delay } from '../gateway/apiClient';

export async function getSlots(venueId: string): Promise<Slot[]> {
  // TODO: GET /api/venues/:venueId/slots
  return delay(venueSlots[venueId] || []);
}

/**
 * Toggle a single slot between available ↔ blocked.
 * Booked slots cannot be toggled (they're locked).
 */
export function toggleSlotStatus(slot: Slot): Slot {
  if (slot.status === 'booked') return slot; // can't toggle a booked slot
  return {
    ...slot,
    status: slot.status === 'available' ? 'blocked' : 'available',
  };
}

export async function toggleSlot(
  venueId: string,
  day: string,
  time: string,
): Promise<Slot | undefined> {
  // TODO: PATCH /api/venues/:venueId/slots { day, time }
  const slots = venueSlots[venueId] || [];
  const target = slots.find(s => s.day === day && s.time === time);
  if (!target) return delay(undefined);
  return delay(toggleSlotStatus(target));
}

export async function bulkUpdateSlots(
  _venueId: string,
  slots: Slot[],
): Promise<Slot[]> {
  // TODO: PUT /api/venues/:venueId/slots { slots }
  return delay(slots);
}

/**
 * Mark a specific slot as booked — called by bookingService when a booking
 * is created. Returns the updated slot.
 */
export function markSlotBooked(slot: Slot): Slot {
  return { ...slot, status: 'booked' };
}
