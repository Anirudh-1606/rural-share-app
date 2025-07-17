import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
import AuthScreen from '../screens/AuthScreen';

export default function RootNavigator() {
  // Get authentication state from Redux
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  return (
    <NavigationContainer>
    {isAuthenticated ? (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    ) : (
      <AuthScreen />
    )}
    </NavigationContainer>
  );
}