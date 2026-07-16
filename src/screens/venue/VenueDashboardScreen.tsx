import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, CURRENCY } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { SectionHeader } from '../../components/UI';
import { BookingCard } from '../../components/Cards';

export default function VenueDashboardScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const { courts, venueBookings, notifications } = useAppData();
  // Mock simplification: the signed-in venue owner "owns" venues seeded with
  // ownerId 'owner1'. Once there's a real backend this would filter by user.id.
  const myVenues = courts.filter(c => c.ownerId === 'owner1');
  const upcomingCount = venueBookings.filter(b => b.status === 'upcoming').length;
  const revenue = venueBookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.price, 0);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi {user?.name?.split(' ')[0] || 'there'}</Text>
          <Text style={styles.subGreeting}>Here's how your venues are doing</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.ink} />
          {unread > 0 && <View style={styles.dot} />}
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{myVenues.length}</Text>
          <Text style={styles.statLabel}>Venues listed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{upcomingCount}</Text>
          <Text style={styles.statLabel}>Upcoming bookings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{CURRENCY}{revenue}</Text>
          <Text style={styles.statLabel}>Total revenue</Text>
        </View>
      </View>

      <View style={styles.quickRow}>
        <TouchableOpacity style={[styles.quickCard, { backgroundColor: COLORS.venueTint }]} onPress={() => navigation.navigate('VenueForm', {})}>
          <Ionicons name="add-circle" size={22} color={COLORS.venueDark} />
          <Text style={[styles.quickText, { color: COLORS.venueDark }]}>Add a venue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickCard, { backgroundColor: COLORS.playerTint }]} onPress={() => navigation.navigate('Calendar')}>
          <Ionicons name="calendar" size={22} color={COLORS.playerDark} />
          <Text style={[styles.quickText, { color: COLORS.playerDark }]}>Manage slots</Text>
        </TouchableOpacity>
      </View>

      <SectionHeader title="Recent bookings" action="See all" onAction={() => navigation.navigate('Bookings')} />
      <View style={{ paddingHorizontal: SPACING.lg }}>
        {venueBookings.slice(0, 3).map(b => <BookingCard key={b.id} booking={b} />)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: SPACING.lg, paddingTop: 60, paddingBottom: SPACING.lg },
  greeting: { ...FONT.h2, color: COLORS.ink },
  subGreeting: { ...FONT.body, color: COLORS.inkSoft, marginTop: 2 },
  bellBtn: { width: 42, height: 42, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.line },
  dot: { position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger },
  statsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center' },
  statValue: { ...FONT.h2, color: COLORS.ink },
  statLabel: { ...FONT.tiny, color: COLORS.inkSoft, marginTop: 4, textAlign: 'center' },
  quickRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.md, marginBottom: SPACING.lg },
  quickCard: { flex: 1, borderRadius: RADIUS.lg, padding: SPACING.md, height: 90, justifyContent: 'space-between' },
  quickText: { ...FONT.bodyMedium },
});
