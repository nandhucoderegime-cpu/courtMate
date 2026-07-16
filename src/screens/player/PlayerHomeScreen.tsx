import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { SectionHeader } from '../../components/UI';
import { CourtCard, PlayerCard } from '../../components/Cards';
import { s, hp, wp, normalize } from '../../utils/responsive';

export default function PlayerHomeScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const { courts, players, notifications } = useAppData();
  const unread = notifications.filter(n => !n.read).length;
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
      <View style={[styles.header, { paddingTop: insets.top + hp(1.5) }]}>
        <View>
          <Text style={styles.greeting}>Hey {user?.name?.split(' ')[0] || 'there'} 👋</Text>
          <Text style={styles.subGreeting}>Ready for a game today?</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={normalize(22)} color={COLORS.ink} />
          {unread > 0 && <View style={styles.dot} />}
        </TouchableOpacity>
      </View>

      <View style={styles.quickRow}>
        <TouchableOpacity style={[styles.quickCard, { backgroundColor: COLORS.playerTint }]} onPress={() => navigation.navigate('Courts')}>
          <Ionicons name="location" size={normalize(22)} color={COLORS.playerDark} />
          <Text style={[styles.quickText, { color: COLORS.playerDark }]}>Find a court</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickCard, { backgroundColor: COLORS.venueTint }]} onPress={() => navigation.navigate('Matches')}>
          <Ionicons name="people" size={normalize(22)} color={COLORS.venueDark} />
          <Text style={[styles.quickText, { color: COLORS.venueDark }]}>Find a player</Text>
        </TouchableOpacity>
      </View>

      <SectionHeader title="Courts near you" action="See all" onAction={() => navigation.navigate('Courts')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.lg }}>
        {courts.slice(0, 5).map(c => (
          <View key={c.id} style={{ width: wp(58), marginRight: SPACING.md }}>
            <CourtCard venue={c} onPress={() => navigation.navigate('CourtDetail', { courtId: c.id })} />
          </View>
        ))}
      </ScrollView>

      <SectionHeader title="Players who match you" action="See all" onAction={() => navigation.navigate('Matches')} />
      <View style={{ paddingHorizontal: SPACING.lg }}>
        {players.slice(0, 2).map(p => (
          <PlayerCard key={p.id} player={p} onConnect={() => navigation.navigate('Matches')} />
        ))}
      </View>
    </ScrollView>
  );
}

const bellSize = s(42);

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  greeting: { ...FONT.h2, color: COLORS.ink },
  subGreeting: { ...FONT.body, color: COLORS.inkSoft, marginTop: s(2) },
  bellBtn: { width: bellSize, height: bellSize, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.line },
  dot: { position: 'absolute', top: s(10), right: s(11), width: s(8), height: s(8), borderRadius: s(4), backgroundColor: COLORS.danger },
  quickRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.md, marginBottom: SPACING.lg },
  quickCard: { flex: 1, borderRadius: RADIUS.lg, padding: SPACING.md, height: hp(11), justifyContent: 'space-between' },
  quickText: { ...FONT.bodyMedium },
});
