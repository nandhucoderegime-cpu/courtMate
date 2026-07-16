import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, FONT } from '../theme/theme';
import { s, normalize } from '../utils/responsive';

export function PrimaryButton({
  title,
  onPress,
  color = COLORS.player,
  loading = false,
  disabled = false,
  style,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.btn, { backgroundColor: color, opacity: disabled ? 0.5 : 1 }, style]}
      activeOpacity={0.85}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function SecondaryButton({
  title,
  onPress,
  color = COLORS.player,
  style,
}: {
  title: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btnOutline, { borderColor: color }, style]} activeOpacity={0.7}>
      <Text style={[styles.btnOutlineText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Badge({ label, color, tint }: { label: string; color: string; tint: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: tint }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
  color = COLORS.player,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}>
      <Text style={[styles.chipText, active && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function EmptyState({ icon, title, body }: { icon?: React.ReactNode; title: string; body?: string }) {
  return (
    <View style={styles.empty}>
      {icon}
      <Text style={styles.emptyTitle}>{title}</Text>
      {body ? <Text style={styles.emptyBody}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: s(14), borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', ...FONT.bodyMedium },
  btnOutline: { paddingVertical: s(13), borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  btnOutlineText: { ...FONT.bodyMedium },
  badge: { paddingHorizontal: s(10), paddingVertical: s(4), borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  badgeText: { ...FONT.tiny },
  chip: {
    flexDirection: 'row',
    paddingHorizontal: s(14),
    paddingVertical: s(8),
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginRight: s(8),
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: { ...FONT.small, color: COLORS.ink, includeFontPadding: false, textAlignVertical: 'center' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionTitle: { ...FONT.h3, color: COLORS.ink },
  sectionAction: { ...FONT.small, color: COLORS.inkSoft },
  empty: { alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  emptyTitle: { ...FONT.bodyMedium, color: COLORS.ink, marginTop: SPACING.sm, textAlign: 'center' },
  emptyBody: { ...FONT.small, color: COLORS.inkSoft, marginTop: s(4), textAlign: 'center' },
});
