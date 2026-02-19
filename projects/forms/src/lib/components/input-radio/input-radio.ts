import { Component, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldControl } from '@angular/material/form-field';

import { FormFieldSelectControl } from '../../form-field-select-control';

/**
 * InputRadio
 */
@Component({
  selector: 'f24-input-radio',
  standalone: true,
  imports: [MatRadioModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './input-radio.html',
  styleUrl: './input-radio.scss',
  providers: [{provide: MatFormFieldControl, useExisting: InputRadio}],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
})
export class InputRadio<I, T> extends FormFieldSelectControl<I, T> {
  /**
   * view childs
   */
  readonly container = viewChild.required<HTMLInputElement>('container');

  /**
   * name
   */
  protected override name: string = 'f24-input-radio';

  /**
   * constructor
   */
  constructor() {
    super();

    this.shouldLabelFloat = true;
  }

  /**
   * onContainerClick
   * @param event
   */
  onContainerClick(event: MouseEvent): void {
    this.focusMonitor.focusVia(this.container(), 'program');
  }
}
