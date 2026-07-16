// ---------------------------------------------------------------------------
// AUTH SERVICE
// Login, signup, token refresh, role switching. Currently returns mock users;
// swap the body of each function with a real POST to your Django auth endpoint.
// ---------------------------------------------------------------------------

import { User, UserRole } from '../../types';
import { delay, setAuthToken } from './apiClient';

function makeUser(role: UserRole, name: string, email?: string): User {
  return {
    id: 'me',
    name,
    email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    role,
    locality: 'Anna Nagar',
    sport: 'Badminton',
    skill: 'Intermediate',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0E8E7C&color=fff`,
  };
}

export async function login(
  email: string,
  _password: string,
  role: UserRole,
): Promise<User> {
  // TODO: POST /api/auth/login { email, password, role }
  const name = role === 'player' ? 'You' : 'Venue Owner';
  const user = makeUser(role, name, email);
  setAuthToken('mock-jwt-token');
  return delay(user);
}

export async function signup(
  name: string,
  email: string,
  _password: string,
  role: UserRole,
): Promise<User> {
  // TODO: POST /api/auth/signup { name, email, password, role }
  const user = makeUser(role, name, email);
  setAuthToken('mock-jwt-token');
  return delay(user);
}

export async function refreshToken(): Promise<void> {
  // TODO: POST /api/auth/refresh
  return delay(undefined);
}

export function switchRole(current: User): User {
  return {
    ...current,
    role: current.role === 'player' ? 'venue_owner' : 'player',
  };
}

export async function logout(): Promise<void> {
  setAuthToken(null);
  return delay(undefined, 0);
}
