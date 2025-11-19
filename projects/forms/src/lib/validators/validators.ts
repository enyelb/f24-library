import { AbstractControl, Validators as V, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Phone } from './phone';

/**
 * Validators
 */
export class Validators extends V {
  /**
   * phone
   * @param control
   * @returns
   */
  static phone(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value instanceof Phone) {
      return value.errors();
    };

    // Validar formato internacional
    const internationalRegex = /^\+\d{1,4}[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,9}$/;

    if (!internationalRegex.test(value)) {
      return {
        phone: true,
      };
    }

    return null;
  };

  /**
   * match
   * @param match
   * @returns
   */
  static match(match: string[] | string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      if (typeof match === 'string') {
        match = [match];
      }

      if (!match.includes(value)) {
        return {
          requiredMatch: true,
          requiredMatchValue: match,
        };
      }

      return null;
    };
  }
}
