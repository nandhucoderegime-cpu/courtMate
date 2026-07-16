import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, CURRENCY } from '../../theme/theme';
import { SPORTS, DAYS, AMENITIES } from '../../data/mockData';
import { useAppData } from '../../context/AppDataContext';
import { CourtCard, BookingCard } from '../../components/Cards';
import { Chip, PrimaryButton, EmptyState } from '../../components/UI';
import { Venue } from '../../types';

export function MyVenuesScreen({ navigation }: { navigation: any }) {
  const { courts } = useAppData();
  const myVenues = courts.filter(c => c.ownerId === 'owner1');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My venues</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('VenueForm', {})}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={myVenues}
        keyExtractor={v => v.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        ListEmptyComponent={<EmptyState title="No venues yet" body="Add your first court to start taking bookings." />}
        renderItem={({ item }) => <CourtCard venue={item} onPress={() => navigation.navigate('VenueForm', { venueId: item.id })} />}
      />
    </View>
  );
}

export function VenueFormScreen({ route, navigation }: { route: any; navigation: any }) {
  const { venueId } = route.params || {};
  const { courts, addVenue, updateVenue } = useAppData();
  const existing = courts.find(c => c.id === venueId);

  const [name, setName] = useState(existing?.name || '');
  const [sport, setSport] = useState(existing?.sport || SPORTS[0]);
  const [address, setAddress] = useState(existing?.address || '');
  const [locality, setLocality] = useState(existing?.locality || '');
  const [price, setPrice] = useState(existing ? String(existing.pricePerHour) : '');
  const [amenities, setAmenities] = useState<string[]>(existing?.amenities || []);

  const toggleAmenity = (a: string) => {
    setAmenities(prev => (prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]));
  };

  const canSave = name.trim().length > 1 && address.trim().length > 1 && Number(price) > 0;

  const save = () => {
    const venue: Venue = {
      id: existing?.id || `v${Date.now()}`,
      ownerId: 'owner1',
      name,
      sport,
      address,
      locality,
      pricePerHour: Number(price),
      rating: existing?.rating || 4.5,
      image: existing?.image || `https://picsum.photos/seed/${Date.now()}/500/320`,
      distanceKm: existing?.distanceKm || 1.0,
      amenities,
    };
    if (existing) updateVenue(venue);
    else addVenue(venue);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingTop: 60 }}>
        <Text style={styles.title}>{existing ? 'Edit venue' : 'Add a venue'}</Text>

        <Text style={styles.label}>Venue name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Ace Sports Arena" placeholderTextColor={COLORS.inkFaint} />

        <Text style={styles.label}>Sport</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.sm }}>
          {SPORTS.map(s => (
            <Chip key={s} label={s} active={sport === s} onPress={() => setSport(s)} color={COLORS.venue} />
          ))}
        </ScrollView>

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Street, area" placeholderTextColor={COLORS.inkFaint} />

        <Text style={styles.label}>Locality</Text>
        <TextInput style={styles.input} value={locality} onChangeText={setLocality} placeholder="e.g. Anna Nagar" placeholderTextColor={COLORS.inkFaint} />

        <Text style={styles.label}>Price per hour ({CURRENCY})</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="400" placeholderTextColor={COLORS.inkFaint} />

        <Text style={styles.label}>Amenities</Text>
        <View style={styles.amenityWrap}>
          {AMENITIES.map(a => (
            <TouchableOpacity key={a} onPress={() => toggleAmenity(a)} style={[styles.amenityToggle, amenities.includes(a) && styles.amenityToggleActive]}>
              <Text style={[styles.amenityToggleText, amenities.includes(a) && { color: '#fff' }]}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <PrimaryButton title={existing ? 'Save changes' : 'Add venue'} onPress={save} disabled={!canSave} color={COLORS.venue} style={{ marginTop: SPACING.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function SlotCalendarScreen() {
  const { courts, slotsByVenue, toggleSlot } = useAppData();
  const myVenues = courts.filter(c => c.ownerId === 'owner1');
  const [venueId, setVenueId] = useState(myVenues[0]?.id);
  const slots = slotsByVenue[venueId || ''] || [];

  if (myVenues.length === 0) {
    return <EmptyState title="Add a venue first" body="Slot management appears once you've listed a venue." />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: SPACING.lg, paddingTop: 60, paddingBottom: SPACING.xl }}>
      <Text style={styles.title}>Slot calendar</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: SPACING.md }}>
        {myVenues.map(v => (
          <Chip key={v.id} label={v.name} active={venueId === v.id} onPress={() => setVenueId(v.id)} color={COLORS.venue} />
        ))}
      </ScrollView>
      <Text style={styles.mockNote}>Tap a slot to block or unblock it. Booked slots are set automatically when a player books.</Text>
      {DAYS.map(day => (
        <View key={day} style={{ marginBottom: SPACING.md }}>
          <Text style={styles.dayLabel}>{day}</Text>
          <View style={styles.slotGrid}>
            {slots
              .filter(s => s.day === day)
              .map(s => (
                <TouchableOpacity
                  key={s.time}
                  onPress={() => venueId && toggleSlot(venueId, s.day, s.time)}
                  disabled={s.status === 'booked'}
                  style={[styles.slotChip, s.status === 'booked' && styles.slotBooked, s.status === 'blocked' && styles.slotBlockedOwner]}
                >
                  <Text style={[styles.slotText, s.status === 'booked' && styles.slotTextDim]}>{s.time}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      ))}
      <View style={styles.legendRow}>
        <LegendDot color={COLORS.surface} border label="Available" />
        <LegendDot color="#F1F1EE" label="Booked" />
        <LegendDot color={COLORS.venueTint} label="Blocked" />
      </View>
    </ScrollView>
  );
}

function LegendDot({ color, label, border }: { color: string; label: string; border?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: SPACING.md }}>
      <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: color, borderWidth: border ? 1 : 0, borderColor: COLORS.line, marginRight: 6 }} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

export function VenueBookingsScreen() {
  const { venueBookings } = useAppData();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: SPACING.lg, paddingTop: 60 }}>
      <Text style={styles.title}>Bookings</Text>
      {venueBookings.length === 0 && <EmptyState title="No bookings yet" />}
      {venueBookings.map(b => <BookingCard key={b.id} booking={b} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: 60, paddingBottom: SPACING.sm },
  title: { ...FONT.h1, color: COLORS.ink },
  addBtn: { width: 40, height: 40, borderRadius: RADIUS.full, backgroundColor: COLORS.venue, alignItems: 'center', justifyContent: 'center' },
  label: { ...FONT.small, color: COLORS.inkSoft, marginBottom: 6, marginTop: SPACING.sm },
  input: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    fontSize: 15,
    color: COLORS.ink,
  },
  amenityWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityToggle: { borderWidth: 1, borderColor: COLORS.line, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.surface },
  amenityToggleActive: { backgroundColor: COLORS.venue, borderColor: COLORS.venue },
  amenityToggleText: { ...FONT.small, color: COLORS.ink },
  mockNote: { ...FONT.tiny, color: COLORS.inkFaint, marginBottom: SPACING.md },
  dayLabel: { ...FONT.bodyMedium, color: COLORS.ink, marginBottom: 8 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip: { borderWidth: 1, borderColor: COLORS.line, borderRadius: RADIUS.md, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: COLORS.surface },
  slotBooked: { backgroundColor: '#F1F1EE', borderColor: '#F1F1EE' },
  slotBlockedOwner: { backgroundColor: COLORS.venueTint, borderColor: COLORS.venue },
  slotText: { ...FONT.small, color: COLORS.ink },
  slotTextDim: { color: COLORS.inkFaint },
  legendRow: { flexDirection: 'row', marginTop: SPACING.md, flexWrap: 'wrap' },
  legendText: { ...FONT.tiny, color: COLORS.inkSoft },
});
