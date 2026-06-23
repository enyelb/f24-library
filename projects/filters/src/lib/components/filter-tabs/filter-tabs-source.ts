import { computed, effect, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, switchMap } from "rxjs";

import { F24DataSource } from '@f24/data';
import { signalSource } from "@f24/core";

import { FilterStorage } from "../../filter-storage";

/**
 * F24FilterTabsItemSourceParams
 */
export interface F24FilterTabsItemSourceParams {
  tooltip?: string,
  icon?: string,
  color?: string,
  name: string,
  label: string,
  isDefault?: boolean,
};

/**
 * F24FilterTabsValueSourceParams
 */
export interface F24FilterTabsValueSourceParams {
  [key: string]: boolean | undefined
};
/**
 * F24FilterTabsSourceParams
 */
export interface F24FilterTabsSourceParams {
  id?: string;
  dataSource?: F24DataSource<any>;
  items?: F24FilterTabsItemSourceParams[];
  form?: FormControl<F24FilterTabsValueSourceParams | null>;
  default?: F24FilterTabsValueSourceParams,
  change?: (value: F24FilterTabsValueSourceParams | null) => void;
}
/**
 * F24FilterTabsSource
 */
export class F24FilterTabsSource {
  /**
   * id para guardar el filtro en local storage
   */
  protected readonly _id = signalSource('');
  readonly id = this._id.asReadonly();
  /**
  /**
   * dataSource variable para pasar el filtro 
   * al datasource cuando cambie este input 
   */
  protected readonly _dataSource = signalSource<F24DataSource<any> | undefined>(undefined);
  readonly dataSource = this._dataSource.asReadonly();
  /**
   * dafault
   * este es el valor por defecto que se usa
   */
  protected readonly _default = signalSource<F24FilterTabsValueSourceParams>({});
  readonly default = this._default.asReadonly();
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _form = signalSource(new FormControl<F24FilterTabsValueSourceParams>({}));
  readonly form = this._form.asReadonly();
  /**
   * change
   * esta funcion emite los cambios del filtro
   */
  protected readonly _change = signalSource<(value: F24FilterTabsValueSourceParams | null) => void>((value: F24FilterTabsValueSourceParams | null) => {});
  readonly change = this._change.asReadonly();
  /**
   * items
   * esta variable es la lista de opciones
   */
  protected readonly _items = signalSource<F24FilterTabsItemSourceParams[]>([]);
  readonly items = this._items.asReadonly();
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
   * color
   */
  readonly color = computed(() => {
    const form = this.formValue();
    if(!form) {
      return 'primary';
    }
    const items = this.items();
    for( const [key, value] of Object.entries(form)) {
      const item = items.find(item => item.name == key && value);
      if (item) {
        return item.color ?? 'primary';
      }
    }
    return 'primary';
  })
  /**
   * constructor
   */
  constructor(params?: F24FilterTabsSourceParams) {
    this.update(params);
    /**
     * efecto para asignar los filtros locales
     */
    effect(() => {
      /**
       * obtener los filtros actuales del datasource
       * para obtener el filtro asociado al este forms
       */
      //const name = this.name();
      const id = this.id();
      const form = this.form();

      untracked(() => {
        const dataSource = this.dataSource();
        const filtersOLd = dataSource?.filters();
        //const filterOld = filtersOLd && name in filtersOLd ? filtersOLd[name] : null;
        const local = FilterStorage.get(id);
        //form.setValue(filterOld ?? local, { emitEvent: !filterOld });
      });
    });
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
        const dataSource = this.dataSource();
        if (dataSource && value) {
          dataSource.update({
            filters: value
          });
        }
      })
    });
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FilterTabsSourceParams, params2?: F24FilterTabsSourceParams) {
    untracked(() => {
      this._id.setExectUndefined(params?.id ?? params2?.id);
      this._dataSource.setExectUndefined(params?.dataSource ?? params2?.dataSource); 
      this._change.setExectUndefined(params?.change ?? params2?.change);
      this._items.setExectUndefined(params?.items ?? params2?.items);
    });
  }
}
/**
 * createFilterTabsSource
 */
export const createFilterTabsSource = (params?: F24FilterTabsSourceParams) => {
  return new F24FilterTabsSource(params);
}
/**
 * createFilterTabsSourceParams
 */
export const createFilterTabsSourceParams = (params?: F24FilterTabsSourceParams) => {
  return params;
}