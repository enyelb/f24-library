import { NgModule } from '@angular/core';

import { F24PreviewText } from './components/preview-text/preview-text';
import { F24PreviewFormGroup } from './components/preview-form-group/preview-form-group';
import { F24PreviewForm } from './components/preview-form/preview-form';
import { F24PreviewCurrency } from './components/preview-currency/preview-currency';

/**
 * F24PreviewModule
 */
@NgModule({
  imports: [
    F24PreviewText,
    F24PreviewCurrency,
    F24PreviewFormGroup,
    F24PreviewForm,
  ],
  exports: [
    F24PreviewText,
    F24PreviewCurrency,
    F24PreviewFormGroup,
    F24PreviewForm,
  ]
})
export class F24PreviewModule { }
