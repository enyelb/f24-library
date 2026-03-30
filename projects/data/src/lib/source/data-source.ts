import { effect, signal, untracked } from "@angular/core";

import { format, isDate } from 'date-fns';
import { debounceTime, Observable, of, Subject, switchMap, takeUntil } from "rxjs";

import { F24Page } from "@f24/api";
import { signalSource } from "@f24/core";

/**
 * Properties
 */
type Id = string | ((item: any) => any);
type Filters = { [key: string]: any };
type FilterFn<T> = (filters: Filters, data: T[]) => T[] | undefined;
type Sorts = { [key: string]: string };
type SortFn<T> = (sorts: Sorts, data: T[]) => T[] | undefined;
type RequestPage<T> = (page: number, size: number, filters: Filters, sorts: Sorts) => Observable<F24Page<T>>
type Request<T> = (filters: Filters, sorts: Sorts) => Observable<T[]> | T[]
/**
 * F24DataSourceParams
 */
export interface F24DataSourceParams<T> {
  id?: string | ((item: any) => any);
  data?: T[];
  allSelected?: T[];
  filters?: Filters;
  sorts?: Sorts;
  sort?: SortFn<T>
  page?: {
    size?: number;
    index?: number;
    options?: number[];
    isMaxLength?: boolean;
  };
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
  private readonly _connected = signalSource(false);
  readonly connected = this._connected.asReadonly();
  /**
   * id para identificar cada item en el trackBy
   */
  protected readonly _id = signalSource<Id>((item: T) => item);
  readonly id = this._id.asReadonly();
  /**
   * data
   */
  protected readonly _data = signalSource<T[]>([]);
  readonly data = this._data.asReadonly()
  /**
   * allSelected
   */
  protected readonly _allSelected = signalSource<T[]>([]);
  readonly allSelected = this._allSelected.asReadonly();
  /**
   * total
   */
  protected readonly _total = signalSource(0);
  readonly total = this._total.asReadonly();
  /**
   * loading
   */
  protected readonly _loading = signalSource(true);
  readonly loading = this._loading.asReadonly()
  /**
   * filters
   */
  protected readonly _filters = signalSource<Filters>({});
  readonly filters = this._filters.asReadonly()
  /**
   * filter funcion
   */
  protected readonly _filter = signalSource<FilterFn<T> | undefined>(undefined);
  readonly filter = this._filter.asReadonly()
  /**
   * sorts
   */
  protected readonly _sorts = signalSource<Sorts>({});
  readonly sorts = this._sorts.asReadonly()
  /**
   * sort funcion
   */
  protected readonly _sort = signalSource<SortFn<T> | undefined>(undefined);
  readonly sort = this._sort.asReadonly()
  /**
   * page size
   */
  protected readonly _pageSize = signalSource(20);
  readonly pageSize = this._pageSize.asReadonly()
  /**
   *
   */
  protected readonly _pageIndex = signalSource(0);
  readonly pageIndex = this._pageIndex.asReadonly()
  /**
   * 
   */
  protected readonly _pageOptions = signalSource([10, 25, 50, 100]);
  readonly pageOptions = this._pageOptions.asReadonly()
  /**
   * 
   */
  protected readonly _pageIsMaxLength = signalSource(true);
  readonly pageIsMaxLength = this._pageIsMaxLength.asReadonly();
  /**
   * request
   */
  protected readonly _request = signalSource<RequestPage<T> | Request<T> | undefined>(undefined);
  readonly request = this._request.asReadonly()
  /**
   * noResultLabel
   */
  protected readonly _noResultLabel = signalSource<string>('No data matching the filter');
  readonly noResultLabel = this._noResultLabel.asReadonly()
  /**
   * constructor
   */
  constructor(params?: F24DataSourceParams<T>) {
    this.update(params);

    this.reload.pipe(
      debounceTime(300),
      switchMap(() => {
        this._loading.set(true);

        const filters = this.safeProperties(this.filters());
        const sorts = this.safeProperties(this.sorts());
        const pageSize = this.pageSize();
        const pageIndex = this.pageIndex();
        
        const request = this.request();
        const connected = this.connected();

        if (!request || !connected) {
          return of(null);
        }

        const respose = isPageRequest(request) ? 
          request(pageIndex + 1, pageSize, filters, sorts) : 
          request(filters, sorts);

        return respose instanceof Observable ? respose : of(respose);
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
        
        this.applySortsFn(newData.data, this.sorts(), this.sort());
      },
      error: (e) => {
        this._loading.set(false);
      }
    });
    /**
     * efecto para recargar data
     */
    effect((onCleanup) => {
      this.filters();
      this.sorts();
      this.pageSize();
      this.pageIndex();
      this.request();
      this.connected();
      const rafId = requestAnimationFrame(() => {
        untracked(() => {    
          this.reload.next();
        });
      });
      onCleanup(() => cancelAnimationFrame(rafId));
    }, { debugName: 'F24DataSource' });
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24DataSourceParams<T>, params2?: F24DataSourceParams<T>) {
    untracked(() => {
      this._id.setExectUndefined(params?.id ?? params2?.id);
      this._data.setExectUndefined(params?.data ?? params2?.data);
      this._total.setExectUndefined(params?.data?.length ?? params2?.data?.length);
      this._allSelected.setExectUndefined(params?.allSelected ?? params2?.allSelected);
      this._filters.append(params?.filters ?? params2?.filters);
      this._sorts.append(params?.sorts ?? params2?.sorts);
      this._sort.setExectUndefined(params?.sort ?? params2?.sort);
      this._pageIndex.setExectUndefined(params?.page?.index ?? params2?.page?.index);
      this._pageSize.setExectUndefined(params?.page?.size ?? params2?.page?.size);
      this._pageOptions.setExectUndefined(params?.page?.options ?? params2?.page?.options);
      this._pageIsMaxLength.setExectUndefined(params?.page?.isMaxLength ?? params2?.page?.isMaxLength);
      this._request.setExectUndefined(params?.request ?? params2?.request);
      this._loading.setExectUndefined(params?.loading ?? params2?.loading);
      this._noResultLabel.setExectUndefined(params?.noResultLabel ?? params2?.noResultLabel);
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
      this._allSelected.set(this.data());
    } else {
      this._allSelected.set([]);
    }
  }
  /**
   * isSelected
   * @param item
   */
  public isSelected(item: T) {
    return this.allSelected().includes(item);
  }
  /**
   * refresh
   */
  public refresh() {
    this.reload.next();
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
   * private apply filter function 
   */
  private safeProperties(properties: { [key: string]: any }): { [key: string]: any } {
    const safeProperties: { [key: string]: any } = {};
    for (const key in properties) {
      if (properties[key] == null) {
        continue;
      } 
      
      safeProperties[key] = isDate(properties[key]) ? format(properties[key], 'yyyy-MM-dd') : properties[key];
    }
    return safeProperties;
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