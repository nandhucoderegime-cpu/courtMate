import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  profileService,
  chatService,
  venueService,
  slotService,
  bookingService,
  notificationService,
  paymentService,
} from '../services';
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

  // Loads data through domain-specific service modules on mount.
  // Each service call is a direct swap target for a real API endpoint.
  useEffect(() => {
    (async () => {
      const [c, p, mb, vb, ch, n] = await Promise.all([
        venueService.getVenues(),
        profileService.getPlayers(),
        bookingService.getPlayerBookings('me'),
        bookingService.getVenueBookings(),
        chatService.getThreads('me'),
        notificationService.getNotifications('me'),
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
    // 1. Persist booking through booking service
    bookingService.createBooking(b);

    // 2. Dispatch booking alert via notification service
    notificationService.sendBookingAlert(b).then(alert => {
      setNotifications(prev => [alert, ...prev]);
    });

    // 3. Update local state
    setMyBookings(prev => [b, ...prev]);
    setSlotsByVenue(prev => ({
      ...prev,
      [b.venueId]: (prev[b.venueId] || []).map(s =>
        s.day === b.day && s.time === b.time ? { ...s, status: 'booked' } : s
      ),
    }));
  };

  const sendMessage = (chatId: string, text: string) => {
    const msg: ChatMessage = chatService.createMessage(chatId, 'me', text);
    // Also fire the async service call for when backend is live
    chatService.sendMessage(chatId, text);
    setChats(prev => prev.map(c => (c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c)));
  };

  const startChat = (player: PlayerProfile): string => {
    const existing = chats.find(c => c.participant.id === player.id);
    if (existing) return existing.id;
    const newChat = chatService.createThread(player);
    // Also fire the async service call for when backend is live
    chatService.startThread(player);
    setChats(prev => [newChat, ...prev]);
    return newChat.id;
  };

  const addVenue = (v: Venue) => {
    venueService.createVenue(v);
    setCourts(prev => [v, ...prev]);
    setSlotsByVenue(prev => ({ ...prev, [v.id]: [] }));
  };

  const updateVenueData = (v: Venue) => {
    venueService.updateVenue(v.id, v);
    setCourts(prev => prev.map(c => (c.id === v.id ? v : c)));
  };

  const toggleSlotData = (venueId: string, day: string, time: string) => {
    slotService.toggleSlot(venueId, day, time);
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
    notificationService.markAllRead('me');
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
        updateVenue: updateVenueData,
        toggleSlot: toggleSlotData,
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
