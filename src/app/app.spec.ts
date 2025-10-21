import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    // Reset persisted theme state to guarantee consistent test start
    localStorage.removeItem('app-theme');
    document.documentElement.classList.remove('dark-theme', 'light-theme');

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Toolbar shows the application title signal
    expect(compiled.querySelector('mat-toolbar')?.textContent).toContain('BuildVersionClient');
  });

  it('should toggle theme when toolbar button clicked', () => {
    // ensure initial reset
    document.documentElement.classList.remove('dark-theme', 'light-theme');
    localStorage.removeItem('app-theme');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button[aria-label="Toggle theme"]') as HTMLButtonElement;
    expect(btn).toBeTruthy();

    // click -> dark
    btn.click();
    expect(document.documentElement.classList.contains('dark-theme') || localStorage.getItem('app-theme') === 'dark').toBeTrue();

    // click -> light
    btn.click();
    expect(localStorage.getItem('app-theme') === 'light' || document.documentElement.classList.contains('light-theme')).toBeTrue();
  });
});
