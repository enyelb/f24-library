import { computed, effect, signal, untracked } from "@angular/core";
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, debounceTime, Observable, of, Subject, switchMap, takeUntil } from "rxjs";

import { F24Page } from "@f24/api";

/**
 * Properties
 */
type Properties = { [key: string]: any };

/**
 * FnRequestAll
 */
export interface FnRequestAll<DataSource> {
  (page: Number, size: Number, filters: Properties, sorts: Properties, previus: DataSource[]): Observable<DataSource[] | F24Page<DataSource>> | DataSource[]
}

/**
 * FnRequestServerSide
 */
export interface FnRequestServerSide<DataSource> {
  (filters: Properties, sorts: Properties): Observable<DataSource[]>
}

/**
 * FnRequestServerSidePage
 */
export interface FnRequestServerSidePage<DataSource> {
  (page: Number, size: Number, filters: Properties, sorts: Properties): Observable<F24Page<DataSource>>
}

/**
 * FnRequestArray
 */
export interface FnRequestArray<DataSource> {
  (filters: Properties, sorts: Properties): DataSource[]
}

/**
 * DataSource
 */
export class F24DataSource<T> extends DataSource<T> {
  /**
   * stream 
   */
  private stream = new BehaviorSubject<T[]>([]);
  /**
   * reload
   */
  private reload = new Subject<void>();
  /**
   * destroy
   */
  private destroy$ = new Subject<void>();
  /**
   * fnRequest
   */
  private fnRequest: FnRequestAll<T>;
  /**
   * data
   */
  protected readonly _data = signal<T[]>([]);
  /**
   * total
   */
  protected readonly _total = signal(0);
  /**
   * loading
   */
  protected readonly _loading = signal(true);
  /**
   * filters
   */
  protected readonly _filters = signal<Properties>({});
  /**
   * sorts
   */
  protected readonly _sorts = signal<Properties>({});
  /**
   * page
   */
  protected readonly _page = signal({ index: 1, size: 10 });
  /**
   * 
   */
  protected readonly _connected = signal(false);
  /**
   * constructor
   */
  constructor(fnRequest: FnRequestAll<T>) {
    super();
    this.fnRequest = fnRequest;

    this.reload.pipe(
      debounceTime(300),
      switchMap(() => {
        this._loading.set(true);

        const filters = this._filters();
        const sorts = this._sorts();
        const page = this._page();
        const previus = this._data();

        const request = this.request(page.index, page.size, filters, sorts, previus);

        if (request instanceof Observable) {
          return request;
        } else {
          return of(request);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        if (data instanceof Array) {
          this._data.set(data);
          this._total.set(data.length);
        } else {
          this._data.set(data.data);
          this._total.set(data.total);
        }
        this._loading.set(false);
      },
      error: (e) => {
        this._loading.set(false);
      }
    });

    effect(() => {
      const data = this._data();
      this.stream.next(data);
    });

    effect(() => {
      const filters = this._filters();
      const sorts = this._sorts();
      const page = this._page();
      const connected = this._connected();

      if (!connected) {
        return;
      }

      untracked(() => {        
        this.reload.next();
      });
    });
  }
  /**
   * connect
   * @returns
   */
  public connect(): Observable<T[]> {
    if (!this._connected()) {
      this._connected.set(true);
    }
    return this.stream;
  }
  /**
   * disconnect
   */
  public disconnect(): void {
    //this._connected.set(false);
  }
  /**
   * destroy
   */
  public destroy() {
    this.stream.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * filters
   * @param filters
   */
  public filters(filters: {}) {
    this._filters.set(filters);
  }
  /**
   * filter
   * @param filters
   */
  public filter(name: string, value: any) {
    this._filters.set({ ...this._filters(), [name]: value });
  }
  /**
   * sorts
   * @param sorts
   */
  public sorts(sorts: {}) {
    this._sorts.set(sorts);
  }
  /**
   * sort
   */
  public sort(name: string, value: any) {
    this._sorts.set({ ...this._sorts(), [name]: value });
  }
  /**
   * page
   * @param page
   */
  public page(index: number, size: number) {
    this._page.set({ index, size });
  }
  /**
   * data
   * @param data
   */
  public data(data: T[]) {
    this._data.set(data);
  }
  /**
   * request
   * @param page
   * @param size
   * @param filters
   * @param sorts
   * @param previus
   */
  public request(page: number, size: number, filters: Properties, sorts: Properties, previus: T[] = []) {
    return this.fnRequest(page, size, filters, sorts, previus);
  }
  /**
   * options
   */
  get options() {
    return {
      data: this._data.asReadonly(),
      total: this._total.asReadonly(),
      page: computed(() => this._page().index),
      size: computed(() => this._page().size),
      filters: this._filters.asReadonly(),
      sorts: this._sorts.asReadonly(),
      loading: this._loading.asReadonly(),
    }
  }
  /**
   * refresh
   */
  public refresh() {
    this.reload.next();
  }
}

/**
 * createDataSourceServerSide
 */
export const createDataSourceServerSide = <T>(fn: FnRequestServerSide<T>) => {
  return new F24DataSource<T>((page, size, filters, sorts) => fn(filters, sorts))
}

/**
 * createDataSourceServerSidePage
 */
export const createDataSourceServerSidePage = <T>(fn: FnRequestServerSidePage<T>) => {
  return new F24DataSource<T>((page, size, filters, sorts) => fn(page, size,filters, sorts))
}

/**
 * createDataSource
 */
export const createDataSource = <T>(fn: FnRequestArray<T>) => {
  return new F24DataSource<T>((page, size, filters, sorts) => fn(filters, sorts))
}

/**
 * createDataSourceEmpty
 */
export const createDataSourceEmpty = <T>() => {
  return new F24DataSource<T>((page, size, filters, sorts, previus) => previus)
}