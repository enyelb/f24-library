import { Component, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldControl } from '@angular/material/form-field';

import { F24FilterInput } from '@f24/filters';
import { F24ColDirective, F24RowDirective } from '@f24/layout';

import { FormFieldSelectControl } from '../../form-field-select-control';

/**
 * InputRadio
 */
@Component({
  selector: 'f24-input-radio',
  standalone: true,
  imports: [
    MatRadioModule, MatIconModule, MatInputModule, ReactiveFormsModule,
    F24FilterInput, F24ColDirective, F24RowDirective,
  ],
  templateUrl: './input-radio.html',
  styleUrl: './input-radio.scss',
  providers: [{provide: MatFormFieldControl, useExisting: InputRadio}],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
})
export class InputRadio extends FormFieldSelectControl<string | number | boolean> {
  /**
   * view childs
   */
  readonly container = viewChild.required<HTMLInputElement>('container');

  /**
   * name
   */
  protected override name: string = 'f24-input-radio';

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
   * onContainerClick
   * @param event
   */
  onContainerClick(event: MouseEvent): void {
    this.focusMonitor.focusVia(this.container(), 'program');
  }
}
