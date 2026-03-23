// column-token.ts
import { InjectionToken } from '@angular/core';

import { FormCheckbox } from './components/form-checkbox';
import { F24FormDate } from './components/form-date';
import { FormFile } from './components/form-file';
import { F24FormInput } from './components/form-input';
import { FormPhone } from './components/form-phone';
import { F24FormSelect } from './components/form-select';
import { FormRadio } from './components/form-radio';

/**
 * F24_FORM_TOKEN
 */
export const F24_FORM_TOKEN = new InjectionToken<FormCheckbox | F24FormDate | FormFile | F24FormInput | FormPhone | F24FormSelect | FormRadio>('F24_FORM_TOKEN');