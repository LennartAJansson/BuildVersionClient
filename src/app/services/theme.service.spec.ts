import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let svc: ThemeService;

  beforeEach(() => {
    localStorage.removeItem('app-theme');
    document.documentElement.classList.remove('dark-theme', 'light-theme');
    TestBed.configureTestingModule({ providers: [ThemeService] });
    svc = TestBed.inject(ThemeService);
  });

  it('should set light theme by default on init', () => {
    svc.init(false);
    expect(document.documentElement.classList.contains('light-theme')).toBeTrue();
    expect(localStorage.getItem('app-theme')).toBe('light');
  });

  it('should set dark theme when requested and persist it', () => {
    svc.setDark(true);
    expect(document.documentElement.classList.contains('dark-theme')).toBeTrue();
    expect(localStorage.getItem('app-theme')).toBe('dark');
  });

  it('should toggle theme', () => {
    svc.setDark(false);
    expect(svc.isDark()).toBeFalse();
    svc.toggle();
    expect(svc.isDark()).toBeTrue();
    svc.toggle();
    expect(svc.isDark()).toBeFalse();
  });

  it('should initialize from localStorage', () => {
    localStorage.setItem('app-theme', 'dark');
    svc.init(false);
    expect(svc.isDark()).toBeTrue();
  });
});
