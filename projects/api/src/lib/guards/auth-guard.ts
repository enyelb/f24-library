import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ManagerAuthService } from '../services/manager-auth-service';

/**
 * authGuard
 * @param route 
 * @param state 
 * @returns 
 */
export const authGuard: CanActivateFn = (route, state) => {
  const manager = inject(ManagerAuthService);
  const router = inject(Router);

  const service = manager.service();

  if (service) {
    /**
     * validar si no esta autenticado y ya se inicializo el servicio o si no existe el token
     */
    if ((!service.authorized() && service.isInitialized()) || !service.token()) {
      const redirect = service.redirect();
      return router.parseUrl(redirect.public || '/');
    }
  }

  return true;
};