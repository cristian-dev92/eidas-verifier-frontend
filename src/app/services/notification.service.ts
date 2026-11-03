import { Injectable, signal } from '@angular/core';

export type NotificationType = 'error' | 'success' | 'info' | 'warning';

export interface AppNotification {
  type: NotificationType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Signal pública de solo lectura (o accesible) para que los componentes la escuchen
  private notificationState = signal<AppNotification | null>(null);
  readonly current = this.notificationState.asReadonly();

  private timeoutId: any;

  /**
   * Muestra un toast flotante que se auto-oculta tras unos segundos
   */
  show(type: NotificationType, message: string, durationMs: number = 4000) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.notificationState.set({ type, message });

    this.timeoutId = setTimeout(() => {
      this.clear();
    }, durationMs);
  }

  /**
   * Cierra o limpia la notificación actual de forma manual
   */
  clear() {
    this.notificationState.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}