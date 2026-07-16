import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services';

interface AuthContextValue {
  user: User | null;
  loginAs: (role: UserRole, name?: string) => void;
  logout: () => void;
  switchRole: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// AUTH: login/signup/switch calls are routed through services/gateway/authService.
// When the Django API is ready, only the inside of authService needs to change.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const loginAs = async (role: UserRole, name: string = role === 'player' ? 'You' : 'Venue Owner') => {
    const email = `${(name || 'user').toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const loggedIn = await authService.login(email, 'mock', role);
    setUser({ ...loggedIn, name: name || loggedIn.name });
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // This is the "same app, both roles" behaviour from the diagram: one
  // account, one session, and this just flips which tab bar / screens render.
  const switchRole = () => {
    setUser(prev => (prev ? authService.switchRole(prev) : prev));
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
