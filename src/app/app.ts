import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from './services/notification.service';
import { ThemeService } from './services/theme.service';
import { LanguageService } from './services/language.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('eudi-frontend');
  public notificationService = inject(NotificationService);
  public themeService = inject(ThemeService);
  public i18n = inject(LanguageService);
  public readonly showWalletSimulator = environment.showWalletSimulator;
}
