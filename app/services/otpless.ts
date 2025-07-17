// 🌾 OTPLess Service - Clean and Simple OTP Authentication
// This service wraps the OTPLess headless SDK for seamless phone verification
// Built with clean, readable code that feels like plain english

import { OtplessHeadlessModule } from 'otpless-headless-rn';

interface OTPLessResult {
  responseType: string;
  statusCode: number;
  response: any;
}

interface OTPAuthResult {
  success: boolean;
  message?: string;
  authType?: string;
  deliveryChannel?: string;
  otp?: string;
  token?: string;
  error?: string;
}

// 🏗️ OTPLess Service Configuration
class OTPLessService {
  private headlessModule: OtplessHeadlessModule;
  private appId: string;
  private isInitialized: boolean = false;
  private resultCallback: ((result: OTPAuthResult) => void) | null = null;

  constructor(appId: string) {
    this.appId = appId;
    this.headlessModule = new OtplessHeadlessModule();
  }

  // 🚀 Initialize OTPLess SDK
  async initialize(): Promise<void> {
    try {
      console.log('🔄 Initializing OTPLess SDK...');
      
      // Initialize the headless module
      await this.headlessModule.initialize(this.appId);
      
      // Set up the callback handler
      this.headlessModule.setResponseCallback(this.handleOTPLessResult.bind(this));
      
      this.isInitialized = true;
      console.log('✅ OTPLess SDK initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize OTPLess SDK:', error);
      throw new Error('Failed to initialize OTP service');
    }
  }

  // 🔄 Handle OTPLess SDK results
  private handleOTPLessResult(result: OTPLessResult): void {
    console.log('📱 OTPLess result received:', result);
    
    // Commit the response as required by the SDK
    this.headlessModule.commitResponse(result);
    
    const { responseType, statusCode, response } = result;
    
    switch (responseType) {
      case 'SDK_READY':
        console.log('✅ OTPLess SDK is ready');
        this.notifyResult({
          success: true,
          message: 'SDK is ready for authentication',
        });
        break;
        
      case 'FAILED':
        const errorMessage = response.errorMessage || 'SDK initialization failed';
        const errorCode = response.errorCode || statusCode;
        
        console.error('❌ OTPLess SDK failed:', errorMessage, 'Code:', errorCode);
        
        // Handle specific error codes
        let userFriendlyError = errorMessage;
        if (errorCode === 5003) {
          // This is a common initialization error that often resolves itself
          userFriendlyError = 'SDK initialization failed';
        }
        
        this.notifyResult({
          success: false,
          error: userFriendlyError,
        });
        break;
        
      case 'INITIATE':
        this.handleInitiateResponse(statusCode, response);
        break;
        
      case 'OTP_AUTO_READ':
        this.handleAutoReadOTP(response);
        break;
        
      case 'VERIFY':
        this.handleVerifyResponse(statusCode, response);
        break;
        
      case 'DELIVERY_STATUS':
        this.handleDeliveryStatus(response);
        break;
        
      case 'ONETAP':
        this.handleOneTap(response);
        break;
        
      case 'FALLBACK_TRIGGERED':
        this.handleFallback(response);
        break;
        
      default:
        console.warn('⚠️ Unknown response type:', responseType);
        this.notifyResult({
          success: false,
          error: `Unknown response type: ${responseType}`,
        });
    }
  }

  // 🔄 Handle authentication initiation
  private handleInitiateResponse(statusCode: number, response: any): void {
    if (statusCode === 200) {
      console.log('✅ Authentication initiated successfully');
      const { authType } = response;
      
      this.notifyResult({
        success: true,
        message: 'Authentication initiated',
        authType,
      });
    } else {
      console.error('❌ Authentication initiation failed:', response);
      this.notifyResult({
        success: false,
        error: response.errorMessage || 'Authentication initiation failed',
      });
    }
  }

  // 📱 Handle auto-read OTP (Android only)
  private handleAutoReadOTP(response: any): void {
    const { otp } = response;
    console.log('📱 OTP auto-read:', otp);
    
    this.notifyResult({
      success: true,
      message: 'OTP automatically detected',
      otp,
    });
  }

  // ✅ Handle OTP verification result
  private handleVerifyResponse(statusCode: number, response: any): void {
    if (statusCode === 200) {
      console.log('✅ OTP verification successful');
      
      this.notifyResult({
        success: true,
        message: 'OTP verified successfully',
        token: response.token,
      });
    } else {
      console.error('❌ OTP verification failed:', response);
      
      this.notifyResult({
        success: false,
        error: response.errorMessage || 'OTP verification failed',
      });
    }
  }

  // 📞 Handle delivery status
  private handleDeliveryStatus(response: any): void {
    const { authType, deliveryChannel } = response;
    console.log('📞 Delivery status:', { authType, deliveryChannel });
    
    this.notifyResult({
      success: true,
      message: `OTP sent via ${deliveryChannel}`,
      authType,
      deliveryChannel,
    });
  }

  // 🔄 Handle one-tap authentication
  private handleOneTap(response: any): void {
    // Extract token from nested response structure
    const token = response.data?.token || response.token;
    if (token) {
      console.log('🔄 One-tap authentication successful with token:', token);
      
      this.notifyResult({
        success: true,
        message: 'One-tap authentication successful',
        token,
      });
    } else {
      console.error('❌ One-tap authentication missing token:', response);
      this.notifyResult({
        success: false,
        error: 'Authentication successful but token missing',
      });
    }
  }

  // 🔄 Handle fallback to another channel
  private handleFallback(response: any): void {
    const { deliveryChannel } = response;
    console.log('🔄 Fallback triggered, new channel:', deliveryChannel);
    
    this.notifyResult({
      success: true,
      message: `OTP delivery fallback to ${deliveryChannel}`,
      deliveryChannel,
    });
  }

  // 📱 Start phone authentication
  async startPhoneAuth(phoneNumber: string, countryCode: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('OTPLess service not initialized');
    }
    
    console.log('📱 Starting phone authentication for:', phoneNumber);
    
    const request = {
      phone: phoneNumber,
      countryCode,
    };
    
    this.headlessModule.start(request);
  }

  // ✅ Verify OTP
  async verifyOTP(phoneNumber: string, countryCode: string, otp: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('OTPLess service not initialized');
    }
    
    console.log('✅ Verifying OTP for:', phoneNumber);
    
    const request = {
      phone: phoneNumber,
      countryCode,
      otp,
    };
    
    this.headlessModule.start(request);
  }

  // 📢 Set result callback
  setResultCallback(callback: (result: OTPAuthResult) => void): void {
    this.resultCallback = callback;
  }

  // 📢 Notify result to callback
  private notifyResult(result: OTPAuthResult): void {
    if (this.resultCallback) {
      this.resultCallback(result);
    }
  }

  // 🧹 Clean up resources
  cleanup(): void {
    if (this.isInitialized) {
      this.headlessModule.clearListener();
      this.headlessModule.cleanup();
      this.isInitialized = false;
      this.resultCallback = null;
      console.log('🧹 OTPLess service cleaned up');
    }
  }
}

// 🎯 Export singleton instance
// Note: Replace 'YOUR_APP_ID' with your actual OTPLess App ID
const otplessService = new OTPLessService('DH4FUC8YO0OVJEQK5D1L');

export default otplessService; 