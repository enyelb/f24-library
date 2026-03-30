import { effect, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, switchMap } from "rxjs";

import { signalSource } from "@f24/core";

/**
 * F24FormSelectFormatterSourceParams
 */
export type F24FormSelectFormatterSourceParams<Item> = (data: Item) => string;
/**
 * F24FormSelectBindSourceParams
 */
export type F24FormSelectBindSourceParams = string;
/**
 * F24FormSelectSourceParams
 */
export interface F24FormSelectSourceParams<Type, Item> {
  label?: string;
  appearance?: 'fill' | 'outline';
  name?: string;
  icon?: string;
  default?: Type | null;
  placeholder?: string;
  form?: FormControl<Type | null>;
  type?: 'number' | 'text';
  change?: (value: Type | null) => void;
  multiple?: boolean;
  items?: Item[];
  formatter?: F24FormSelectFormatterSourceParams<Item> | {
    label?: F24FormSelectFormatterSourceParams<Item>;
    value?: F24FormSelectFormatterSourceParams<Item>;
  };
  bind?: F24FormSelectBindSourceParams | {
    label?: F24FormSelectBindSourceParams
    value?: F24FormSelectBindSourceParams
  }
}
/**
 * F24FormSelectSource
 */
export class F24FormSelectSource<T, I> {
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
   * multiple
   * esta variable permite seleccion multiple
   */
  protected readonly _multiple = signalSource(false);
  readonly multiple = this._multiple.asReadonly();
  /**
   * items
   * esta variable es la lista de opciones
   */
  protected readonly _items = signalSource<I[]>([]);
  readonly items = this._items.asReadonly();
  /**
   * formatterLabel
   * funcion para formatear el item seleccionado y mostarar en la lista
   */
  protected readonly _formatterLabel = signalSource((item: I) => this.formatterDefault(this.bindLabel(), item));
  readonly formatterLabel = this._formatterLabel.asReadonly();
  /**
   * formatterValue
   * funcion para formatear el item seleccionado y mostrar en el input
   */
  protected readonly _formatterValue = signalSource((item: I) => this.formatterDefault(this.bindValue(), item));
  readonly formatterValue = this._formatterValue.asReadonly();
  /**
   * bindLabel
   * variable para enlazar una propiedad del item con el label
   */
  protected readonly _bindLabel = signalSource<string>('label');
  readonly bindLabel = this._bindLabel.asReadonly();
  /**
   * bindValue
   * variable para enlazar una porpiedad del item con el value
   */
  protected readonly _bindValue = signalSource<string>('value');
  readonly bindValue = this._bindValue.asReadonly();
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
  constructor(params?: F24FormSelectSourceParams<T, I>) {
    this.update(params);
    /**
     * efecto para guardar el filtro y ejecutar el cambio en el data source
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
   * formatterDefault
   */
  private formatterDefault(bind: string | undefined, data: I): any {
    if (!bind || !(data instanceof Object)) {
      return '';
    }
    for(const [key, value] of Object.entries(data)) {
      if (key === bind) {
        return value;
      }
    }
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FormSelectSourceParams<T, I>, params2?: F24FormSelectSourceParams<T, I>) {
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
      this._multiple.setExectUndefined(params?.multiple ?? params2?.multiple);
      this._items.setExectUndefined(params?.items ?? params2?.items);
      this._formatterLabel.setExectUndefined((typeof params?.formatter === 'object' ? params.formatter?.label : params?.formatter) ?? (typeof params2?.formatter === 'object' ? params2.formatter?.label : params2?.formatter));
      this._formatterValue.setExectUndefined((typeof params?.formatter === 'object' ? params.formatter?.value : params?.formatter) ?? (typeof params2?.formatter === 'object' ? params2.formatter?.value : params2?.formatter));
      this._bindLabel.setExectUndefined((typeof params?.bind === 'object' ? params.bind?.label : params?.bind) ?? (typeof params2?.bind === 'object' ? params2.bind?.label : params2?.bind));
      this._bindValue.setExectUndefined((typeof params?.bind === 'object' ? params.bind?.value : params?.bind) ?? (typeof params2?.bind === 'object' ? params2.bind?.value : params2?.bind));
    });
  }
}
/**
 * createFormSelectSource
 */
export const createFormSelectSource = <Type, Item>(params?: F24FormSelectSourceParams<Type, Item>) => {
  return new F24FormSelectSource(params);
}
/**
 * createFormSelectSourceParams
 */
export const createFormSelectSourceParams = <Type, Item>(params?: F24FormSelectSourceParams<Type, Item>) => {
  return params;
}