import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

/**
 * FormErrors
 */
@Component({
  selector: 'f24-form-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-errors.html',
  styleUrl: './form-errors.scss',
})
export class FormErrors {

  /**
   * show
   */
  public show = input<boolean>(true);

  /**
   * errors
   */
  public errors = input<ValidationErrors | null>()

  /**
   * message
   */
  protected message(key: string, error: any): string {

    if (key == 'required') {
      return 'Este campo es obligatorio'
    };
    if (key == 'email') {
      return 'Email no válido';
    }
    if (key == 'min') {
      return `Mínimo ${error.min}`;
    }
    if (key == 'max') {
      return `Máximo ${error.max}`;
    }
    if (key == 'minlength') {
      return `Mínimo ${error.requiredLength} caracteres`;
    }
    if (key == 'maxlength') {
      return `Máximo ${error.requiredLength} caracteres`;
    }
    if (key == 'pattern') {
      return 'Formato incorrecto';
    }
    if (key == 'phone') {
      return `Teléfono no válido`;
    }
    if (key == 'phone_match') {
      return `Teléfono no válido (Ej: ${error.match.slice(0, 3).join(', ')})`;
    }
    if (key == 'phone_length') {
      return `Teléfono no válido (debe tener ${error.length} dígitos)`;
    }
    if (key == 'phone_min') {
      return `Teléfono no válido (mínimo ${error.length} dígitos)`;
    }
    if (key == 'phone_max') {
      return `Teléfono no válido (máximo ${error.length} dígitos)`;
    }

    if (typeof error === 'string') {
      return error;
    }

    return '';
  }

}
