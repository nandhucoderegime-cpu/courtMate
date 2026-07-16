import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS } from '../../theme/theme';
import { SPORTS } from '../../data/mockData';
import { useAppData } from '../../context/AppDataContext';
import { PlayerCard } from '../../components/Cards';
import { Chip, EmptyState } from '../../components/UI';
import { PlayerProfile } from '../../types';
import { s, hp, wp, normalize } from '../../utils/responsive';

export function MatchingScreen({ navigation }: { navigation: any }) {
  const { players, startChat } = useAppData();
  const insets = useSafeAreaInsets();
  const [sport, setSport] = useState<string | null>(null);
  const filtered = sport ? players.filter(p => p.sport === sport) : players;

  const connect = (player: PlayerProfile) => {
    const chatId = startChat(player);
    navigation.navigate('ChatThread', { chatId });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + hp(1.5) }]}>
        <Text style={styles.title}>Find players</Text>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={['All', ...SPORTS]}
        keyExtractor={s => s}
        style={{ flexGrow: 0, marginBottom: SPACING.sm }}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
        renderItem={({ item }) => (
          <Chip label={item} active={item === 'All' ? !sport : sport === item} onPress={() => setSport(item === 'All' ? null : item)} color={COLORS.venue} />
        )}
      />
      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => <PlayerCard player={item} onConnect={() => connect(item)} />}
        ListEmptyComponent={<EmptyState title="No players for this sport yet" />}
      />
    </View>
  );
}

export function ChatListScreen({ navigation }: { navigation: any }) {
  const { chats } = useAppData();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + hp(1.5) }]}>
        <Text style={styles.title}>Chats</Text>
      </View>
      <FlatList
        data={chats}
        keyExtractor={c => c.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        ListEmptyComponent={<EmptyState title="No conversations yet" body="Connect with a player to start planning a game." />}
        renderItem={({ item }) => {
          const last = item.messages[item.messages.length - 1];
          return (
            <TouchableOpacity style={styles.chatRow} onPress={() => navigation.navigate('ChatThread', { chatId: item.id })}>
              <Image source={{ uri: item.participant.avatar }} style={styles.chatAvatar} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.chatName}>{item.participant.name}</Text>
                <Text style={styles.chatPreview} numberOfLines={1}>{last?.text}</Text>
              </View>
              <Text style={styles.chatTime}>{last?.time}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export function ChatThreadScreen({ route }: { route: any }) {
  const { chatId } = route.params;
  const { chats, sendMessage } = useAppData();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const chat = chats.find(c => c.id === chatId);

  if (!chat) return <EmptyState title="Conversation not found" />;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={s(90)}>
      <View style={[styles.threadHeader, { paddingTop: insets.top + hp(1.5) }]}>
        <Image source={{ uri: chat.participant.avatar }} style={styles.chatAvatar} />
        <View style={{ marginLeft: SPACING.sm }}>
          <Text style={styles.chatName}>{chat.participant.name}</Text>
          <Text style={styles.chatPreview}>{chat.participant.sport} · {chat.participant.skill}</Text>
        </View>
      </View>
      <FlatList
        data={chat.messages}
        keyExtractor={m => m.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.senderId === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
            <Text style={[styles.bubbleText, item.senderId === 'me' && { color: '#fff' }]}>{item.text}</Text>
          </View>
        )}
      />
      <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, s(8)) }]}>
        <TextInput
          style={styles.chatInput}
          value={text}
          onChangeText={setText}
          placeholder="Suggest a time, court, or say hi"
          placeholderTextColor={COLORS.inkFaint}
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => {
            if (text.trim()) {
              sendMessage(chat.id, text.trim());
              setText('');
            }
          }}
        >
          <Ionicons name="send" size={normalize(18)} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const chatAvatarSize = wp(12.5);
const sendBtnSize = s(42);

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  title: { ...FONT.h1, color: COLORS.ink },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  chatAvatar: { width: chatAvatarSize, height: chatAvatarSize, borderRadius: RADIUS.full, backgroundColor: COLORS.line },
  chatName: { ...FONT.bodyMedium, color: COLORS.ink },
  chatPreview: { ...FONT.small, color: COLORS.inkSoft, marginTop: s(2) },
  chatTime: { ...FONT.tiny, color: COLORS.inkFaint },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    backgroundColor: COLORS.surface,
  },
  bubble: { maxWidth: '78%', padding: s(12), borderRadius: RADIUS.lg, marginBottom: SPACING.sm },
  bubbleMe: { backgroundColor: COLORS.player, alignSelf: 'flex-end', borderBottomRightRadius: s(4) },
  bubbleThem: { backgroundColor: COLORS.surface, alignSelf: 'flex-start', borderWidth: 1, borderColor: COLORS.line, borderBottomLeftRadius: s(4) },
  bubbleText: { ...FONT.body, color: COLORS.ink },
  inputRow: { flexDirection: 'row', padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.line, backgroundColor: COLORS.surface, alignItems: 'center' },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS.full,
    paddingHorizontal: s(16),
    paddingVertical: s(10),
    marginRight: SPACING.sm,
    fontSize: normalize(15),
    color: COLORS.ink,
  },
  sendBtn: { width: sendBtnSize, height: sendBtnSize, borderRadius: RADIUS.full, backgroundColor: COLORS.player, alignItems: 'center', justifyContent: 'center' },
});
