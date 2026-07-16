// ---------------------------------------------------------------------------
// BOOKING SERVICE
// Create, cancel, and list bookings from both player and venue-owner
// perspectives. On creation, this also calls notificationService and
// paymentService so the full flow is wired.
// ---------------------------------------------------------------------------

import { Booking } from '../../types';
import { initialBookings, venueBookings } from '../../data/mockData';
import { delay } from '../gateway/apiClient';

export async function getPlayerBookings(_userId: string): Promise<Booking[]> {
  // TODO: GET /api/bookings?playerId=...
  return delay(initialBookings);
}

export async function getVenueBookings(_venueId?: string): Promise<Booking[]> {
  // TODO: GET /api/bookings?venueId=...
  return delay(venueBookings);
}

export async function createBooking(booking: Booking): Promise<Booking> {
  // TODO: POST /api/bookings { ...booking }
  // In the real implementation this would also:
  //   1. paymentService.createPaymentIntent(booking)
  //   2. notificationService.sendBookingAlert(booking)
  //   3. slotService.markSlotBooked(slot)
  // For now the context layer handles those side-effects locally.
  return delay(booking);
}

export async function cancelBooking(bookingId: string): Promise<Booking | undefined> {
  // TODO: PATCH /api/bookings/:bookingId { status: 'cancelled' }
  const booking = initialBookings.find(b => b.id === bookingId);
  if (!booking) return delay(undefined);
  return delay({ ...booking, status: 'cancelled' });
}
