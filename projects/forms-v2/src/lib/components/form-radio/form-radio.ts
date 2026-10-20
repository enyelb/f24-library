import { Component, OnInit, inject, OnDestroy, input, effect } from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { InputRadio } from '../input-radio';
import { F24_FORM_TOKEN } from '../../form-token';
import { ControlValueAccessor } from '../../control-value';

import { F24FormErrors } from '../form-errors';

import { createFormRadioSource, createFormRadioSourceParams, F24FormRadioSourceParams, F24FormRadioBindSourceParams } from './form-radio-source';

/**
 * F24FormRadio
 */
@Component({
  selector: 'f24-form-radio',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatIconModule, MatFormFieldModule, 
    InputRadio, F24FormErrors
  ],
  templateUrl: './form-radio.html',
  styleUrl: './form-radio.scss',
  providers: [
    {
      provide: F24_FORM_TOKEN,
      useFactory: (component: F24FormRadio<any, any>) => component,
      deps: [F24FormRadio]
    },
  ],
})
export class F24FormRadio<Type, Item extends { [key: string]: any } > implements OnInit, OnDestroy {
  /**
   * injects
   */
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  /**
   * source 
   */
  readonly params = input(createFormRadioSourceParams<Type, Item>());
  readonly source = input(createFormRadioSource<Type, Item>());
  /**
   * inputs
   */
  readonly label = input<F24FormRadioSourceParams<Type, Item>['label']>();
  readonly appearance = input<F24FormRadioSourceParams<Type, Item>['appearance']>();
  readonly name = input<F24FormRadioSourceParams<Type, Item>['name']>();
  readonly icon = input<F24FormRadioSourceParams<Type, Item>['icon']>();
  readonly default = input<F24FormRadioSourceParams<Type, Item>['default']>();
  readonly placeholder = input<F24FormRadioSourceParams<Type, Item>['placeholder']>();
  readonly form = input<F24FormRadioSourceParams<Type, Item>['form']>();
  readonly type = input<F24FormRadioSourceParams<Type, Item>['type']>();
  readonly change = input<F24FormRadioSourceParams<Type, Item>['change']>();
  readonly items = input<F24FormRadioSourceParams<Type, Item>['items']>();
  readonly limit = input<F24FormRadioSourceParams<Type, Item>['limit']>();
  readonly bindValue = input<F24FormRadioBindSourceParams>();
  readonly bindLabel = input<F24FormRadioBindSourceParams>();
  readonly bindIcon = input<F24FormRadioBindSourceParams>();
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
