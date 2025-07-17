// 🌾 Rural Share API Service
// This service handles all API calls to the Rural Share backend
// Built with clean, readable code that feels like plain english

import { API_BASE_URL } from '../config/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  phone: string; // Now required according to the guide
  password: string;
  role: 'individual' | 'SHG' | 'FPO';
}

interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string; // Now included in user profile
  role: 'individual' | 'SHG' | 'FPO' | 'admin';
  isVerified: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  access_token: string;
  user?: User;
}

interface UserVerificationResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    isVerified: boolean;
  };
}

interface UserUpdateRequest {
  name?: string;
  phone?: string;
  isVerified?: boolean;
  kycStatus?: 'pending' | 'approved' | 'rejected';
}

// 🏗️ API Configuration
class ApiService {
  private baseURL: string;
  private authToken: string | null = null;
  
  constructor() {
    // Base URL for Rural Share API - configured in config/api.ts
    this.baseURL = API_BASE_URL;
  }
  
  // 🔑 Set authentication token for protected routes
  setAuthToken(token: string) {
    this.authToken = token;
  }
  
  // 🚫 Clear authentication token
  clearAuthToken() {
    this.authToken = null;
  }
  
  // 📡 Generic API request handler
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log('📡 Making API request to:', url);
      
      // Default headers
      const headers: any = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      // Add auth token if available
      if (this.authToken) {
        headers.Authorization = `Bearer ${this.authToken}`;
      }
      
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ API request successful:', data);
        return {
          success: true,
          data,
        };
      } else {
        console.error('❌ API request failed:', data);
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }
    } catch (error) {
      console.error('🔥 Network error in API request:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
  
  // 📝 Register new user (now with phone number)
  async registerUser(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
  
  // 🔐 Login user with email and password
  async loginUser(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
  
  // 👤 Get user profile by ID (now includes phone number)
  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/users/${userId}`, {
      method: 'GET',
    });
  }
  
  // ✅ Verify user (set isVerified to true) - Method 1 from guide
  async verifyUser(userId: string): Promise<ApiResponse<UserVerificationResponse>> {
    return this.makeRequest<UserVerificationResponse>(`/users/${userId}/verify`, {
      method: 'PATCH',
    });
  }
  
  // ❌ Unverify user (set isVerified to false) - Method 2 from guide
  async unverifyUser(userId: string): Promise<ApiResponse<UserVerificationResponse>> {
    return this.makeRequest<UserVerificationResponse>(`/users/${userId}/unverify`, {
      method: 'PATCH',
    });
  }
  
  // 🔄 Update user fields (including isVerified) - Method 3 from guide
  async updateUser(userId: string, updates: UserUpdateRequest): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
  
  // 🔓 Refresh authentication token
  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/refresh', {
      method: 'POST',
    });
  }
  
  // 📱 Send OTP for verification
  async sendOTP(email: string): Promise<ApiResponse<{message: string}>> {
    return this.makeRequest<{message: string}>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
  
  // ✅ Verify OTP
  async verifyOTP(email: string, otp: string): Promise<ApiResponse<{message: string}>> {
    return this.makeRequest<{message: string}>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }
  
  // 🔒 Change password (protected route)
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<{message: string}>> {
    return this.makeRequest<{message: string}>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
  
  // 📧 Request password reset
  async requestPasswordReset(email: string): Promise<ApiResponse<{message: string}>> {
    return this.makeRequest<{message: string}>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
  
  // 🔄 Reset password with token
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<{message: string}>> {
    return this.makeRequest<{message: string}>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }
  
  // 🚪 Logout user (optional server-side logout)
  async logoutUser(): Promise<ApiResponse<{message: string}>> {
    return this.makeRequest<{message: string}>('/auth/logout', {
      method: 'POST',
    });
  }
}

// 🎯 Create singleton instance
const apiService = new ApiService();

// 🔧 Helper functions for easier usage
export const authAPI = {
  // 📝 Register new user (now with phone number)
  register: (userData: RegisterRequest) => apiService.registerUser(userData),
  
  // 🔐 Login user
  login: (credentials: LoginRequest) => apiService.loginUser(credentials),
  
  // 👤 Get user profile by ID
  getProfile: (userId: string) => apiService.getUserProfile(userId),
  
  // ✅ Verify user (Method 1 from guide)
  verifyUser: (userId: string) => apiService.verifyUser(userId),
  
  // ❌ Unverify user (Method 2 from guide)
  unverifyUser: (userId: string) => apiService.unverifyUser(userId),
  
  // 🔄 Update user fields (Method 3 from guide)
  updateUser: (userId: string, updates: UserUpdateRequest) => apiService.updateUser(userId, updates),
  
  // 📱 Send OTP
  sendOTP: (email: string) => apiService.sendOTP(email),
  
  // ✅ Verify OTP
  verifyOTP: (email: string, otp: string) => apiService.verifyOTP(email, otp),
  
  // 🔒 Change password
  changePassword: (currentPassword: string, newPassword: string) =>
    apiService.changePassword(currentPassword, newPassword),
  
  // 📧 Request password reset
  requestPasswordReset: (email: string) => apiService.requestPasswordReset(email),
  
  // 🔄 Reset password
  resetPassword: (token: string, newPassword: string) =>
    apiService.resetPassword(token, newPassword),
  
  // 🚪 Logout
  logout: () => apiService.logoutUser(),
  
  // 🔑 Set auth token
  setToken: (token: string) => apiService.setAuthToken(token),
  
  // 🚫 Clear auth token
  clearToken: () => apiService.clearAuthToken(),
};

// 📱 Check if phone number exists in database
export const checkPhoneExists = async (phone: string): Promise<{ exists: boolean; message: string }> => {
  try {
    console.log('🔍 Checking phone existence:', phone);
    
    const response = await fetch(`${API_BASE_URL}/users/check-phone/${phone}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Phone check response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Phone check failed: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Phone check result:', result);
    
    return {
      exists: result.exists,
      message: result.message,
    };
  } catch (error) {
    console.error('❌ Phone check error:', error);
    throw error;
  }
};

// Export the main service and helper functions
export default apiService;
