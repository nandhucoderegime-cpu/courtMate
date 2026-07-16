// ---------------------------------------------------------------------------
// CHAT SERVICE
// Get threads, send messages, start new conversations. All "Confirm plans"
// happens here — once two players agree on a time/court, the booking flow
// picks up from venue services.
// ---------------------------------------------------------------------------

import { ChatThread, ChatMessage, PlayerProfile } from '../../types';
import { initialChats } from '../../data/mockData';
import { delay } from '../gateway/apiClient';

export async function getThreads(_userId: string): Promise<ChatThread[]> {
  // TODO: GET /api/chats?userId=...
  return delay(initialChats);
}

export async function getThread(chatId: string): Promise<ChatThread | undefined> {
  // TODO: GET /api/chats/:chatId
  return delay(initialChats.find(c => c.id === chatId));
}

export function createMessage(chatId: string, senderId: string, text: string): ChatMessage {
  return {
    id: `m${Date.now()}`,
    senderId,
    text,
    time: 'Just now',
  };
}

export async function sendMessage(
  chatId: string,
  text: string,
): Promise<ChatMessage> {
  // TODO: POST /api/chats/:chatId/messages { text }
  const msg = createMessage(chatId, 'me', text);
  return delay(msg);
}

export function createThread(player: PlayerProfile): ChatThread {
  return {
    id: `ch${Date.now()}`,
    participant: player,
    messages: [
      {
        id: `m${Date.now()}`,
        senderId: player.id,
        text: `Hi! Up for a ${player.sport.toLowerCase()} game sometime?`,
        time: 'Just now',
      },
    ],
  };
}

export async function startThread(
  player: PlayerProfile,
): Promise<ChatThread> {
  // TODO: POST /api/chats { participantId: player.id }
  return delay(createThread(player));
}
