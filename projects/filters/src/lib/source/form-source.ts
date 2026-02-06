import { signal } from "@angular/core";
import { FormControl } from "@angular/forms";

import { Subscription } from "rxjs";

import { F24FilterSource, F24FilterSourceParams } from "./filter-source";

/**
 * F24FilterSourceParamForm
 */
export type F24FilterSourceParamForm<Type> = {
  name?: string;
  default?: Type | null;
  placeholder?: string;
  form?: FormControl<Type | null>
  change?: (value: Type | null) => void;
}
/**
 * F24FilterSourceFormParams
 */
export type F24FilterSourceFormParams<Type> = F24FilterSourceParams & F24FilterSourceParamForm<Type>;
/**
 * F24FilterSourceForm
 */
export abstract class F24FilterSourceForm<T> extends F24FilterSource {
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
   * subscription
   */
  protected subscription?: Subscription;
  /**
   * constructor
   */
  constructor(params?: F24FilterSourceFormParams<T>) {
    super(params);
    this._name = signal(params?.name ?? '');
    this._default = signal(params?.default ?? null);
    this._placeholder = signal(params?.placeholder ?? '');
    this._form = signal(params?.form ?? new FormControl(this._default()));
    this._change = signal(params?.change);
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
  public override update(params?: F24FilterSourceFormParams<T>) {
    super.update(params);
    /**
     * validar si existe name
     */
    if (params?.name) {
      this._name.set(params.name);
    }
    /**
     * validar si existe default
     */
    if (params?.default) {
      this._default.set(params.default);
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
    /**
     * obtener los filtros actuales del datasource
     * para obtener el filtro asociado al este forms
     */
    const dataSource = this._dataSource();
    const name = this._name();
    const filtersOLd = dataSource?.filters()
    const filterOld = filtersOLd && name in filtersOLd ? filtersOLd[name] : null;
    /**
     * destruir las suscripciones anteriores
     */
    this.destroy();
    /**
     * buscar en local storage
     */
    const local = this.getStorage();
    /**
     * usar el valor que tiene el filtro en el data source
     * si el valor no esta usar el de local storage
     */
    const form = this._form();
    form.setValue(filterOld ?? local, { emitEvent: !filterOld });
    /**
     * si el filtro en el data source no existe y el local storage esta
     * actualizar el data source
     */
    if (!filterOld && local) {
      if (dataSource && name) {
        dataSource.update({
          filter: { name, value: local }
        });
      }
    }
    /**
     * suscripcion para ver si el valor de form cambia
     */
    this.subscription = form.valueChanges.subscribe(value => {
      /**
       * emitir el valor del filtro
       */
      const change = this._change();
      if (change) {
        change(value);
      }
      /**
       * guardar el valor en local storage
       */
      this.setStorage(value);
      /**
       * si la variable name y datasource existen, setear el valor del filtro
       */
      const name = this._name();
      const dataSource = this._dataSource();
      if (dataSource && name) {
        dataSource.update({
          filter: { name, value }
        });
      }
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