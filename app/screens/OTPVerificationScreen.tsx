import React, {useState, useRef, useEffect} from 'react';
/* eslint-disable react-hooks/exhaustive-deps */
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Text from '../components/Text';
import Button from '../components/Button';
import {COLORS, SPACING, BORDER_RADIUS, SHADOWS} from '../utils';
import {verifyOTP, clearError, updateUserVerification, otpLogin, setOtpChannel} from '../store/slices/authSlice';
import {RootState, AppDispatch} from '../store';
import otplessService from '../services/otpless';
import firebaseSMSService from '../services/firebaseSMS';

const OTPVerificationScreen = () => {
  const navigation = useNavigation();
  // Redux state and dispatch
  const dispatch = useDispatch<AppDispatch>();
  const {
    isVerifyingOTP,
    pendingUserPhone,
    isForgotPassword,
    otpChannel,
  } = useSelector((state: RootState) => state.auth);

  // OTP state - 6 digit OTP
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [otpError, setOTPError] = useState('');
  // Firebase confirmation object – required to verify OTP later (SMS only)
  const [smsConfirmation, setSMSConfirmation] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState<string>('');
  
  // References for OTP inputs
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const [isWhatsAppLoading, setIsWhatsAppLoading] = useState(false);
  const [isOTPLessInitialized, setIsOTPLessInitialized] = useState(false);

  useEffect(() => {
    startFirebaseSMSAuth();
    return () => {
      otplessService.cleanup();
    };
  }, []);

  // Focus on first input when component mounts
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // 📱 Start SMS authentication via Firebase
  const startFirebaseSMSAuth = async () => {
    try {
      if (!pendingUserPhone) {
        setOTPError('Phone number required for OTP');
        return;
      }

      let phoneE164: string;
      if (pendingUserPhone.startsWith('+')) {
        phoneE164 = pendingUserPhone;
      } else if (/^\d{10}$/.test(pendingUserPhone)) {
        phoneE164 = `+91${pendingUserPhone}`;
      } else {
        phoneE164 = `+${pendingUserPhone}`;
      }

      setAuthStatus('Sending SMS OTP...');
      const confirmation = await firebaseSMSService.sendOTP(phoneE164);
      setSMSConfirmation(confirmation);
      setAuthStatus('OTP sent via SMS');
      dispatch(setOtpChannel('sms'));
    } catch (error) {
      console.error('❌ Failed to send SMS OTP:', error);
      setOTPError('Unable to send SMS OTP. Please try again.');
      setAuthStatus('');
    }
  };

  // 🚀 Initialize OTPLess service
  const initializeOTPLess = async () => {
    setIsWhatsAppLoading(true);
    try {
      setAuthStatus('Initializing WhatsApp OTP service...');
      otplessService.setResultCallback(handleOTPLessResult);
      await otplessService.initialize();
      setIsOTPLessInitialized(true);
      setAuthStatus('WhatsApp OTP service ready.');
    } catch (error) {
      console.error('❌ Failed to initialize OTPLess:', error);
      setOTPError('Failed to initialize WhatsApp OTP service. Please try again.');
      setAuthStatus('');
    } finally {
      setIsWhatsAppLoading(false);
    }
  };

  const handleWhatsAppOTP = async () => {
    if (!isOTPLessInitialized) {
      // If not initialized, initialize first. The actual OTP sending will happen in handleOTPLessResult.
      initializeOTPLess();
      return;
    }
    // If already initialized, proceed to send OTP
    sendWhatsAppOTP();
  };

  const sendWhatsAppOTP = async () => {
    try {
      if (!pendingUserPhone) {
        setOTPError('Phone number required for OTP');
        return;
      }
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
      setAuthStatus('Sending WhatsApp OTP...');
      await otplessService.startPhoneAuth(phoneNumber, countryCode);
      dispatch(setOtpChannel('whatsapp'));
    } catch (error) {
      console.error('❌ Failed to send WhatsApp OTP:', error);
      setOTPError('Failed to send WhatsApp OTP. Please try again.');
      setAuthStatus('');
    }
  };

  // 🔄 Handle OTPLess service results
  const handleOTPLessResult = (result: any) => {
    if (result.success) {
      switch (result.message) {
        case 'SDK is ready for authentication':
          setAuthStatus('WhatsApp OTP service ready. Sending OTP...');
          sendWhatsAppOTP(); // Now send OTP after SDK is ready
          break;
        case 'Authentication initiated':
          setAuthStatus(`OTP sent via WhatsApp`);
          break;
        case 'OTP automatically detected':
          if (result.otp) {
            const otpDigits = result.otp.split('');
            setOTP(otpDigits);
            setAuthStatus('OTP automatically detected');
          }
          break;
        case 'One-tap authentication successful':
        case 'OTP verified successfully':
          if (result.token) {
            handleSuccessfulOTPVerification(result.token);
          }
          break;
        default:
          setAuthStatus(result.message || 'Ready');
      }
      setOTPError('');
    } else {
      setOTPError(result.error || 'OTP verification failed');
      setAuthStatus('');
    }
  };

    // ✅ Handle successful OTP verification
  const handleSuccessfulOTPVerification = async (token?: string) => {
    try {
      if (isForgotPassword) {
        await dispatch(otpLogin({ phone: pendingUserPhone || '' }));
        return;
      }

      const result = await dispatch(verifyOTP({
        phone: pendingUserPhone || '',
        otp: otp.join(''),
      }));
      
      if (verifyOTP.fulfilled.match(result)) {
        const payload = result.payload as { userId: string; requiresUserVerification: boolean };
        
        if (payload.requiresUserVerification && payload.userId) {
          const verificationResult = await dispatch(updateUserVerification({
            userId: payload.userId,
            isVerified: true,
            token: token || 'temp-token',
          }));
          
          if (!updateUserVerification.fulfilled.match(verificationResult)) {
            setOTPError('Failed to complete user verification. Please try again.');
          }
        }
      }
    } catch (error) {
      setOTPError('Failed to complete authentication. Please try again.');
    }
  };

  // Handle OTP input change
  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) return;
    if (value !== '' && !/^\d$/.test(value)) return;
    
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    
    if (otpError) setOTPError('');
    
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
    if (!validateOTP()) return;
    
    dispatch(clearError());
    setOTPError('');
    
    const otpString = otp.join('');
    
    try {
      setAuthStatus('Verifying OTP...');
      let verificationSuccessful = false;
      let lastError: string | null = null;

      if (otpChannel === 'sms') {
        if (!smsConfirmation) {
          setOTPError('SMS confirmation not found. Please resend OTP.');
          return;
        }
        try {
          await firebaseSMSService.verifyOTP(smsConfirmation, otpString);
          verificationSuccessful = true;
          setAuthStatus('OTP verified via SMS.');
        } catch (smsError: any) {
          console.log('Firebase SMS verification failed:', smsError);
          lastError = smsError.message || 'Firebase SMS verification failed.';
        }
      } else if (otpChannel === 'whatsapp') {
        try {
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
          await otplessService.verifyOTP(phoneNumber, countryCode, otpString);
          verificationSuccessful = true;
          setAuthStatus('OTP verified via WhatsApp.');
        } catch (whatsappError: any) {
          console.log('Otpless WhatsApp verification failed:', whatsappError);
          lastError = whatsappError.message || 'Otpless WhatsApp verification failed.';
        }
      } else {
        setOTPError('Please request an OTP first.');
        return;
      }

      if (verificationSuccessful) {
        await handleSuccessfulOTPVerification();
        setOTPError(''); // Clear error if any method succeeds
      } else {
        setOTPError(lastError || 'Failed to verify OTP. Please try again.');
        setAuthStatus('');
      }
    } catch (error: any) {
      setOTPError(error.message || 'Failed to verify OTP. Please try again.');
      setAuthStatus('');
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      setAuthStatus('Resending OTP...');
      setOTPError('');
      setOTP(['', '', '', '', '', '']);
      if (otpChannel === 'sms') {
        await startFirebaseSMSAuth();
      } else if (otpChannel === 'whatsapp') {
        await sendWhatsAppOTP();
      } else {
        // Default to SMS if no channel is set (e.g., first load)
        await startFirebaseSMSAuth();
      }
    } catch (error) {
      setOTPError('Failed to resend OTP. Please try again.');
      setAuthStatus('');
    }
  };

  return (
    <SafeAreaWrapper backgroundColor={COLORS.BACKGROUND.PRIMARY}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content}>
            <>
            {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
            </TouchableOpacity>
            <Image
              source={require('../assets/harvest.png')}
              style={styles.headerImage}
              resizeMode="contain"
            />
            <Text variant="h2" weight="bold" style={styles.title}>
              Sign in using OTP
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

          {/* WhatsApp OTP Link */}
          <TouchableOpacity
            style={styles.whatsappContainer}
            onPress={handleWhatsAppOTP}
            disabled={isVerifyingOTP}
          >
            <Text variant="caption" style={styles.whatsappText}>
              Receive OTP on WhatsApp
            </Text>
          </TouchableOpacity>
            </>
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
    flexGrow: 1,
    padding: SPACING.LG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['2XL'],
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backImage: {
    width: 24,
    height: 24,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  otpInputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginTop: SPACING.SM,
  },
  verifyButton: {
    marginBottom: SPACING.LG,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: SPACING.MD,
  },
  resendText: {
    color: COLORS.TEXT.SECONDARY,
  },
  resendLink: {
    color: COLORS.PRIMARY.MAIN,
  },
  whatsappContainer: {
    alignItems: 'center',
    marginTop: SPACING.MD,
  },
  whatsappText: {
    color: COLORS.PRIMARY.MAIN,
  },
});

export default OTPVerificationScreen;

 