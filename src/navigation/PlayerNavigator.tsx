import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';
import PlayerHomeScreen from '../screens/player/PlayerHomeScreen';
import { CourtListScreen, CourtDetailScreen, BookingConfirmScreen, MyBookingsScreen } from '../screens/player/CourtScreens';
import { MatchingScreen, ChatListScreen, ChatThreadScreen } from '../screens/player/SocialScreens';
import { NotificationsScreen, SettingsScreen, ProfileScreen } from '../screens/shared/SharedScreens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Courts: 'location',
  Matches: 'people',
  Chats: 'chatbubble-ellipses',
  Profile: 'person',
};

function PlayerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.player,
        tabBarInactiveTintColor: COLORS.inkFaint,
        tabBarStyle: { borderTopColor: COLORS.line, height: 60, paddingBottom: 8, paddingTop: 8 },
        tabBarIcon: ({ color, size }) => <Ionicons name={TAB_ICON[route.name]} size={size - 2} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={PlayerHomeScreen} />
      <Tab.Screen name="Courts" component={CourtListScreen} />
      <Tab.Screen name="Matches" component={MatchingScreen} />
      <Tab.Screen name="Chats" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function PlayerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={PlayerTabs} />
      <Stack.Screen name="CourtDetail" component={CourtDetailScreen} />
      <Stack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
