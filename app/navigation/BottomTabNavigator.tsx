import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ProviderScreen from '../screens/ProviderScreen';
import Text from '../components/Text'; // Custom Text component
import { COLORS, BORDER_RADIUS, SHADOWS } from '../utils'; // Your theme constants

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
    return null; // Or loading spinner
  }

  return (
    <Tab.Navigator
      initialRouteName={defaultTab === 'provider' ? 'Provider' : 'Seeker'}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          height: 60,
          borderRadius: BORDER_RADIUS.XL || 30,
          backgroundColor: COLORS.BACKGROUND.NAV,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 12,
          ...SHADOWS.MD,
          borderTopWidth: 0,
          elevation: 8,
        },
        tabBarIcon: ({ focused }) => {
          let iconName = '';
          let label = '';

          if (route.name === 'Seeker') {
            iconName = 'search-outline';
            label = 'Seeker';
          } else if (route.name === 'Provider') {
            iconName = 'briefcase-outline';
            label = 'Provider';
          } else if (route.name === 'Bookings') {
            iconName = 'calendar-outline';
            label = 'Bookings';
          } else if (route.name === 'Notifications') {
            iconName = 'notifications-outline';
            label = 'Notifications';
          }

          return (
            <View
              style={{
                flexDirection: 'column',
                backgroundColor: focused ? COLORS.PRIMARY.MAIN : 'transparent',
                paddingHorizontal: focused ? 5 : 0,
                paddingVertical: focused ? 2 : 0,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: focused ? 100 : undefined,
                maxHeight: 60,
                minHeight: 60,
                marginLeft: 5,
                alignSelf: 'center',
              }}
            >
              <Ionicons
                name={iconName}
                size={20}
                color={focused ? COLORS.BACKGROUND.NAV : COLORS.TEXT.SECONDARY}
              />
              {focused && (
                <Text
                  style={{
                    color: COLORS.BACKGROUND.NAV,
                    marginLeft: 6,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {label}
                  
                </Text>
                

                  
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Seeker" component={HomeScreen} />
      <Tab.Screen name="Provider" component={ProviderScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}
