import { effect, signal, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, switchMap } from "rxjs";

import { F24DataSource } from '@f24/data';
import { FilterStorage } from "../../filter-storage";

/**
 * F24FilterInputSourceParams
 */
export interface F24FilterInputSourceParams<Type> {
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
}
/**
 * F24FilterInputSource
 */
export class F24FilterInputSource<T> {
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
  constructor(params?: F24FilterInputSourceParams<T>) {
    this.update(params);
    /**
     * obtener los filtros actuales del datasource
     * para obtener el filtro asociado al este forms
     */
    const dataSource = this._dataSource();
    const name = this._name();
    const filtersOLd = dataSource?.filters()
    const filterOld = filtersOLd && name in filtersOLd ? filtersOLd[name] : null;
    /**
     * para asignar el filtro que esta en local storage
     */
    effect((onCleanup) => {
      /**
       * buscar en local storage
       */
      const local = FilterStorage.get(this._id());
      /**
       * usar el valor que tiene el filtro en el data source
       * si el valor no esta usar el de local storage
       */
      const form = this._form();
      form.setValue(filterOld ?? local, { emitEvent: !filterOld });
      /**
       * si el filtro en el data source no existe y el local storage esta
       * actualizar el data source
       */
      if (!filterOld && local) {
        if (dataSource && name) {
          dataSource.update({
            filter: { name, value: local }
          });
        }
      }
    });
    /**
     * efecto para guardar el filtro y ejecutar el cambio en el data source
     */
    effect((onCleanup) => {
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
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FilterInputSourceParams<T>, params2?: F24FilterInputSourceParams<T>) {
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
       * actualizar el
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
    });
  }
}
/**
 * createFilterInputSource
 */
export const createFilterInputSource = <Type>(params?: F24FilterInputSourceParams<Type>) => {
  return new F24FilterInputSource(params);
}
/**
 * createFilterInputSourceParams
 */
export const createFilterInputSourceParams = <Type>(params?: F24FilterInputSourceParams<Type>) => {
  return params;
}