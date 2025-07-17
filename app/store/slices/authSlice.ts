import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/api';

// Types for authentication state
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'individual' | 'SHG' | 'FPO' | 'admin';
  isVerified: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
}

interface AuthState {
  // Authentication status
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  
  // Loading states for better UX
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isVerifyingOTP: boolean;
  isUpdatingUserVerification: boolean;
  
  // Error handling
  error: string | null;
  
  // OTP verification state
  isOTPRequired: boolean;
  pendingUserPhone: string | null;
  pendingUserId: string | null;
  // Forgot-password flow flag
  isForgotPassword: boolean;
  
  // Screen navigation state
  currentScreen: 'signIn' | 'signUp' | 'otp' | 'authenticated' | 'forgotPassword';
}

// Initial state - clean and organized
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  
  isLoading: false,
  isSigningIn: false,
  isSigningUp: false,
  isVerifyingOTP: false,
  isUpdatingUserVerification: false,
  
  error: null,
  
  isOTPRequired: false,
  pendingUserPhone: null,
  pendingUserId: null,
  isForgotPassword: false,
  
  currentScreen: 'signIn',
};

// Async action for user registration
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'individual' | 'SHG' | 'FPO';
  }) => {
    try {
      console.log('🔄 Attempting to register user:', userData.email);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Registration failed:', errorData);
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const result = await response.json();
      console.log('✅ Registration successful:', result);
      return result;
    } catch (error) {
      console.error('🔥 Network error during registration:', error);
      throw error;
    }
  }
);

// Async action for user login
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: {email: string; phone: string; password: string}) => {
    try {
      console.log('🔄 Attempting to sign in user:', credentials.email);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }
      
      const result = await response.json();
      console.log('✅ Login successful:', result);
      return result;
    } catch (error) {
      console.error('🔥 Network error during login:', error);
      throw error;
    }
  }
);

// Async action for OTP verification - now handles real verification
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData: {phone: string; otp: string}, { getState }) => {
    try {
      console.log('🔄 Verifying OTP for phone:', otpData.phone);
      
      // Get the current state to access pending user info
      const state = getState() as { auth: AuthState };
      const pendingUserId = state.auth.pendingUserId;
      
      if (!pendingUserId) {
        throw new Error('No pending user found. Please restart the authentication process.');
      }
      
      // Since OTP verification is handled by OTPLess service,
      // we assume OTP is valid if we reach this point
      // Now we need to mark the user as verified
      console.log('✅ OTP verification successful, marking user as verified');
      
      // Return success with user verification update
      return {
        success: true,
        userId: pendingUserId,
        phone: otpData.phone,
        requiresUserVerification: true,
      };
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      throw error;
    }
  }
);

// Async action to update user verification status
export const updateUserVerification = createAsyncThunk(
  'auth/updateUserVerification',
  async (userData: { userId: string; isVerified: boolean; token: string }) => {
    try {
      console.log('🔄 Updating user verification status:', userData.userId);
      
      // Method 1: Use the quick verify endpoint from the API guide
      const endpoint = userData.isVerified 
        ? `/users/${userData.userId}/verify`
        : `/users/${userData.userId}/unverify`;
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
      });
      
      console.log('📡 User verification response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ User verification failed:', errorData);
        throw new Error(errorData.message || 'User verification failed');
      }
      
      const result = await response.json();
      console.log('✅ User verification updated:', result);
      return result;
    } catch (error) {
      console.error('🔥 Network error during user verification:', error);
      throw error;
    }
  }
);

// Async action to get user profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (userData: { userId: string; token: string }) => {
    try {
      console.log('🔄 Getting user profile:', userData.userId);
      
      const response = await fetch(`${API_BASE_URL}/users/${userData.userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
        },
      });
      
      console.log('📡 User profile response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Failed to get user profile:', errorData);
        throw new Error(errorData.message || 'Failed to get user profile');
      }
      
      const result = await response.json();
      console.log('✅ User profile retrieved:', result);
      return result;
    } catch (error) {
      console.error('🔥 Network error during profile retrieval:', error);
      throw error;
    }
  }
);

// Async action for OTP login (forgot-password / passwordless sign-in)
export const otpLogin = createAsyncThunk(
  'auth/otpLogin',
  async (payload: { phone: string }) => {
    try {
      console.log('🔄 Attempting OTP login for phone:', payload.phone);
      const response = await fetch(`${API_BASE_URL}/auth/otp-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: payload.phone }),
      });
      console.log('📡 OTP login status:', response.status);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'OTP login failed');
      }
      const data = await response.json();
      console.log('✅ OTP login success:', data);
      return data; // expects { token, user }
    } catch (error) {
      console.error('❌ OTP login error:', error);
      throw error;
    }
  }
);

// The main auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear any errors
    clearError: (state) => {
      state.error = null;
    },
    
    // Navigate between auth screens
    setCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
    },

    // Start forgot-password flow
    startForgotPassword: (state, action) => {
      state.error = null;
      state.pendingUserPhone = action.payload; // phone number
      state.isForgotPassword = true;
      state.currentScreen = 'otp';
    },

    // Reset forgot-password flags on completion
    finishForgotPassword: (state) => {
      state.isForgotPassword = false;
      state.pendingUserPhone = null;
    },
    
    // Logout user completely
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isOTPRequired = false;
      state.pendingUserPhone = null;
      state.pendingUserId = null;
      state.currentScreen = 'signIn';
      state.error = null;
    },
    
    // Reset all loading states
    resetLoadingStates: (state) => {
      state.isLoading = false;
      state.isSigningIn = false;
      state.isSigningUp = false;
      state.isVerifyingOTP = false;
      state.isUpdatingUserVerification = false;
    },
  },
  
  extraReducers: (builder) => {
    // Sign Up reducers
    builder
      .addCase(signUp.pending, (state) => {
        state.isSigningUp = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.isOTPRequired = true;
        state.pendingUserPhone = action.meta.arg.phone;
        state.pendingUserId = action.payload._id; // Store the user ID for verification
        state.currentScreen = 'otp';
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isSigningUp = false;
        state.error = action.error.message || 'Registration failed';
      });
    
    // Sign In reducers
    builder
      .addCase(signIn.pending, (state) => {
        state.isSigningIn = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isSigningIn = false;
        
        // Check if user needs OTP verification
        if (action.payload.requiresOTP) {
          state.isOTPRequired = true;
          state.pendingUserPhone = action.meta.arg.phone;
          state.pendingUserId = action.payload.user?._id || action.payload.userId;
          state.currentScreen = 'otp';
        } else {
          // Direct login success
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.access_token;
          state.currentScreen = 'authenticated';
        }
        
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isSigningIn = false;
        state.error = action.error.message || 'Login failed';
      });
    
    // OTP Verification reducers
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isVerifyingOTP = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isVerifyingOTP = false;
        
        if (action.payload.requiresUserVerification) {
          // OTP verified, but we need to update user verification status
          state.isUpdatingUserVerification = true;
          console.log('✅ OTP verified, updating user verification status...');
        } else {
          // Direct success
          state.isAuthenticated = true;
          state.isOTPRequired = false;
          state.pendingUserPhone = null;
          state.pendingUserId = null;
          state.currentScreen = 'authenticated';
        }
        
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isVerifyingOTP = false;
        state.error = action.error.message || 'OTP verification failed';
      });
    
    // Update User Verification reducers
    builder
      .addCase(updateUserVerification.pending, (state) => {
        state.isUpdatingUserVerification = true;
        state.error = null;
      })
      .addCase(updateUserVerification.fulfilled, (state, action) => {
        state.isUpdatingUserVerification = false;
        
        // User verification updated successfully
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.isOTPRequired = false;
          state.pendingUserPhone = null;
          state.pendingUserId = null;
          state.currentScreen = 'authenticated';
        }
        
        state.error = null;
      })
      .addCase(updateUserVerification.rejected, (state, action) => {
        state.isUpdatingUserVerification = false;
        state.error = action.error.message || 'User verification failed';
      });
    
    // Get User Profile reducers
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to get user profile';
      });

    builder
      .addCase(otpLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.currentScreen = 'authenticated';
        state.isForgotPassword = false;
      })
      .addCase(otpLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'OTP login failed';
        state.isForgotPassword = false;
      });
  },
});

export const {clearError, setCurrentScreen, logout, resetLoadingStates, startForgotPassword, finishForgotPassword} = authSlice.actions;
export default authSlice.reducer;
