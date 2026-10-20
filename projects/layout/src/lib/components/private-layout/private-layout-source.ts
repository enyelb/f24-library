import { signal, untracked } from "@angular/core";

import { F24SidenavSourceParams } from "../sidenav/sidenav-source";
import { F24NavbarSourceParams } from "../navbar/navbar-source";

/**
 * F24PrivateLayoutSourceParams
 */
export type F24PrivateLayoutSourceParams = F24SidenavSourceParams &  F24NavbarSourceParams & {
  top?: boolean;
  position?: 'start' | 'end'
  compact?: boolean;
  compactName?: string;
}
/**
 * F24PrivateLayoutSource
 */
export class F24PrivateLayoutSource {
  /**
   * nombre en caso de no usar logo
   */
  protected readonly _name = signal<F24PrivateLayoutSourceParams['name']>(undefined);
  readonly name = this._name.asReadonly();
  /**
   * name
   * nombre en caso de no usar logo
   */
  protected readonly _compactName = signal<F24PrivateLayoutSourceParams['compactName']>(undefined);
  readonly compactName = this._compactName.asReadonly();
  /**
   * logo
   * logo del navbar
   */
  protected readonly _logo = signal<F24PrivateLayoutSourceParams['logo']>(undefined);
  readonly logo = this._logo.asReadonly();
  /**
   * label
   * este es el label del mat input
   */
  protected readonly _routes = signal<F24PrivateLayoutSourceParams['routes']>(undefined);
  readonly routes = this._routes.asReadonly();
  /**
   * isMobile
   * indica si la vista es móvil
   */
  protected readonly _isMobile = signal<F24PrivateLayoutSourceParams['isMobile']>(undefined);
  readonly isMobile = this._isMobile.asReadonly();
  /**
   * icon
   * icono del navbar
   */
  protected readonly _icon = signal<F24PrivateLayoutSourceParams['icon']>(undefined);
  readonly icon = this._icon.asReadonly();
  /**
   * compact
   * indica si el layout está en modo compacto
   */
  protected readonly _compact = signal<F24PrivateLayoutSourceParams['compact']>(undefined);
  readonly compact = this._compact.asReadonly();
  /**
   * position
   * indica la posición del sidenav
   */
  protected readonly _position = signal<F24PrivateLayoutSourceParams['position']>(undefined);
  readonly position = this._position.asReadonly();
  /**
   * top
   * indica si el sidenav está en la parte superior
   */
  protected readonly _top = signal<F24PrivateLayoutSourceParams['top']>(undefined);
  readonly top = this._top.asReadonly();
  /**
   * title
   * indica el titulo superior
   */
  protected readonly _title = signal<F24PrivateLayoutSourceParams['title']>(undefined);
  readonly title = this._title.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24PrivateLayoutSourceParams) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24PrivateLayoutSourceParams, params2?: F24PrivateLayoutSourceParams) {
    untracked(() => {
      this._name.set(params?.name ?? params2?.name);
      this._compactName.set(params?.compactName ?? params2?.compactName);
      this._logo.set(params?.logo ?? params2?.logo);
      this._routes.set(params?.routes ?? params2?.routes);
      this._icon.set(params?.icon ?? params2?.icon);
      this._compact.set(params?.compact ?? params2?.compact); 
      this._position.set(params?.position ?? params2?.position);
      this._top.set(params?.top ?? params2?.top);
      this._title.set(params?.title ?? params2?.title);
    });
  }
}
/**
 * createPrivateLayoutSource
 */
export const createPrivateLayoutSource = (params?: F24PrivateLayoutSourceParams) => {
  return new F24PrivateLayoutSource(params);
}