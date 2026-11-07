import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { EudiApiService, VerificationResponse } from '../../services/eudi-api.service';
import { NotificationService } from '../../services/notification.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-wallet-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-simulator.component.html',
  styleUrl: './wallet-simulator.component.scss'
})
export class WalletSimulatorComponent {
  private eudiApi = inject(EudiApiService);
  private notificationService = inject(NotificationService);
  public i18n = inject(LanguageService);

  // Estados del formulario y simulación
  nonceInput = signal<string>('');
  isAgeValid = signal<boolean>(true); // true = edad > 15 (válido), false = simula fallo
  isLoading = signal<boolean>(false);
  
  // Resultado de la presentación
  verificationResult = signal<VerificationResponse | null>(null);

  /**
   * Simula la firma de la presentación y el envío del vpToken al backend
   */
  submitPresentation() {
    const nonce = this.nonceInput().trim();
    if (!nonce) {
      this.notificationService.show('error', this.i18n.t('wallet.notification.missingNonce'));
      return;
    }

    this.isLoading.set(true);
    this.verificationResult.set(null);

    // El monedero pide al emisor una credencial SD-JWT firmada real y la presenta.
    this.eudiApi
      .issueAgeCredential(this.isAgeValid())
      .pipe(
        switchMap((credential) =>
          this.eudiApi.submitPresentation({
            nonce: nonce,
            vpToken: credential.credential
          })
        )
      )
      .subscribe({
        next: (res) => {
          this.verificationResult.set(res);
          this.isLoading.set(false);
          const msg = res.isAgeVerified
            ? this.i18n.t('wallet.notification.success')
            : this.i18n.tOr(res.messageCode, this.i18n.t('wallet.notification.rejected'));
          this.notificationService.show(res.isAgeVerified ? 'success' : 'error', msg);
        },
        error: (err) => {
          console.error('Error en la presentación de credenciales:', err);
          this.isLoading.set(false);
          this.notificationService.show('error', this.i18n.t('wallet.notification.connectionError'));
        }
      });
  }
}