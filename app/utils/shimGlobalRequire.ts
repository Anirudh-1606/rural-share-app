// Simple safety-net for old libraries that still call `global.require()` on React Native.
// Hermes (RN 0.73+) no longer defines that alias out-of-the-box, so we recreate it.
//
// This is **not** Node.js `require`, it's just the same function Metro passes to every
// JS module. That is good enough for libraries that blindly call `global.require()`.
//
// We attach it only once and leave existing values untouched.
if (typeof global.require === 'undefined') {
  // `require` is available as a free variable inside every JS module that Metro bundles.
  // eslint-disable-next-line no-undef
  // @ts-ignore – `require` is provided at runtime by Metro.
  global.require = require;
} 