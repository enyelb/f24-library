import { Component, effect, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { F24Icon } from '@f24/layout'

import { F24_FORM_TOKEN } from '../../form-token';
import { ControlValueAccessor } from '../../control-value';

import { F24FormErrors } from '../form-errors';

import { createFormInputSource, createFormInputSourceParams, F24FormInputSourceParams } from './form-input-source';

/**
 * F24FormInput
 */
@Component({
  selector: 'f24-form-input',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, 
    F24FormErrors, F24Icon
  ],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  providers: [
    {
      provide: F24_FORM_TOKEN,
      useFactory: (component: F24FormInput<any>) => component,
      deps: [F24FormInput]
    },
  ],
})
export class F24FormInput<Type> implements OnInit, OnDestroy {
  /**
   * injects
   */
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  /**
   * source 
   */
  readonly params = input(createFormInputSourceParams<Type>());
  readonly source = input(createFormInputSource<Type>());
  /**
   * inputs
   */
  readonly label = input<F24FormInputSourceParams<Type>['label']>();
  readonly appearance = input<F24FormInputSourceParams<Type>['appearance']>();
  readonly name = input<F24FormInputSourceParams<Type>['name']>();
  readonly icon = input<F24FormInputSourceParams<Type>['icon']>();
  readonly default = input<F24FormInputSourceParams<Type>['default']>();
  readonly placeholder = input<F24FormInputSourceParams<Type>['placeholder']>();
  readonly form = input<F24FormInputSourceParams<Type>['form']>();
  readonly type = input<F24FormInputSourceParams<Type>['type']>();
  readonly change = input<F24FormInputSourceParams<Type>['change']>();
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
        change: this.change()
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
