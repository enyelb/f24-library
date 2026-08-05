import { Injectable, signal } from '@angular/core';

/**
 * Servicio que monitoriza la inactividad del usuario.
 * Expone una señal `idle` que se vuelve `true` cuando el tiempo de inactividad
 * supera el umbral configurado (por defecto 15 minutos).
 */
@Injectable({ 
  providedIn: 'root' 
})
export class IdleService {
  /**
   * Temporizador para el chequeo actividad del usuario.
   */
  private lastActivityAt = signal<number>(Date.now());
  private idleTimer: any = null;
  private isStarted = signal(false);
  private idleThresholdMs = 15 * 60 * 1000;
  /**
   * signals
   */
  private readonly _idle = signal<boolean>(false);
  public readonly idle = this._idle.asReadonly();
  /**
   * Inicia el seguimiento de actividad y el chequeo periódico.
   * @param idleThresholdMs Umbral en milisegundos (opcional, por defecto 15 min).
   */
  start(idleThresholdMs?: number): void {
    if (this.isStarted()) {
      return;
    }
    if (typeof idleThresholdMs === 'number' && idleThresholdMs > 0) {
      this.idleThresholdMs = idleThresholdMs;
    }
    this.isStarted.set(true);
    this.registerActivityListeners();
    this.scheduleIdleCheck();
    this._idle.set(false);
  }
  /**
   * Detiene el seguimiento y limpia temporizadores/listeners.
   */
  stop(): void {
    if (!this.isStarted()) {
      return;
    };
    this.isStarted.set(false);
    this.clearIdleTimer();
    this.unregisterActivityListeners();
    this._idle.set(false);
  }
  /**
   * Reinicia el contador de inactividad y desactiva el estado idle.
   */
  touch(): void {
    this.lastActivityAt.set(Date.now());
    this._idle.set(false);  // al tocar, el usuario ya no está idle
  }

  /**
   * Funciones bound para los listeners de eventos.
   * Se usan para poder remover los listeners correctamente.
   */
  private touchBound = () => {
     this.touch();
  };
  private visibilityBound = () => {
    if (document.visibilityState === 'visible') { 
      this.touch();
    }
  };
  /**
   * Registra los listeners de eventos de actividad del usuario.
   * Se activan en eventos como mousemove, keydown, click, etc.
   * Cuando se detecta actividad, se llama a `touch()`.
   * También se escucha `visibilitychange` para detectar cuando la pestaña vuelve a estar visible.
   * Esto asegura que si el usuario vuelve a la pestaña, se considere activo.
   */
  private registerActivityListeners(): void {
    window.addEventListener('mousemove', this.touchBound, { passive: true });
    window.addEventListener('mousedown', this.touchBound, { passive: true });
    window.addEventListener('keydown', this.touchBound, { passive: true });
    window.addEventListener('click', this.touchBound, { passive: true });
    window.addEventListener('touchstart', this.touchBound, { passive: true });
    window.addEventListener('focus', this.touchBound, { passive: true });
    document.addEventListener('visibilitychange', this.visibilityBound);
  }
  /**
   * Remueve los listeners de eventos de actividad del usuario.
   */
  private unregisterActivityListeners(): void {
    window.removeEventListener('mousemove', this.touchBound);
    window.removeEventListener('mousedown', this.touchBound);
    window.removeEventListener('keydown', this.touchBound);
    window.removeEventListener('click', this.touchBound);
    window.removeEventListener('touchstart', this.touchBound);
    window.removeEventListener('focus', this.touchBound);
    document.addEventListener('visibilitychange', this.visibilityBound);
  }
  /**
   * Programa un temporizador que chequea cada segundo si el usuario ha estado inactivo
   */
  private scheduleIdleCheck(): void {
    this.clearIdleTimer();
    this.idleTimer = setInterval(() => {
      const idleForMs = Date.now() - this.lastActivityAt();
      // Si supera el umbral y aún no está marcado como idle, lo activamos.
      if (idleForMs >= this.idleThresholdMs && !this.idle()) {
        this._idle.set(true);
      }
    }, 1000);
  }
  /**
   * Limpia el temporizador de chequeo de inactividad.
   */
  private clearIdleTimer(): void {
    if (this.idleTimer) {
      clearInterval(this.idleTimer);
      this.idleTimer = null;
    }
  }
}


