import { F24DataSource } from '@f24/data';

import { signal } from "@angular/core";

/**
 * F24FilterSourceInputParams
 */
export interface F24FilterSourceParams<T> {
  id?: string;
  dataSource?: F24DataSource<any>;
  name?: string;
  default?: T;
  label?: string;
  appearance?: 'fill' | 'outline';
  change?: (value: T | null | undefined) => void;
}

/**
 * F24FilterSourceInput
 */
export abstract class F24FilterSource<T> {
  /**
   * id para guardar el filtro en local storage
   */
  protected readonly _id;
  /**
   * name 
   * este nombre se usa para identificar el valor cuando se envia al data source 
   */
  protected readonly _name;
  /**
   * dataSource variable para pasar el filtro 
   * al datasource cuando cambie este input 
   */
  protected readonly _dataSource;
  /**
   * dafault
   * este es el valor por defecto que se usa
   */
  protected readonly _default;
  /**
   * label
   * este es el label del mat input
   */
  protected readonly _label;
  /**
   * appearance
   * esta es la apariencia del mat input
   */
  protected readonly _appearance;
  /**
   * change
   * esta funcion emite los cambios del filtro
   */
  protected readonly _change;
  /**
   * constructor
   */
  constructor(params?: F24FilterSourceParams<T>) {
    this._id = signal(params?.id ?? '');
    this._name = signal(params?.name ?? '');
    this._dataSource = signal(params?.dataSource);
    this._default = signal(params?.default);
    this._label = signal(params?.label ?? '');
    this._appearance = signal(params?.appearance ?? 'outline');
    this._change = signal(params?.change);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FilterSourceParams<T>) {
    /**
     * validar si existe id
     */
    if (params?.id) {
      this._id.set(params.id);
    }
    /**
     * validar si existe name
     */
    if (params?.name) {
      this._name.set(params.name);
    }
    /**
     * validar si existe dataSource
     */
    if (params?.dataSource) {
      this._dataSource.set(params.dataSource);
    }
    /**
     * validar si existe default
     */
    if (params?.default) {
      this._default.set(params.default);
    }
    /**
     * validar si existe label
     */
    if (params?.label) {
      this._label.set(params.label);
    }
    /**
     * validar si existe appearance
     */
    if (params?.appearance) {
      this._appearance.set(params.appearance);
    }
  }
  /**
   * value
   */
  protected value(value: T | null | undefined) {
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
      dataSource.filter(name, value);
    }
  }
  /**
   * storage
   */
  getStorage(): T | null {
    /**
     * obtener los filtros guardados en local storage
     */
    const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
    /**
     * validar si el id existe en los filtros y guardar los filtros
     */
    const id = this._id();
    if (id in filters) {
      return filters[id] as T;
    }
    return this.default() ?? null;
  }
  /**
   * storage
   */
  setStorage(value: T | null | undefined) {
    /**
     * obtener los filtros guardados en local storage
     */
    const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
    /**
     * validar si el id existe en los filtros y guardar los filtros
     */
    const id = this._id();
    if (id) {
      filters[id] = value;
      localStorage.setItem("filters", JSON.stringify(filters));
    }
  }
  /**
   * metodo para obtener id
   */
  get id() {
    return this._id.asReadonly();  
  }
  /**
   * metodo para obtener name
   */
  get name() {
    return this._name.asReadonly();  
  }
  /**
   * metodo para obtener dataSource
   */
  get dataSource() {
    return this._dataSource.asReadonly();  
  }
  /**
   * metodo para obtener default
   */
  get default() {
    return this._default.asReadonly();  
  }
  /**
   * metodo para obtener label
   */
  get label() {
    return this._label.asReadonly();  
  }
  /**
   * metodo para obtener appearance
   */
  get appearance() {
    return this._appearance.asReadonly();
  }
  /**
   * metodo para obtener fn change
   */
  get change() {
    return this._change.asReadonly();
  }

  /**
   * init
   */
  abstract init(): void;
  
  /**
   * destroy
   */
  abstract destroy(): void;
}