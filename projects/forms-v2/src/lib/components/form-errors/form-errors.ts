import { Component, input } from '@angular/core';

import { FieldState } from '@angular/forms/signals';

/**
 * F24FormErrors
 */
@Component({
  selector: 'f24-form-errors',
  templateUrl: './form-errors.html',
  styleUrl: './form-errors.scss',
})
export class F24FormErrors {
  /**
   * inputs
   */
  readonly show = input<boolean>(true);
  readonly field = input<FieldState<any>>();
}
