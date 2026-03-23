import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { createFormInputSource, createFormInputSourceParams } from '../source/input-source';
import { F24InputComponent } from '../template/input-component';

import { FormErrors } from '../form-errors';
import { F24_FORM_TOKEN } from '../../form-token';

/**
 * FormInput
 */
@Component({
  selector: 'f24-form-input',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, FormErrors],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  providers: [
    {
      provide: F24_FORM_TOKEN,
      useFactory: (component: F24FormInput) => component,
      deps: [F24FormInput]
    },
  ],
})
export class F24FormInput<T = string> extends F24InputComponent<T> {
  /**
   * source 
   */
  readonly params = input(createFormInputSourceParams<T>());
  readonly source = input(createFormInputSource<T>());
  /**
   * constructor
   */
  constructor() {
    super();
  }
}
