import { NgModule } from '@angular/core';

import { F24PreviewText } from './preview-text/preview-text';
import { F24PreviewForm } from './preview-form/preview-form';

/**
 * F24PreviewModule
 */
@NgModule({
  imports: [
    F24PreviewText,
    F24PreviewForm
  ],
  exports: [
    F24PreviewText,
    F24PreviewForm
  ]
})
export class F24PreviewModule { }
