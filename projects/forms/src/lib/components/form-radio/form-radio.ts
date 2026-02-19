import { Component, OnInit, inject, OnDestroy, input } from '@angular/core';
import { NgControl, ReactiveFormsModule, AbstractControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { InputRadio } from '../input-radio';
import { ControlValueAccessor } from '../../control-value';
import { FormErrors } from '../form-errors';

@Component({
  selector: 'f24-form-radio',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatFormFieldModule, InputRadio, FormErrors],
  templateUrl: './form-radio.html',
  styleUrl: './form-radio.scss',
})
export class FormRadio extends ControlValueAccessor implements OnInit, OnDestroy {

  /**
   * inputs
   */

  readonly label = input<string>('');
  readonly bindValue = input<string>('value');
  readonly bindTitle = input<string>('title');
  readonly bindIcon = input<string>('icon');
  readonly bindImage = input<string>('image');
  readonly limit = input<number>(30);
  readonly items = input<{ [key: string]: any }[]>([]);
  public formControl = input<AbstractControl | null>(null);

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
}
