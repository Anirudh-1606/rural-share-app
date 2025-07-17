import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './app/store';
import RootNavigator from './app/navigation/RootNavigator';
import '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

export default function App() {
  // Initialize Firebase when app starts
  

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </SafeAreaProvider>
  );
}
