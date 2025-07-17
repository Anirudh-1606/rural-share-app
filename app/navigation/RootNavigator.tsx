import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import BottomTabNavigator from './BottomTabNavigator';
import AuthScreen from '../screens/AuthScreen';

export default function RootNavigator() {
  // Get authentication state from Redux
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        // User is authenticated - show main app with bottom navigation
        <BottomTabNavigator />
      ) : (
        // User is not authenticated - show auth screens
        <AuthScreen />
      )}
    </NavigationContainer>
  );
}
