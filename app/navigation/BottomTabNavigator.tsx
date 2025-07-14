import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import Text from '../components/Text';
import { COLORS } from '../utils';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ label }: { label: string }) {
  return <Text style={{ flex: 1, textAlign: 'center', marginTop: 100 }}>{label} Screen</Text>;
}
const BookingsScreen = () => <PlaceholderScreen label="Bookings" />;
const NotificationsScreen = () => <PlaceholderScreen label="Notifications" />;
const ProfileScreen = () => <PlaceholderScreen label="Profile" />;

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.PRIMARY.MAIN,
        tabBarInactiveTintColor: COLORS.TEXT.SECONDARY,
        tabBarStyle: {
          backgroundColor: COLORS.BACKGROUND.NAV,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: 60,
        },
        tabBarIcon: ({ color }) => {
          let iconName = '';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Bookings') iconName = 'calendar-outline';
          else if (route.name === 'Notifications') iconName = 'notifications-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarLabel: ({ color }) => (
          <Text variant="label" color={color} style={{ fontSize: 12 }}>{route.name}</Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
} 