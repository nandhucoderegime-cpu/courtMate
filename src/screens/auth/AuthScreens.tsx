import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, FONT } from '../../theme/theme';
import { PrimaryButton, SecondaryButton } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

export function WelcomeScreen({ navigation }: { navigation: any }) {
  const { loginAs } = useAuth();
  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.brand}>
        <View style={styles.logoDot}>
          <Ionicons name="tennisball" size={30} color="#fff" />
        </View>
        <Text style={styles.brandName}>CourtMate</Text>
        <Text style={styles.brandTag}>Find a court. Find a player. Play today.</Text>
      </View>

      <View style={styles.roleCards}>
        <TouchableOpacity
          style={[styles.roleCard, { backgroundColor: COLORS.playerTint, borderColor: COLORS.player }]}
          onPress={() => loginAs('player')}
        >
          <Ionicons name="people" size={26} color={COLORS.playerDark} />
          <Text style={[styles.roleTitle, { color: COLORS.playerDark }]}>I'm a Player</Text>
          <Text style={styles.roleBody}>Book courts and find people to play with</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleCard, { backgroundColor: COLORS.venueTint, borderColor: COLORS.venue }]}
          onPress={() => loginAs('venue_owner')}
        >
          <Ionicons name="business" size={26} color={COLORS.venueDark} />
          <Text style={[styles.roleTitle, { color: COLORS.venueDark }]}>I'm a Venue Owner</Text>
          <Text style={styles.roleBody}>List courts and manage bookings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.authLinks}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Log in with email</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>Create an account</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.switchNote}>You can switch between Player and Venue Owner mode anytime from Profile.</Text>
    </View>
  );
}

export function LoginScreen({ navigation }: { navigation: any }) {
  const { loginAs } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'player' | 'venue_owner'>('player');
  const canSubmit = email.includes('@') && password.length >= 4;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.formTitle}>Log in</Text>
        <Text style={styles.formSub}>No backend is connected yet - any valid-looking details will sign you in.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={COLORS.inkFaint}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor={COLORS.inkFaint}
        />

        <Text style={styles.label}>Continue as</Text>
        <View style={{ flexDirection: 'row', marginBottom: SPACING.lg }}>
          <TouchableOpacity
            style={[styles.roleToggle, role === 'player' && { backgroundColor: COLORS.player, borderColor: COLORS.player }]}
            onPress={() => setRole('player')}
          >
            <Text style={[styles.roleToggleText, role === 'player' && { color: '#fff' }]}>Player</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleToggle, role === 'venue_owner' && { backgroundColor: COLORS.venue, borderColor: COLORS.venue }]}
            onPress={() => setRole('venue_owner')}
          >
            <Text style={[styles.roleToggleText, role === 'venue_owner' && { color: '#fff' }]}>Venue Owner</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton
          title="Log in"
          onPress={() => loginAs(role, email.split('@')[0] || 'You')}
          disabled={!canSubmit}
          color={role === 'player' ? COLORS.player : COLORS.venue}
        />
        <SecondaryButton title="Back" onPress={() => navigation.goBack()} style={{ marginTop: SPACING.md }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function SignupScreen({ navigation }: { navigation: any }) {
  const { loginAs } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'player' | 'venue_owner'>('player');
  const canSubmit = name.trim().length > 1 && email.includes('@') && password.length >= 4;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.formTitle}>Create account</Text>
        <Text style={styles.formSub}>This creates a local mock session - wire it up to your API in services/api.ts later.</Text>

        <Text style={styles.label}>Full name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={COLORS.inkFaint} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={COLORS.inkFaint}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor={COLORS.inkFaint}
        />

        <Text style={styles.label}>I am a</Text>
        <View style={{ flexDirection: 'row', marginBottom: SPACING.lg }}>
          <TouchableOpacity
            style={[styles.roleToggle, role === 'player' && { backgroundColor: COLORS.player, borderColor: COLORS.player }]}
            onPress={() => setRole('player')}
          >
            <Text style={[styles.roleToggleText, role === 'player' && { color: '#fff' }]}>Player</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleToggle, role === 'venue_owner' && { backgroundColor: COLORS.venue, borderColor: COLORS.venue }]}
            onPress={() => setRole('venue_owner')}
          >
            <Text style={[styles.roleToggleText, role === 'venue_owner' && { color: '#fff' }]}>Venue Owner</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton
          title="Create account"
          onPress={() => loginAs(role, name)}
          disabled={!canSubmit}
          color={role === 'player' ? COLORS.player : COLORS.venue}
        />
        <SecondaryButton title="Back" onPress={() => navigation.goBack()} style={{ marginTop: SPACING.md }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: SPACING.lg,
    paddingTop: 90,
    paddingBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  brand: { alignItems: 'center' },
  logoDot: { width: 64, height: 64, borderRadius: 20, backgroundColor: COLORS.player, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  brandName: { ...FONT.h1, color: COLORS.ink },
  brandTag: { ...FONT.body, color: COLORS.inkSoft, marginTop: 6, textAlign: 'center' },
  roleCards: { gap: SPACING.md },
  roleCard: { borderWidth: 1.5, borderRadius: RADIUS.lg, padding: SPACING.lg },
  roleTitle: { ...FONT.h3, marginTop: SPACING.sm },
  roleBody: { ...FONT.small, color: COLORS.inkSoft, marginTop: 4 },
  authLinks: { alignItems: 'center', gap: SPACING.sm },
  linkText: { ...FONT.bodyMedium, color: COLORS.ink, textDecorationLine: 'underline' },
  switchNote: { ...FONT.tiny, color: COLORS.inkFaint, textAlign: 'center', marginTop: SPACING.sm },
  formContainer: { padding: SPACING.lg, paddingTop: 70 },
  formTitle: { ...FONT.h1, color: COLORS.ink, marginBottom: 6 },
  formSub: { ...FONT.small, color: COLORS.inkSoft, marginBottom: SPACING.lg },
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
  roleToggle: { flex: 1, borderWidth: 1, borderColor: COLORS.line, borderRadius: RADIUS.md, paddingVertical: 10, alignItems: 'center', marginRight: 8 },
  roleToggleText: { ...FONT.bodyMedium, color: COLORS.ink },
});
