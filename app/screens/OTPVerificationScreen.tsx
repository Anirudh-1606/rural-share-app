import React, {useState, useRef, useEffect} from 'react';
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import Button from '../components/Button';
import {COLORS, SPACING, BORDER_RADIUS, SHADOWS} from '../utils';
import {verifyOTP, setCurrentScreen, clearError, updateUserVerification, otpLogin} from '../store/slices/authSlice';
import {RootState, AppDispatch} from '../store';
import otplessService from '../services/otpless';
import firebaseSMSService from '../services/firebaseSMS';

const OTPVerificationScreen = () => {
  // Redux state and dispatch
  const dispatch = useDispatch<AppDispatch>();
  const {
    isVerifyingOTP,
    pendingUserPhone,
    isForgotPassword,
  } = useSelector((state: RootState) => state.auth);

  // OTP state - 6 digit OTP
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [otpError, setOTPError] = useState('');
  // Let user pick WhatsApp (default) or SMS
  const [preferredChannel, setPreferredChannel] = useState<'whatsapp' | 'sms' | null>(null);
  // Firebase confirmation object – required to verify OTP later (SMS only)
  const [smsConfirmation, setSMSConfirmation] = useState<any>(null);
  const [isOTPLessInitialized, setIsOTPLessInitialized] = useState(false);
  const [authStatus, setAuthStatus] = useState<string>('');
  const [deliveryChannel, setDeliveryChannel] = useState<string>('');
  const [initializationTime, setInitializationTime] = useState<number>(0);
  // Flag to ensure we only initiate phone auth once per screen load
  const [hasInitiatedAuth, setHasInitiatedAuth] = useState<boolean>(false);
  
  // References for OTP inputs
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Initialize the correct provider once the user makes a choice
  useEffect(() => {
    if (preferredChannel === 'whatsapp') {
      initializeOTPLess();
    }
    if (preferredChannel === 'sms') {
      // Kick off Firebase SMS flow right away
      startFirebaseSMSAuth();
    }

    // cleanup OTPLess on unmount (safe to call even if never initialised)
    return () => {
      otplessService.cleanup();
    };
  }, [preferredChannel]);

  // Focus on first input when component mounts
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // 🚀 Initialize OTPLess service
  const initializeOTPLess = async () => {
    try {
      console.log('🔄 Initializing OTPLess for phone:', pendingUserPhone);
      
      // Clear any previous errors and set status
      setOTPError('');
      setAuthStatus('Initializing OTP service...');
      setInitializationTime(Date.now());
      
      // Set up callback to handle OTPLess results
      otplessService.setResultCallback(handleOTPLessResult);
      
      // Initialize the service
      await otplessService.initialize();
      
      setIsOTPLessInitialized(true);
      setAuthStatus('OTP service ready');
      
      // Small delay to ensure SDK is fully ready (increased for stability)
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Do NOT start phone auth here – we will start it once we receive
      // the "SDK is ready for authentication" callback to ensure a single request
    } catch (error) {
      console.error('❌ Failed to initialize OTPLess:', error);
      setOTPError('Failed to initialize OTP service. Please try again.');
      setAuthStatus('');
    }
  };

  // 📱 Start SMS authentication via Firebase
  const startFirebaseSMSAuth = async () => {
    try {
      if (!pendingUserPhone) {
        setOTPError('Phone number required for OTP');
        return;
      }

      // 🔢 Build a proper E.164 phone string
      // If the user already typed a +<country><number> we keep it as-is.
      // If they typed a plain 10-digit Indian number (common case) we prefix +91.
      // Otherwise you may extend this logic to prompt for country code.
      let phoneE164: string;
      if (pendingUserPhone.startsWith('+')) {
        phoneE164 = pendingUserPhone;
      } else if (/^\d{10}$/.test(pendingUserPhone)) {
        phoneE164 = `+91${pendingUserPhone}`; // default to India
      } else {
        // Fallback: assume caller included country code without +
        phoneE164 = `+${pendingUserPhone}`;
      }

      setAuthStatus('Sending SMS OTP...');
      const confirmation = await firebaseSMSService.sendOTP(phoneE164);
      setSMSConfirmation(confirmation);
      setAuthStatus('OTP sent via SMS');
      setHasInitiatedAuth(true);
    } catch (error) {
      console.error('❌ Failed to send SMS OTP:', error);
      setOTPError('Unable to send SMS OTP. Please try again.');
      setAuthStatus('');
    }
  };

  // 📱 Start phone authentication with retry logic
  const startPhoneAuthenticationWithRetry = async (retryCount = 0) => {
    try {
      setHasInitiatedAuth(true); // Mark that we're attempting auth (controls error visibility)
      await startPhoneAuthentication();
      setHasInitiatedAuth(true);
    } catch (error) {
      console.error('❌ Phone authentication failed, attempt:', retryCount + 1, error);
      
      if (retryCount < 2) {
        // Retry after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        await startPhoneAuthenticationWithRetry(retryCount + 1);
      } else {
        setOTPError('Failed to send OTP. Please try again.');
        setAuthStatus('');
      }
    }
  };

  // 📱 Start phone authentication
  const startPhoneAuthentication = async () => {
    if (!pendingUserPhone) {
      setOTPError('Phone number is required for OTP verification');
      return;
    }

    try {
      // Determine country code and phone number
      // If user entered '+<code><number>' we split accordingly.
      // Otherwise we default to India (+91) and treat entire input as phone number.
      const cleanedInput = pendingUserPhone.replace(/[^\d+]/g, ''); // retain digits and +
      let countryCode = '91';
      let phoneNumber = cleanedInput;

      if (cleanedInput.startsWith('+')) {
        // Remove '+' then split first up to 3 digits as country code (common max length)
        const match = cleanedInput.match(/^\+(\d{1,3})(\d+)/);
        if (match) {
          countryCode = match[1];
          phoneNumber = match[2];
        }
      }
      
      console.log('📱 Starting phone auth:', { countryCode, phoneNumber });
      
      await otplessService.startPhoneAuth(phoneNumber, countryCode);
      setAuthStatus('OTP request sent...');
    } catch (error) {
      console.error('❌ Failed to start phone authentication:', error);
      setOTPError('Failed to initiate OTP. Please try again.');
    }
  };

  // 🔍 Determine if error should be shown to user
  const shouldShowError = (error: string): boolean => {
    // Don't show these temporary/initialization errors
    const temporaryErrors = [
      'SDK initialization failed',
      'Failed to initialize the SDK',
      'Failed to initialize the SDK', // duplicate entry to be safe
    ];
    
    // If we haven't initiated auth yet, hide all errors (SDK still booting)
    if (!hasInitiatedAuth) {
      return false;
    }
    // If SDK is not initialized and it's a temporary error, don't show
    if (!isOTPLessInitialized && temporaryErrors.includes(error)) {
      return false;
    }
    
    // If it's an "Invalid request" error but we're still initializing or just ready, don't show
    if (error === 'Invalid request' && (
      authStatus.includes('Initializing') || 
      authStatus.includes('service ready') ||
      authStatus.includes('Ready for OTP')
    )) {
      return false;
    }
    
    // Don't show "Invalid request" errors within 3 seconds of initialization
    const timeSinceInit = Date.now() - initializationTime;
    if (error === 'Invalid request' && timeSinceInit < 3000) {
      return false;
    }
    
    // Show all other errors
    return true;
  };

  // 🔄 Handle OTPLess service results
  const handleOTPLessResult = (result: any) => {
    console.log('📱 OTPLess result:', result);
    
    if (result.success) {
      switch (result.message) {
        case 'SDK is ready for authentication':
          setAuthStatus('Ready for OTP verification');
          // If we haven't yet sent the initial OTP request (because SDK failed first), try now
          if (!hasInitiatedAuth && pendingUserPhone) {
            startPhoneAuthenticationWithRetry();
          }
          setOTPError(''); // Clear any initialization errors
          break;
          
        case 'Authentication initiated':
          setAuthStatus(`Authentication via ${result.authType}`);
          setOTPError(''); // Clear any previous errors
          break;
          
        case 'OTP automatically detected':
          // Auto-fill OTP if detected (Android only)
          if (result.otp) {
            const otpDigits = result.otp.split('');
            setOTP(otpDigits);
            setAuthStatus('OTP automatically detected');
          }
          break;
        case 'One-tap authentication successful':
          // ONETAP response delivers token directly (silent auth)
          if (result.token) {
            handleSuccessfulOTPVerification(result.token);
          }
          break;
        case 'OTP verified successfully':
          // Handle successful OTP verification
          handleSuccessfulOTPVerification(result.token);
          break;
          
        default:
          if (result.deliveryChannel) {
            setDeliveryChannel(result.deliveryChannel);
            setAuthStatus(`OTP sent via ${result.deliveryChannel}`);
          } else {
            setAuthStatus(result.message || 'Ready');
          }
      }
      
      // Clear any previous errors on success
      setOTPError('');
    } else {
      // Handle errors with intelligent filtering
      console.error('❌ OTPLess error:', result.error);
      
      // Only show error if it's not a temporary initialization error
      if (shouldShowError(result.error)) {
        setOTPError(result.error || 'OTP verification failed');
        setAuthStatus('');
      } else {
        // Don't show error, just log it
        console.log('🔄 Temporary error (not shown to user):', result.error);
      }
    }
  };

    // ✅ Handle successful OTP verification
  const handleSuccessfulOTPVerification = async (token?: string) => {
    try {
      console.log('✅ OTP verification successful, token:', token);
      
      if (isForgotPassword) {
        // Password-less login flow
        await dispatch(otpLogin({ phone: pendingUserPhone || '' }));
        return; // Nothing else to do – user will be logged in
      }

      // Normal sign-up verification flow
      const result = await dispatch(verifyOTP({
        phone: pendingUserPhone || '',
        otp: otp.join(''),
      }));
      
      if (verifyOTP.fulfilled.match(result)) {
        console.log('✅ OTP verified, now updating user verification status');
        setAuthStatus('Updating user verification...');
        
        // Update user verification status using the API
        const payload = result.payload as { userId: string; requiresUserVerification: boolean };
        
        if (payload.requiresUserVerification && payload.userId) {
          // Update user verification status to true
          const verificationResult = await dispatch(updateUserVerification({
            userId: payload.userId,
            isVerified: true,
            token: token || 'temp-token', // Use token from OTPLess or temp token
          }));
          
          if (updateUserVerification.fulfilled.match(verificationResult)) {
            console.log('✅ User verification completed successfully');
            setAuthStatus('Authentication completed!');
          } else {
            console.error('❌ Failed to update user verification');
            setOTPError('Failed to complete user verification. Please try again.');
          }
        } else {
          console.log('✅ User authentication completed successfully');
          setAuthStatus('Authentication completed!');
        }
      } else {
        console.error('❌ Failed to complete user authentication');
        setOTPError('Failed to complete authentication. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error in successful OTP verification:', error);
      setOTPError('Failed to complete authentication. Please try again.');
    }
  };

  // Handle OTP input change
  const handleOTPChange = (value: string, index: number) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    // Only allow numbers
    if (value !== '' && !/^\d$/.test(value)) return;
    
    // Update OTP array
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    
    // Clear error when user types
    if (otpError) setOTPError('');
    
    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Validate OTP
  const validateOTP = () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setOTPError('Please enter all 6 digits');
      return false;
    }
    
    return true;
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!preferredChannel) {
      setOTPError('Please choose WhatsApp or SMS first');
      return;
    }
    if (!validateOTP()) return;
    
    // Clear any previous errors
    dispatch(clearError());
    setOTPError('');
    
    const otpString = otp.join('');
    
    try {
      if (!pendingUserPhone) {
        setOTPError('Phone number is required for verification');
        return;
      }

      if (preferredChannel === 'sms') {
        if (!smsConfirmation) {
          setOTPError('SMS confirmation not found. Please resend OTP.');
          return;
        }

        setAuthStatus('Verifying SMS OTP...');
        await firebaseSMSService.verifyOTP(smsConfirmation, otpString);
        // Treat as successful verification
        await handleSuccessfulOTPVerification();
        return;
      }

      // === WhatsApp flow (unchanged) ===

      // Determine country code and phone number (same logic as before)
      const cleanedInput = pendingUserPhone.replace(/[^\d+]/g, '');
      let countryCode = '91';
      let phoneNumber = cleanedInput;

      if (cleanedInput.startsWith('+')) {
        const match = cleanedInput.match(/^\+(\d{1,3})(\d+)/);
        if (match) {
          countryCode = match[1];
          phoneNumber = match[2];
        }
      }
      console.log('✅ Verifying OTP via WhatsApp flow');
      setAuthStatus('Verifying OTP...');
      await otplessService.verifyOTP(phoneNumber, countryCode, otpString);
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      setOTPError('Failed to verify OTP. Please try again.');
      setAuthStatus('');
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      setAuthStatus('Resending OTP...');
      setOTPError('');
      
      // Clear current OTP
      setOTP(['', '', '', '', '', '']);
      
      // Restart phone authentication
      await startPhoneAuthentication();
    } catch (error) {
      console.error('❌ Failed to resend OTP:', error);
      setOTPError('Failed to resend OTP. Please try again.');
      setAuthStatus('');
    }
  };

  // Navigate back to sign in
  const handleBackToSignIn = () => {
    dispatch(setCurrentScreen('signIn'));
  };

  // Ask the user their preferred channel (rendered before main content)
  const renderChannelPicker = () => (
    <View style={{ padding: SPACING.LG, alignItems: 'center' }}>
      <Text variant="body" style={{ marginBottom: SPACING.MD }}>
        How would you like to receive your OTP?
      </Text>
      <Button
        title="WhatsApp"
        onPress={() => setPreferredChannel('whatsapp')}
        fullWidth
        style={{ marginBottom: SPACING.SM }}
      />
      <Button
        title="SMS"
        onPress={() => setPreferredChannel('sms')}
        fullWidth
      />
    </View>
  );

  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {preferredChannel === null ? (
            renderChannelPicker()
          ) : (
            <>
            {/* Header Section */}
          <View style={styles.header}>
            <Image
              source={require('../assets/harvest.png')}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text variant="h2" weight="bold" style={styles.title}>
              OTP Verification
            </Text>
            <Text variant="body" style={styles.subtitle}>
              Enter the 6-digit code sent to
            </Text>
            <Text variant="body" weight="medium" style={styles.email}>
              {pendingUserPhone || 'your phone'}
            </Text>
          </View>

          {/* Status and Error Display */}
          <View style={styles.statusContainer}>
            {authStatus && (
              <Text variant="body" style={styles.statusText}>
                {authStatus}
              </Text>
            )}
            {deliveryChannel && (
              <Text variant="caption" style={styles.deliveryText}>
                OTP sent via {deliveryChannel}
              </Text>
            )}
            {otpError && (
              <Text variant="caption" style={styles.errorText}>
                {otpError}
              </Text>
            )}
          </View>

          {/* OTP Input Grid */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => { inputRefs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  otpError ? styles.otpInputError : null,
                ]}
                value={digit}
                onChangeText={text => handleOTPChange(text, index)}
                onKeyPress={({nativeEvent}) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                editable={!isVerifyingOTP}
              />
            ))}
          </View>

          {/* Verify Button */}
          <Button
            title="Verify OTP"
            onPress={handleVerifyOTP}
            loading={isVerifyingOTP}
            fullWidth
            style={styles.verifyButton}
          />

          {/* Resend OTP Link */}
          <TouchableOpacity
            style={styles.resendContainer}
            onPress={handleResendOTP}
            disabled={isVerifyingOTP}
          >
            <Text variant="caption" style={styles.resendText}>
              Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
            </Text>
          </TouchableOpacity>

          {/* Back to Sign In Link */}
          <TouchableOpacity
            style={styles.backToSignIn}
            onPress={() => dispatch(setCurrentScreen('signIn'))}
          >
            <Text variant="caption" style={styles.backToSignInText}>
              ← Back to Sign In
            </Text>
          </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.LG,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
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
    marginBottom: SPACING.XS,
  },
  email: {
    color: COLORS.PRIMARY.MAIN,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: BORDER_RADIUS.SM,
    padding: SPACING.SM,
    marginBottom: SPACING.MD,
    alignItems: 'center',
  },
  statusText: {
    color: '#0369A1',
    textAlign: 'center',
  },
  deliveryContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: BORDER_RADIUS.SM,
    padding: SPACING.SM,
    marginBottom: SPACING.MD,
    alignItems: 'center',
  },
  deliveryText: {
    color: '#166534',
    textAlign: 'center',
  },
  otpSection: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    marginBottom: SPACING.MD,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: COLORS.BORDER.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.NEUTRAL.WHITE,
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.TEXT.PRIMARY,
    ...SHADOWS.SM,
  },
  otpInputFilled: {
    borderColor: COLORS.PRIMARY.MAIN,
    backgroundColor: COLORS.PRIMARY.LIGHT,
  },
  otpInputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: BORDER_RADIUS.SM,
    padding: SPACING.SM,
    marginTop: SPACING.SM,
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginTop: SPACING.SM,
  },
  verifyButton: {
    marginBottom: SPACING.LG,
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  resendPrompt: {
    color: COLORS.TEXT.SECONDARY,
    textAlign: 'center',
  },
  resendLink: {
    color: COLORS.PRIMARY.MAIN,
  },
  backButton: {
    alignItems: 'center',
    padding: SPACING.MD,
  },
  backButtonText: {
    color: COLORS.TEXT.SECONDARY,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: SPACING.MD,
  },
  resendText: {
    color: COLORS.TEXT.SECONDARY,
  },
  backToSignIn: {
    alignItems: 'center',
    padding: SPACING.MD,
  },
  backToSignInText: {
    color: COLORS.TEXT.SECONDARY,
  },
});

export default OTPVerificationScreen; 