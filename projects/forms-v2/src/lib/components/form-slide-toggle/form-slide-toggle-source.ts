import { signal, untracked } from "@angular/core";
import { Field } from "@angular/forms/signals";

/**
 * F24FormSlideToggleSourceParams
 */
export interface F24FormSlideToggleSourceParams {
  label?: string;
  labelPosition?: 'before' | 'after';
  disable?: boolean;
  form?: Field<any>;
}
/**
 * F24FormSlideToggleSource
 */
export class F24FormSlideToggleSource {
  /**
   * label
   */
  protected readonly _label = signal<F24FormSlideToggleSourceParams['label']>(undefined);
  readonly label = this._label.asReadonly();
  /**
   * labelPosition
   */
  protected readonly _labelPosition = signal<F24FormSlideToggleSourceParams['labelPosition']>(undefined);
  readonly labelPosition = this._labelPosition.asReadonly();
  /**
   * disable
   */
  protected readonly _disable = signal<F24FormSlideToggleSourceParams['disable']>(undefined);
  readonly disable = this._disable.asReadonly();
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _form = signal<Field<any> | null>(null);
  readonly form = this._form.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24FormSlideToggleSourceParams) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FormSlideToggleSourceParams, params2?: F24FormSlideToggleSourceParams) {
    untracked(() => {
      this._label.set(params?.label ?? params2?.label ?? this._label());
      this._labelPosition.set(params?.labelPosition ?? params2?.labelPosition ?? this._labelPosition());
      this._disable.set(params?.disable ?? params2?.disable ?? this._disable());
      this._form.set(params?.form ?? params2?.form ?? this._form());
    });
  }
}
/**
 * createFormSlideToggleSource
 */
export const createFormSlideToggleSource = (params?: F24FormSlideToggleSourceParams) => {
  return new F24FormSlideToggleSource(params);
}