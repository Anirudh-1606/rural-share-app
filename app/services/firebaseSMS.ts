// 🌾 Firebase SMS Service - Clean and Simple SMS-only OTP Authentication
// This file complements `otpless.ts`. We keep WhatsApp with OTPLess,
// and use Firebase Authentication when the user prefers SMS.
//
// Prerequisites:
// 1. Install native deps: `@react-native-firebase/app` & `@react-native-firebase/auth`
// 2. Add your google-services.json (Android) & GoogleService-Info.plist (iOS)
// 3. Enable Phone Authentication in the Firebase console
//
// The code below is intentionally written in "plain english" style with
// generous comments so that future developers can follow the flow easily.

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import './firebase'; // Ensure Firebase [DEFAULT] app is initialised before any auth call

// A minimal wrapper so the rest of the app does *not* talk to Firebase directly.
// That keeps our SMS implementation swappable just like the OTPLess service.

class FirebaseSMSService {
  /**
   * Kick off SMS OTP delivery via Firebase.
   * Returns the `confirmation` object which we must keep around in order to
   * verify the OTP later.
   */
  async sendOTP(phoneWithPlus: string): Promise<FirebaseAuthTypes.ConfirmationResult> {
    try {
      // No manual initialise needed – handled centrally in app/services/firebase

      console.log('📨 [FirebaseSMS] Sending OTP to', phoneWithPlus);
      const confirmation = await auth().signInWithPhoneNumber(phoneWithPlus);
      console.log('✅ [FirebaseSMS] OTP dispatched');
      return confirmation;
    }  catch (e: any) {
      console.error('❌ [FirebaseSMS] FULL ERROR OBJECT:', e);        // ① raw object
      console.error('❌ [FirebaseSMS] ERROR CODE:', e?.code);          // ② specific code
      throw new Error(`Failed to send SMS OTP. Code: ${e.code ?? 'unknown'}`);
    }
  }

  /**
   * Confirm / verify the OTP.
   * If successful Firebase returns a `UserCredential`.
   */
  async verifyOTP(
    confirmation: FirebaseAuthTypes.ConfirmationResult,
    otp: string,
  ): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      console.log('🔍 [FirebaseSMS] Verifying OTP');
      const credential = await confirmation.confirm(otp);
      if (!credential) {
        throw new Error('OTP verification returned null credential');
      }
      console.log('✅ [FirebaseSMS] OTP verified');
      return credential;
    } catch (error: any) {
      // Firebase throws a regular Error but with useful `code` property
      console.error('❌ [FirebaseSMS] OTP verification failed:', error?.code);
      throw new Error('Invalid OTP');
    }
  }
}

// We expose a singleton so that state (if any) is kept globally.
const firebaseSMSService = new FirebaseSMSService();
export default firebaseSMSService; 