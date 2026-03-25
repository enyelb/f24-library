import { effect, signal, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { F24BaseSource, F24BaseSourceParams } from "./base-source";

/**
 * F24FormSourceParam
 */
export type F24FormSourceParam<Type> = {
  name?: string;
  default?: Type | null;
  type?: 'text' | 'number';
  disabled?: boolean;
  placeholder?: string;
  form?: FormControl<Type | null>
  change?: (value: Type | null) => void;
}
/**
 * F24FormSourceParams
 */
export type F24FormSourceParams<Type> = F24BaseSourceParams & F24FormSourceParam<Type>;
/**
 * F24FormSource
 */
export abstract class F24FormSource<T> extends F24BaseSource {
  /**
   * name 
   * este nombre se usa para identificar el valor cuando se envia al data source 
   */
  protected readonly _name;
  /**
   * dafault
   * este es el valor por defecto que se usa
   */
  protected readonly _default;
  /**
   * type
   * este es el tipo del mat input
   */
  protected readonly _type;
  /**
   * disabled
   * este es el disabled del mat input
   */
  protected readonly _disabled;
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
   * change
   * esta funcion emite los cambios del filtro
   */
  protected readonly _change;
  /**
   * constructor
   */
  constructor(params?: F24FormSourceParams<T>) {
    super(params);
    this._name = signal(params?.name ?? '');
    this._default = signal(params?.default ?? null);
    this._type = signal(params?.type ?? 'text');
    this._disabled = signal(params?.disabled ?? false);
    this._placeholder = signal(params?.placeholder ?? '');
    this._form = signal(params?.form ?? new FormControl(this._default()));
    this._change = signal(params?.change);

    /**
     * efecto
     */
    effect(() => {
      const disabled = this._disabled();
      untracked(() => {
        const form  = this._form();
        if (disabled) {
          form.disable();
        } else {
          form.enable();
        }
      });
    })
  }
  /**
   * metodo para obtener name
   */
  get name() {
    return this._name.asReadonly();  
  }
  /**
   * metodo para obtener default
   */
  get default() {
    return this._default.asReadonly();  
  }
  /**
   * metodo para obtener type
   */
  get type() {
    return this._type.asReadonly();  
  }
  /**
   * metodo para obtener disabled
   */
  get disabled() {
    return this._disabled.asReadonly();  
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
   * metodo para obtener fn change
   */
  get change() {
    return this._change.asReadonly();
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public override update(params?: F24FormSourceParams<T>) {
    super.update(params);
    /**
     * validar si existe name
     */
    if (params?.name) {
      this._name.set(params.name);
    }
    /**
     * validar si existe type
     */
    if (params?.type) {
      this._type.set(params.type);
    }
    /**
     * validar si existe disabled
     */
    if (params?.disabled != undefined) {
      this._disabled.set(params.disabled);
    }
    /**
     * validar si existe placeholder
     */
    if (params?.placeholder) {
      this._placeholder.set(params.placeholder);
    }
    /**
     * validar si existe form
     */
    if (params?.form) {
      this._form.set(params.form);
    }
    /**
     * validar si existe default
     */
    if (params?.default) {
      this._default.set(params.default);
      if (!this.form().value) {
        this.form().setValue(params.default);
      }
    }
    /**
     * validar si existe change
     */
    if (params?.change) {
      this._change.set(params.change);
    }
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