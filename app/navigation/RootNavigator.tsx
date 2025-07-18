import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import AuthScreen from '../screens/AuthScreen';
import { checkAuth } from '../store/slices/authSlice';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from '../utils';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY.MAIN} />
      </View>
    );
  }
  
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.PRIMARY,
  },
});