import { signal, untracked } from "@angular/core";

/**
 * F24NavbarSourceParams
 */
export interface F24NavbarSourceParams {
  title?: string;
  icon?: string;
  logo?: string;
}
/**
 * F24NavbarSource
 */
export class F24NavbarSource {
  /**
   * título en caso de no usar logo
   */
  protected readonly _title = signal<string | undefined>(undefined);
  readonly title = this._title.asReadonly();
  /**
   * icono para el botón del navbar
   */
  protected readonly _icon = signal<string | undefined>(undefined);
  readonly icon = this._icon.asReadonly();
  /**
   * url del logo
   */
  protected readonly _logo = signal<string | undefined>(undefined);
  readonly logo = this._logo.asReadonly();
  /**
   * props adicionales
   */
  protected readonly _props = signal<{ [key: string]: string | number | boolean } | undefined>(undefined);
  readonly props = this._props.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24NavbarSourceParams) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24NavbarSourceParams, params2?: F24NavbarSourceParams) {
    untracked(() => {
      this._title.set(params?.title ?? params2?.title);
      this._icon.set(params?.icon ?? params2?.icon);
      this._logo.set(params?.logo ?? params2?.logo);
    });
  }
}
/**
 * createNavbarSource
 */
export const createNavbarSource = (params?: F24NavbarSourceParams) => {
  return new F24NavbarSource(params);
}