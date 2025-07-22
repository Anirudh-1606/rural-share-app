import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import Button from '../components/Button';
import {COLORS, SPACING, BORDER_RADIUS, SHADOWS} from '../utils';
import {isValidEmail, isRequired} from '../utils/validators';
import {signIn, clearError} from '../store/slices/authSlice';
import {RootState, AppDispatch} from '../store';

const SignInScreen = () => {
  const navigation = useNavigation();
  // Redux state and dispatch
  const dispatch = useDispatch<AppDispatch>();
  const {isSigningIn, error} = useSelector((state: RootState) => state.auth);

  // Form state
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [emailOrPhoneError, setEmailOrPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Form validation
  const validateForm = () => {
    let isValid = true;
    
    // Clear previous errors
    setEmailOrPhoneError('');
    setPasswordError('');
    
    // Email/Phone validation
    if (!isRequired(emailOrPhone)) {
      setEmailOrPhoneError('Email or Phone is required');
      isValid = false;
    }
    
    // Password validation
    if (!isRequired(password)) {
      setPasswordError('Password is required');
      isValid = false;
    }
    
    return isValid;
  };

  // Handle sign in
  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    // Clear any previous errors
    dispatch(clearError());
    
    try {
      // Attempt to sign in
      const result = await dispatch(signIn({emailOrPhone, password}));
      
      if (signIn.fulfilled.match(result)) {
        // Success - navigation will happen through Redux state
        console.log('✅ Sign in successful');
      } else {
        // Error - will be handled by Redux state
        console.log('❌ Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  // Navigate to sign up screen
  const handleNavigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  // Handle email/phone input change
  const handleEmailOrPhoneChange = (text: string) => {
    setEmailOrPhone(text);
    if (emailOrPhoneError) setEmailOrPhoneError(''); // Clear error when user types
  };

  // Handle password input change
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError(''); // Clear error when user types
  };

  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Image
              source={require('../assets/tractor.png')}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text variant="h2" weight="bold" style={styles.title}>
              Rural Share
            </Text>
            <Text variant="body" style={styles.subtitle}>
              Sign in to continue
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {/* Email/Phone Input */}
            <View style={styles.inputContainer}>
              <Text variant="label" weight="medium" style={styles.inputLabel}>
                Email or Phone
              </Text>
              <TextInput
                style={[
                  styles.input,
                  emailOrPhoneError ? styles.inputError : null,
                ]}
                placeholder="Enter your email or phone"
                placeholderTextColor={COLORS.TEXT.PLACEHOLDER}
                value={emailOrPhone}
                onChangeText={handleEmailOrPhoneChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSigningIn}
              />
              {emailOrPhoneError ? (
                <Text variant="caption" style={styles.errorText}>
                  {emailOrPhoneError}
                </Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text variant="label" weight="medium" style={styles.inputLabel}>
                Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  passwordError ? styles.inputError : null,
                ]}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.TEXT.PLACEHOLDER}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSigningIn}
              />
              {passwordError ? (
                <Text variant="caption" style={styles.errorText}>
                  {passwordError}
                </Text>
              ) : null}
            </View>

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Text variant="caption" style={styles.errorText}>
                  {error}
                </Text>
              </View>
            )}

            {/* Sign In Button */}
            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={isSigningIn}
              fullWidth
              style={styles.signInButton}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text variant="caption" style={styles.forgotPasswordText}>
                Sign in Using OTP!
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Section */}
          <View style={styles.signUpSection}>
            <Text variant="body" style={styles.signUpPrompt}>
              Don't have an account?{' '}
              <Text
                variant="body"
                weight="medium"
                style={styles.signUpLink}
                onPress={handleNavigateToSignUp}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.LG,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING['2XL'],
    marginBottom: SPACING['2XL'],
  },
  headerImage: {
    width: 80,
    height: 80,
    marginBottom: SPACING.MD,
  },
  title: {
    color: COLORS.PRIMARY.MAIN,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    color: COLORS.TEXT.SECONDARY,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.XL,
  },
  inputContainer: {
    marginBottom: SPACING.LG,
  },
  inputLabel: {
    color: COLORS.TEXT.PRIMARY,
    marginBottom: SPACING.SM,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    fontSize: 16,
    color: COLORS.TEXT.PRIMARY,
    backgroundColor: COLORS.NEUTRAL.WHITE,
    ...SHADOWS.SM,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: BORDER_RADIUS.SM,
    padding: SPACING.SM,
    marginBottom: SPACING.MD,
  },
  errorText: {
    color: '#EF4444',
    marginTop: SPACING.XS,
  },
  signInButton: {
    marginTop: SPACING.MD,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: SPACING.MD,
  },
  forgotPasswordText: {
    color: COLORS.PRIMARY.MAIN,
  },
  signUpSection: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: SPACING.LG,
  },
  signUpPrompt: {
    color: COLORS.TEXT.SECONDARY,
    textAlign: 'center',
  },
  signUpLink: {
    color: COLORS.PRIMARY.MAIN,
  },
});

export default SignInScreen; 