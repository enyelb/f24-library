import { computed, effect, inject, signal, untracked } from '@angular/core';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';

import { SnackService } from '@f24/notification';

import { IdleService } from './idle-service';
import { TokenRefreshService } from './token-refresh-service';
import { Router } from '@angular/router';

/**
 * BaseAuthServiceRequest
 */
export interface BaseAuthServiceRequest<Authentication, Authorized, Token> {
  login: (params: Authentication) => Observable<Token>;
  refresh: () => Observable<Token>;
  me: () => Observable<Authorized>;
  logout: () => void;
  permissions: (user: Authorized) => Observable<string[]>;
  redirect: () => { private: string, public: string };
  expiresAt: (token: Token) => number;
  headers: (token: Token) => { [key: string]: string };
}

/**
 * BaseAuthService
 */
export abstract class BaseAuthService<Authentication, Authorized, Token> {
  /**
   * services
   */
  private readonly idle = inject(IdleService);
  private readonly tokenRefresh = inject(TokenRefreshService);
  private readonly snack = inject(SnackService);
  private readonly router = inject(Router);
  /**
   * variables abstractas
   */
  readonly abstract type: string;
  /**
   * authorized
   */
  protected readonly _authorized = signal<Authorized | undefined>(undefined);
  public readonly authorized = this._authorized.asReadonly();
  /**
   * token
   */
  protected readonly _token = signal<Token | undefined>(undefined);
  public readonly token = this._token.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._token());
  /**
   * permissions
   */
  protected readonly _permissions = signal<string[]>([]);
  public readonly permissions = this._permissions.asReadonly();
  /**
   * isInitialized
   */
  protected readonly _isInitialized = signal<boolean>(false);
  public readonly isInitialized = this._isInitialized.asReadonly();
  /**
   * _isLogin
   */
  protected readonly _isLogin = signal<boolean>(false);
  public readonly isLogin = this._isLogin.asReadonly();
  /**
   * 
   */
  protected readonly _isRefreshing = signal<boolean>(false);
  protected readonly _request: BaseAuthServiceRequest<Authentication, Authorized, Token>;
  /**
   * constructor
   * @param request
   */
  constructor(request: BaseAuthServiceRequest<Authentication, Authorized, Token>) {
    this._request = request;
    /**
     * obtenemos el token del localStorage si existe y lo seteamos en la señal _token
     * si el token no es valido, se elimina del localStorage
     */
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      try {
        const token = JSON.parse(tokenString) as Token;
        this._token.set(token);
      } catch (error) {
        console.error('Error parsing token from localStorage:', error);
        localStorage.removeItem('token');
      }
    }
    /**
     * efecto para cerrar la sesión cuando el usuario se vuelve inactivo o el token expira
     */
    effect(() => {
      const idle = this.idle.idle();
      const tokenExpired = this.tokenRefresh.tokenExpired();
      if (!idle && !tokenExpired) {
        return;
      }

      if (idle) {
        this.snack.message('Sesión finalizada por inactividad', 'Cerrar', { duration: 5000 });
      }
      
      this.logout();
    });
    /**
     * efecto para validar el token y refrescarlo si es necesario
     */
    effect(() => {
      const tokenRefresh = this.tokenRefresh.tokenRefresh();
      const tokenExpired = this.tokenRefresh.tokenExpired();
      if (!tokenRefresh || tokenExpired) {
        return;
      }
      
      this.refreshToken().subscribe({
        next: (token) => {
          if (token) {
            console.log('Token refreshed successfully');
          }
        },
        error: (error: any) => {
          console.error('Error refreshing token:', error);
          this.logout();
        }
      });
    });
    /**
     * iniciar los servicios que corren en segundo plano, como el idle service
     * si el usuario tiene un token, se inician los servicios, si no, se detienen
     */
    effect(() => {
      const token = this.token();
      untracked(() => {
        if (token) {
          localStorage.setItem('token', JSON.stringify(token));
          /**
           * se valida si es primer inicio y el token lo saco del localstorage el usuario no etsa disponible
           */
          if (!this._isInitialized()) {
            this.me().subscribe({ 
              next: () => this.navigate(), 
              error: () => this.logout() 
            });
          } else {
            this.navigate()
          } 

          this.idle.start();
          this.tokenRefresh.start(this._request.expiresAt(token));
        } else {
          localStorage.removeItem('token');
          this.idle.stop();
          this.tokenRefresh.stop();
        }
      });
    });
  }
  /**
   * login
   * @param params 
   * @returns 
   */
  public login(params: Authentication) {
    return this._request.login(params).pipe(
      tap((token) => {
        this._token.set(token);
        this._isLogin.set(true);
        this.idle.touch();
      }),
      catchError((error) => {
        this._isLogin.set(true);
        return throwError(() => error);
      })
    );
  }
  /**
   * me
   * @returns 
   */
  public me() {
    return this._request.me().pipe(
      tap((user) => {
        this._authorized.set(user);
        this._isInitialized.set(true);
      }),
      switchMap((user) => {
        return this._request.permissions(user).pipe(
          tap((permissions) => {
            this._permissions.set(permissions);
          })
        );
      }),
      catchError((error) => {
        this._isInitialized.set(true);
        return throwError(() => error);
      })
    );
  }
  /**
   * refreshToken
   */
  public refreshToken() {
    if (this._isRefreshing()) {
      return of(this._token());
    }
    this._isRefreshing.set(true);
    return this._request.refresh().pipe(
      tap((token) => {
        this._token.set(token);
        this.idle.touch();
        this._isRefreshing.set(false);
      }),
      catchError((error) => {
        console.error('Token refresh failed:', error);
        this.logout();
        this._isRefreshing.set(false);
        return throwError(() => error);
      })
    );
  }
  /**
   * logout
   */
  public logout(): void {
    this._request.logout();
    this._token.set(undefined);
    this._authorized.set(undefined);
    this._permissions.set([]);
    this.router.navigate([this._request.redirect().public]);
  }
  /**
   * headers
   */
  public headers(): { [key: string]: string } {
    const token = this.token();
    if (!token) {
      return {};
    }
    return this._request.headers(token);
  }
  /**
   * redirect
   * @returns 
   */
  public redirect() {
    return this._request.redirect();
  }
  /**
   * navigate
   */
  public navigate() {
    if (this.isLogin() && this.authorized()) {
      this.router.navigate([this._request.redirect().private]);
    } else if ((this.isInitialized() && !this.authorized()) || !this.token()) {
      this.router.navigate([this._request.redirect().private]);
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
