import { effect, signal, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, switchMap } from "rxjs";

import { F24DataSource } from '@f24/data';

import { FilterStorage } from "../../filter-storage";

/**
 * F24FilterSelectFormatterSourceParams
 */
export type F24FilterSelectFormatterSourceParams<Item> = (data: Item) => string;
/**
 * F24FilterSelectBindSourceParams
 */
export type F24FilterSelectBindSourceParams = string;
/**
 * F24FilterSelectSourceParams
 */
export interface F24FilterSelectSourceParams<Type, Item> {
  id?: string;
  dataSource?: F24DataSource<any>;
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
  formatter?: F24FilterSelectFormatterSourceParams<Item> | {
    label?: F24FilterSelectFormatterSourceParams<Item>;
    value?: F24FilterSelectFormatterSourceParams<Item>;
  };
  bind?: F24FilterSelectBindSourceParams | {
    label?: F24FilterSelectBindSourceParams
    value?: F24FilterSelectBindSourceParams
  }
}
/**
 * F24FilterSelectSource
 */
export class F24FilterSelectSource<T, I> {
  /**
   * id para guardar el filtro en local storage
   */
  protected readonly _id = signal('');
  /**
   * dataSource variable para pasar el filtro 
   * al datasource cuando cambie este input 
   */
  protected readonly _dataSource = signal<F24DataSource<any> | undefined>(undefined);
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
   * multiple
   * esta variable permite seleccion multiple
   */
  protected readonly _multiple = signal(false);
  /**
   * items
   * esta variable es la lista de opciones
   */
  protected readonly _items = signal<I[]>([]);
  /**
   * formatterLabel
   * funcion para formatear el item seleccionado y mostarar en la lista
   */
  protected readonly _formatterLabel = signal((item: I) => this.formatterDefault(this._bindLabel(), item));
  /**
   * formatterValue
   * funcion para formatear el item seleccionado y mostrar en el input
   */
  protected readonly _formatterValue = signal((item: I) => this.formatterDefault(this._bindValue(), item));
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
  constructor(params?: F24FilterSelectSourceParams<T, I>) {
    this.update(params);
    /**
     * obtener los filtros actuales del datasource
     * para obtener el filtro asociado al este forms
     */
    const dataSource = this._dataSource();
    const filtersOLd = dataSource?.filters();

    const name = this._name();
    const filterOld = filtersOLd && name in filtersOLd ? filtersOLd[name] : null;
    const local = FilterStorage.get(this._id());
    const form = this._form();
    form.setValue(filterOld ?? local, { emitEvent: !filterOld });
    /**
     * efecto para guardar el filtro y ejecutar el cambio en el data source
     */
    effect(() => {
      const value = this._formValue();
      untracked(() => {
        const change = this._change();
        if (change) {
          change(value);
        }
        /**
         * guardar el valor en local storage
         */
        FilterStorage.set(this._id(), value);
        /**
         * si la variable name y datasource existen, setear el valor del filtro
         */
        const name = this._name();
        const dataSource = this._dataSource();
        if (dataSource && name) {
          dataSource.update({
            filter: { name, value }
          });
        }
      })
    });
  }
  /**
   * metodo para obtener id
   */
  get id() {
    return this._id.asReadonly();  
  }
  /**
   * metodo para obtener dataSource
   */
  get dataSource() {
    return this._dataSource.asReadonly();  
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
   * metodo para obtener multiple
   */
  get multiple() {
    return this._multiple.asReadonly();
  }
  /**
   * metodo para obtener items
   */
  get items() {
    return this._items.asReadonly();
  }
  /**
   * metodo para obtener formatterLabel
   */
  get formatterLabel() {
    return this._formatterLabel.asReadonly();
  }
  /**
   * metodo para obtener formatterValue
   */ 
  get formatterValue() {
    return this._formatterValue.asReadonly();
  }
  /**
   * metodo para obtener bindLabel
   */
  get bindLabel() {
    return this._bindLabel.asReadonly();
  }
  /**
   * metodo para obtener bindValue
   */
  get bindValue() {
    return this._bindValue.asReadonly();
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
  public update(params?: F24FilterSelectSourceParams<T, I>, params2?: F24FilterSelectSourceParams<T, I>) {
    untracked(() => {
      /**
       * actualizar el id
       */
      const id = params?.id ?? params2?.id;
      if (id !== undefined && this._id() !== id) {
        this._id.set(id);
      }
      /**
       * actualizar el dataSource
       */
      const dataSource = params?.dataSource ?? params2?.dataSource;
      if (dataSource !== undefined && this._dataSource() !== dataSource) {
        this._dataSource.set(dataSource);
      }
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
       * actualizar el multiple
       */
      const multiple = params?.multiple ?? params2?.multiple;
      if (multiple !== undefined && this._multiple() !== multiple) {
        this._multiple.set(multiple);
      }
      /**
       * actualizar el items
       */
      const items = params?.items ?? params2?.items;
      if (items !== undefined && this._items() !== items) {
        this._items.set(items);
      }
      /**
       * actualizar los formatos
       */
      const formatters = params?.formatter ?? params2?.formatter;
      if (formatters !== undefined) {
        if (typeof formatters === 'function') {
          this._formatterLabel.set(formatters);
          this._formatterValue.set(formatters);
        } else {
          if (formatters['label']) {
            this._formatterLabel.set(formatters['label'])
          }
          if (formatters['value']) {
            this._formatterValue.set(formatters['value'])
          }
        }
      }
      /**
       * actualizar los formatos
       */
      const binds = params?.bind ?? params2?.bind;
      if (binds !== undefined) {
        if (typeof binds === 'string') {
          this._bindLabel.set(binds);
          this._bindValue.set(binds);
        } else {
          if (binds['label']) {
            this._bindLabel.set(binds['label'])
          }
          if (binds['value']) {
            this._bindValue.set(binds['value'])
          }
        }
      }
    });
  }
}
/**
 * createFilterSelectSource
 */
export const createFilterSelectSource = <Type, Item>(params?: F24FilterSelectSourceParams<Type, Item>) => {
  return new F24FilterSelectSource(params);
}
/**
 * createFilterSelectSourceParams
 */
export const createFilterSelectSourceParams = <Type, Item>(params?: F24FilterSelectSourceParams<Type, Item>) => {
  return params;
}