// 🌟 Central Firebase initialiser – single place to bootstrap the default app
// This file is imported once at application start (see `index.js`) **before** any
// other Firebase service is touched (Auth, Firestore, etc.).
//
// We purposely keep it extremely small and written almost like plain-English so
// every future developer understands what is going on at a glance.
//
// Why do we need this file?
// • React-Native-Firebase will *usually* auto-link the native (Android/iOS)
//   configuration that lives in `google-services.json` and
//   `GoogleService-Info.plist`.  But in some cases – e.g. when those files are
//   added after the first build, or when running on Expo bare/monorepos – the
//   JavaScript land sees no default app and throws:
//     "No Firebase App '[DEFAULT]' has been created – call firebase.initializeApp()"
//
// • By calling `initializeApp()` ourselves we make sure there is **always** a
//   default app object so the rest of the codebase (SMS Auth, Firestore, …) can
//   rely on it.
//
// -----------------------------------------------------------------------------

import firebase from '@react-native-firebase/app';

// If the native layer has not created a Default app yet we create it manually.
// Calling `initializeApp()` WITHOUT any config lets RN-Firebase pick up the
// values from the native JSON / plist.  You *could* pass an explicit JS object
// instead – in 99 % of cases this is **not** necessary and we keep it blank so
// the code stays environment-agnostic.
if (!firebase.apps.length) {
  console.log('⚙️  [Firebase] No default app detected – initialising now…');
  // Calling with no arguments lets the native (Android/iOS) layer supply the
  // configuration that lives inside google-services.json / GoogleService-Info.plist.
  // Typings expect at least one argument – but run-time works fine without.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore We purposefully rely on native config, hence no JS object needed
  const createdApp = firebase.initializeApp();
  console.log('📦 [Firebase] Created app:', (createdApp as any).name);
  console.log('📦 [Firebase] Apps array immediately after create:', firebase.apps.map(a => a.name));
} else {
  console.log('✅ [Firebase] Default app already initialised');
}

// We export the **already-initialised** firebase instance for optional direct
// usage.  Most files will not need this – they should import the specific sub
// packages (auth, firestore, …).  But having it here can be handy for advanced
// scenarios (multi-app, diagnostics, etc.).
export default firebase; 