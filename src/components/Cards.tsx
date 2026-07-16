import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, FONT, CURRENCY } from '../theme/theme';
import { Venue, PlayerProfile, Booking, BookingStatus } from '../types';
import { Badge } from './UI';

export function CourtCard({ venue, onPress }: { venue: Venue; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.courtCard} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: venue.image }} style={styles.courtImage} />
      <View style={styles.courtBody}>
        <View style={styles.rowBetween}>
          <Text style={styles.courtName} numberOfLines={1}>{venue.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={COLORS.amber} />
            <Text style={styles.ratingText}>{venue.rating}</Text>
          </View>
        </View>
        <Text style={styles.courtMeta}>{venue.sport} · {venue.locality} · {venue.distanceKm} km</Text>
        <Text style={styles.courtPrice}>
          {CURRENCY}{venue.pricePerHour}<Text style={styles.perHour}>/hr</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function PlayerCard({ player, onConnect }: { player: PlayerProfile; onConnect: () => void }) {
  return (
    <View style={styles.playerCard}>
      <Image source={{ uri: player.avatar }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: SPACING.md }}>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.courtMeta}>{player.sport} · {player.skill} · {player.locality}</Text>
        <Text style={styles.bio} numberOfLines={2}>{player.bio}</Text>
      </View>
      <TouchableOpacity style={styles.connectBtn} onPress={onConnect}>
        <Text style={styles.connectText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
}

const STATUS_STYLE: Record<BookingStatus, { color: string; tint: string; label: string }> = {
  upcoming: { color: COLORS.player, tint: COLORS.playerTint, label: 'Upcoming' },
  completed: { color: COLORS.inkSoft, tint: '#EFEFEC', label: 'Completed' },
  cancelled: { color: COLORS.danger, tint: COLORS.dangerTint, label: 'Cancelled' },
};

export function BookingCard({ booking }: { booking: Booking }) {
  const s = STATUS_STYLE[booking.status];
  return (
    <View style={styles.bookingCard}>
      <Image source={{ uri: booking.venueImage }} style={styles.bookingImage} />
      <View style={{ flex: 1, marginLeft: SPACING.md }}>
        <View style={styles.rowBetween}>
          <Text style={styles.playerName} numberOfLines={1}>{booking.venueName}</Text>
          <Badge label={s.label} color={s.color} tint={s.tint} />
        </View>
        <Text style={styles.courtMeta}>{booking.day}, {booking.date} · {booking.time}</Text>
        <Text style={styles.playerName}>
          {booking.playerName !== 'You' ? booking.playerName + ' · ' : ''}{CURRENCY}{booking.total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  courtCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  courtImage: { width: '100%', height: 140, backgroundColor: COLORS.line },
  courtBody: { padding: SPACING.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courtName: { ...FONT.bodyMedium, color: COLORS.ink, flex: 1, marginRight: SPACING.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { ...FONT.small, color: COLORS.ink, marginLeft: 3 },
  courtMeta: { ...FONT.small, color: COLORS.inkSoft, marginTop: 4, marginBottom: 8 },
  courtPrice: { ...FONT.h3, color: COLORS.ink },
  perHour: { ...FONT.small, color: COLORS.inkSoft },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  avatar: { width: 52, height: 52, borderRadius: RADIUS.full, backgroundColor: COLORS.line },
  playerName: { ...FONT.bodyMedium, color: COLORS.ink },
  bio: { ...FONT.small, color: COLORS.inkSoft, marginTop: 4 },
  connectBtn: { backgroundColor: COLORS.playerTint, paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full },
  connectText: { ...FONT.small, color: COLORS.playerDark, fontWeight: '700' },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  bookingImage: { width: 64, height: 64, borderRadius: RADIUS.md, backgroundColor: COLORS.line },
});
