import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EudiApiService, ChallengeResponse } from '../services/eudi-api.service';
import { NotificationService } from '../services/notification.service';
import { LanguageService, TranslationKey } from '../services/language.service';

@Component({
  selector: 'app-verifier-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verifier-dashboard.component.html',
  styleUrl: './verifier-dashboard.component.scss'
})
export class VerifierDashboardComponent {
  private eudiApi = inject(EudiApiService);
  private notificationService = inject(NotificationService);
  public i18n = inject(LanguageService);

  // Signals para manejar el estado de forma reactiva y limpia
  challenge = signal<ChallengeResponse | null>(null);
  isLoading = signal<boolean>(false);
  private statusKey = signal<TranslationKey | null>(null);
  statusText = computed(() => {
    const key = this.statusKey();
    return key ? this.i18n.t(key) : null;
  });

  /**
   * Solicita un nuevo reto de verificación al backend
   */
  requestChallenge() {
    this.isLoading.set(true);
    this.statusKey.set('dashboard.challenge.waiting');

    this.eudiApi.createChallenge().subscribe({
      next: (res) => {
        this.challenge.set(res);
        this.isLoading.set(false);
        this.notificationService.show('success', this.i18n.t('dashboard.notification.challengeSuccess'));
      },
      error: (err) => {
        console.error('Error al generar el challenge:', err);
        this.isLoading.set(false);
        this.statusKey.set(null);
        this.notificationService.show('error', this.i18n.t('dashboard.notification.connectionError'));
      }
    });
  }
}