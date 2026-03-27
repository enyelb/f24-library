import { NgModule } from '@angular/core';

import { F24FormDate } from './components/form-date';
import { F24FormErrors } from './components/form-errors';
import { F24FormInput } from './components/form-input';
import { F24FormSelect } from './components/form-select';
import { FormFile } from './components/form-file';
import { F24FormRadio } from './components/form-radio';
import { F24FormCheckbox } from './components/form-checkbox';

/**
 * F24FormModule
 */
@NgModule({
  declarations: [],
  imports: [
    F24FormDate,
    F24FormErrors,
    F24FormInput,
    F24FormSelect,
    FormFile,
    F24FormRadio,
    F24FormCheckbox
  ],
  exports: [
    F24FormDate,
    F24FormErrors,
    F24FormInput,
    F24FormSelect,
    FormFile,
    F24FormRadio,
    F24FormCheckbox
  ]
})
export class F24FormModule { }
