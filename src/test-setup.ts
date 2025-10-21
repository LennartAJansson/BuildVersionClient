/// <reference types="jasmine" />
// Global test setup executed for all specs.
// Keep global test-side effects idempotent and fast.

beforeEach(() => {
  try { localStorage.removeItem('app-theme'); } catch { /* ignore */ }
  try { document.documentElement.classList.remove('dark-theme', 'light-theme'); } catch { /* ignore */ }
});
