import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import { map, Observable } from 'rxjs';

import { format, isDate } from "date-fns";

import { F24APICache } from './api-cache';

/**
 * Page
 */
export interface F24Page<Data> {
  current_page: number
  data: Data[]
  last_page: number
  per_page: number
  total: number
}

/**
 * PageRequestData
 */
export interface F24PageRequestData<Model> {
  (pageNumber: Number, pageSize: Number, filters?: {}, sorts?: {}) : Observable<F24Page<Model>>
};

/**
 * RequestData
 */
export interface F24RequestData<Model> {
  (filters?: {}, sorts?: {}) : Observable<Model[]>,
};

/**
 * RequestOptions
 */
export interface F24RequestMessage<Generic> {
  status: number,
  message: string,
  data: Generic
};

/**
 * RequestOptions
 */
export interface F24RequestOptions {
  params?: {}
  filters?: {}
  sorts?: {}
  options?: {}
  url?: boolean
  cache?: string
  index?: boolean
};

/**
 * APIService
 */
@Injectable({
  providedIn: 'root'
})
export abstract class F24APIService {

  /**
   * _cache
   */
  private _cache: { [key:string] : any } = {};

  /**
   * _url
   */
  protected _url: string = '';

  /**
   * _http
   */
  private _http: HttpClient = inject(HttpClient);

  /**
   * get
   */
  public get<Generic>(url: string, options: F24RequestOptions = {}) : Observable<Generic> {
    return F24APICache.api(this._cache, options.cache, () => {
      return this.index(
        this._http.get<Generic>(this.url(url, options.params, options.filters, options.sorts), options.options), options
      );
    });
  }

  /**
   * post
   */
  public post<Generic>(url: string, body = {}, options: F24RequestOptions = {}) : Observable<Generic> {
    return F24APICache.api(this._cache, options.cache, () => {
      return this.index(
        this._http.post<Generic>(this.url(url, options.params, options.filters, options.sorts), body, options.options), options
      );
    });
  }

  /**
   * put
   */
  public put<Generic>(url: string, body = {}, options: F24RequestOptions = {}) : Observable<Generic> {
    return F24APICache.api(this._cache, options.cache, () => {
      return this.index(
        this._http.put<Generic>(this.url(url, options.params, options.filters, options.sorts), body, options.options), options
      );
    });
  }

  /**
   * delete
   */
  public delete<Generic>(url: string, options: F24RequestOptions = {}) : Observable<Generic> {
    return F24APICache.api(this._cache, options.cache, () => {
      return this.index(
        this._http.delete<Generic>(this.url(url, options.params, options.filters, options.sorts), options.options), options
      );
    });
  }

  /**
   * url
   */
  private url(url: string, params: {} | undefined = {}, filters: {} | undefined, sorts: {} | undefined, onlyUrl: boolean | undefined = false) : string {
    let newurl = (onlyUrl ? '' : this._url) + url;
    const paramsurl = this.params(params);
    if (paramsurl.length > 0) {
      newurl += `${newurl.includes('?') ? '&' : '?'}${paramsurl}`
    }
    const filtersurl = this.filters(filters);
    if (filtersurl.length > 0) {
      newurl += `${newurl.includes('?') ? '&' : '?'}${filtersurl}`
    }
    const sortsurl = this.sorts(sorts);
    if (sortsurl.length > 0) {
      newurl += `${newurl.includes('?') ? '&' : '?'}${sortsurl}`
    }
    return newurl;
  }


  /**
   * index
   */
  private index<Generic>(request: Observable<Generic>, options: F24RequestOptions) : Observable<Generic> {
    if (options.index) {
      return request.pipe(map(data => {
        if (this.isPage(data)) {
          data.data = data.data.map((item, index) => item ? {index: (((data.current_page - 1) * data.per_page) + (index + 1)), ... item } : item);
        }
        return data;
      }));
    }
    return request;
  }

  /**
   * isPage
   * @param request
   * @returns
   */
  private isPage<Data>(request: F24Page<Data> | any): request is F24Page<Data> {
    return 'data' in request;
  }

  /**
   * filters
   */
  private filters(filters: {} | undefined = {}) : string {
    return this.params(filters, 'filter_');
  }

  /**
   * sorts
   */
  private sorts(filters: {} | undefined = {}) : string {
    return this.params(filters, 'sort_');
  }

  /**
   * params
   */
  private params(params: {} | undefined = {}, prefix : string = '') : string {
    let paramss = '';
    if (params) {
      for (const [name, param] of Object.entries(params)) {
        if (paramss.length > 0) {
          paramss += '&';
        }
        paramss += `${prefix}${name}=${param}`;
      }
    }
    return paramss;
  }

  /**
   * filters
   */
  public static filters(forms: {[key: string]: FormControl} = {}) : {[key: string] : any} {
    let filters: {[key: string] : any} = {};
    for (const [key, form] of Object.entries(forms)) {
      if (form.value) {
        filters[key] = isDate(form.value) ? format(new Date(form.value), 'yyyy-MM-dd') : form.value ? form.value: '';
      }
    }
    return filters;
  }

  /**
   * filters
   */
  public static sorts(forms: {[key: string]: FormControl} = {}) : {[key: string] : any} {
    let sorts: {[key: string] : any} = {};
    for (const [key,form] of Object.entries(forms)) {
      if (form.value) {
        sorts[key] = form.value;
      }
    }
    return sorts;
  }
}
