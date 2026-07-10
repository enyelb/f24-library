import { computed, untracked } from "@angular/core";

import { signalSource } from "@f24/core";

/**
 * F24ButtonDialogSourceParams
 */
export interface F24ButtonDialogSourceParams {
  label?: string;
  tooltip?: string;
  icon?: string;
  color?: string;
  dialogSize?: "xs" | "s" | "m" | "l" | "xl" | "xxl";
  dialogTitle?: string;
}
/**
 * F24ButtonDialogSource
 */
export class F24ButtonDialogSource {
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
  protected readonly _icon = signalSource<string>('');
  readonly icon = this._icon.asReadonly();
  /**
   * color
   * este es el label del mat input
   */
  protected readonly _color = signalSource<string>('lavender');
  readonly color = this._color.asReadonly();
  /**
   * dialogSize
   */
  protected readonly _dialogSize = signalSource<"xs" | "s" | "m" | "l" | "xl" | "xxl">('xs');
  readonly dialogSize = this._dialogSize.asReadonly();
  /**
   * dialogTitle
   */
  protected readonly _dialogTitle = signalSource<string>('');
  readonly dialogTitle = this._dialogTitle.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24ButtonDialogSourceParams) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24ButtonDialogSourceParams, params2?: F24ButtonDialogSourceParams) {
    untracked(() => {
        this._label.setExectUndefined(params?.label ?? params2?.label);
        this._tooltip.setExectUndefined(params?.tooltip ?? params2?.tooltip);
        this._icon.setExectUndefined(params?.icon ?? params2?.icon);
        this._color.setExectUndefined(params?.color ?? params2?.color);
        this._dialogSize.setExectUndefined(params?.dialogSize ?? params2?.dialogSize);
        this._dialogTitle.setExectUndefined(params?.dialogTitle ?? params2?.dialogTitle);
    });
  }
}
/**
 * createButtonDialogSource
 */
export const createButtonDialogSource = (params?: F24ButtonDialogSourceParams) => {
  return new F24ButtonDialogSource(params);
}
/**
 * createButtonDialogSourceParams
 */
export const createButtonDialogSourceParams = (params?: F24ButtonDialogSourceParams) => {
  return params;
}