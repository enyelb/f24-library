import { CommonModule } from '@angular/common';

import { Component, OnInit, inject, OnDestroy, input, output, forwardRef } from '@angular/core';
import { NgControl, ReactiveFormsModule, AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';


import { InputPhone } from '../input-phone';
import { ControlValueAccessor } from '../control-value';
import { FormErrors } from '../form-errors';

/**
 * FormPhone
 */
@Component({
  selector: 'f24-form-phone',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, InputPhone, FormErrors],
  templateUrl: './form-phone.html',
  styleUrl: './form-phone.scss',
  providers: [
  ]
})
export class FormPhone extends ControlValueAccessor implements OnInit, OnDestroy {
  /**
   * inputs
   */
  public label = input<string>('Phone');
  readonly placeholder = input<string>('');
  public type = input<string>('text');
  public formControl = input<AbstractControl | null>(null);

  /**
   * outputs
   */
  public changes = output<any>()

  /**
   * injects
   */
  private ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });


  /**
   * constructor
   */
  constructor() {
    super();

    // Configurar el value accessor
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.init(this.ngControl, this.formControl());
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroy(this.ngControl);
  }

  /**
   * changeEmit
   * @param event
   * @returns
   */
  protected changeEmit() {
    setTimeout(() => {
      this.changes.emit(this.control().value);
    }, 0)
  }
}
