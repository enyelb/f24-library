import { effect, inject, signal, untracked } from '@angular/core';

import { F24ManagerAuthService } from './manager-auth-service';
import { F24BaseAuthService } from './base-auth-service';
import { of } from 'rxjs';

/**
 * F24UserAuthService
 */
export abstract class F24UserAuthService<Authorized> {
  /**
   * 
   */
  protected readonly manager = inject(F24ManagerAuthService);  
  /**
   * authorized
   */
  protected readonly _authorized = signal<Authorized | undefined>(undefined);
  public readonly authorized = this._authorized.asReadonly();
  public readonly user = this._authorized.asReadonly();
  /**
   * permissions
   */
  protected readonly _permissions = signal<string[]>([]);
  public readonly permissions = this._permissions.asReadonly();
  /**
   * constructor
   * @param request
   */
  constructor(login: (user: Authorized) => void) {

    /**
     * efecto para sincronizar el usuario logueado
     */
    effect(() => {
      const authorized = this.manager.service()?.authorized();
      untracked(() => {
        this._authorized.set(authorized);

        if(authorized && login) {
          login(authorized);
        }
      });
    });
    /**
     *  efecto para sincronizar los permisos
     */
    effect(() => {
      const permissions = this.manager.service()?.permissions();
      untracked(() => {
        this._permissions.set(permissions ?? []);
      });
    })
  }
  /**
   * login
   * @param params 
   * @returns 
   */
  login<Authentication, Token>(params: Authentication) {
    const service: F24BaseAuthService<Authentication, Authorized, Token>  | undefined = this.manager.service();
    if (service) {
      return service.login(params);
    }
    return of(undefined);
  }
  /**
   * logout
   * @returns 
   */
  logout<Authentication, Token>() {
    const service: F24BaseAuthService<Authentication, Authorized, Token>  | undefined = this.manager.service();
    if (service) {
      return service.logout();
    }
  }
  /**
   * hasPermission
   */
  public hasPermission(permission:  string | string[] ): boolean {
    const permissions = this.permissions();
    if (typeof permission === 'string' || typeof permission === 'number') {
      return permissions.includes(permission);
    }

    return permission.some(permission => permissions.includes(permission));
  }
}
