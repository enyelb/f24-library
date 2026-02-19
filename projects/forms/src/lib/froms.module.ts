import { NgModule } from '@angular/core';

import { F24FormDate } from './components/form-date';
import { FormErrors } from './components/form-errors';
import { FormFile } from './components/form-file';
import { F24FormInput } from './components/form-input';
import { FormPhone } from './components/form-phone';
import { FormRadio } from './components/form-radio';
import { FormCheckbox } from './components/form-checkbox';
import { F24FormSelect } from './components/form-select';

/**
 * F24FormModule
 */
@NgModule({
  declarations: [],
  imports: [
    F24FormDate,
    FormErrors,
    FormFile,
    F24FormInput,
    F24FormSelect,
    FormPhone,
    FormRadio,
    FormCheckbox
  ],
  exports: [
    F24FormDate,
    FormErrors,
    FormFile,
    F24FormInput,
    F24FormSelect,
    FormPhone,
    FormRadio,
    FormCheckbox
  ]
})
export class F24FormModule { }
