import { signal, untracked } from "@angular/core";

/**
 * F24SidenavFormSourceParams
 */
export interface F24SidenavRouteSourceParams {
  title: string,
  url?:   string,
  icon?: string,
  children?: F24SidenavRouteSourceParams[];
}
/**
 * F24SidenavSourceParams
 */
export interface F24SidenavSourceParams {
  logo?: string;
  name?: string;
  routes?: F24SidenavRouteSourceParams[];
  isMobile?: boolean;
  allowExpandedMultiple?: boolean;
}
/**
 * F24SidenavSource
 */
export class F24SidenavSource {
  /**
   * logo
   * logo del sidenav
   */
  protected readonly _logo = signal<string | undefined>(undefined);
  readonly logo = this._logo.asReadonly();
  /**
   * nombre en caso de no usar logo
   */
  protected readonly _name = signal<string | undefined>(undefined);
  readonly name = this._name.asReadonly();

  /**
   * label
   * este es el label del mat input
   */
  protected readonly _routes = signal<F24SidenavRouteSourceParams[] | undefined>(undefined);
  readonly routes = this._routes.asReadonly();
  /**
   * isMobile
   * indica si la vista es móvil
   */
  protected readonly _isMobile = signal<boolean | undefined>(undefined);
  readonly isMobile = this._isMobile.asReadonly();
  /**
   * allowExpandedMultiple
   * indica si todos los elementos deben estar expandidos
   */
  protected readonly _allowExpandedMultiple = signal<boolean | undefined>(undefined);
  readonly allowExpandedMultiple = this._allowExpandedMultiple.asReadonly();
  /**
   * compact
   * indica si la vista debe ser compacta
   */
  protected readonly _compact = signal<boolean | undefined>(undefined);
  readonly compact = this._compact.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24SidenavSourceParams) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24SidenavSourceParams, params2?: F24SidenavSourceParams) {
    untracked(() => {
      this._logo.set(params?.logo ?? params2?.logo);
      this._name.set(params?.name ?? params2?.name);
      this._routes.set(params?.routes ?? params2?.routes);
      this._isMobile.set(params?.isMobile ?? params2?.isMobile);  
      this._allowExpandedMultiple.set(params?.allowExpandedMultiple ?? params2?.allowExpandedMultiple);
    });
  }
}
/**
 * createSidenavSource
 */
export const createSidenavSource = (params?: F24SidenavSourceParams) => {
  return new F24SidenavSource(params);
}