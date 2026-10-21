import { signal, untracked } from "@angular/core";
import { MatButtonAppearance } from "@angular/material/button";

/**
 * F24ButtonSwitchOption
 * opcion del boton
 */
export interface F24ButtonSwitchOption {
  /**
   * texto completo del boton expandido
   */
  label: string;
  /**
   * valor unico de la opcion, si no se usa el label para el track
   */
  value?: string | number;
  /**
   * icono mostrado cuando la opcion esta minimizada, si no hay icono se muestran iniciales
   */
  icon?: string;
  /**
   * iniciales mostradas cuando la opcion esta minimizada, por defecto se derivan del label
   */
  initials?: string;
  /**
   * tooltip de la opcion, por defecto se usa el label
   */
  tooltip?: string;
}
/**
 * F24ButtonSwitchChangeEvent
 * evento emitido cuando cambia la seleccion
 */
export interface F24ButtonSwitchChangeEvent {
  index: number;
  option: F24ButtonSwitchOption;
}
/**
 * F24ButtonSwitchSourceParams
 */
export interface F24ButtonSwitchSourceParams {
  options?: F24ButtonSwitchOption[];
  selectedIndex?: number;
  appearance?: MatButtonAppearance;
  iconSize?: number;
  selected?: (event: F24ButtonSwitchChangeEvent) => void;
  click?: (event: F24ButtonSwitchChangeEvent) => void;
}
/**
 * F24ButtonSwitchSource
 */
export class F24ButtonSwitchSource {
  /**
   * opciones del boton
   */
  protected readonly _options = signal<F24ButtonSwitchSourceParams['options']>([]);
  readonly options = this._options.asReadonly();
  /**
   * indice de la opcion seleccionada
   */
  protected readonly _selectedIndex = signal<F24ButtonSwitchSourceParams['selectedIndex']>(0);
  readonly selectedIndex = this._selectedIndex.asReadonly();
  /**
   * appearance del boton expandido
   */
  protected readonly _appearance = signal<F24ButtonSwitchSourceParams['appearance']>('elevated');
  readonly appearance = this._appearance.asReadonly();
  /**
   * tamanho del icono
   */
  protected readonly _iconSize = signal<F24ButtonSwitchSourceParams['iconSize']>(24);
  readonly iconSize = this._iconSize.asReadonly();
  /**
   * callback de cambio de seleccion
   */
  protected readonly _selected = signal<F24ButtonSwitchSourceParams['selected']>(undefined);
  readonly selected = this._selected.asReadonly();
  /**
   * callback de click
   */
  protected readonly _click = signal<F24ButtonSwitchSourceParams['click']>(undefined);
  readonly click = this._click.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24ButtonSwitchSourceParams) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24ButtonSwitchSourceParams, params2?: F24ButtonSwitchSourceParams) {
    untracked(() => {
      this._options.set(params?.options ?? params2?.options ?? this.options());
      this._selectedIndex.set(params?.selectedIndex ?? params2?.selectedIndex ?? this.selectedIndex());
      this._appearance.set(params?.appearance ?? params2?.appearance ?? this.appearance());
      this._iconSize.set(params?.iconSize ?? params2?.iconSize ?? this.iconSize());
      this._selected.set(params?.selected ?? params2?.selected ?? this.selected());
      this._click.set(params?.click ?? params2?.click ?? this.click());
    });
  }
}
/**
 * createButtonSwitchSource
 */
export const createButtonSwitchSource = (params?: F24ButtonSwitchSourceParams) => {
  return new F24ButtonSwitchSource(params);
}
