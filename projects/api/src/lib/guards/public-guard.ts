import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { F24ManagerAuthService } from '../services/manager-auth-service';

/**
 * publicGuard
 * @param route 
 * @param state 
 * @returns 
 */
export const publicGuard: CanActivateFn = (route, state) => {

  const manager = inject(F24ManagerAuthService);
  const router = inject(Router);

  const service = manager.service();
  
  if (service) {
    const redirect = service.redirect();
    /**
     * validar si existe el token y estoy en una ruta publica
     */
    if (service.token() && (state.url.includes(redirect.public) || state.url === '/')) {
      return router.parseUrl(redirect.private);
    }
  }
  return true;
};