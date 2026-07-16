// ---------------------------------------------------------------------------
// MAPS SERVICE (Google Maps)
// Distance calculation and venue sorting by proximity.
// Currently uses the mock distanceKm field from venue data; when ready,
// swap with Google Maps Distance Matrix API calls.
// ---------------------------------------------------------------------------

import { Venue } from '../../types';
import { delay } from '../gateway/apiClient';

// Google Maps API key — set via environment variable when ready
// const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two coordinates.
 * TODO: Replace with Google Maps Distance Matrix API
 * GET https://maps.googleapis.com/maps/api/distancematrix/json
 *   ?origins=${from.lat},${from.lng}
 *   &destinations=${to.lat},${to.lng}
 *   &key=${GOOGLE_MAPS_API_KEY}
 */
export async function calculateDistance(
  _from: Coordinates,
  _to: Coordinates,
): Promise<number> {
  // Mock: returns a random-ish distance. Real impl uses Google Distance Matrix.
  const mockKm = Math.round((Math.random() * 8 + 0.5) * 10) / 10;
  return delay(mockKm);
}

/**
 * Sort venues by distance from a user's location.
 * Uses the existing venue.distanceKm field (mock) — in production, this
 * would first call calculateDistance for each venue, then sort.
 */
export async function sortByDistance(
  venues: Venue[],
  _userLocation?: Coordinates,
): Promise<Venue[]> {
  // TODO: Batch distance matrix call, then sort
  const sorted = [...venues].sort((a, b) => a.distanceKm - b.distanceKm);
  return delay(sorted);
}

/**
 * Geocode an address string to coordinates.
 * TODO: Replace with Google Maps Geocoding API
 * GET https://maps.googleapis.com/maps/api/geocode/json
 *   ?address=${encodeURIComponent(address)}
 *   &key=${GOOGLE_MAPS_API_KEY}
 */
export async function geocodeAddress(
  _address: string,
): Promise<Coordinates> {
  // Mock coordinates (roughly Chennai, India)
  return delay({ lat: 13.0827, lng: 80.2707 });
}
