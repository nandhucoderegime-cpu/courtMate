// ---------------------------------------------------------------------------
// NOTIFICATION SERVICE
// In-app notification dispatch + FCM push notification stubs.
// Transport: Firebase Cloud Messaging (FCM) via expo-notifications.
// ---------------------------------------------------------------------------

import { AppNotification, Booking } from '../../types';
import { initialNotifications } from '../../data/mockData';
import { delay } from '../gateway/apiClient';

export async function getNotifications(_userId: string): Promise<AppNotification[]> {
  // TODO: GET /api/notifications?userId=...
  return delay(initialNotifications);
}

export async function markAllRead(_userId: string): Promise<void> {
  // TODO: PATCH /api/notifications/read-all { userId }
  return delay(undefined);
}

// ----- Dispatchers — create + send notifications --------------------------

export function createBookingAlert(booking: Booking): AppNotification {
  return {
    id: `n${Date.now()}`,
    type: 'booking',
    title: 'Booking confirmed',
    body: `Your slot at ${booking.venueName}, ${booking.day} ${booking.time} is confirmed.`,
    time: 'Just now',
    read: false,
  };
}

export function createMatchAlert(playerName: string, sport: string): AppNotification {
  return {
    id: `n${Date.now()}`,
    type: 'match',
    title: 'New match request',
    body: `${playerName} wants to play ${sport.toLowerCase()} with you.`,
    time: 'Just now',
    read: false,
  };
}

export async function sendBookingAlert(booking: Booking): Promise<AppNotification> {
  // TODO: POST /api/notifications/send { type: 'booking', ... }
  // In production this triggers FCM push via the backend
  const notification = createBookingAlert(booking);
  return delay(notification);
}

export async function sendMatchAlert(
  playerName: string,
  sport: string,
): Promise<AppNotification> {
  // TODO: POST /api/notifications/send { type: 'match', ... }
  // In production this triggers FCM push via the backend
  const notification = createMatchAlert(playerName, sport);
  return delay(notification);
}

// ----- FCM Push Token Registration ----------------------------------------

export async function registerPushToken(_token: string): Promise<void> {
  // TODO: POST /api/notifications/register-device { token, platform }
  // Uses expo-notifications to get the FCM token, then sends to backend
  // so it can push via Firebase Cloud Messaging.
  return delay(undefined);
}
