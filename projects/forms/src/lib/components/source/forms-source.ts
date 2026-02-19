import { signal } from "@angular/core";
import { FormControl } from "@angular/forms";

import { F24BaseSource, F24BaseSourceParams } from "./base-source";

import { F24FormSourceParam } from "./form-source";

/**
 * Params
 */
export type F24FormsSourceFormsForms = string | number;
/**
 * F24FormsSourceParamForm
 */
export type F24FormsSourceParam<Type, Keys extends string> = {
  [key in Keys]?: F24FormSourceParam<Type>;
}
/**
 * F24FormsSourceParams
 */
export type F24FormsSourceParams<Type, Keys extends string> = F24BaseSourceParams & F24FormsSourceParam<Type, Keys>;
/**
 * F24FormsSource
 */
export abstract class F24FormsSource<Type, Keys extends string> extends F24BaseSource {
  /**
   * expectedKeys
   * estas keys se usan para crear los forms por defecto 
   */
  protected expectedKeys: Keys[];
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _forms;
  /**
   * constructor
   */
  constructor(keys: Keys[], params?: F24FormsSourceParams<Type, Keys>) {
    super(params);
    this.expectedKeys = keys;
    this._forms = signal(this.createForms(params));
  }
  /**
   * metodo para obtener forms
   */
  get forms() {
    return this._forms.asReadonly();  
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public override update(params?: F24FormsSourceParams<Type, Keys>) {
    super.update(params);
    /**
     * validar si existe forms
     */
    if (params) {
      this._forms.set(this.createForms(params, this._forms()));
    }
  }
  /**
   * método para crear forms con valores por defecto
   * Devuelve todas las propiedades como requeridas
   */
  protected createForms(
    forms?: Partial<Record<Keys, F24FormSourceParam<Type>>>,
    formsOld?: Record<Keys, Required<F24FormSourceParam<Type>>>
  ): Record<Keys, Required<F24FormSourceParam<Type>>> {

    const result = {} as Record<Keys, Required<F24FormSourceParam<Type>>>;
      
    for (const key of this.expectedKeys) {
      const params = forms?.[key];
      const formOld = formsOld?.[key] ?? undefined;
      
      result[key as Keys] = {
        name: params?.name ?? formOld?.name ?? '',
        default: params?.default ?? formOld?.default ?? null,
        type: params?.type ?? formOld?.type ?? 'text',
        disabled: params?.disabled ?? formOld?.disabled ?? false,
        placeholder: params?.placeholder ?? formOld?.placeholder ?? '',
        form: params?.form ?? formOld?.form ?? new FormControl<Type | null>(params?.default ?? null),
        change: params?.change ?? formOld?.change ?? ((value: Type | null) => {})
      };
    }
    
    return result;
  }
  /**
   * init
   */
  public override init() {
    
  }
  /**
   * destroy
   */
  public override destroy() {
   
  }
}