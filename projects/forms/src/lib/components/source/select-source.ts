import { signal } from "@angular/core";

import { F24FormSource, F24FormSourceParams } from "./form-source";

/**
 * F24FormSourceParams
 */
export type F24FormSelectSourceParams<Item, Type> = F24FormSourceParams<Type> & {
  multiple?: boolean
  items?: Item[]
  formatter?: (data: Item) => string | {
    label: (data: Item) => string
    value: (data: Item) => string
  },
  bind?: string | {
    label: string
    value: string
  }
}
/**
 * F24FormSelectSource
 */
export class F24FormSelectSource<Item, Type> extends F24FormSource<Type> {
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
  constructor(params?: F24FormSelectSourceParams<Item, Type>) {
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
  public override update(params?: F24FormSelectSourceParams<Item, Type>) {
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
   * formatterDefault
   */
  private formatterDefault(bind: string | undefined, data: Item) {
    if (!bind || !(data instanceof Object)) {
      return '';
    }
    for(const [key, value] of Object.entries(data)) {
      if (key === bind) {
        return value;
      }
    }
  }
  /**
   * formatterLabel
   */
  private formatterLabel(data: Item) {
    return this.formatterDefault(this._bind().label, data);
  }
  /**
   * formatterValue
   */
  private formatterValue(data: Item) {
    return this.formatterDefault(this._bind().value, data);
  }
  /**
   * metodo para crear formatters
   */
  protected createFormatter(formatters?: F24FormSelectSourceParams<Item, Type>['formatter']): { label: (data: Item) => string, value: (data: Item) => string } {
    return {
      label: (formatters ? typeof formatters === 'function' ? formatters : formatters['label'] : undefined) ?? ((item: Item) => this.formatterLabel(item)),
      value: (formatters ? typeof formatters === 'function' ? formatters : formatters['value'] : undefined) ?? ((item: Item) => this.formatterValue(item)),
    }
  }
  /**
   * metodo para crear formatters
   */
  protected createBind(binds?: F24FormSelectSourceParams<Item, Type>['bind']): { label: string, value: string } {
    return {
      label: (binds ? typeof binds === 'string' ? binds : binds['label'] : undefined) ?? 'label',
      value: (binds ? typeof binds === 'string' ? binds : binds['value'] : undefined) ?? 'value'
    }
  }
}
/**
 * createFormSelectSource
 */
export const createFormSelectSource = <Item, Type>(params?: F24FormSelectSourceParams<Item, Type>) => {
  return new F24FormSelectSource(params);
}
/**
 * createFormSelectSourceParams
 */
export const createFormSelectSourceParams = <Item, Type>(params?: F24FormSelectSourceParams<Item, Type>) => {
  return params;
}