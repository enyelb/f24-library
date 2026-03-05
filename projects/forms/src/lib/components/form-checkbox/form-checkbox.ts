import { Component, OnInit, inject, OnDestroy, input } from '@angular/core';
import { AbstractControl, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { InputCheckbox } from '../input-checkbox';
import { ControlValueAccessor } from '../../control-value';
import { FormErrors } from '../form-errors';

/**
 * FormCheckbox
 */
@Component({
  selector: 'f24-form-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatFormFieldModule, InputCheckbox, FormErrors],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
})
export class FormCheckbox extends ControlValueAccessor implements OnInit, OnDestroy {

 /**
   * inputs
   */

  readonly label = input<string>('');
  readonly bindValue = input<string>('value');
  readonly bindTitle = input<string>('title');
  readonly bindIcon = input<string>('icon');
  readonly bindImage = input<string>('image');
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
