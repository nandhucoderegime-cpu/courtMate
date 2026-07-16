import { Venue, PlayerProfile, Booking, ChatThread, AppNotification, Slot, SkillLevel } from '../types';

export const SPORTS = ['Badminton', 'Football', 'Tennis', 'Cricket', 'Basketball', 'Pickleball'];
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const TIME_SLOTS = ['6:00 AM', '8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];
export const SKILLS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
export const AMENITIES = ['Parking', 'Washroom', 'Floodlights', 'Equipment rental', 'Drinking water', 'Seating area'];

export const courts: Venue[] = [
  { id: 'v1', ownerId: 'owner1', name: 'Ace Sports Arena', sport: 'Badminton', address: '14 Lake Road', locality: 'Anna Nagar', pricePerHour: 400, rating: 4.6, image: 'https://picsum.photos/seed/v1/500/320', distanceKm: 1.8, amenities: ['Parking', 'Washroom', 'Floodlights'] },
  { id: 'v2', ownerId: 'owner1', name: 'GreenTurf Football Ground', sport: 'Football', address: '22 Stadium Road', locality: 'Gandhi Nagar', pricePerHour: 900, rating: 4.4, image: 'https://picsum.photos/seed/v2/500/320', distanceKm: 3.2, amenities: ['Parking', 'Floodlights', 'Seating area'] },
  { id: 'v3', ownerId: 'owner2', name: 'SmashPoint Badminton Club', sport: 'Badminton', address: '9 Palace Road', locality: 'Race Course', pricePerHour: 350, rating: 4.7, image: 'https://picsum.photos/seed/v3/500/320', distanceKm: 2.4, amenities: ['Washroom', 'Equipment rental'] },
  { id: 'v4', ownerId: 'owner2', name: 'Baseline Tennis Courts', sport: 'Tennis', address: '5 Church Street', locality: 'Bypass Road', pricePerHour: 600, rating: 4.3, image: 'https://picsum.photos/seed/v4/500/320', distanceKm: 4.1, amenities: ['Parking', 'Floodlights'] },
  { id: 'v5', ownerId: 'owner3', name: 'Boundary Line Nets', sport: 'Cricket', address: '31 College Road', locality: 'K.K. Nagar', pricePerHour: 700, rating: 4.5, image: 'https://picsum.photos/seed/v5/500/320', distanceKm: 2.9, amenities: ['Parking', 'Equipment rental', 'Drinking water'] },
  { id: 'v6', ownerId: 'owner3', name: 'Hoop House Basketball Court', sport: 'Basketball', address: '18 Market Street', locality: 'Central', pricePerHour: 500, rating: 4.2, image: 'https://picsum.photos/seed/v6/500/320', distanceKm: 1.2, amenities: ['Floodlights', 'Seating area'] },
  { id: 'v7', ownerId: 'owner1', name: 'Rally Point Pickleball', sport: 'Pickleball', address: '44 Garden Avenue', locality: 'Anna Nagar', pricePerHour: 450, rating: 4.8, image: 'https://picsum.photos/seed/v7/500/320', distanceKm: 1.6, amenities: ['Parking', 'Washroom', 'Equipment rental'] },
  { id: 'v8', ownerId: 'owner2', name: 'Victory Football Turf', sport: 'Football', address: '7 Ring Road', locality: 'West End', pricePerHour: 850, rating: 4.1, image: 'https://picsum.photos/seed/v8/500/320', distanceKm: 5.4, amenities: ['Parking', 'Floodlights', 'Washroom'] },
];

export const players: PlayerProfile[] = [
  { id: 'p1', name: 'Arjun Kumar', sport: 'Badminton', skill: 'Intermediate', locality: 'Anna Nagar', avatar: 'https://ui-avatars.com/api/?name=Arjun+Kumar&background=0E8E7C&color=fff', bio: 'Play every weekend, looking for regular partners.' },
  { id: 'p2', name: 'Sneha Reddy', sport: 'Badminton', skill: 'Advanced', locality: 'Race Course', avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=E0693A&color=fff', bio: 'District level player, coaching beginners on the side.' },
  { id: 'p3', name: 'Vikram Singh', sport: 'Football', skill: 'Intermediate', locality: 'Gandhi Nagar', avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=3D8B52&color=fff', bio: 'Striker, free most weekday evenings.' },
  { id: 'p4', name: 'Divya Nair', sport: 'Tennis', skill: 'Beginner', locality: 'Bypass Road', avatar: 'https://ui-avatars.com/api/?name=Divya+Nair&background=C99A3E&color=fff', bio: 'Just started, want to rally with patient players.' },
  { id: 'p5', name: 'Rahul Menon', sport: 'Cricket', skill: 'Advanced', locality: 'K.K. Nagar', avatar: 'https://ui-avatars.com/api/?name=Rahul+Menon&background=0E8E7C&color=fff', bio: 'All-rounder, organize weekend box cricket.' },
  { id: 'p6', name: 'Priya Iyer', sport: 'Basketball', skill: 'Intermediate', locality: 'Central', avatar: 'https://ui-avatars.com/api/?name=Priya+Iyer&background=E0693A&color=fff', bio: 'Point guard, love a fast pace game.' },
  { id: 'p7', name: 'Kiran Das', sport: 'Pickleball', skill: 'Beginner', locality: 'Anna Nagar', avatar: 'https://ui-avatars.com/api/?name=Kiran+Das&background=3D8B52&color=fff', bio: 'New to pickleball, coming from a badminton background.' },
  { id: 'p8', name: 'Ananya Pillai', sport: 'Football', skill: 'Advanced', locality: 'West End', avatar: 'https://ui-avatars.com/api/?name=Ananya+Pillai&background=C99A3E&color=fff', bio: 'Ex-college captain, midfielder.' },
];

// Deterministic pseudo-random slot generator so every venue gets a believable
// mix of available/booked/blocked slots without hand-writing hundreds of rows.
function seededStatus(seed: number): Slot['status'] {
  const r = seed % 10;
  if (r < 6) return 'available';
  if (r < 9) return 'booked';
  return 'blocked';
}

function generateSlotsFor(venueId: string): Slot[] {
  const slots: Slot[] = [];
  let seed = venueId.charCodeAt(venueId.length - 1) * 7 + 3;
  DAYS.forEach((day, di) => {
    TIME_SLOTS.forEach((time, ti) => {
      seed = (seed * 13 + di * 5 + ti * 3 + 1) % 97;
      slots.push({ day, time, status: seededStatus(seed) });
    });
  });
  return slots;
}

export const venueSlots: Record<string, Slot[]> = Object.fromEntries(
  courts.map(c => [c.id, generateSlotsFor(c.id)])
);

export const initialBookings: Booking[] = [
  { id: 'b1', venueId: 'v1', venueName: 'Ace Sports Arena', venueImage: courts[0].image, playerName: 'You', day: 'Sat', date: '18 Jul', time: '6:00 PM', price: 400, commission: 40, total: 440, status: 'upcoming' },
  { id: 'b2', venueId: 'v3', venueName: 'SmashPoint Badminton Club', venueImage: courts[2].image, playerName: 'You', day: 'Wed', date: '8 Jul', time: '8:00 AM', price: 350, commission: 35, total: 385, status: 'completed' },
  { id: 'b3', venueId: 'v7', venueName: 'Rally Point Pickleball', venueImage: courts[6].image, playerName: 'You', day: 'Sun', date: '12 Jul', time: '4:00 PM', price: 450, commission: 45, total: 495, status: 'cancelled' },
];

export const venueBookings: Booking[] = [
  { id: 'vb1', venueId: 'v1', venueName: 'Ace Sports Arena', venueImage: courts[0].image, playerName: 'Arjun Kumar', day: 'Sat', date: '18 Jul', time: '6:00 PM', price: 400, commission: 40, total: 440, status: 'upcoming' },
  { id: 'vb2', venueId: 'v1', venueName: 'Ace Sports Arena', venueImage: courts[0].image, playerName: 'Sneha Reddy', day: 'Sun', date: '19 Jul', time: '8:00 AM', price: 400, commission: 40, total: 440, status: 'upcoming' },
  { id: 'vb3', venueId: 'v2', venueName: 'GreenTurf Football Ground', venueImage: courts[1].image, playerName: 'Vikram Singh', day: 'Fri', date: '17 Jul', time: '6:00 PM', price: 900, commission: 90, total: 990, status: 'completed' },
  { id: 'vb4', venueId: 'v7', venueName: 'Rally Point Pickleball', venueImage: courts[6].image, playerName: 'Kiran Das', day: 'Mon', date: '13 Jul', time: '4:00 PM', price: 450, commission: 45, total: 495, status: 'completed' },
];

export const initialChats: ChatThread[] = [
  {
    id: 'ch1',
    participant: players[0],
    messages: [
      { id: 'm1', senderId: 'p1', text: 'Hey! Saw you play badminton too, up for a game this weekend?', time: '10:12 AM' },
      { id: 'm2', senderId: 'me', text: 'Yes! Saturday evening works for me.', time: '10:15 AM' },
      { id: 'm3', senderId: 'p1', text: 'Ace Sports Arena, 6 PM slot?', time: '10:16 AM' },
    ],
  },
  {
    id: 'ch2',
    participant: players[4],
    messages: [
      { id: 'm4', senderId: 'p5', text: 'We need one more player for box cricket Sunday morning.', time: 'Yesterday' },
      { id: 'm5', senderId: 'me', text: 'Count me in, which ground?', time: 'Yesterday' },
    ],
  },
];

export const initialNotifications: AppNotification[] = [
  { id: 'n1', type: 'booking', title: 'Booking confirmed', body: 'Your slot at Ace Sports Arena, Sat 6:00 PM is confirmed.', time: '2h ago', read: false },
  { id: 'n2', type: 'match', title: 'New match request', body: 'Arjun Kumar wants to play badminton with you.', time: '5h ago', read: false },
  { id: 'n3', type: 'system', title: 'Weekend offer', body: '10% off on all bookings this weekend.', time: '1d ago', read: true },
  { id: 'n4', type: 'booking', title: 'Slot reminder', body: 'Your game at SmashPoint Badminton Club starts in 2 hours.', time: '2d ago', read: true },
];
