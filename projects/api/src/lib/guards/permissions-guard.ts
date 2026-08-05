import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { ManagerAuthService } from '../services/manager-auth-service';

/**
 * permissionsGuard
 * @param route 
 * @param state 
 * @returns 
 */
export const permissionsGuard: CanActivateFn = (route, state) => {
  const manager = inject(ManagerAuthService);
  const service = manager.service();
  const permissions = route.data['permissions'];

  if (!permissions) {
    return true;
  }

  if (!service) {
    return false;
  }

  return true;//service.hasPermission(permissions);
};