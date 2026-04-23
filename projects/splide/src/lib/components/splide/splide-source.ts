import { untracked } from "@angular/core";

import { signalSource } from "@f24/core";

import { F24SplideOptions } from "../../models/splide";

/**
 * F24SplideSourceParams
 */
export interface F24SplideSourceParams<Item> {
  id?: string;
  items?: Item[];
  options?: F24SplideOptions
  defaults?: F24SplideOptions,
  autoScroll?: boolean,
}
/**
 * F24SplideSource
 */
export class F24SplideSource<Item> {
  /**
   * id
   * este es el id del splide
   */
  protected readonly _id = signalSource('splide');
  readonly id = this._id.asReadonly();
  /**
   * items
   * la lista de elementos del splide
   */
  protected readonly _items = signalSource<Item[]>([]);
  readonly items = this._items.asReadonly();
  /**
   * options 
   * las opciones para modificar el splide
   */
  protected readonly _options = signalSource<F24SplideOptions>({});
  readonly options = this._options.asReadonly();
  /**
   * defaults
   * valores por defecto que tendra el splide
   */
  protected readonly _defaults = signalSource<F24SplideOptions>({});
  readonly defaults = this._defaults.asReadonly();
  /**
   * autoScroll activa la extension para hacer scroll infinito
   */
  protected readonly _autoScroll = signalSource(true);
  readonly autoScroll = this._autoScroll.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24SplideSourceParams<Item>) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24SplideSourceParams<Item>, params2?: F24SplideSourceParams<Item>) {
    untracked(() => {
      this._id.setExectUndefined(params?.id ?? params2?.id);
      this._items.setExectUndefined(params?.items ?? params2?.items);
      this._options.setExectUndefined(params?.options ?? params2?.options);
      this._defaults.setExectUndefined(params?.defaults ?? params2?.defaults);
      this._autoScroll.setExectUndefined(params?.autoScroll ?? params2?.autoScroll);
    });
  }
}
/**
 * createSplideSource
 */
export const createSplideSource = <Item>(params?: F24SplideSourceParams<Item>) => {
  return new F24SplideSource(params);
}
/**
 * createSplideSourceParams
 */
export const createSplideSourceParams = <Item>(params?: F24SplideSourceParams<Item>) => {
  return params;
}