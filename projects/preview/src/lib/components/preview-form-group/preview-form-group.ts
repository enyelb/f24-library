import { Component, contentChildren, effect } from '@angular/core';

import { F24_FORM_TOKEN } from '@f24/forms';

import { F24PreviewForm } from '../preview-form/preview-form';

/**
 * PreviewFormGroup
 */
@Component({
  selector: 'f24-preview-form-group',
  imports: [],
  templateUrl: './preview-form-group.html',
  styleUrl: './preview-form-group.scss',
})
export class F24PreviewFormGroup {
  /**
   * los formularios a previzualizar
   */
  protected readonly previewForms = contentChildren(F24PreviewForm);
  /**
   * constructor
   */
  constructor() { 
    effect(() => {
      const forms = this.previewForms();

      forms.forEach((current, index) => {
        if (index > 0) {
          current.source().update({ linked: forms[index - 1] });
        }
      });
    });
  }
}
