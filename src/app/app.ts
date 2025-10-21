import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('BuildVersionClient');

  private readonly theme = inject(ThemeService);

  constructor() {
    // Initialize theme from storage (default: light)
    this.theme.init(false);
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  get themeIcon(): string {
    return this.theme.isDark() ? 'light_mode' : 'dark_mode';
  }
}
