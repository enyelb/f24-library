import { Component, OnInit, inject, OnDestroy, input, effect } from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { InputCheckbox } from '../input-checkbox';
import { F24_FORM_TOKEN } from '../../form-token';
import { ControlValueAccessor } from '../../control-value';

import { F24FormErrors } from '../form-errors';

import { createFormCheckboxSource, createFormCheckboxSourceParams, F24FormCheckboxSourceParams, F24FormCheckboxBindSourceParams } from './form-checkbox-source';

/**
 * FormCheckbox
 */
@Component({
  selector: 'f24-form-checkbox',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatIconModule, MatFormFieldModule, 
    InputCheckbox, F24FormErrors
  ],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
  providers: [
    {
      provide: F24_FORM_TOKEN,
      useFactory: (component: F24FormCheckbox<any, any>) => component,
      deps: [F24FormCheckbox]
    },
  ],
})
export class F24FormCheckbox<Type, Item extends { [key: string]: any } > implements OnInit, OnDestroy {
  /**
   * injects
   */
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  /**
   * source 
   */
  readonly params = input(createFormCheckboxSourceParams<Type, Item>());
  readonly source = input(createFormCheckboxSource<Type, Item>());
  /**
   * inputs
   */
  readonly label = input<F24FormCheckboxSourceParams<Type, Item>['label']>();
  readonly appearance = input<F24FormCheckboxSourceParams<Type, Item>['appearance']>();
  readonly name = input<F24FormCheckboxSourceParams<Type, Item>['name']>();
  readonly icon = input<F24FormCheckboxSourceParams<Type, Item>['icon']>();
  readonly default = input<F24FormCheckboxSourceParams<Type, Item>['default']>();
  readonly placeholder = input<F24FormCheckboxSourceParams<Type, Item>['placeholder']>();
  readonly form = input<F24FormCheckboxSourceParams<Type, Item>['form']>();
  readonly type = input<F24FormCheckboxSourceParams<Type, Item>['type']>();
  readonly change = input<F24FormCheckboxSourceParams<Type, Item>['change']>();
  readonly items = input<F24FormCheckboxSourceParams<Type, Item>['items']>();
  readonly limit = input<F24FormCheckboxSourceParams<Type, Item>['limit']>();
  readonly bindValue = input<F24FormCheckboxBindSourceParams>();
  readonly bindLabel = input<F24FormCheckboxBindSourceParams>();
  readonly bindIcon = input<F24FormCheckboxBindSourceParams>();
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar params
     */
    effect(() => {
      this.source()?.update({
        label: this.label(),
        appearance: this.appearance(),
        name: this.name(),
        icon: this.icon(),
        default: this.default(),
        placeholder: this.placeholder(),
        form: this.form(),
        type: this.type(),
        change: this.change(),
        bind: {
          value: this.bindValue(),
          label: this.bindLabel(),
          icon: this.bindIcon()
        },
        items: this.items(),
        limit: this.limit()
      }, this.params());
    });
    /**
     * value ng control
     */
    if (this.ngControl) {
      this.ngControl.valueAccessor = new ControlValueAccessor();
    }
  }
  /**
   * ngOnInit
   */
  ngOnInit(): void {
    if (this.ngControl && this.ngControl.control) {
      this.source().update({ form: this.ngControl.control as FormControl<Type | null> });
    }
  }
  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.valueAccessor = null;
    }
  }
}
