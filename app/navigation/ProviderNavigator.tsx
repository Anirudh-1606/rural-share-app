import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProviderScreen from '../screens/ProviderScreen';
import CreateListingScreen from '../screens/CreateListingScreen';

const Stack = createStackNavigator();

const ProviderNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProviderHome" component={ProviderScreen} />
      <Stack.Screen name="CreateListing" component={CreateListingScreen} />
    </Stack.Navigator>
  );
};

export default ProviderNavigator;