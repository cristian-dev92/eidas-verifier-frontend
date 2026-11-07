import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { toDataURL } from 'qrcode';
import {
  EudiApiService,
  ChallengeResponse,
  VerificationStatusResponse
} from '../services/eudi-api.service';
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
  private destroyRef = inject(DestroyRef);
  public i18n = inject(LanguageService);

  // Signals para manejar el estado de forma reactiva y limpia
  challenge = signal<ChallengeResponse | null>(null);
  isLoading = signal<boolean>(false);
  qrDataUrl = signal<string | null>(null);
  result = signal<VerificationStatusResponse | null>(null);

  private statusKey = signal<TranslationKey | null>(null);
  statusText = computed(() => {
    const key = this.statusKey();
    return key ? this.i18n.t(key) : null;
  });

  private pollSubscription?: Subscription;

  constructor() {
    this.destroyRef.onDestroy(() => this.stopPolling());
  }

  /**
   * Solicita un nuevo reto de verificación al backend y empieza a vigilar su estado.
   */
  requestChallenge() {
    this.stopPolling();
    this.result.set(null);
    this.qrDataUrl.set(null);
    this.isLoading.set(true);
    this.statusKey.set('dashboard.status.waiting');

    this.eudiApi.createChallenge().subscribe({
      next: async (res) => {
        this.challenge.set(res);
        this.isLoading.set(false);
        this.notificationService.show(
          'success',
          this.i18n.t('dashboard.notification.challengeSuccess')
        );
        await this.renderQr(res.presentationUri);
        this.startPolling(res);
      },
      error: (err) => {
        console.error('Error al generar el challenge:', err);
        this.isLoading.set(false);
        this.statusKey.set(null);
        this.notificationService.show(
          'error',
          this.i18n.t('dashboard.notification.connectionError')
        );
      }
    });
  }

  private async renderQr(uri: string) {
    try {
      const dataUrl = await toDataURL(uri, {
        width: 220,
        margin: 1,
        errorCorrectionLevel: 'M'
      });
      this.qrDataUrl.set(dataUrl);
    } catch (err) {
      console.error('No se pudo generar el código QR:', err);
    }
  }

  private startPolling(challenge: ChallengeResponse) {
    const expiresAt = new Date(challenge.expiresAt).getTime();

    this.pollSubscription = interval(2000)
      .pipe(
        switchMap(() => this.eudiApi.getStatus(challenge.nonce)),
        takeWhile((res) => !res.completed && Date.now() < expiresAt + 5000, true)
      )
      .subscribe({
        next: (res) => {
          if (res.completed) {
            this.handleResult(res);
          }
        },
        error: (err) => {
          console.error('Error consultando el estado del challenge:', err);
          this.stopPolling();
        },
        complete: () => {
          if (!this.result()) {
            this.fetchFinalStatus(challenge.nonce);
          }
        }
      });
  }

  private fetchFinalStatus(nonce: string) {
    this.eudiApi.getStatus(nonce).subscribe({
      next: (res) => this.handleResult(res),
      error: (err) => console.error('Error consultando el estado final:', err)
    });
  }

  private handleResult(res: VerificationStatusResponse) {
    this.result.set(res);
    this.stopPolling();
    this.statusKey.set(this.mapStatusKey(res.status));

    if (res.status === 'SUCCESS') {
      this.notificationService.show('success', this.i18n.t('dashboard.notification.verified'));
    } else {
      this.notificationService.show('error', this.i18n.tOr(res.messageCode, res.message));
    }
  }

  private mapStatusKey(status: string): TranslationKey {
    switch (status) {
      case 'SUCCESS':
        return 'dashboard.status.success';
      case 'INVALID_PROOF':
        return 'dashboard.status.invalidProof';
      case 'EXPIRED':
        return 'dashboard.status.expired';
      case 'REJECTED':
        return 'dashboard.status.rejected';
      default:
        return 'dashboard.status.waiting';
    }
  }

  private stopPolling() {
    this.pollSubscription?.unsubscribe();
    this.pollSubscription = undefined;
  }
}
