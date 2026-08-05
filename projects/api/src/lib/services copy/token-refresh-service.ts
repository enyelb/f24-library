import { Injectable, signal } from '@angular/core';

/**
 * TokenRefreshService
 */
@Injectable({ 
  providedIn: 'root' 
})
export class TokenRefreshService {
  /**
   * Temporizador para el chequeo de expiración del token.
   */
  private tokenRefreshTimer: any = null;
  private tokenRefreshThresholdMs = 5 * 60 * 1000;
  private isStarted = signal(false);
  /**
   * signals
   */
  private readonly _tokenRefresh = signal<boolean>(false);
  public readonly tokenRefresh = this._tokenRefresh.asReadonly();
  private readonly _tokenExpired = signal<boolean>(false);
  public readonly tokenExpired = this._tokenExpired.asReadonly();
  /**
   * Inicia el seguimiento de actividad y el chequeo periódico.
   * @param tokenExpiresAt Momento en que el token expira.
   * @param tokenRefreshThresholdMs Umbral en milisegundos (opcional, por defecto 5 min).
   */
  start(tokenExpiresAt: number, tokenRefreshThresholdMs?: number): void {
    this.scheduleTokenRefreshCheck(tokenExpiresAt);
    
    if (typeof tokenRefreshThresholdMs === 'number' && tokenRefreshThresholdMs > 0) {
      this.tokenRefreshThresholdMs = tokenRefreshThresholdMs;
    }
    
    if (this.isStarted()) {
      return;
    }
    
    this.isStarted.set(true);
    this._tokenRefresh.set(false);
    this._tokenExpired.set(false);
  }
  /**
   * Detiene el seguimiento y limpia temporizadores/listeners.
   */
  stop(): void {
    if (!this.isStarted()) {
      return;
    };
    this.isStarted.set(false);
    this.clearTokenRefreshTimer();
    this._tokenRefresh.set(false);
    this._tokenExpired.set(false);
  }
  /**
   * Programa un temporizador que chequea el estado del token y actualiza las señales `tokenRefresh` y `tokenExpired`
   * @param expiresAt Momento en que el token expira.
   */
  private scheduleTokenRefreshCheck(expiresAt: number): void {

    // Cancela cualquier temporizador activo antes de crear uno nuevo
    this.clearTokenRefreshTimer();

    if (expiresAt === null) {
      this._tokenRefresh.set(false);
      this._tokenExpired.set(false);
      return;
    }

    const timeUntilExpiry = expiresAt - Date.now();

    if (timeUntilExpiry <= 0) {
      // Ya expiró
      this._tokenExpired.set(true);
      this._tokenRefresh.set(false);
    } else {
      // Calcula el momento exacto para activar el refresh
      const timeUntilRefresh = timeUntilExpiry - this.tokenRefreshThresholdMs;

      if (timeUntilRefresh <= 0) {
        // Ya estamos dentro del margen de renovación
        this._tokenExpired.set(false);
        this._tokenRefresh.set(true);
      } else {
        // Estado normal antes del margen
        this._tokenExpired.set(false);
        this._tokenRefresh.set(false);

        // Programa la ejecución cuando entre en el margen
        this.tokenRefreshTimer = setTimeout(() => {
          this._tokenRefresh.set(true);
        }, timeUntilRefresh);
      }
    }
  }
  /**
   * Limpia el temporizador de chequeo de inactividad.
   */
  private clearTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }
}
