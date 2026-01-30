import { F24DataSource } from '@f24/data';

import { signal } from "@angular/core";

/**
 * F24FilterSourceParams
 */
export interface F24FilterSourceParams {
  id?: string;
  dataSource?: F24DataSource<any>;
  label?: string;
  appearance?: 'fill' | 'outline';
}

/**
 * F24FilterSource
 */
export abstract class F24FilterSource {
  /**
   * id para guardar el filtro en local storage
   */
  protected readonly _id;
  /**
   * dataSource variable para pasar el filtro 
   * al datasource cuando cambie este input 
   */
  protected readonly _dataSource;
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
   * constructor
   */
  constructor(params?: F24FilterSourceParams) {
    this._id = signal(params?.id ?? '');
    this._dataSource = signal(params?.dataSource);
    this._label = signal(params?.label ?? '');
    this._appearance = signal(params?.appearance ?? 'outline');
  }
  /**
   * metodo para obtener id
   */
  get id() {
    return this._id.asReadonly();  
  }
  /**
   * metodo para obtener dataSource
   */
  get dataSource() {
    return this._dataSource.asReadonly();  
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
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FilterSourceParams) {
    /**
     * validar si existe id
     */
    if (params?.id) {
      this._id.set(params.id);
    }
    /**
     * validar si existe dataSource
     */
    if (params?.dataSource) {
      this._dataSource.set(params.dataSource);
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
   * storage
   */
  getStorage(from: string = ''): any {
    /**
     * obtener los filtros guardados en local storage
     */
    const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
    /**
     * validar si el id existe en los filtros y guardar los filtros
     */
    const id = this._id() + from;
    if (id in filters) {
      return filters[id];
    }
    return null;
  }
  /**
   * storage
   */
  setStorage(value: any, from: string = '') {
    /**
     * obtener los filtros guardados en local storage
     */
    const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
    /**
     * validar si el id existe en los filtros y guardar los filtros
     */
    const id = this._id();
    if (id) {
      if (value instanceof Array && value.length === 0) {
        delete filters[id + from];
      } else if (value) {
        filters[id + from] = value;
      } else {
        delete filters[id + from];
      } 
      localStorage.setItem("filters", JSON.stringify(filters));
    }
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