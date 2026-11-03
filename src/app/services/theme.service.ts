import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'eudi-theme';
  readonly theme = signal<Theme>(this.resolveInitialTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();
      document.documentElement.classList.toggle('dark-theme', theme === 'dark');
      localStorage.setItem(this.storageKey, theme);
    });
  }

  toggle(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  private resolveInitialTheme(): Theme {
    const stored = localStorage.getItem(this.storageKey);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
