import { inject, Injectable, provideAppInitializer, ProviderToken } from '@angular/core';
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
  protected readonly active: string = 'JWT'; 
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

    this.services.set(auth.type, auth);
  }

  /** */
  public service<Authentication, Authorized, Token>(): BaseAuthService<Authentication, Authorized, Token> | undefined {
    return this.services.get(this.active);
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