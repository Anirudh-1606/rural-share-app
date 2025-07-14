import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import RootNavigator from './app/navigation/RootNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
