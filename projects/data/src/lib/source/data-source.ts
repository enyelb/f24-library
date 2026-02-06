import { effect, signal, untracked } from "@angular/core";

import { format, isDate } from 'date-fns';
import { debounceTime, Observable, of, Subject, switchMap, takeUntil } from "rxjs";

import { F24Page } from "@f24/api";

/**
 * Properties
 */
type Id = string | ((item: any) => any);
type Filters = { [key: string]: any };
type Filter = { name: string, value: any };
type FilterFn<T> = (filters: Filters, data: T[]) => T[] | undefined;
type Sorts = { [key: string]: string };
type Sort = { name: string, value: string };
type SortFn<T> = (sorts: Sorts, data: T[]) => T[] | undefined;
type RequestPage<T> = (page: number, size: number, filters: Filters, sorts: Sorts) => Observable<F24Page<T>>
type Request<T> = (filters: Filters, sorts: Sorts) => Observable<T[]> | T[]
type Pagination = { size?: number, index?: number, options?: number[], isMaxLength?: boolean }
/**
 * F24DataSourceParams
 */
export interface F24DataSourceParams<T> {
  id?: Id;
  data?: T[];
  allSelected?: T[];
  filters?: Filters;
  sorts?: Sorts;
  filter?: Filter | FilterFn<T>;
  sort?: Sort | SortFn<T>
  page?: Pagination;
  loading?: boolean;
  request?: RequestPage<T> | Request<T>;
  noResultLabel?: string;
}
/**
 * isPageRequest
 */
function isPageRequest<T>(
  request: F24DataSourceParams<T>['request']
): request is RequestPage<T> {
  return request !== undefined && request.length === 4;
}
/**
 * DataSource
 */
export class F24DataSource<T> {
  /**
   * reload
   */
  private reload = new Subject<void>();
  /**
   * destroy
   */
  private destroy$ = new Subject<void>();
  /**
   * _connected
   */
  private readonly _connected = signal(false);
  /**
   * id para identificar cada item en el trackBy
   */
  protected readonly _id;
  /**
   * data
   */
  protected readonly _data;
  /**
   * allSelected
   */
  protected readonly _allSelected;
  /**
   * total
   */
  protected readonly _total;
  /**
   * loading
   */
  protected readonly _loading;
  /**
   * filters
   */
  protected readonly _filters;
  /**
   * filter funcion
   */
  protected readonly _filter;
  /**
   * sorts
   */
  protected readonly _sorts;
  /**
   * sort funcion
   */
  protected readonly _sort;
  /**
   * page
   */
  protected readonly _page;
  /**
   * request
   */
  protected readonly _request;
  /**
   * noResultLabel
   */
  protected readonly _noResultLabel;
  /**
   * constructor
   */
  constructor(params?: F24DataSourceParams<T>) {
    this._id = signal(params?.id ?? ((item: T) => item));
    this._data = signal(params?.data ?? []);
    this._total = signal(params?.data?.length ?? 0);
    this._allSelected = signal(params?.allSelected ?? []);
    this._loading = signal(params?.loading ?? true);
    this._page = signal(this.createPage(params));
    this._filters = signal(this.cerateFilters(params));
    this._sorts = signal(this.cerateSorts(params));
    this._filter = signal(typeof params?.filter === 'function' ? params.filter : undefined);
    this._sort = signal(typeof params?.sort === 'function' ? params.sort : undefined);
    this._request = signal(params?.request);
    this._noResultLabel = signal(params?.noResultLabel ?? 'No data matching the filter');

    this.reload.pipe(
      debounceTime(300),
      switchMap(() => {
        this._loading.set(true);

        const filters = this._filters();
        const sorts = this._sorts();
        const page = this._page();
        const request = this._request();
        const connected = this._connected();

        if (!request || !connected) {
          return of(null);
        }

        const respose = isPageRequest(request) ? 
          request(page.index + 1, page.size, filters, sorts) : 
          request(filters, sorts);

        if (respose instanceof Observable) {
          return respose;
        } else {
          return of(respose);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this._loading.set(false);
        if (!data) {
          return;
        }
        const newData = data instanceof Array ? 
          { total: data.length, data } : 
          { total: data.total, data: data.data };

        
        this._total.set(newData.total);
        this._data.set(newData.data);
        
        this.applySortsFn(newData.data, this._sorts(), this._sort());
        this.applyFiltersFn(newData.data, this._filters(), this._filter());
      },
      error: (e) => {
        this._loading.set(false);
      }
    });
    /**
     * efecto para recargar data solo con sort
     */
    effect(() => {
      const sorts = this._sorts();
      const sort = this._sort();
      untracked(() => {  
        /**
         * validate si se aplican los filtros por funcion
         */
        if (this.applySortsFn(this._data(), sorts, sort)) {
          return;
        }   
        this.reload.next();
      });   
    });
    /**
     * efecto para recargar data
     */
    effect(() => {
      this._filters();
      this._page();
      this._request();
      this._connected();

      untracked(() => {    
        this.reload.next();
      });
    });
  }
  /**
   * metodo para obtener id
   */
  get id() {
    return this._id.asReadonly();  
  }
  /**
   * total
   */
  get total() {
    return this._total.asReadonly();
  }
  /**
   * data
   */
  get data() {
    return this._data.asReadonly();
  }
  /**
   * allSelected
   */
  get allSelected() {
    return this._allSelected.asReadonly();
  }
  /**
   * loading
   */
  get loading() {
    return this._loading.asReadonly();
  }
  /**
   * filters
   */
  get filters() {
    return this._filters.asReadonly();
  }
  /**
   * sorts
   */
  get sorts() {
    return this._sorts.asReadonly();
  }
  /**
   * page
   */
  get page() {
    return this._page.asReadonly();
  }
  /**
   * metodo para obtener label no result
   */
  get noResultLabel() {
    return this._noResultLabel.asReadonly();  
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24DataSourceParams<T>) {
    /**
     * por si el update se llega a llamar en un effect
     */
    untracked(() => {
      /**
       * validar si existe id
       */
      if (params?.id) {
        this._id.set(params.id);
      }
      /**
       * validar si existe data
       */
      if (params?.data) {
        this._data.set(params.data);
        this._total.set(params.data.length)
      }
      /**
       * validar si existe isSticky
       */
      if (params?.allSelected) {
        this._allSelected.set(params.allSelected);
      }
      /**
       * validar si existe page
       */
      if (params?.page) {
        this._page.set(this.createPage(params, this._page()));
      }
      /**
       * validar si existe filters
       */
      if (params?.filters || params?.filter) {
        this._filters.set(this.cerateFilters(params, this._filters()));
        this._filter.set(typeof params?.filter === 'function' ? params.filter : this._filter());
      }
      /**
       * validar si existe sorts
       */
      if (params?.sorts || params?.sort) {
        this._sorts.set(this.cerateSorts(params, this._sorts()));
        this._sort.set(typeof params?.sort === 'function' ? params.sort : this._sort());
      }
      /**
       * validar si existe request
       */
      if (params?.request) {
        this._request.set(params.request);
      }
      /**
       * validar si existe loading
       */
      if (params?.loading) {
        this._loading.set(params.loading);
      }
      /**
       * validar si existe noResultLabel
       */
      if (params?.noResultLabel) {
        this._noResultLabel.set(params.noResultLabel);
      }
    });
  }
  /**
   * connect
   */
  public connect() {
    this._connected.set(true);
  }
  /**
   * select
   * @param item
   * @param select
   */
  public select(item: T, select: boolean = true) {
    if (select) {
      this._allSelected.update(selected => [...selected, item]);
    } else {
      this._allSelected.update(selected => selected.filter(s => s !== item));
    }
  }
  /**
   * selectAll
   * @param select
   */
  public selectAll(select: boolean = true) {
    if (select) {
      this._allSelected.set(this._data());
    } else {
      this._allSelected.set([]);
    }
  }
  /**
   * isSelected
   * @param item
   */
  public isSelected(item: T) {
    return this._allSelected().includes(item);
  }
  /**
   * refresh
   */
  public refresh() {
    this.reload.next();
  }
  /**
   * cerateFilters
   */
  private cerateFilters(params?: F24DataSourceParams<T>, filters?: Filters) {
    let newFilters: Filters = { ...filters ?? {}};
    if (params?.filters) {
      newFilters = params.filters;
    }

    if (params?.filter && typeof params.filter !== 'function') {
      newFilters[params.filter.name] = params.filter.value;
    }

    for (const key in newFilters) {
      const form = newFilters[key];
      if (isDate(form)) {
        newFilters[key] = format(new Date(form), 'yyyy-MM-dd')
      } else if (form == null) {
        delete newFilters[key];
      }
    }
    return newFilters
  }
  /**
   * cerateSorts
   */
  private cerateSorts(params?: F24DataSourceParams<T>, sorts?: Sorts) {
    let newSorts: Sorts = { ...sorts ?? {}};
    if (params?.sorts) {
      newSorts = params.sorts;
    }
    if (params?.sort && typeof params.sort !== 'function') {
      newSorts[params.sort.name] = params.sort.value;
    }
    return newSorts
  }
  /**
   * metodo para crear page
   */
  private createPage(params?: F24DataSourceParams<T>, page?: Pagination) {
    const size = params?.page?.size ?? page?.size ?? 20;
    const options = params?.page?.options ?? page?.options ?? [10, 25, 50, 100];
    const index = params?.page?.index ?? page?.index ?? 0;
    const isMaxLength = params?.page?.isMaxLength ?? page?.isMaxLength ?? true;
    return { 
      size,
      index,
      isMaxLength,
      options: isMaxLength ? [...options, 100000] : options,
    }
  }
  /**
   * private apply sort function 
   */
  private applySortsFn(data: T[], sorts: Sorts, sort: SortFn<T> | undefined): boolean {
    if (!sort) {
      return false;
    }
    
    const newData = sort(sorts, [...data]);
    if (newData) {
      this._data.set(newData);
      return true;
    }
    return false;
  }
  /**
   * private apply sort function 
   */
  private applyFiltersFn(data: T[], sorts: Sorts, sort: SortFn<T> | undefined): boolean {
    if (!sort) {
      return false;
    }
    
    const newData = sort(sorts, [...data]);
    if (newData) {
      this._data.set(newData);
      return true;
    }
    return false;
  }
}
/**
 * createDataSource
 */
export const createDataSource = <T>(params?: F24DataSourceParams<T>) => {
  return new F24DataSource<T>(params)
}
/**
 * createDataSourceParams
 */
export const createDataSourceParams = <T>(params?: F24DataSourceParams<T>) => {
  return params;
}