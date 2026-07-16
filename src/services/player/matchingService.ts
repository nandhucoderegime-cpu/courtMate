// ---------------------------------------------------------------------------
// MATCHING ENGINE SERVICE
// "Find someone to play with" — filters players by sport, skill, and locality,
// then cross-references real court availability from the shared database so a
// match suggestion only appears if there's actually a slot open nearby.
// ---------------------------------------------------------------------------

import { PlayerProfile, Venue, Slot } from '../../types';
import { players, courts, venueSlots } from '../../data/mockData';
import { delay } from '../gateway/apiClient';

export interface MatchCriteria {
  sport: string;
  skill?: string;
  locality?: string;
}

export interface MatchResult {
  player: PlayerProfile;
  nearbyVenuesWithSlots: { venue: Venue; availableSlots: number }[];
}

/**
 * Finds players that match the criteria AND have at least one nearby venue
 * with open slots for the same sport. This is the key cross-query that the
 * shared database enables — player matching + court availability in one call.
 */
export async function findMatches(
  userId: string,
  criteria: MatchCriteria,
): Promise<MatchResult[]> {
  // TODO: POST /api/matching/find { userId, criteria }

  // 1. Filter players by sport / skill / locality (excluding self)
  let candidates = players.filter(p => p.id !== userId && p.sport === criteria.sport);
  if (criteria.skill) candidates = candidates.filter(p => p.skill === criteria.skill);
  if (criteria.locality) candidates = candidates.filter(p => p.locality === criteria.locality);

  // 2. Find venues for this sport with available slots
  const sportVenues = courts.filter(v => v.sport === criteria.sport);
  const venuesWithAvailability = sportVenues.map(venue => {
    const slots: Slot[] = venueSlots[venue.id] || [];
    const availableSlots = slots.filter(s => s.status === 'available').length;
    return { venue, availableSlots };
  }).filter(v => v.availableSlots > 0);

  // 3. Combine — only return players if there are courts to play at
  if (venuesWithAvailability.length === 0) return delay([]);

  const results: MatchResult[] = candidates.map(player => ({
    player,
    nearbyVenuesWithSlots: venuesWithAvailability,
  }));

  return delay(results);
}

/**
 * Send a match request to another player (triggers notification).
 */
export async function sendMatchRequest(
  _fromId: string,
  _toId: string,
): Promise<{ success: boolean }> {
  // TODO: POST /api/matching/request { fromId, toId }
  return delay({ success: true });
}
