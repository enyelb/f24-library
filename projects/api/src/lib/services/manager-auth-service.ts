import { inject, Injectable, provideAppInitializer, ProviderToken, signal, WritableSignal } from '@angular/core';
import { BaseAuthService } from './base-auth-service';

/**
 * ManagerAuthService
 */
@Injectable({
  providedIn: 'root',
})
export class ManagerAuthService {
  /**
   * services
   */
  protected readonly services = new Map<string, BaseAuthService<any, any, any>>();
  /**
   * metodo activo
   */
  //protected readonly _active: string = 'JWT';
  protected readonly _service = signal<BaseAuthService<any, any, any> | undefined>(undefined);
  public readonly service = this._service.asReadonly();
  /**
   * 
   * @param auth 
   * @returns 
   */
  public register<Authentication, Authorized, Token>(auth: BaseAuthService<Authentication, Authorized, Token>): void {
    if (this.services.has(auth.type)) {
      console.log('ya esta registrado este servicio');
      return;
    }

    if (!this._service()) {
      this._service.set(auth);
    }

    this.services.set(auth.type, auth);
  }
}

/**
 * provideAuthService
 */
export function provideAuthService<C extends BaseAuthService<any, any, any>>(services: ProviderToken<C> | ProviderToken<C>[]): ReturnType<typeof provideAppInitializer> {
  return provideAppInitializer(() => {
    const manager = inject(ManagerAuthService);
    if (Array.isArray(services)) {
      services.forEach(service => {
        manager.register(inject(service))
      });
    } else {
      manager.register(inject(services));
    }
  });
}