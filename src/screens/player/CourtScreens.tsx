import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, CURRENCY } from '../../theme/theme';
import { SPORTS, DAYS } from '../../data/mockData';
import { useAppData } from '../../context/AppDataContext';
import { CourtCard, BookingCard } from '../../components/Cards';
import { Chip, PrimaryButton, EmptyState } from '../../components/UI';
import { Booking } from '../../types';
import { s, hp, wp, normalize } from '../../utils/responsive';

export function CourtListScreen({ navigation }: { navigation: any }) {
  const { courts } = useAppData();
  const insets = useSafeAreaInsets();
  const [sport, setSport] = useState<string | null>(null);
  const filtered = sport ? courts.filter(c => c.sport === sport) : courts;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={[styles.listHeader, { paddingTop: insets.top + hp(1.5) }]}>
        <Text style={styles.title}>Courts</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: SPACING.lg }}>
        <Chip label="All" active={!sport} onPress={() => setSport(null)} />
        {SPORTS.map(s => (
          <Chip key={s} label={s} active={sport === s} onPress={() => setSport(s)} />
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => <CourtCard venue={item} onPress={() => navigation.navigate('CourtDetail', { courtId: item.id })} />}
        ListEmptyComponent={<EmptyState title="No courts for this sport yet" body="Try a different sport filter." />}
      />
    </View>
  );
}

export function CourtDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { courtId } = route.params;
  const { courts, slotsByVenue } = useAppData();
  const venue = courts.find(c => c.id === courtId);
  const [day, setDay] = useState(DAYS[0]);
  const [time, setTime] = useState<string | null>(null);

  if (!venue) return <EmptyState title="Court not found" />;

  const daySlots = (slotsByVenue[venue.id] || []).filter(s => s.day === day);

  const openMaps = () => {
    const query = encodeURIComponent(`${venue.name} ${venue.address} ${venue.locality}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <Image source={{ uri: venue.image }} style={styles.heroImage} />
      <View style={{ padding: SPACING.lg }}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{venue.name}</Text>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={normalize(13)} color={COLORS.amber} />
            <Text style={styles.ratingPillText}>{venue.rating}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addressRow} onPress={openMaps}>
          <Ionicons name="location-outline" size={normalize(16)} color={COLORS.inkSoft} />
          <Text style={styles.addressText}>{venue.address}, {venue.locality} · {venue.distanceKm} km away</Text>
        </TouchableOpacity>

        <View style={styles.amenityRow}>
          {venue.amenities.map(a => (
            <View key={a} style={styles.amenityChip}>
              <Text style={styles.amenityText}>{a}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Pick a day</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
          {DAYS.map(d => (
            <Chip
              key={d}
              label={d}
              active={day === d}
              onPress={() => {
                setDay(d);
                setTime(null);
              }}
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>Pick a time</Text>
        <View style={styles.slotGrid}>
          {daySlots.map(sl => (
            <TouchableOpacity
              key={sl.time}
              disabled={sl.status !== 'available'}
              onPress={() => setTime(sl.time)}
              style={[
                styles.slotChip,
                sl.status !== 'available' && styles.slotDisabled,
                time === sl.time && styles.slotSelected,
              ]}
            >
              <Text style={[styles.slotText, sl.status !== 'available' && styles.slotTextDim, time === sl.time && styles.slotTextSelected]}>
                {sl.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.rowBetween, { marginTop: SPACING.lg }]}>
          <Text style={styles.sectionLabelInline}>Price</Text>
          <Text style={styles.priceValue}>{CURRENCY}{venue.pricePerHour}/hr</Text>
        </View>

        <PrimaryButton
          title={time ? `Book ${day}, ${time}` : 'Select a time slot'}
          onPress={() => navigation.navigate('BookingConfirm', { courtId: venue.id, day, time })}
          disabled={!time}
          style={{ marginTop: SPACING.lg }}
        />
      </View>
    </ScrollView>
  );
}

export function BookingConfirmScreen({ route, navigation }: { route: any; navigation: any }) {
  const { courtId, day, time } = route.params;
  const { courts, addBooking } = useAppData();
  const venue = courts.find(c => c.id === courtId);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  if (!venue) return <EmptyState title="Court not found" />;

  const commission = Math.round(venue.pricePerHour * 0.1);
  const total = venue.pricePerHour + commission;

  const confirm = () => {
    setConfirming(true);
    setTimeout(() => {
      const booking: Booking = {
        id: `b${Date.now()}`,
        venueId: venue.id,
        venueName: venue.name,
        venueImage: venue.image,
        playerName: 'You',
        day,
        time,
        date: 'This week',
        price: venue.pricePerHour,
        commission,
        total,
        status: 'upcoming',
      };
      addBooking(booking);
      setConfirming(false);
      setDone(true);
    }, 900);
  };

  if (done) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={normalize(36)} color="#fff" />
        </View>
        <Text style={styles.title}>Booking confirmed!</Text>
        <Text style={styles.addressText}>{venue.name} · {day}, {time}</Text>
        <PrimaryButton title="View my bookings" onPress={() => navigation.navigate('MyBookings')} style={{ marginTop: SPACING.xl, width: '100%' }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, padding: SPACING.lg }}>
      <Text style={styles.title}>Confirm booking</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryVenue}>{venue.name}</Text>
        <Text style={styles.addressText}>{day}, {time} · {venue.locality}</Text>
        <View style={styles.divider} />
        <View style={styles.rowBetween}>
          <Text style={styles.addressText}>Court fee</Text>
          <Text style={styles.addressText}>{CURRENCY}{venue.pricePerHour}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.addressText}>Platform commission (10%)</Text>
          <Text style={styles.addressText}>{CURRENCY}{commission}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.rowBetween}>
          <Text style={styles.priceValue}>Total</Text>
          <Text style={styles.priceValue}>{CURRENCY}{total}</Text>
        </View>
      </View>
      <Text style={styles.mockNote}>
        Payments aren't wired to a real gateway yet - this simulates success. Hook up Razorpay/Stripe in services/api.ts when the backend is ready.
      </Text>
      <PrimaryButton title={`Pay ${CURRENCY}${total}`} onPress={confirm} loading={confirming} style={{ marginTop: SPACING.lg }} />
    </View>
  );
}

export function MyBookingsScreen() {
  const { myBookings } = useAppData();
  const insets = useSafeAreaInsets();
  const upcoming = myBookings.filter(b => b.status === 'upcoming');
  const past = myBookings.filter(b => b.status !== 'upcoming');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: SPACING.lg, paddingTop: insets.top + hp(1.5) }}>
      <Text style={styles.title}>My bookings</Text>
      <Text style={styles.sectionLabel}>Upcoming</Text>
      {upcoming.length === 0 && <EmptyState title="No upcoming bookings" body="Book a court to see it here." />}
      {upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
      {past.length > 0 && <Text style={styles.sectionLabel}>Past</Text>}
      {past.map(b => <BookingCard key={b.id} booking={b} />)}
    </ScrollView>
  );
}

const successIconSize = wp(19);

const styles = StyleSheet.create({
  listHeader: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  title: { ...FONT.h1, color: COLORS.ink },
  filterRow: { marginBottom: SPACING.sm, flexGrow: 0 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroImage: { width: '100%', height: hp(27), backgroundColor: COLORS.line },
  ratingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.amberTint, paddingHorizontal: s(10), paddingVertical: s(5), borderRadius: RADIUS.full },
  ratingPillText: { ...FONT.small, marginLeft: s(4), color: COLORS.ink },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: s(8) },
  addressText: { ...FONT.small, color: COLORS.inkSoft, marginLeft: s(4) },
  amenityRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.md, gap: s(8) },
  amenityChip: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.line, borderRadius: RADIUS.full, paddingHorizontal: s(12), paddingVertical: s(6) },
  amenityText: { ...FONT.tiny, color: COLORS.ink },
  sectionLabel: { ...FONT.bodyMedium, color: COLORS.ink, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  sectionLabelInline: { ...FONT.bodyMedium, color: COLORS.ink },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: s(8) },
  slotChip: { borderWidth: 1, borderColor: COLORS.line, borderRadius: RADIUS.md, paddingVertical: s(10), paddingHorizontal: s(12), backgroundColor: COLORS.surface },
  slotDisabled: { backgroundColor: '#F1F1EE', borderColor: '#F1F1EE' },
  slotSelected: { backgroundColor: COLORS.player, borderColor: COLORS.player },
  slotText: { ...FONT.small, color: COLORS.ink },
  slotTextDim: { color: COLORS.inkFaint, textDecorationLine: 'line-through' },
  slotTextSelected: { color: '#fff' },
  priceValue: { ...FONT.h3, color: COLORS.ink },
  successContainer: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  successIcon: { width: successIconSize, height: successIconSize, borderRadius: successIconSize / 2, backgroundColor: COLORS.success, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  summaryCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.line, gap: s(8) },
  summaryVenue: { ...FONT.h3, color: COLORS.ink },
  divider: { height: 1, backgroundColor: COLORS.line, marginVertical: s(6) },
  mockNote: { ...FONT.tiny, color: COLORS.inkFaint, marginTop: SPACING.md },
});
