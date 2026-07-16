import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { EmptyState, Badge } from '../../components/UI';

const NOTIF_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  booking: 'calendar',
  match: 'people',
  system: 'megaphone',
};

export function NotificationsScreen() {
  const { notifications, markNotificationsRead } = useAppData();

  useEffect(() => {
    markNotificationsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={n => n.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        ListEmptyComponent={<EmptyState title="You're all caught up" />}
        renderItem={({ item }) => (
          <View style={styles.notifRow}>
            <View style={styles.notifIcon}>
              <Ionicons name={NOTIF_ICON[item.type]} size={18} color={COLORS.player} />
            </View>
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifBody}>{item.body}</Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export function SettingsScreen() {
  const { logout } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: SPACING.lg, paddingTop: 60 }}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.settingsGroup}>Notifications</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Push notifications</Text>
        <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: COLORS.player }} />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Email updates</Text>
        <Switch value={emailEnabled} onValueChange={setEmailEnabled} trackColor={{ true: COLORS.player }} />
      </View>

      <Text style={styles.settingsGroup}>About</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Version</Text>
        <Text style={styles.settingValue}>1.0.0 (frontend preview)</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() =>
          Alert.alert('Log out', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log out', style: 'destructive', onPress: logout },
          ])
        }
      >
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export function ProfileScreen({ navigation }: { navigation: any }) {
  const { user, switchRole } = useAuth();
  const isPlayer = user?.role === 'player';
  const accent = isPlayer ? COLORS.player : COLORS.venue;
  const accentTint = isPlayer ? COLORS.playerTint : COLORS.venueTint;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
      <View style={[styles.profileHeader, { backgroundColor: accentTint }]}>
        <Image source={{ uri: user?.avatar }} style={styles.profileAvatar} />
        <Text style={styles.profileName}>{user?.name}</Text>
        <Badge label={isPlayer ? 'Player' : 'Venue Owner'} color={accent} tint={COLORS.surface} />
        {isPlayer && <Text style={styles.profileMeta}>{user?.sport} · {user?.skill} · {user?.locality}</Text>}
      </View>

      <View style={styles.menuList}>
        <MenuItem icon="notifications-outline" label="Notifications" onPress={() => navigation.navigate('Notifications')} />
        <MenuItem icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Settings')} />
        <MenuItem icon="swap-horizontal-outline" label={`Switch to ${isPlayer ? 'Venue Owner' : 'Player'} mode`} onPress={switchRole} highlight />
      </View>
      <Text style={styles.footnote}>One account, two modes - switch anytime without logging out.</Text>
    </ScrollView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  highlight,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  highlight?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color={highlight ? COLORS.player : COLORS.ink} />
      <Text style={[styles.menuLabel, highlight && { color: COLORS.player, fontWeight: '700' }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={COLORS.inkFaint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.lg, paddingTop: 60, paddingBottom: SPACING.sm },
  title: { ...FONT.h1, color: COLORS.ink },
  notifRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.line },
  notifIcon: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: COLORS.playerTint, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { ...FONT.bodyMedium, color: COLORS.ink },
  notifBody: { ...FONT.small, color: COLORS.inkSoft, marginTop: 2 },
  notifTime: { ...FONT.tiny, color: COLORS.inkFaint, marginTop: 4 },
  settingsGroup: { ...FONT.small, color: COLORS.inkSoft, marginTop: SPACING.lg, marginBottom: SPACING.sm, textTransform: 'uppercase' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  settingLabel: { ...FONT.body, color: COLORS.ink },
  settingValue: { ...FONT.small, color: COLORS.inkSoft },
  logoutBtn: { marginTop: SPACING.xl, alignItems: 'center', padding: SPACING.md },
  logoutText: { ...FONT.bodyMedium, color: COLORS.danger },
  profileHeader: { alignItems: 'center', paddingTop: 70, paddingBottom: SPACING.xl, gap: 8 },
  profileAvatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: COLORS.surface, marginBottom: 4 },
  profileName: { ...FONT.h2, color: COLORS.ink },
  profileMeta: { ...FONT.small, color: COLORS.inkSoft },
  menuList: { padding: SPACING.lg },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.line,
    gap: SPACING.md,
  },
  menuLabel: { flex: 1, ...FONT.body, color: COLORS.ink },
  footnote: { ...FONT.tiny, color: COLORS.inkFaint, textAlign: 'center', paddingHorizontal: SPACING.lg },
});
