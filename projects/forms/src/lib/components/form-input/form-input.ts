import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { createFormInputSource, createFormInputSourceParams } from '../source/input-source';
import { F24InputComponent } from '../template/input-component';

import { FormErrors } from '../form-errors';

/**
 * FormInput
 */
@Component({
  selector: 'f24-form-input',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, FormErrors],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class F24FormInput<T> extends F24InputComponent<T> {
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
