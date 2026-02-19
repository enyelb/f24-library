import { Component, effect, inject, input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, NgControl } from "@angular/forms";

import { F24FormSource, F24FormSourceParams } from '../source/form-source';
import { ControlValueAccessor } from '../../control-value';

import { F24BaseComponent } from "./base-component";

/**
 * F24FormComponent
 */
@Component({
  template: ''
})
export abstract class F24FormComponent<T, 
  Source extends F24FormSource<T>,
  Params extends F24FormSourceParams<T>,
> extends F24BaseComponent<Source, Params> implements OnInit, OnDestroy  {
  /**
   * injects
   */
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  /**
   * inputs
   */
  readonly name = input<F24FormSourceParams<T>['name']>();
  readonly default = input<F24FormSourceParams<T>['default']>();
  readonly type = input<F24FormSourceParams<T>['type']>();
  readonly disabled = input<F24FormSourceParams<T>['disabled']>();
  readonly placeholder = input<F24FormSourceParams<T>['placeholder']>();
  readonly form = input<F24FormSourceParams<T>['form']>();
  readonly change = input<F24FormSourceParams<T>['change']>();
  /**
   * constructor
   */
  constructor() {
    super();
    /**
     * efecto para asignar name
     */
    effect((onCleanup) => this.update({ name: this.name() }, onCleanup));
    /**
     * efecto para asignar default
     */
    effect((onCleanup) => this.update({ default: this.default() }, onCleanup));
    /**
     * efecto para asignar type
     */
    effect((onCleanup) => this.update({ type: this.type() }, onCleanup));
    /**
     * efecto para asignar disabled
     */
    effect((onCleanup) => this.update({ disabled: this.disabled() }, onCleanup));
    /**
     * efecto para asignar placeholder
     */
    effect((onCleanup) => this.update({ placeholder: this.placeholder() }, onCleanup));
    /**
     * efecto para asignar form
     */
    effect((onCleanup) => this.update({ form: this.form() }, onCleanup));
    /**
     * efecto para asignar change
     */
    effect((onCleanup) => this.update({ change: this.change() }, onCleanup));

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
      this.source().update({ form: this.ngControl.control as FormControl<T | null> });
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
