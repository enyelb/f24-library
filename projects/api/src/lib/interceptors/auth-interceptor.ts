import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, throwError } from 'rxjs';

import { F24ManagerAuthService } from '../services/manager-auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  /**
   * services
   */
  const manager = inject(F24ManagerAuthService);
  const service = manager.service();
  /**
   * salir si no existe el auth service
   */
  if (!service) {
    return next(req);
  }

  /**
   * token
   */
  const token = service.token();

  let apiReq = req;

  // Always attach token if present (including for refresh). We guard loops elsewhere.
  if (token) {
    apiReq = apiReq.clone({
      setHeaders: service.headers()
    });
  }

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        service.logout();
      }
      return throwError(() => error);
    })
  );
};