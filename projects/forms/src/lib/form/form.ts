import { Signal } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { F24FormField } from "./form-field";

/**
 * F24FormConfigType
 */
export type F24FormConfigType<T> = {
  [K in keyof T]: T[K] extends object
    ? F24FormConfigType<T[K]>
    : F24FormField<T[K]>;
};
/**
 * F24FormModelType
 */
export type F24FormModelType<C> = C extends F24FormField<infer U> 
  ? Signal<U> : { [K in keyof C]: F24FormModelType<C[K]> };
/**
 * F24FormModelPlainType
 */
export type F24FormModelPlainType<C> = C extends F24FormField<infer U> 
  ? U : { [K in keyof C]: F24FormModelPlainType<C[K]> };
/**
 * F24FormControlType
 */
export type F24FormControlType<C> = C extends F24FormField<infer U> 
  ? FormControl<U> : { [K in keyof C]: F24FormControlType<C[K]> };
/**
 * F24FormGroupType
 */
export type F24FormGroupType<C> = FormGroup<{
  [K in keyof C]: C[K] extends object
    ? F24FormGroupType<C[K]>
    : FormControl<C[K]>;
}> & {  
  controls: { 
    [K in keyof C]: C[K] extends object
      ? F24FormGroupType<C[K]>
      : FormControl<C[K]>;
  }
};
/**
 * F24FromField 
 */
export class F24Form<C extends F24FormConfigType<any>> {
  /**
   * campos
   */
  private readonly _fields: F24FormConfigType<C>;
  /**
   * modelo
   */
  private readonly _model: F24FormModelType<C>;
  /**
   * controles
   */
  private readonly _controls: F24FormControlType<C>;
  /**
   * grupos
   */
  private readonly _group: F24FormGroupType<C>;
  /**
   * constructor
   *
   * @param config
   */
  constructor(fields: C) {
    this._fields = fields;
    this._model = this.createModel(this._fields) as F24FormModelType<C>;
    this._controls = this.createControls(this._fields) as F24FormControlType<C>;
    this._group = this.createFormGroup(this._fields) as F24FormGroupType<C>;
  }
  /**
   * crear el formulario
   * 
   * @param fields campos del formulario
   */
  protected createFormGroup<U>(fields: F24FormConfigType<U>): F24FormGroupType<U> {
    const controls: any = {};
    for (const key in fields) {
      controls[key] = fields[key] instanceof F24FormField ? fields[key].form : this.createFormGroup(fields[key] as F24FormConfigType<U>);
    }
    return new FormGroup(controls) as F24FormGroupType<U>;
  }
  /**
   * crear modelo
   * 
   * @param fields campos del formulario
   */
  protected createModel<U>(fields: F24FormConfigType<U>): F24FormModelType<U> {
    const models: any = {};
    for (const key in fields) {
      models[key] = fields[key] instanceof F24FormField ? fields[key].value : this.createModel(fields[key] as F24FormConfigType<U>);
    }
    return models as F24FormModelType<U>;
  }
  /**
   * crear controles
   * 
   * @param fields campos del formulario
   */
  protected createControls<U>(fields: F24FormConfigType<U>): F24FormControlType<U> {
    const controls: any = {};
    for (const key in fields) {
      controls[key] = fields[key] instanceof F24FormField ? fields[key].form : this.createControls(fields[key] as F24FormConfigType<U>);
    }
    return controls as F24FormControlType<U>;
  }
  /**
   * fields
   */
  get fields(): F24FormConfigType<C> {
    return this._fields;
  }
  /**
   * controls
   */
  get controls(): F24FormControlType<C> {
    return this._controls;
  }
  /**
   * group
   */
  get group(): F24FormGroupType<C> {
    return this._group;
  }
  /**
   * model
   */
  get model(): F24FormModelType<C> {
    return this._model;
  }
  /**
   * value
   */
  get value(): F24FormModelPlainType<C> {
    return this._group.value as F24FormModelPlainType<C>;
  }
  /**
   * invalid
   */
  get invalid(): boolean {
    return this._group.invalid;
  }
  /**
   * valid
   */
  get valid(): boolean {
    return this._group.valid;
  }
  /**
   * markAsTouched
   */
  markAsTouched() {
    this._group.markAllAsTouched();
  }
  /**
   * markAsUntouched
   */
  markAsUntouched() {
    this._group.markAsUntouched();
  }
  /**
   * reset
   */
  reset() {
    this._group.reset();
  }
}
/**
 * crear formulario
 * 
 * @param config cofigurariones del formulario
 */
export function createForm<C extends F24FormConfigType<any>>(config: C): F24Form<C> {
  return new F24Form<C>(config);
}