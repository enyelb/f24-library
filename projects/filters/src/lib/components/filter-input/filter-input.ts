
import { ChangeDetectionStrategy, Component, effect, input, OnDestroy, OnInit, untracked } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { F24Icon } from '@f24/layout';

import { createFilterInputSource, createFilterInputSourceParams, F24FilterInputSourceParams } from './filter-input-source';

/**
 * F24FilterInput
 */
@Component({
  selector: 'f24-filter-input',
  styleUrls: ['filter-input.scss'],
  templateUrl: 'filter-input.html',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, MatInputModule, MatButtonModule,
    F24Icon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24FilterInput<Type> {
  /**
   * source 
   */
  readonly params = input(createFilterInputSourceParams<Type>());
  readonly source = input(createFilterInputSource<Type>());
  /**
   * inputs
   */
  readonly id = input<F24FilterInputSourceParams<Type>['id']>();
  readonly dataSource = input<F24FilterInputSourceParams<Type>['dataSource']>();
  readonly label = input<F24FilterInputSourceParams<Type>['label']>();
  readonly appearance = input<F24FilterInputSourceParams<Type>['appearance']>();
  readonly name = input<F24FilterInputSourceParams<Type>['name']>();
  readonly icon = input<F24FilterInputSourceParams<Type>['icon']>();
  readonly default = input<F24FilterInputSourceParams<Type>['default']>();
  readonly placeholder = input<F24FilterInputSourceParams<Type>['placeholder']>();
  readonly form = input<F24FilterInputSourceParams<Type>['form']>();
  readonly type = input<F24FilterInputSourceParams<Type>['type']>();
  readonly change = input<F24FilterInputSourceParams<Type>['change']>();
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar params
     */
    effect(() => {
      this.source()?.update({
        id: this.id(),
        dataSource: this.dataSource(),
        label: this.label(),
        appearance: this.appearance(),
        name: this.name(),
        icon: this.icon(),
        default: this.default(),
        placeholder: this.placeholder(),
        form: this.form(),
        type: this.type(),
        change: this.change()
      }, this.params());
    });
  }
}
