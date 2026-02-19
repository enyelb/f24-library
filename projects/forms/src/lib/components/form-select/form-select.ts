import { Component, input, } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { MatIconModule } from '@angular/material/icon';


import { createFormSelectSource, createFormSelectSourceParams } from '../source/select-source';
import { F24SelectComponent } from '../template/select-component';

import { FormErrors } from '../form-errors';

/**
 * F24FormSelect
 */
@Component({
  selector: 'f24-form-select;',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MtxSelectModule, MatIconModule, FormErrors],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
})
export class F24FormSelect<I, T> extends F24SelectComponent<I, T> {
  /**
   * source 
   */
  readonly params = input(createFormSelectSourceParams<I, T>());
  readonly source = input(createFormSelectSource<I, T>());
  /**
   * constructor>
   */
  constructor() {
    super();
  }
}
