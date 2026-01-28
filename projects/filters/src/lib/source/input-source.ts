
import { signal } from "@angular/core";
import { FormControl } from "@angular/forms";

import { Subscription } from "rxjs";

import { F24FilterSource, F24FilterSourceParams } from "./filter-source";

/**
 * F24FilterSourceInputParams
 */
export interface F24FilterSourceInputParams<T> extends F24FilterSourceParams<T> {
  placeholder?: string;
  form?: FormControl<T | null>
}

/**
 * F24FilterSourceInput
 */
export class F24FilterSourceInput<T> extends F24FilterSource<T> {
  /**
   * placeholder
   * este es el placeholder del mat input
   */
  protected readonly _placeholder;
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _form;
  /**
   * subscription
   */
  protected subscription?: Subscription;
  /**
   * constructor
   */
  constructor(params?: F24FilterSourceInputParams<T>) {
    super(params);
    this._placeholder = signal(params?.placeholder ?? '');
    this._form = signal(params?.form ?? new FormControl(this._default()));
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public override update(params?: F24FilterSourceInputParams<T>) {
    super.update(params);
    /**
     * validar si existe placeholder
     */
    if (params?.placeholder) {
      this._placeholder.set(params.placeholder);
    }
  }
  /**
   * metodo para obtener placeholder
   */
  get placeholder() {
    return this._placeholder.asReadonly();  
  }
  /**
   * metodo para obtener form
   */
  get form() {
    return this._form.asReadonly();  
  }
  /**
   * init
   */
  public override init() {
    /**
     * buscar en local storage y asignar el valor al formulario
     */
    const value = this.getStorage();
    this.form().setValue(value);
    /**
     * suscripcion para ver si el valor de form cambia
     */
    this.subscription = this._form().valueChanges.subscribe(value => {
      this.value(value);
    });
  }
  /**
   * destroy
   */
  public override destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

/**
 * createFilterSourceInput
 */
export const createFilterSourceInput = <T = string | number>(params?: F24FilterSourceInputParams<T>) => {
  return new F24FilterSourceInput<T>(params);
}