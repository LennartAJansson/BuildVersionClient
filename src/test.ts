// Test entry that ensures zone.js/testing is loaded and our global test setup
// runs. We avoid importing platform-browser-dynamic/testing here to not require
// additional bundling/resolution of testing packages.
import 'zone.js/testing';

// Import our global test setup (beforeEach cleanup)
import './test-setup';
