// ---------------------------------------------------------------------------
// VENUE MANAGEMENT SERVICE
// CRUD for venues — address, pricing, amenities. Reads from mock data now;
// swap with GET/POST/PATCH to /api/venues when Django is live.
// ---------------------------------------------------------------------------

import { Venue } from '../../types';
import { courts } from '../../data/mockData';
import { delay } from '../gateway/apiClient';

export interface VenueFilters {
  sport?: string;
  locality?: string;
  maxPrice?: number;
}

export async function getVenues(filters?: VenueFilters): Promise<Venue[]> {
  // TODO: GET /api/venues?sport=...&locality=...&maxPrice=...
  let result = [...courts];
  if (filters?.sport) result = result.filter(v => v.sport === filters.sport);
  if (filters?.locality) result = result.filter(v => v.locality === filters.locality);
  if (filters?.maxPrice != null) {
    const max = filters.maxPrice;
    result = result.filter(v => v.pricePerHour <= max);
  }
  return delay(result);
}

export async function getVenueById(id: string): Promise<Venue | undefined> {
  // TODO: GET /api/venues/:id
  return delay(courts.find(c => c.id === id));
}

export async function createVenue(data: Venue): Promise<Venue> {
  // TODO: POST /api/venues { ...data }
  return delay(data);
}

export async function updateVenue(id: string, patch: Partial<Venue>): Promise<Venue | undefined> {
  // TODO: PATCH /api/venues/:id
  const venue = courts.find(c => c.id === id);
  if (!venue) return delay(undefined);
  return delay({ ...venue, ...patch });
}
