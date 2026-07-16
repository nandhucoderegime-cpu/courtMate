import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { WelcomeScreen, LoginScreen, SignupScreen } from '../screens/auth/AuthScreens';
import PlayerNavigator from './PlayerNavigator';
import VenueNavigator from './VenueNavigator';

const AuthStack = createNativeStackNavigator();

function AuthFlow() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {!user ? <AuthFlow /> : user.role === 'player' ? <PlayerNavigator /> : <VenueNavigator />}
    </NavigationContainer>
  );
}
