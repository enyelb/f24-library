import { effect, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, switchMap } from "rxjs";

import { F24DataSource } from '@f24/data';
import { signalSource } from "@f24/core";
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
  protected readonly _id = signalSource('');
  readonly id = this._id.asReadonly();
  /**
   * dataSource variable para pasar el filtro 
   * al datasource cuando cambie este input 
   */
  protected readonly _dataSource = signalSource<F24DataSource<any> | undefined>(undefined);
  readonly dataSource = this._dataSource.asReadonly();
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
  constructor(params?: F24FilterInputSourceParams<T>) {
    this.update(params);
    /**
     * obtener los filtros actuales del datasource
     * para obtener el filtro asociado al este forms
     */
    const dataSource = this.dataSource();
    const filtersOLd = dataSource?.filters();

    const name = this.name();
    const filterOld = filtersOLd && name in filtersOLd ? filtersOLd[name] : null;
    const local = FilterStorage.get(this.id());
    const form = this.form();
    form.setValue(filterOld ?? local, { emitEvent: !filterOld });
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
        /**
         * guardar el valor en local storage
         */
        FilterStorage.set(this.id(), value);
        /**
         * si la variable name y datasource existen, setear el valor del filtro
         */
        const name = this.name();
        const dataSource = this.dataSource();
        if (dataSource && name) {
          dataSource.update({
            filters: { [name]: value }
          });
        }
      })
    });
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FilterInputSourceParams<T>, params2?: F24FilterInputSourceParams<T>) {
    untracked(() => {
      this._id.setExectUndefined(params?.id ?? params2?.id);
      this._dataSource.setExectUndefined(params?.dataSource ?? params2?.dataSource);
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