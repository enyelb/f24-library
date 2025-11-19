import { computed, effect, signal } from "@angular/core";
import { DataSource as CDKDataSource } from '@angular/cdk/collections';
import { BehaviorSubject, debounceTime, Observable, of, Subject, switchMap, takeUntil } from "rxjs";

import { FnRequestAll, FnRequestArray, FnRequestServerSide, FnRequestServerSidePage } from "./model";

/**
 * DataSource
 */
export class DataSource<T> extends CDKDataSource<T> {

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
   * signals
   */
  private signals = {
    data: signal<T[]>([]),
    filters: signal({}),
    sorts: signal({}),
    total: signal(0),
    page: signal<{
      index: number;
      size: number;
    }>({ index: 1, size: 10}),
    loading: signal(true),
  }

  constructor(fnRequest: FnRequestAll<T>) {
    super();
    this.fnRequest = fnRequest;

    this.reload.pipe(
      debounceTime(300),
      switchMap(() => {
        this.signals.loading.set(true);

        const filters = this.signals.filters();
        const sorts = this.signals.sorts();
        const page = this.signals.page();

        const request = this.request(page.index, page.size, filters, sorts);

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
          this.signals.data.set(data);
          this.signals.total.set(data.length);
        } else {
          this.signals.data.set(data.data);
          this.signals.total.set(data.total);
        }
        this.signals.loading.set(false);
      },
      error: (e) => {
        this.signals.loading.set(false);
      }
    });

    effect(() => {
      const data = this.signals.data();
      this.stream.next(data);
    })

    effect(() => {
      const filters = this.signals.filters();
      const sorts = this.signals.sorts();
      const page = this.signals.page();

      this.reload.next()
    })
  }

  /**
   * connect
   * @returns
   */
  public connect(): Observable<T[]> {
    return this.stream;
  }

  /**
   * disconnect
   */
  public disconnect(): void {
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
   * filter
   * @param filters
   */
  public filter(filters: {}) {
    this.signals.filters.set(filters);
  }

  /**
   * sort
   * @param sorts
   */
  public sort(sorts: {}) {
    this.signals.sorts.set(sorts);
  }

  /**
   * page
   * @param page
   */
  public page(index: number, size: number) {
    this.signals.page.set({
      index,
      size
    });
  }

  /**
   * data
   * @param data
   */
  public data(data: T[]) {
    this.signals.data.set(data);
  }

  /**
   * request
   * @param page
   * @param size
   * @param filters
   * @param sorts
   */
  public request(page: number, size: number, filters: {}, sorts: {}) {
    return this.fnRequest(page, size, filters, sorts);
  }

  /**
   * options
   */
  get options() {
    return {
      data: this.signals.data.asReadonly(),
      total: this.signals.total.asReadonly(),
      page: computed(() => this.signals.page().index),
      size: computed(() => this.signals.page().size),
      loading: this.signals.loading.asReadonly(),
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
  return new DataSource<T>((page, size, filters, sorts) => fn(filters, sorts))
}

/**
 * createDataSourceServerSidePage
 */
export const createDataSourceServerSidePage = <T>(fn: FnRequestServerSidePage<T>) => {
  return new DataSource<T>((page, size, filters, sorts) => fn(page, size,filters, sorts))
}

/**
 * createDataSource
 */
export const createDataSource = <T>(fn: FnRequestArray<T>) => {
  return new DataSource<T>((page, size, filters, sorts) => fn(filters, sorts))
}