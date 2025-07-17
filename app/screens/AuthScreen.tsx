import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import OTPVerificationScreen from './OTPVerificationScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';

const AuthScreen = () => {
  // Get current screen from Redux state
  const currentScreen = useSelector((state: RootState) => state.auth.currentScreen);
  
  // Render appropriate screen based on current screen state
  switch (currentScreen) {
    case 'signIn':
      return <SignInScreen />;
    case 'signUp':
      return <SignUpScreen />;
    case 'otp':
      return <OTPVerificationScreen />;
    case 'forgotPassword':
      return <ForgotPasswordScreen />;
    default:
      return <SignInScreen />;
  }
};

export default AuthScreen;
