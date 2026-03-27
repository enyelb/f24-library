import { effect, signal, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, switchMap } from "rxjs";

/**
 * F24FormCheckboxBindSourceParams
 */
export type F24FormCheckboxBindSourceParams = string;
/**
 * F24FormCheckboxSourceParams
 */
export interface F24FormCheckboxSourceParams<Type, Item> {
  label?: string;
  appearance?: 'fill' | 'outline';
  name?: string;
  icon?: string;
  default?: Type | null;
  placeholder?: string;
  form?: FormControl<Type | null>;
  type?: 'number' | 'text';
  change?: (value: Type | null) => void;
  bind?: {
    value?: F24FormCheckboxBindSourceParams;
    label?: F24FormCheckboxBindSourceParams;
    icon?: F24FormCheckboxBindSourceParams;
  }
  items?: Item[];
  limit?: number;
}
/**
 * F24FormCheckboxSource
 */
export class F24FormCheckboxSource<T, I> {
  /**
   * label
   * este es el label del mat input
   */
  protected readonly _label = signal('');
  /**
   * appearance
   * esta es la apariencia del mat input
   */
  protected readonly _appearance = signal<'fill' | 'outline'>('outline');
  /**
   * name 
   * este nombre se usa para identificar el valor cuando se envia al data source 
   */
  protected readonly _name = signal('');
  /**
   * icon
   * este es el icono que se usa para que apareca delante del input
   */
  protected readonly _icon = signal('');
  /**
   * dafault
   * este es el valor por defecto que se usa
   */
  protected readonly _default = signal<T | null>(null);
  /**
   * placeholder
   * este es el placeholder del mat input
   */
  protected readonly _placeholder = signal('');
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _form = signal(new FormControl<T | null>(null));
  /**
   * type
   * este es el tipo de input
   */
  protected readonly _type = signal<'number' | 'text'>('text');
  /**
   * change
   * esta funcion emite los cambios del filtro
   */
  protected readonly _change = signal<(value: T | null) => void>((value: T | null) => {});
  /**
   * items
   * esta variable es la lista de opciones
   */
  protected readonly _items = signal<I[]>([]);
  /**
   * bindLabel
   * variable para enlazar una propiedad del item con el label
   */
  protected readonly _bindLabel = signal<string>('label');
  /**
   * bindValue
   * variable para enlazar una porpiedad del item con el value
   */
  protected readonly _bindValue = signal<string>('value');
  /**
   * bindIcon
   * variable para enlazar una porpiedad del item con el icon
   */
  protected readonly _bindIcon = signal<string>('icon');
  /**
   * es un signal que tendra el limite visible
   */
  protected readonly _limit = signal(10);
  /**
   * es un signal que tendra el valor del form
   */
  protected readonly _formValue = toSignal(
    toObservable(this._form).pipe(
      distinctUntilChanged(),
      switchMap(form => form.valueChanges),
      takeUntilDestroyed()
    ),
    { initialValue: null }
  );
  /**
   * constructor
   */
  constructor(params?: F24FormCheckboxSourceParams<T, I>) {
    this.update(params);
    /**
     * efecto ejecutar el cambio en la funcion change
     */
    effect(() => {
      const value = this._formValue();
      untracked(() => {
        const change = this._change();
        if (change) {
          change(value);
        }
      })
    });
  }
  /**
   * metodo para obtener label
   */
  get label() {
    return this._label.asReadonly();  
  }
  /**
   * metodo para obtener appearance
   */
  get appearance() {
    return this._appearance.asReadonly();
  }
  /**
   * metodo para obtener name
   */
  get name() {
    return this._name.asReadonly();  
  }
  /**
   * metodo para obtener icon
   */
  get icon() {
    return this._icon.asReadonly();  
  }
  /**
   * metodo para obtener default
   */
  get default() {
    return this._default.asReadonly();  
  }
  /**
   * metodo para obtener placeholder
   */
  get placeholder() {
    return this._placeholder.asReadonly();  
  }
  /**
   * metodo para obtener form
   */
  get form() {
    return this._form.asReadonly();  
  }
  /**
   * metodo para obtener el tipo
   */
  get type() {
    return this._type.asReadonly();  
  }
  /**
   * metodo para obtener fn change
   */
  get change() {
    return this._change.asReadonly();
  }
  /**
   * metodo para obtener items
   */
  get items() {
    return this._items.asReadonly();
  }
  /**
   * metodo para obtener el enlace al valor
   */
  get bindValue() {
    return this._bindValue.asReadonly();
  }
  /**
   * metodo para obtener el enlace al label
   */
  get bindLabel() {
    return this._bindLabel.asReadonly();
  }
  /**
   * metodo para obtener el enlace al icono
   */
  get bindIcon() {
    return this._bindIcon.asReadonly();
  }
  /**
   * metodo para obtener el limite
   */
  get limit() {
    return this._limit.asReadonly();
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FormCheckboxSourceParams<T, I>, params2?: F24FormCheckboxSourceParams<T, I>) {
    untracked(() => {
      /**
       * actualizar el label
       */
      const label = params?.label ?? params2?.label;
      if (label !== undefined && this._label() !== label) {
        this._label.set(label);
      }
      /**
       * actualizar el appearance
       */
      const appearance = params?.appearance ?? params2?.appearance;
      if (appearance !== undefined && this._appearance() !== appearance) {
        this._appearance.set(appearance);
      }
      /**
       * actualizar el nombre
       */
      const name = params?.name ?? params2?.name;
      if (name !== undefined && this._name() !== name) {
        this._name.set(name);
      }
      /**
       * actualizar el icono
       */
      const icon = params?.icon ?? params2?.icon;
      if (icon !== undefined && this._icon() !== icon) {
        this._icon.set(icon);
      }
      /**
       * actualizar el default
       */
      const default2 = params?.default ?? params2?.default
      if (default2 !== undefined && this._default() !== default2) {
        this._default.set(default2);
      }
      /**
       * actualizar el placeholder
       */
      const placeholder = params?.placeholder ?? params2?.placeholder;
      if (placeholder !== undefined && this._placeholder() !== placeholder) {
        this._placeholder.set(placeholder);
      }
      /**
       * actualizar el form
       */
      const form = params?.form ?? params2?.form;
      if (form !== undefined && this._form() !== form) {
        this._form.set(form);
      }
      /**
       * actualizar el tipo
       */
      const type = params?.type ?? params2?.type;
      if (type !== undefined && this._type() !== type) {
        this._type.set(type);
      }
      /**
       * actualizar el change
       */
      const change = params?.change ?? params2?.change;
      if (change !== undefined && this._change() !== change) {
        this._change.set(change);
      }
      /**
       * actualizar el items
       */
      const items = params?.items ?? params2?.items;
      if (items !== undefined && this._items() !== items) {
        this._items.set(items);
      }
      /**
       * actualizar el enlaze label
       */
      const bindLabel = (typeof params?.bind === 'object' ? params.bind?.label : params?.bind) ?? (typeof params2?.bind === 'object' ? params2.bind?.label : params2?.bind);
      if (bindLabel !== undefined && this._bindLabel() !== bindLabel) {
        this._bindLabel.set(bindLabel);
      }
      /**
       * actualizar el enlaze value
       */
      const bindValue =(typeof params?.bind === 'object' ? params.bind?.value : params?.bind) ?? (typeof params2?.bind === 'object' ? params2.bind?.value : params2?.bind);
      if (bindValue !== undefined && this._bindValue() !== bindValue) {
        this._bindValue.set(bindValue);
      }
      /**
       * actualizar el enlaze icono
       */
      const bindIcon =(typeof params?.bind === 'object' ? params.bind?.icon : params?.bind) ?? (typeof params2?.bind === 'object' ? params2.bind?.icon : params2?.bind);
      if (bindIcon !== undefined && this._bindIcon() !== bindIcon) {
        this._bindIcon.set(bindIcon);
      }
      /**
       * actualizar el limite
       */
      const limit = params?.limit ?? params2?.limit;
      if (limit !== undefined && this._limit() !== limit) {
        this._limit.set(limit);
      }
    });
  }
}
/**
 * createFormCheckboxSource
 */
export const createFormCheckboxSource = <Type, Item>(params?: F24FormCheckboxSourceParams<Type, Item>) => {
  return new F24FormCheckboxSource(params);
}
/**
 * createFormCheckboxSourceParams
 */
export const createFormCheckboxSourceParams = <Type, Item>(params?: F24FormCheckboxSourceParams<Type, Item>) => {
  return params;
}