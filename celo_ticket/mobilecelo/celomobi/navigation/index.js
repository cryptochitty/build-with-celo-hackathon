import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import SplashScreen from '../screen/SplashScreen';

const AuthStatus = (props, navigation) => {
  const [isLoading, setIsLoading] = useState(true);

  return isLoading ? (
    <SplashScreen />
  ) : (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};

export default AuthStatus;
