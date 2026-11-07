import { Injectable, effect, signal } from '@angular/core';

export type Language = 'es' | 'en';

const ES = {
  'nav.brand': 'Plataforma Verificadora eIDAS 2.0',
  'nav.dashboard': 'Panel Verificador',
  'nav.wallet': 'Simulador Wallet',

  'theme.toLight': 'Cambiar a modo claro',
  'theme.toDark': 'Cambiar a modo oscuro',

  'lang.switch': 'Cambiar a inglés',

  'dashboard.header.title': 'Portal de Verificación eIDAS 2.0',
  'dashboard.header.subtitle': 'Control de acceso por edad (>15 años)',
  'dashboard.start.title': 'Iniciar Verificación',
  'dashboard.start.description': 'Pulsa el botón para generar una petición de presentación OpenID4VP.',
  'dashboard.start.button': 'Solicitar Verificación de Edad',
  'dashboard.start.buttonLoading': 'Generando reto...',
  'dashboard.challenge.title': 'Desafío Activo (OpenID4VP)',
  'dashboard.challenge.subtitle': 'Escanea este código con tu monedero digital o simula la respuesta:',
  'dashboard.challenge.uri': 'URI de Solicitud:',
  'dashboard.challenge.waiting': 'Esperando lectura del monedero...',
  'dashboard.status.waiting': 'Esperando lectura del monedero...',
  'dashboard.status.success': 'Verificación completada correctamente.',
  'dashboard.status.invalidProof': 'La prueba de identidad no es válida.',
  'dashboard.status.expired': 'El desafío ha expirado.',
  'dashboard.status.rejected': 'El usuario no cumple el requisito de edad.',
  'dashboard.result.title': 'Resultado de la verificación',
  'dashboard.notification.challengeSuccess': '¡Desafío OpenID4VP generado correctamente!',
  'dashboard.notification.verified': '¡Verificación de edad completada con éxito!',
  'dashboard.notification.connectionError': 'Error de conexión: No se pudo comunicar con el servidor backend en el puerto 8080.',

  'wallet.header.title': 'Simulador EUDI Wallet',
  'wallet.header.subtitle': 'Monedero digital del ciudadano (Simulación Móvil)',
  'wallet.nonce.label': 'Nonce del Desafío (OpenID4VP):',
  'wallet.nonce.placeholder': 'Pega aquí el nonce del Dashboard...',
  'wallet.age.label': 'Atributo de Edad: Válido (> 15 años)',
  'wallet.age.help': 'Desmarca para emitir una credencial real de menor de edad y ver la denegación.',
  'wallet.submit': 'Firmar y Enviar Presentación (vpToken)',
  'wallet.submitLoading': 'Firmando y enviando VP...',
  'wallet.result.title': 'Resultado de la Verificación',
  'wallet.result.status': 'Estado:',
  'wallet.result.ageVerified': '¿Edad Verificada?:',
  'wallet.result.yes': 'SÍ (>15)',
  'wallet.result.no': 'NO',
  'wallet.result.message': 'Mensaje:',
  'wallet.result.sessionToken': 'Token de Sesión:',
  'wallet.notification.missingNonce': 'Por favor, introduce o pega el Nonce del desafío.',
  'wallet.notification.success': '¡Verificación completada con éxito! Edad validada (>15).',
  'wallet.notification.rejected': 'Verificación rechazada por el backend.',
  'wallet.notification.connectionError': 'Error al comunicarse con el servidor.',

  'verification.success': 'Verificación de edad (>15 años) completada con éxito.',
  'verification.nonceInvalid': 'El nonce es inválido o ha expirado.',
  'verification.invalidProof': 'La firma digital o prueba Verifiable Presentation es inválida.',
  'verification.ageNotMet': 'El usuario no cumple el requisito de edad.',
  'verification.pending': 'Esperando la respuesta del monedero...'
} as const;

export type TranslationKey = keyof typeof ES;

const EN: Record<TranslationKey, string> = {
  'nav.brand': 'eIDAS 2.0 Verifier Platform',
  'nav.dashboard': 'Verifier Dashboard',
  'nav.wallet': 'Wallet Simulator',

  'theme.toLight': 'Switch to light mode',
  'theme.toDark': 'Switch to dark mode',

  'lang.switch': 'Switch to Spanish',

  'dashboard.header.title': 'eIDAS 2.0 Verification Portal',
  'dashboard.header.subtitle': 'Age access control (>15 years)',
  'dashboard.start.title': 'Start Verification',
  'dashboard.start.description': 'Press the button to generate an OpenID4VP presentation request.',
  'dashboard.start.button': 'Request Age Verification',
  'dashboard.start.buttonLoading': 'Generating challenge...',
  'dashboard.challenge.title': 'Active Challenge (OpenID4VP)',
  'dashboard.challenge.subtitle': 'Scan this code with your digital wallet or simulate the response:',
  'dashboard.challenge.uri': 'Request URI:',
  'dashboard.challenge.waiting': 'Waiting for wallet scan...',
  'dashboard.status.waiting': 'Waiting for wallet scan...',
  'dashboard.status.success': 'Verification completed successfully.',
  'dashboard.status.invalidProof': 'The identity proof is not valid.',
  'dashboard.status.expired': 'The challenge has expired.',
  'dashboard.status.rejected': 'The user does not meet the age requirement.',
  'dashboard.result.title': 'Verification result',
  'dashboard.notification.challengeSuccess': 'OpenID4VP challenge generated successfully!',
  'dashboard.notification.verified': 'Age verification completed successfully!',
  'dashboard.notification.connectionError': 'Connection error: Could not reach the backend server on port 8080.',

  'wallet.header.title': 'EUDI Wallet Simulator',
  'wallet.header.subtitle': 'Citizen digital wallet (Mobile Simulation)',
  'wallet.nonce.label': 'Challenge Nonce (OpenID4VP):',
  'wallet.nonce.placeholder': 'Paste the nonce from the Dashboard here...',
  'wallet.age.label': 'Age Attribute: Valid (> 15 years)',
  'wallet.age.help': 'Uncheck to issue a real underage credential and see the denial.',
  'wallet.submit': 'Sign and Send Presentation (vpToken)',
  'wallet.submitLoading': 'Signing and sending VP...',
  'wallet.result.title': 'Verification Result',
  'wallet.result.status': 'Status:',
  'wallet.result.ageVerified': 'Age Verified?:',
  'wallet.result.yes': 'YES (>15)',
  'wallet.result.no': 'NO',
  'wallet.result.message': 'Message:',
  'wallet.result.sessionToken': 'Session Token:',
  'wallet.notification.missingNonce': 'Please enter or paste the challenge Nonce.',
  'wallet.notification.success': 'Verification completed successfully! Age validated (>15).',
  'wallet.notification.rejected': 'Verification rejected by the backend.',
  'wallet.notification.connectionError': 'Error communicating with the server.',

  'verification.success': 'Age verification (>15 years) completed successfully.',
  'verification.nonceInvalid': 'The nonce is invalid or has expired.',
  'verification.invalidProof': 'The digital signature or Verifiable Presentation proof is invalid.',
  'verification.ageNotMet': 'The user does not meet the age requirement.',
  'verification.pending': 'Waiting for the wallet response...'
};

const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  es: ES,
  en: EN
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly storageKey = 'eudi-lang';
  readonly lang = signal<Language>(this.resolveInitialLanguage());

  constructor() {
    effect(() => {
      const lang = this.lang();
      document.documentElement.lang = lang;
      document.title = this.t('nav.brand');
      localStorage.setItem(this.storageKey, lang);
    });
  }

  toggle(): void {
    this.lang.update((current) => (current === 'es' ? 'en' : 'es'));
  }

  set(lang: Language): void {
    this.lang.set(lang);
  }

  t(key: TranslationKey): string {
    return TRANSLATIONS[this.lang()][key];
  }

  tOr(code: string | null | undefined, fallback: string): string {
    if (!code) {
      return fallback;
    }
    const dict = TRANSLATIONS[this.lang()] as Record<string, string>;
    return dict[code] ?? fallback;
  }

  private resolveInitialLanguage(): Language {
    const stored = localStorage.getItem(this.storageKey);
    if (stored === 'es' || stored === 'en') {
      return stored;
    }
    return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es';
  }
}
