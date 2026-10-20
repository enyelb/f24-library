import { signal, untracked } from "@angular/core";
import { MatButtonAppearance } from "@angular/material/button";



/**
 * F24ButtonIconSourceParams
 */
export interface F24ButtonIconSourceParams {
  icon?: string;
  iconSize?: number;
  label?: string;
  tooltip?: string;
  appearance?: MatButtonAppearance
  click?: () => void;
}
/**
 * F24ButtonIconSource
 */
export class F24ButtonIconSource {
  /**
   * icono del botón
   */
  protected readonly _icon = signal<F24ButtonIconSourceParams['icon']>(undefined);
  readonly icon = this._icon.asReadonly();
  /**
   * tamaño del icono del botón
   */
  protected readonly _iconSize = signal<F24ButtonIconSourceParams['iconSize']>(undefined);
  readonly iconSize = this._iconSize.asReadonly();
  /**
   * título del botón
   */
  protected readonly _label = signal<F24ButtonIconSourceParams['label']>(undefined);
  readonly label = this._label.asReadonly();
  /**
   * tooltip del botón
   */
  protected readonly _tooltip = signal<F24ButtonIconSourceParams['tooltip']>(undefined);
  readonly tooltip = this._tooltip.asReadonly();
  /**
   * appearance del botón
   */
  protected readonly _appearance = signal<F24ButtonIconSourceParams['appearance']>(undefined);
  readonly appearance = this._appearance.asReadonly();
  /**
   * click del botón
   */
  protected readonly _click = signal<F24ButtonIconSourceParams['click']>(undefined);
  readonly click = this._click.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24ButtonIconSourceParams) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24ButtonIconSourceParams, params2?: F24ButtonIconSourceParams) {
    untracked(() => {
      this._icon.set(params?.icon ?? params2?.icon ?? this.icon());
      this._iconSize.set(params?.iconSize ?? params2?.iconSize ?? this.iconSize());
      this._label.set(params?.label ?? params2?.label ?? this.label());
      this._tooltip.set(params?.tooltip ?? params2?.tooltip ?? this.tooltip());
      this._appearance.set(params?.appearance ?? params2?.appearance ?? this.appearance());
      this._click.set(params?.click ?? params2?.click ?? this.click());
    });
  }
}
/**
 * createButtonIconSource
 */
export const createButtonIconSource = (params?: F24ButtonIconSourceParams) => {
  return new F24ButtonIconSource(params);
}