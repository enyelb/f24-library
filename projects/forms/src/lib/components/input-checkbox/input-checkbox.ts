import { Component, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldControl } from '@angular/material/form-field';

import { F24FilterInput } from '@f24/filters';
import { F24ColDirective, F24RowDirective } from '@f24/layout';

import { FormFieldSelectControl } from '../../form-field-select-control';


/**
 * InputCheckbox
 */
@Component({
  selector: 'f24-input-checkbox',
  standalone: true,
  imports: [
    MatCheckboxModule, MatInputModule, MatIconModule, ReactiveFormsModule, 
    F24FilterInput, F24ColDirective, F24RowDirective,
  ],
  templateUrl: './input-checkbox.html',
  styleUrl: './input-checkbox.scss',
  providers: [{provide: MatFormFieldControl, useExisting: InputCheckbox}],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
})
export class InputCheckbox extends FormFieldSelectControl<Array<string | number | boolean>> {
  
  /**
   * view childs
   */
  readonly container = viewChild.required<HTMLInputElement>('container');

  /**
   * name
   */
  protected override name: string = 'f24-input-checkbox';

  /**
   * on change
   */
  protected readonly change = (value: string | null) => {
    this.search.set(value ?? '');
  }

  /**
   * constructor
   */
  constructor() {
    super();

    this.shouldLabelFloat = true;
  }

  /**
   * onChange
   */
  onChange(event: MatCheckboxChange) {
    const values = this.value || [];

    if (event.checked) {
      values.push(event.source.value);
    } else {
      values.splice(values.indexOf(event.source.value), 1);
    }

    this.value = values;
  }

  /**
   * onContainerClick
   * @param event
   */
  onContainerClick(event: MouseEvent): void {
    this.focusMonitor.focusVia(this.container(), 'program');
  }
}
