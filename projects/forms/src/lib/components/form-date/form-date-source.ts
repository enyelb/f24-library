import { effect, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, switchMap } from "rxjs";

import { signalSource, transformDate } from "@f24/core";

/**

/**
 * F24FormDateSourceParams
 */
export interface F24FormDateSourceParams {
  label?: string;
  appearance?: 'fill' | 'outline';
  name?: string;
  icon?: string;
  default?: Date | string | 'TODAY';
  placeholder?: string;
  form?: FormControl<Date | null>;
  type?: 'number' | 'text';
  minDate?: Date | string | 'TODAY';
  maxDate?: Date | string | 'TODAY';
  change?: (value: Date | null) => void;
}
/**
 * F24FormDateSource
 */
export class F24FormDateSource {
  /**
   * label
   * este es el label del mat input
   */
  protected readonly _label = signalSource('');
  readonly label = this._label.asReadonly();
  /**
   * appearance
   * esta es la apariencia del mat input
   */
  protected readonly _appearance = signalSource<'fill' | 'outline'>('outline');
  readonly appearance = this._appearance.asReadonly();
  /**
   * name 
   * este nombre se usa para identificar el valor cuando se envia al data source 
   */
  protected readonly _name = signalSource('');
  readonly name = this._name.asReadonly();
  /**
   * icon
   * este es el icono que se usa para que apareca delante del input
   */
  protected readonly _icon = signalSource('');
  readonly icon = this._icon.asReadonly();
  /**
   * dafault
   * este es el valor por defecto que se usa
   */
  protected readonly _default = signalSource<Date | null>(null);
  readonly default = this._default.asReadonly();
  /**
   * placeholder
   * este es el placeholder del mat input
   */
  protected readonly _placeholder = signalSource('');
  readonly placeholder = this._placeholder.asReadonly();
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _form = signalSource(new FormControl<Date | null>(null));
  readonly form = this._form.asReadonly();
  /**
   * change
   * esta funcion emite los cambios del filtro
   */
  protected readonly _change = signalSource<(value: Date | null) => void>((value: Date | null) => {});
  readonly change = this._change.asReadonly();
  /**
   * min date
   * fecha minima permitida
   */
  protected readonly _minDate = signalSource(new Date('1900-01-01'));
  readonly minDate = this._minDate.asReadonly();
  /**
   * max date
   * fecha maxima permitida
   */
  protected readonly _maxDate = signalSource(new Date('2100-01-01'));
  readonly maxDate = this._maxDate.asReadonly();
  /**
   * es un signal que tendra el valor del form
   */
  readonly formValue = toSignal(
    toObservable(this._form.value).pipe(
      distinctUntilChanged(),
      switchMap(form => form.valueChanges),
      takeUntilDestroyed()
    ),
    { initialValue: null }
  );
  /**
   * constructor
   */
  constructor(params?: F24FormDateSourceParams) {
    this.update(params);
    /**
     * efecto ejecutar el cambio en la funcion change
     */
    effect(() => {
      const value = this.formValue();
      untracked(() => {
        const change = this.change();
        if (change) {
          change(value);
        }
      })
    });
    /**
     * efecto para asognar valor por defecto al formulario
     */
    effect(() => {
      const dafault2 = this.default();
      const form = this.form();
      if (dafault2 && form) {
        form.setValue(dafault2, { emitEvent: false });
      }
    })
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FormDateSourceParams, params2?: F24FormDateSourceParams) {
    untracked(() => {
      this._label.setExectUndefined(params?.label ?? params2?.label);
      this._appearance.setExectUndefined(params?.appearance ?? params2?.appearance);
      this._name.setExectUndefined(params?.name ?? params2?.name);
      this._icon.setExectUndefined(params?.icon ?? params2?.icon);
      this._default.setExectUndefined(params?.default ?? params2?.default, transformDate);
      this._minDate.setExectUndefined(params?.minDate ?? params2?.minDate, transformDate);
      this._maxDate.setExectUndefined(params?.maxDate ?? params2?.maxDate, transformDate);
      this._placeholder.setExectUndefined(params?.placeholder ?? params2?.placeholder);
      this._form.setExectUndefined(params?.form ?? params2?.form);
      this._change.setExectUndefined(params?.change ?? params2?.change);
    });
  }
}
/**
 * createFormDateSource
 */
export const createFormDateSource = (params?: F24FormDateSourceParams) => {
  return new F24FormDateSource(params);
}
/**
 * createFormDateSourceParams
 */
export const createFormDateSourceParams = (params?: F24FormDateSourceParams) => {
  return params;
}