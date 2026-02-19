import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { InputCheckbox } from '../input-checkbox';

import { createFormCheckboxListSource, createFormCheckboxListSourceParams } from '../source/checkbox-list-source';
import { F24CheckboxListComponent } from '../template/checkbox-list-component';

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
export class FormCheckbox<I, T> extends F24CheckboxListComponent<I, T> {
  /**
   * source 
   */
  readonly params = input(createFormCheckboxListSourceParams<I, T>());
  readonly source = input(createFormCheckboxListSource<I, T>());
  /**
   * constructor>
   */
  constructor() {
    super();
  }
}
