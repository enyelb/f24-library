import { Component, effect, inject, input, OnDestroy, OnInit, } from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { MatIconModule } from '@angular/material/icon';

import { F24_FORM_TOKEN } from '../../form-token';
import { ControlValueAccessor } from '../../control-value';
import { F24FormErrors } from '../form-errors';

import { 
  createFormSelectSource, createFormSelectSourceParams, 
  F24FormSelectSourceParams, F24FormSelectBindSourceParams, F24FormSelectFormatterSourceParams
} from './filter-select-source';

/**
 * F24FormSelect
 */
@Component({
  selector: 'f24-form-select;',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MtxSelectModule, MatIconModule, 
    F24FormErrors
  ],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
  providers: [
    {
      provide: F24_FORM_TOKEN,
      useFactory: (component: F24FormSelect<any, any>) => component,
      deps: [F24FormSelect]
    },
  ],
})
export class F24FormSelect<Type, Item> implements OnInit, OnDestroy {
  /**
   * injects
   */
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  /**
   * source 
   */
  readonly params = input(createFormSelectSourceParams<Type, Item>());
  readonly source = input(createFormSelectSource<Type, Item>());
  /**
   * inputs
   */
  readonly label = input<F24FormSelectSourceParams<Type, Item>['label']>();
  readonly appearance = input<F24FormSelectSourceParams<Type, Item>['appearance']>();
  readonly name = input<F24FormSelectSourceParams<Type, Item>['name']>();
  readonly icon = input<F24FormSelectSourceParams<Type, Item>['icon']>();
  readonly default = input<F24FormSelectSourceParams<Type, Item>['default']>();
  readonly placeholder = input<F24FormSelectSourceParams<Type, Item>['placeholder']>();
  readonly form = input<F24FormSelectSourceParams<Type, Item>['form']>();
  readonly type = input<F24FormSelectSourceParams<Type, Item>['type']>();
  readonly change = input<F24FormSelectSourceParams<Type, Item>['change']>();
  readonly multiple = input<F24FormSelectSourceParams<Type, Item>['multiple']>();
  readonly items = input<F24FormSelectSourceParams<Type, Item>['items']>();
  readonly formatterLabel = input<F24FormSelectFormatterSourceParams<Item>>();
  readonly formatterValue = input<F24FormSelectFormatterSourceParams<Item>>();
  readonly bindLabel = input<F24FormSelectBindSourceParams>();
  readonly bindValue = input<F24FormSelectBindSourceParams>();
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
        multiple: this.multiple(),
        items: this.items(),
        formatter: {
          label: this.formatterLabel(),
          value: this.formatterValue()
        },
        bind: {
          label: this.bindLabel(),
          value: this.bindValue()
        }
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
