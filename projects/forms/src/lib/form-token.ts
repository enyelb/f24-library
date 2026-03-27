// column-token.ts
import { InjectionToken } from '@angular/core';

import { F24FormCheckbox } from './components/form-checkbox';
import { F24FormDate } from './components/form-date';
import { FormFile } from './components/form-file';
import { F24FormInput } from './components/form-input';
import { F24FormSelect } from './components/form-select';
import { F24FormRadio } from './components/form-radio';

/**
 * F24_FORM_TOKEN
 */
export const F24_FORM_TOKEN = new InjectionToken<
  F24FormDate | F24FormInput<any> | F24FormSelect<any, any> | F24FormRadio<any, any> | F24FormCheckbox<any, any> | FormFile
>('F24_FORM_TOKEN');