import { signal } from "@angular/core";
import { F24FilterSourceInput, F24FilterSourceInputParams } from "./input-source";

/**
 * F24FilterSourceSelectType
 */
export type F24FilterSourceSelectType = string | number | [];

/**
 * F24FilterSourceParams
 */
export interface F24FilterSourceSelectParams<D, T = F24FilterSourceSelectType> extends F24FilterSourceInputParams<T>{
  multiple?: boolean
  items?: D[]
  formatter?: (data: D) => string | {
    label: (data: D) => string
    value: (data: D) => string
  },
  bind?: string | {
    label: string
    value: string
  }
}
/**
 * F24FilterSourceSelect
 */
export class F24FilterSourceSelect<D, T = F24FilterSourceSelectType> extends F24FilterSourceInput<T> {
  /**
   * multiple
   */
  protected readonly _multiple;
  /**
   * bindLabel
   */
  protected readonly _bind;
  /**
   * items
   */
  protected readonly _items;
  /**
   * formatter
   */
  protected readonly _formatter;
  /**
   * constructor
   */
  constructor(params?: F24FilterSourceSelectParams<D, T>) {
    super(params);
    this._multiple = signal(params?.multiple ?? false);
    this._items = signal(params?.items ?? []);
    this._bind = signal(this.createBind(params?.bind));
    this._formatter = signal(this.createFormatter(params?.formatter));
    
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public override update(params?: F24FilterSourceSelectParams<D, T>) {
    super.update(params);
    /**
     * validar exiten los parametros
     */
    if (!params) {
      return;
    }
    /**
     * validar si existe multiple
     */
    if (params?.multiple) {
      this._multiple.set(params.multiple);
    }
    /**
     * validar si existe items
     */
    if (params?.items) {
      this._items.set(params.items);
    }
    /**
     * validar si existe bind
     */
    if (params?.bind) {
      this._bind.set(this.createBind(params.bind));
    }
    /**
     * validar si existe formatter
     */
    if (params?.formatter) {
      this._formatter.set(this.createFormatter(params.formatter));
    }
  }
  /**
   * metodo para obtener multiple
   */
  get multiple() {
    return this._multiple.asReadonly();  
  }
  /**
   * metodo para obtener bind
   */
  get bind() {
    return this._bind.asReadonly();  
  }
  /**
   * metodo para obtener items
   */
  get items() {
    return this._items.asReadonly();
  }
  /**
   * metodo para obtener formatter
   */
  get formatter() {
    return this._formatter.asReadonly();
  }
  /**
   * metodo para crear formatters
   */
  protected createFormatter(formatters?: any): { label: (data: D) => string, value: (data: D) => string } {
    const formatter = (bind: string) => (data: D) => {
      if (!bind || !(data instanceof Object)) {
        return;
      }
      for(const [key, value] of Object.entries(data)) {
        if (key === bind) {
          return value;
        }
      }
    }
    return {
      label: (formatters && 'label' in formatters ? formatters.label : formatters) ?? formatter(this._bind().label),
      value: (formatters && 'value' in formatters ? formatters.value : formatters) ?? formatter(this._bind().value)
    }
  }
  /**
   * metodo para crear formatters
   */
  protected createBind(binds?: any): { label: string, value: string } {
    return {
      label: (binds && 'label' in binds ? binds.label : binds) ?? '',
      value: (binds && 'value' in binds ? binds.value : binds) ?? ''
    }
  }
}
/**
 * createFilterSourceSelect
 */
export const createFilterSourceSelect = <D, T = F24FilterSourceSelectType>(params?: F24FilterSourceSelectParams<D, T>) => {
  return new F24FilterSourceSelect(params);
}