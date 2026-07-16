import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextValue {
  user: User | null;
  loginAs: (role: UserRole, name?: string) => void;
  logout: () => void;
  switchRole: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// MOCK AUTH: there's no backend yet, so this just creates a local session.
// Swap this for a real login call (and store a token) once the Django API
// is ready - the shape of `user` below is what the rest of the app expects.
function makeUser(role: UserRole, name: string): User {
  return {
    id: 'me',
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    role,
    locality: 'Anna Nagar',
    sport: 'Badminton',
    skill: 'Intermediate',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0E8E7C&color=fff`,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const loginAs = (role: UserRole, name: string = role === 'player' ? 'You' : 'Venue Owner') => {
    setUser(makeUser(role, name || (role === 'player' ? 'You' : 'Venue Owner')));
  };

  const logout = () => setUser(null);

  // This is the "same app, both roles" behaviour from the diagram: one
  // account, one session, and this just flips which tab bar / screens render.
  const switchRole = () => {
    setUser(prev => (prev ? { ...prev, role: prev.role === 'player' ? 'venue_owner' : 'player' } : prev));
  };

  const updateProfile = (patch: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...patch } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, loginAs, logout, switchRole, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
