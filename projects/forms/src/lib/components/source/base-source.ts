import { signal } from "@angular/core";

/**
 * F24BaseSourceParams
 */
export interface F24BaseSourceParams {
  id?: string;
  label?: string;
  appearance?: 'fill' | 'outline';
}

/**
 * F24BaseSource
 */
export abstract class F24BaseSource {
  /**
   * id para guardar el filtro en local storage
   */
  protected readonly _id;
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
  constructor(params?: F24BaseSourceParams) {
    params = this.changeParams(params);
    this._id = signal(params?.id ?? '');
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
  public update(params?: F24BaseSourceParams) {
    /**
     * change params
     */
    params = this.changeParams(params);
    /**
     * validar si existe id
     */
    if (params?.id) {
      this._id.set(params.id);
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
   * changeParams
   */
  protected changeParams(params?: F24BaseSourceParams) {
    return params;
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