
import { ChangeDetectionStrategy, Component, contentChild, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { F24Icon } from '@f24/layout';

import { createFilterInputSource, createFilterInputSourceParams, F24FilterInputSourceParams } from './filter-input-source';

import { F24FilterDropdawn } from '../../directives/filter-dropdawn';


/**
 * F24FilterInput
 */
@Component({
  selector: 'f24-filter-input',
  styleUrls: ['filter-input.scss'],
  templateUrl: 'filter-input.html',
  standalone: true,
  imports: [
    ReactiveFormsModule, NgTemplateOutlet,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatAutocompleteModule, 
    F24Icon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'clickOutside($event)'
  }
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
   * contentChild
   */
  protected readonly dropdawnTemplate = contentChild(F24FilterDropdawn);
  /**
   * viewChild
   */
  protected readonly containerTemplate = viewChild('f24FilterInputContainer', { read: ElementRef<any> }) 
  /**
   * signals
   */
  protected readonly isOpen = signal<boolean>(false);
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
      /**
       * 
       */
      this.source().form()
    });
  }
  /**
   * clickOutside
   * @param event 
   */
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.containerTemplate()?.nativeElement.contains(target)) {
      this.isOpen.set(true);
    } else {
      this.isOpen.set(false);
    }
  }
}
