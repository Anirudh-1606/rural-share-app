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
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import Button from '../components/Button';
import {COLORS, SPACING, BORDER_RADIUS, SHADOWS} from '../utils';
import {isValidEmail, isRequired, isValidPassword} from '../utils/validators';
import {signUp, setCurrentScreen, clearError} from '../store/slices/authSlice';
import {RootState, AppDispatch} from '../store';
import { checkPhoneExists } from '../services/api';

type UserRole = 'individual' | 'SHG' | 'FPO';

const SignUpScreen = () => {
  // Redux state and dispatch
  const dispatch = useDispatch<AppDispatch>();
  const {isSigningUp, error} = useSelector((state: RootState) => state.auth);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('individual');
  
  // Error state
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isValidatingPhone, setIsValidatingPhone] = useState(false);

  // Role options with descriptions
  const roleOptions = [
    {
      value: 'individual' as UserRole,
      label: 'Individual Farmer',
      description: 'For individual farmers and agriculture enthusiasts',
      emoji: '🌾',
    },
    {
      value: 'SHG' as UserRole,
      label: 'Self Help Group',
      description: 'For community groups and cooperatives',
      emoji: '👥',
    },
    {
      value: 'FPO' as UserRole,
      label: 'Farmer Producer Organization',
      description: 'For formal farmer organizations and collectives',
      emoji: '🏢',
    },
  ];

  // Form validation
  const validateForm = async () => {
    let isValid = true;
    
    // Clear previous errors
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    // Name validation
    if (!isRequired(name)) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    }
    
    // Email validation
    if (!isRequired(email)) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    // Phone validation
    if (!isRequired(phone)) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (phone.length < 10) {
      setPhoneError('Please enter a valid phone number (10 digits)');
      isValid = false;
    } else {
      // Check if phone already exists (for sign-up, we want it to NOT exist)
      setIsValidatingPhone(true);
      try {
        const result = await checkPhoneExists(phone);
        setIsValidatingPhone(false);
        
        if (result.exists) {
          setPhoneError('Phone number is already registered. Please use a different number.');
          isValid = false;
        }
      } catch (error) {
        setIsValidatingPhone(false);
        setPhoneError('Unable to verify phone number. Please try again.');
        isValid = false;
      }
    }
    
    // Password validation
    if (!isRequired(password)) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!isValidPassword(password)) {
      setPasswordError('Password must be at least 8 characters with uppercase, lowercase, and number');
      isValid = false;
    }
    
    // Confirm password validation
    if (!isRequired(confirmPassword)) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    return isValid;
  };

  // Handle sign up
  const handleSignUp = async () => {
    if (!(await validateForm())) return;
    
    // Clear any previous errors
    dispatch(clearError());
    
    try {
      // Attempt to sign up
      const result = await dispatch(signUp({
        name,
        email,
        phone,
        password,
        role: selectedRole,
      }));
      
      if (signUp.fulfilled.match(result)) {
        // Success - navigation will happen through Redux state
        console.log('✅ Sign up successful');
      } else {
        // Error - will be handled by Redux state
        console.log('❌ Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  // Navigate to sign in screen
  const handleNavigateToSignIn = () => {
    dispatch(setCurrentScreen('signIn'));
  };

  // Handle input changes with error clearing
  const handleNameChange = (text: string) => {
    setName(text);
    if (nameError) setNameError('');
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    if (phoneError) setPhoneError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError('');
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) setConfirmPasswordError('');
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
              source={require('../assets/seed.png')}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text variant="h2" weight="bold" style={styles.title}>
              Join Rural Share
            </Text>
            <Text variant="body" style={styles.subtitle}>
              Create your account to get started
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text variant="label" weight="medium" style={styles.inputLabel}>
                Full Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  nameError ? styles.inputError : null,
                ]}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.TEXT.PLACEHOLDER}
                value={name}
                onChangeText={handleNameChange}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isSigningUp}
              />
              {nameError ? (
                <Text variant="caption" style={styles.errorText}>
                  {nameError}
                </Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text variant="label" weight="medium" style={styles.inputLabel}>
                Email Address
              </Text>
              <TextInput
                style={[
                  styles.input,
                  emailError ? styles.inputError : null,
                ]}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.TEXT.PLACEHOLDER}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSigningUp}
              />
              {emailError ? (
                <Text variant="caption" style={styles.errorText}>
                  {emailError}
                </Text>
              ) : null}
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Text variant="label" weight="medium" style={styles.inputLabel}>
                Phone Number
              </Text>
              <TextInput
                style={[
                  styles.input,
                  phoneError ? styles.inputError : null,
                ]}
                placeholder="Enter your phone number"
                placeholderTextColor={COLORS.TEXT.PLACEHOLDER}
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSigningUp && !isValidatingPhone}
              />
              {phoneError ? (
                <Text variant="caption" style={styles.errorText}>
                  {phoneError}
                </Text>
              ) : null}
            </View>

            {/* Role Selection */}
            <View style={styles.inputContainer}>
              <Text variant="label" weight="medium" style={styles.inputLabel}>
                Account Type
              </Text>
              <View style={styles.roleContainer}>
                {roleOptions.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.roleOption,
                      selectedRole === role.value && styles.roleOptionSelected,
                    ]}
                    onPress={() => setSelectedRole(role.value)}
                    disabled={isSigningUp}
                  >
                    <View style={styles.roleContent}>
                      <View style={styles.roleHeader}>
                        <Text variant="h4" style={styles.roleEmoji}>
                          {role.emoji}
                        </Text>
                        <Text variant="label" weight="medium" style={styles.roleLabel}>
                          {role.label}
                        </Text>
                      </View>
                      <Text variant="caption" style={styles.roleDescription}>
                        {role.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
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
                placeholder="Create a secure password"
                placeholderTextColor={COLORS.TEXT.PLACEHOLDER}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSigningUp}
              />
              {passwordError ? (
                <Text variant="caption" style={styles.errorText}>
                  {passwordError}
                </Text>
              ) : null}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text variant="label" weight="medium" style={styles.inputLabel}>
                Confirm Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  confirmPasswordError ? styles.inputError : null,
                ]}
                placeholder="Confirm your password"
                placeholderTextColor={COLORS.TEXT.PLACEHOLDER}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSigningUp}
              />
              {confirmPasswordError ? (
                <Text variant="caption" style={styles.errorText}>
                  {confirmPasswordError}
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

            {/* Sign Up Button */}
            <Button
              title={isValidatingPhone ? "Validating..." : "Sign Up"}
              onPress={handleSignUp}
              loading={isSigningUp || isValidatingPhone}
              fullWidth
              style={styles.signUpButton}
            />
          </View>

          {/* Sign In Section */}
          <View style={styles.signInSection}>
            <Text variant="body" style={styles.signInPrompt}>
              Already have an account?{' '}
              <Text
                variant="body"
                weight="medium"
                style={styles.signInLink}
                onPress={handleNavigateToSignIn}
              >
                Sign In
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
    marginTop: SPACING.XL,
    marginBottom: SPACING.XL,
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
  roleContainer: {
    gap: SPACING.SM,
  },
  roleOption: {
    borderWidth: 1,
    borderColor: COLORS.BORDER.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.NEUTRAL.WHITE,
    padding: SPACING.MD,
    ...SHADOWS.SM,
  },
  roleOptionSelected: {
    borderColor: COLORS.PRIMARY.MAIN,
    backgroundColor: COLORS.PRIMARY.LIGHT,
  },
  roleContent: {
    gap: SPACING.XS,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  roleEmoji: {
    fontSize: 20,
  },
  roleLabel: {
    color: COLORS.TEXT.PRIMARY,
  },
  roleDescription: {
    color: COLORS.TEXT.SECONDARY,
    lineHeight: 18,
  },
  signUpButton: {
    marginTop: SPACING.MD,
  },
  signInSection: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: SPACING.LG,
  },
  signInPrompt: {
    color: COLORS.TEXT.SECONDARY,
    textAlign: 'center',
  },
  signInLink: {
    color: COLORS.PRIMARY.MAIN,
  },
});

export default SignUpScreen; 