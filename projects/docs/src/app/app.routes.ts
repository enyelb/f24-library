import { Routes } from '@angular/router';

import { NG_DOC_ROUTING } from '@ng-doc/generated';

/**
 * Routes
 */
export const routes: Routes = [
  { path: '', redirectTo: 'components/icon', pathMatch: 'full'},
  ...NG_DOC_ROUTING
];
