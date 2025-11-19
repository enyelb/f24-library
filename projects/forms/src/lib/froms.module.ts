import { NgModule } from '@angular/core';

import { FormDate } from './form-date';
import { FormErrors } from './form-errors';
import { FormFile } from './form-file';
import { FormInput } from './form-input';
import { FormPhone } from './form-phone';
import { FormRadio } from './form-radio';
import { FormCheckbox } from './form-checkbox';

/**
 * FormModule
 */
@NgModule({
  declarations: [],
  imports: [
    FormDate,
    FormErrors,
    FormFile,
    FormInput,
    FormPhone,
    FormRadio,
    FormCheckbox
  ],
  exports: [
    FormDate,
    FormErrors,
    FormFile,
    FormInput,
    FormPhone,
    FormRadio,
    FormCheckbox
  ]
})
export class FormModule { }
