/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AuthStatus from './navigation';
import {Provider} from 'react-redux';
import {store} from './redux/rootReducer';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider style={{flex: 1}}>
        <AuthStatus />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
