import { Injectable } from '@angular/core';

export type ThemeName = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'app-theme';
  private readonly darkClass = 'dark-theme';
  private readonly lightClass = 'light-theme';

  /** Initialize theme from localStorage (or default to light) */
  init(defaultDark = false): void {
    try {
      const stored = localStorage.getItem(this.storageKey) as ThemeName | null;
      const shouldDark = stored ? stored === 'dark' : defaultDark;
      this.apply(shouldDark);
    } catch (e) {
      // If localStorage is not available, fall back to default
      this.apply(defaultDark);
    }
  }

  toggle(): void {
    this.apply(!this.isDark());
  }

  setDark(dark: boolean): void {
    this.apply(dark);
  }

  isDark(): boolean {
    return document.documentElement.classList.contains(this.darkClass);
  }

  private apply(dark: boolean): void {
    const el = document.documentElement;
    if (dark) {
      el.classList.add(this.darkClass);
      el.classList.remove(this.lightClass);
      try { localStorage.setItem(this.storageKey, 'dark'); } catch { /* ignore */ }
    } else {
      el.classList.add(this.lightClass);
      el.classList.remove(this.darkClass);
      try { localStorage.setItem(this.storageKey, 'light'); } catch { /* ignore */ }
    }
  }
}
