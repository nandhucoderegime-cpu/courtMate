// ---------------------------------------------------------------------------
// PLAYER PROFILE SERVICE
// Fetch and update player profiles. Reads from mock data now; when Django is
// live, swap with GET/PATCH to /api/players/:id.
// ---------------------------------------------------------------------------

import { PlayerProfile } from '../../types';
import { players } from '../../data/mockData';
import { delay } from '../gateway/apiClient';

export interface PlayerFilters {
  sport?: string;
  skill?: string;
  locality?: string;
}

export async function getPlayers(filters?: PlayerFilters): Promise<PlayerProfile[]> {
  // TODO: GET /api/players?sport=...&skill=...&locality=...
  let result = [...players];
  if (filters?.sport) result = result.filter(p => p.sport === filters.sport);
  if (filters?.skill) result = result.filter(p => p.skill === filters.skill);
  if (filters?.locality) result = result.filter(p => p.locality === filters.locality);
  return delay(result);
}

export async function getProfile(userId: string): Promise<PlayerProfile | undefined> {
  // TODO: GET /api/players/:userId
  return delay(players.find(p => p.id === userId));
}

export async function updateProfile(
  userId: string,
  patch: Partial<PlayerProfile>,
): Promise<PlayerProfile | undefined> {
  // TODO: PATCH /api/players/:userId
  const player = players.find(p => p.id === userId);
  if (!player) return delay(undefined);
  return delay({ ...player, ...patch });
}
