import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';
import VenueDashboardScreen from '../screens/venue/VenueDashboardScreen';
import { MyVenuesScreen, VenueFormScreen, SlotCalendarScreen, VenueBookingsScreen } from '../screens/venue/VenueScreens';
import { NotificationsScreen, SettingsScreen, ProfileScreen } from '../screens/shared/SharedScreens';
import { hp, normalize, s } from '../utils/responsive';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'grid',
  Venues: 'business',
  Calendar: 'calendar',
  Bookings: 'receipt',
  Profile: 'person',
};

function VenueTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.venue,
        tabBarInactiveTintColor: COLORS.inkFaint,
        tabBarStyle: { borderTopColor: COLORS.line, height: hp(7.5), minHeight: 60, paddingBottom: hp(1), paddingTop: hp(1) },
        tabBarIcon: ({ color, size }) => <Ionicons name={TAB_ICON[route.name]} size={normalize(size - 2)} color={color} />,
        tabBarLabelStyle: { fontSize: normalize(10), marginBottom: s(2) }
      })}
    >
      <Tab.Screen name="Dashboard" component={VenueDashboardScreen} />
      <Tab.Screen name="Venues" component={MyVenuesScreen} />
      <Tab.Screen name="Calendar" component={SlotCalendarScreen} />
      <Tab.Screen name="Bookings" component={VenueBookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function VenueNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={VenueTabs} />
      <Stack.Screen name="VenueForm" component={VenueFormScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
