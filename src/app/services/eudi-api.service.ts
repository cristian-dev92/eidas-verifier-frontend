import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces que coinciden con los DTOs de tu backend Spring Boot
export interface ChallengeResponse {
  nonce: string;
  presentationUri: string;
  expiresAt: string;
}

export interface VerificationSubmissionRequest {
  nonce: string;
  vpToken: string;
}

export interface VerificationResponse {
  status: string;
  isAgeVerified: boolean;
  sessionToken: string | null;
  message: string;
  messageCode?: string | null;
}

export interface VerificationStatusResponse {
  nonce: string;
  status: string;
  isAgeVerified: boolean;
  sessionToken: string | null;
  message: string;
  messageCode: string | null;
  expiresAt: string;
  completed: boolean;
}

export interface CredentialResponse {
  credential: string;
  format: string;
  expiresAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class EudiApiService {
  private http = inject(HttpClient);
  
  // URL base configurada por entorno (desarrollo/producción)
  private readonly baseUrl = `${environment.apiUrl}/v1/verify`;

  /**
   * Solicita un nuevo desafío (challenge) con nonce y URI openid4vp://
   */
  createChallenge(): Observable<ChallengeResponse> {
    return this.http.post<ChallengeResponse>(`${this.baseUrl}/challenge`,{});
  }

  /**
   * Envía la prueba Verifiable Presentation (VP) para su validación
   */
  submitPresentation(payload: VerificationSubmissionRequest): Observable<VerificationResponse> {
    return this.http.post<VerificationResponse>(`${this.baseUrl}/submission`, payload);
  }

  /**
   * Consulta el estado de un challenge (polling tras el escaneo del QR)
   */
  getStatus(nonce: string): Observable<VerificationStatusResponse> {
    return this.http.get<VerificationStatusResponse>(
      `${this.baseUrl}/status/${encodeURIComponent(nonce)}`
    );
  }

  /**
   * Solicita al emisor una credencial de edad firmada (SD-JWT real)
   */
  issueAgeCredential(ageOver15: boolean): Observable<CredentialResponse> {
    return this.http.post<CredentialResponse>(
      `${environment.apiUrl}/v1/issuer/credential`,
      { ageOver15 }
    );
  }
}