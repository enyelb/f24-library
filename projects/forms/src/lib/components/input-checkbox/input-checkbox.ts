import { Component, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FormFieldSelectControl } from '../../form-field-select-control';
import { MatFormFieldControl } from '@angular/material/form-field';

/**
 * InputCheckbox
 */
@Component({
  selector: 'f24-input-checkbox',
  standalone: true,
  imports: [MatCheckboxModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './input-checkbox.html',
  styleUrl: './input-checkbox.scss',
  providers: [{provide: MatFormFieldControl, useExisting: InputCheckbox}],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
})
export class InputCheckbox<I, T> extends FormFieldSelectControl<I, T> {
  
  /**
   * view childs
   */
  readonly container = viewChild.required<HTMLInputElement>('container');

  /**
   * name
   */
  protected override name: string = 'f24-input-checkbox';

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
    /*const values = this.value || [];

    if (event.checked) {
      values.push(event.source.value as T);
    } else {
      values.splice(values.indexOf(event.source.value as T), 1);
    }

    this.value = values;*/
  }

  /**
   * onContainerClick
   * @param event
   */
  onContainerClick(event: MouseEvent): void {
    this.focusMonitor.focusVia(this.container(), 'program');
  }
}
