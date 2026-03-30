import { effect, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, switchMap } from "rxjs";

import { signalSource } from "@f24/core";

/**
 * F24FormInputSourceParams
 */
export interface F24FormInputSourceParams<Type> {
  label?: string;
  appearance?: 'fill' | 'outline';
  name?: string;
  icon?: string;
  default?: Type | null;
  placeholder?: string;
  form?: FormControl<Type | null>;
  type?: 'number' | 'text';
  change?: (value: Type | null) => void;
}
/**
 * F24FormInputSource
 */
export class F24FormInputSource<T> {
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
  protected readonly _default = signalSource<T | null>(null);
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
  protected readonly _form = signalSource(new FormControl<T | null>(null));
  readonly form = this._form.asReadonly();
  /**
   * type
   * este es el tipo de input
   */
  protected readonly _type = signalSource<'number' | 'text'>('text');
  readonly type = this._type.asReadonly();
  /**
   * change
   * esta funcion emite los cambios del filtro
   */
  protected readonly _change = signalSource<(value: T | null) => void>((value: T | null) => {});
  readonly change = this._change.asReadonly();
  /**
   * es un signalSource que tendra el valor del form
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
  constructor(params?: F24FormInputSourceParams<T>) {
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
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FormInputSourceParams<T>, params2?: F24FormInputSourceParams<T>) {
    untracked(() => {
      this._label.setExectUndefined(params?.label ?? params2?.label);
      this._appearance.setExectUndefined(params?.appearance ?? params2?.appearance);
      this._name.setExectUndefined(params?.name ?? params2?.name);
      this._icon.setExectUndefined(params?.icon ?? params2?.icon);
      this._default.setExectUndefined(params?.default ?? params2?.default);
      this._placeholder.setExectUndefined(params?.placeholder ?? params2?.placeholder);
      this._form.setExectUndefined(params?.form ?? params2?.form);
      this._type.setExectUndefined(params?.type ?? params2?.type);
      this._change.setExectUndefined(params?.change ?? params2?.change);
    });
  }
}
/**
 * createFormInputSource
 */
export const createFormInputSource = <Type>(params?: F24FormInputSourceParams<Type>) => {
  return new F24FormInputSource(params);
}
/**
 * createFormInputSourceParams
 */
export const createFormInputSourceParams = <Type>(params?: F24FormInputSourceParams<Type>) => {
  return params;
}