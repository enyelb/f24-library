import { signal } from "@angular/core";

import { F24FilterSourceForm, F24FilterSourceFormParams } from "./form-source";

/**
 * Params
 */
export type F24FilterSourceSelectType = string | number | [];
/**
 * F24FilterSourceParams
 */
export interface F24FilterSourceSelectParams<Item, Type extends F24FilterSourceSelectType> extends F24FilterSourceFormParams<Type> {
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
 * F24FilterSourceSelect
 */
export class F24FilterSourceSelect<Item, Type extends F24FilterSourceSelectType> extends F24FilterSourceForm<Type> {
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
  constructor(params?: F24FilterSourceSelectParams<Item, Type>) {
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
  public override update(params?: F24FilterSourceSelectParams<Item, Type>) {
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
      return'';
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
  protected createFormatter(formatters?: any): { label: (data: Item) => string, value: (data: Item) => string } {
    return {
      label: (formatters && 'label' in formatters ? formatters.label : formatters) ?? ((item: Item) => this.formatterLabel(item)),
      value: (formatters && 'value' in formatters ? formatters.value : formatters) ?? ((item: Item) => this.formatterValue(item)),
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
export const createFilterSourceSelect = <Item, Type extends F24FilterSourceSelectType>(params?: F24FilterSourceSelectParams<Item, Type>) => {
  return new F24FilterSourceSelect(params);
}
/**
 * createFilterSourceSelectParams
 */
export const createFilterSourceSelectParams = <Item, Type extends F24FilterSourceSelectType>(params?: F24FilterSourceSelectParams<Item, Type>) => {
  return params;
}