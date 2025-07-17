import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ProviderScreen from '../screens/ProviderScreen';
import Text from '../components/Text';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../utils';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ label }: { label: string }) {
  return <Text style={{ flex: 1, textAlign: 'center', marginTop: 100 }}>{label} Screen</Text>;
}

const BookingsScreen = () => <PlaceholderScreen label="Bookings" />;
const NotificationsScreen = () => <PlaceholderScreen label="Notifications" />;

export default function BottomTabNavigator() {
  const [defaultTab, setDefaultTab] = useState<'seeker' | 'provider'>('seeker');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const savedTab = await AsyncStorage.getItem('defaultTab');
        if (savedTab === 'provider') {
          setDefaultTab('provider');
        }
      } catch (error) {
        console.error('Error loading tab preference:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPreference();
  }, []);

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Tab.Navigator
      initialRouteName={defaultTab === 'provider' ? 'Provider' : 'Seeker'}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.PRIMARY.MAIN,
        tabBarInactiveTintColor: COLORS.TEXT.SECONDARY,
        tabBarStyle: {
          backgroundColor: COLORS.BACKGROUND.NAV,
          borderTopLeftRadius: BORDER_RADIUS.LG,
          borderTopRightRadius: BORDER_RADIUS.LG,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          ...SHADOWS.MD,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName = '';
          if (route.name === 'Seeker') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Provider') iconName = focused ? 'briefcase' : 'briefcase-outline';
          else if (route.name === 'Bookings') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Notifications') iconName = focused ? 'notifications' : 'notifications-outline';
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarLabel: ({ color, focused }) => (
          <Text 
            variant="caption" 
            weight={focused ? 'semibold' : 'regular'} 
            color={color} 
            style={{ fontSize: 12, marginTop: -2 }}
          >
            {route.name}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Seeker" component={HomeScreen} />
      <Tab.Screen name="Provider" component={ProviderScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}