import { signal } from "@angular/core";

import { F24FormSelectSource, F24FormSelectSourceParams } from "./select-source";

/**
 * F24FormSelectSourceParams
 */
export type F24FormCheckboxListSourceParams<Item, Type> = F24FormSelectSourceParams<Item, Type> & {
  bind?: F24FormSelectSourceParams<Item, Type>['bind'] & {
    icon?: string
  }
}
/**
 * F24FormCheckboxListSource
 */
export class F24FormCheckboxListSource<Item, Type> extends F24FormSelectSource<Item,Type> {
  /**
   * bind
   */
  protected override readonly _bind;
  /**
   * constructor
   */
  constructor(params?: F24FormCheckboxListSourceParams<Item, Type>) {
    super(params);
    this._bind = signal(this.createBind(params?.bind));
  }
  /**
   * metodo para crear binds
   */
  protected override createBind(binds?: F24FormCheckboxListSourceParams<Item, Type>['bind']): { label: string, value: string, icon: string } {
    return {
      ...super.createBind(binds),
      icon: (binds ? typeof binds === 'string' ? binds : binds['icon'] : undefined) ?? 'icon'
    }
  }
  /**
   * metodo para obtener bind
   */
  override get bind() {
    return this._bind.asReadonly();  
  }
}
/**
 * createFormCheckboxListSource
 */
export const createFormCheckboxListSource = <Item, Type>(params?: F24FormCheckboxListSourceParams<Item, Type>) => {
  return new F24FormCheckboxListSource(params);
}
/**
 * createFormCheckboxListSourceParams
 */
export const createFormCheckboxListSourceParams = <Item, Type>(params?: F24FormCheckboxListSourceParams<Item, Type>) => {
  return params;
}