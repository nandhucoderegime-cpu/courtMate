import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../services/api';
import { Venue, PlayerProfile, Booking, ChatThread, ChatMessage, AppNotification, Slot } from '../types';
import { venueSlots as seedSlots } from '../data/mockData';

interface AppDataContextValue {
  courts: Venue[];
  players: PlayerProfile[];
  myBookings: Booking[];
  venueBookings: Booking[];
  chats: ChatThread[];
  notifications: AppNotification[];
  slotsByVenue: Record<string, Slot[]>;
  loading: boolean;
  addBooking: (b: Booking) => void;
  sendMessage: (chatId: string, text: string) => void;
  startChat: (player: PlayerProfile) => string;
  addVenue: (v: Venue) => void;
  updateVenue: (v: Venue) => void;
  toggleSlot: (venueId: string, day: string, time: string) => void;
  markNotificationsRead: () => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [courts, setCourts] = useState<Venue[]>([]);
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [venueBookings, setVenueBookings] = useState<Booking[]>([]);
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [slotsByVenue, setSlotsByVenue] = useState<Record<string, Slot[]>>(seedSlots);
  const [loading, setLoading] = useState(true);

  // Loads everything through services/api.ts on mount, exactly like it would
  // with a real backend - only the inside of api.ts needs to change later.
  useEffect(() => {
    (async () => {
      const [c, p, mb, vb, ch, n] = await Promise.all([
        api.getCourts(),
        api.getPlayers(),
        api.getMyBookings(),
        api.getVenueBookings(),
        api.getChats(),
        api.getNotifications(),
      ]);
      setCourts(c);
      setPlayers(p);
      setMyBookings(mb);
      setVenueBookings(vb);
      setChats(ch);
      setNotifications(n);
      setLoading(false);
    })();
  }, []);

  const addBooking = (b: Booking) => {
    setMyBookings(prev => [b, ...prev]);
    setSlotsByVenue(prev => ({
      ...prev,
      [b.venueId]: (prev[b.venueId] || []).map(s =>
        s.day === b.day && s.time === b.time ? { ...s, status: 'booked' } : s
      ),
    }));
  };

  const sendMessage = (chatId: string, text: string) => {
    const msg: ChatMessage = { id: `m${Date.now()}`, senderId: 'me', text, time: 'Just now' };
    setChats(prev => prev.map(c => (c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c)));
  };

  const startChat = (player: PlayerProfile): string => {
    const existing = chats.find(c => c.participant.id === player.id);
    if (existing) return existing.id;
    const id = `ch${Date.now()}`;
    const newChat: ChatThread = {
      id,
      participant: player,
      messages: [
        { id: `m${Date.now()}`, senderId: player.id, text: `Hi! Up for a ${player.sport.toLowerCase()} game sometime?`, time: 'Just now' },
      ],
    };
    setChats(prev => [newChat, ...prev]);
    return id;
  };

  const addVenue = (v: Venue) => {
    setCourts(prev => [v, ...prev]);
    setSlotsByVenue(prev => ({ ...prev, [v.id]: [] }));
  };

  const updateVenue = (v: Venue) => {
    setCourts(prev => prev.map(c => (c.id === v.id ? v : c)));
  };

  const toggleSlot = (venueId: string, day: string, time: string) => {
    setSlotsByVenue(prev => ({
      ...prev,
      [venueId]: (prev[venueId] || []).map(s =>
        s.day === day && s.time === time
          ? { ...s, status: s.status === 'blocked' ? 'available' : s.status === 'available' ? 'blocked' : s.status }
          : s
      ),
    }));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppDataContext.Provider
      value={{
        courts,
        players,
        myBookings,
        venueBookings,
        chats,
        notifications,
        slotsByVenue,
        loading,
        addBooking,
        sendMessage,
        startChat,
        addVenue,
        updateVenue,
        toggleSlot,
        markNotificationsRead,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
