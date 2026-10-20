import { untracked } from "@angular/core";

import { MtxPopoverPosition } from "@ng-matero/extensions/popover";

import { signalSource } from "@f24/core";

/**
 * F24ButtonDropdownSourceParams
 */
export interface F24ButtonDropdownSourceParams {
  label?: string;
  tooltip?: string;
  icon?: string;
  iconSize?: number;
  dropdownPosition?: MtxPopoverPosition;
  dropdownEnterDelay?: number;
  dropdownLeaveDelay?: number;

}
/**
 * F24ButtonDropdownSource
 */
export class F24ButtonDropdownSource {
  /** 
   * direction
   * este es el label del mat input
   */
  protected readonly _label = signalSource<string>('');
  readonly label = this._label.asReadonly();
  /**
   * tooltip
   * este es el label del mat input
   */
  protected readonly _tooltip = signalSource<string>('');
  readonly tooltip = this._tooltip.asReadonly();
  /**
   * icon
   * este es el label del mat input
   */
  protected readonly _icon = signalSource<string>('more_horiz');
  readonly icon = this._icon.asReadonly();
  /**
   * 
   */
  protected readonly _iconSize = signalSource<number>(24);
  readonly iconSize = this._iconSize.asReadonly();
  /**
   * dropdownPosition
   */
  protected readonly _dropdownPosition = signalSource<MtxPopoverPosition>(['above', 'below']);
  readonly dropdownPosition = this._dropdownPosition.asReadonly();
  /**
   * dropdownEnterDelay
   */
  protected readonly _dropdownEnterDelay = signalSource<number>(100);
  readonly dropdownEnterDelay = this._dropdownEnterDelay.asReadonly();
  /**
   * dropdownLeaveDelay
   */
  protected readonly _dropdownLeaveDelay = signalSource<number>(200);
  readonly dropdownLeaveDelay = this._dropdownLeaveDelay.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24ButtonDropdownSourceParams) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24ButtonDropdownSourceParams, params2?: F24ButtonDropdownSourceParams) {
    untracked(() => {
        this._label.setExectUndefined(params?.label ?? params2?.label);
        this._tooltip.setExectUndefined(params?.tooltip ?? params2?.tooltip);
        this._icon.setExectUndefined(params?.icon ?? params2?.icon);
        this._iconSize.setExectUndefined(params?.iconSize ?? params2?.iconSize);
        this._dropdownPosition.setExectUndefined(params?.dropdownPosition ?? params2?.dropdownPosition);
        this._dropdownEnterDelay.setExectUndefined(params?.dropdownEnterDelay ?? params2?.dropdownEnterDelay);
        this._dropdownLeaveDelay.setExectUndefined(params?.dropdownLeaveDelay ?? params2?.dropdownLeaveDelay);
    });
  }
}
/**
 * createButtonDropdownSource
 */
export const createButtonDropdownSource = (params?: F24ButtonDropdownSourceParams) => {
  return new F24ButtonDropdownSource(params);
}
/**
 * createButtonDropdownSourceParams
 */
export const createButtonDropdownSourceParams = (params?: F24ButtonDropdownSourceParams) => {
  return params;
}