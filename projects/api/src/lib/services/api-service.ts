import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

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
  url: string,
  body?: {} | string, 
  params?: {}
  filters?: {}
  sorts?: {}
  options?: {}
  cache?: string
  index?: boolean
};

/**
 * F24PDFResponse
 */
type F24IPDFResponse = {
  pdf_base64?: string;
  base64?: string;
  filename: string;
} | string;
/**
 * F24PDFResponse
 */
export interface F24PDFResponse {
  url: string;
  base64: string;
}

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
   * blob
   * @param options
   */
  public blob(options: F24RequestOptions) : Observable<Blob> {
    return this.request((options) => {
      return this._http.post(options.url, options.body ?? {},  {
        ...options.options, responseType: 'blob'
      });
    }, options);
  }
  /**
   * pdf
   * @param options
   */
  public pdf(options: F24RequestOptions) : Observable<F24PDFResponse> {
    return this.request((options) => {
      return this._http.post<F24IPDFResponse>(options.url, options.options).pipe(
        map(response => {
          const base64 = typeof response === 'string' ? response : response.pdf_base64 || response.base64;

          if (!base64) {
            throw new Error('No PDF data available');
          }
          // Convert base64 to Blob and create object URL
          const blob = this.base64ToBlob(base64, 'application/pdf');
          const url = URL.createObjectURL(blob);

          // Return new object with blob URL instead of data URL
          return { url, base64 };
        })
      );
    }, options);
  }
  /**
   * base64ToBlob
   * @param base64
   * @param contentType
   */
  private base64ToBlob(base64: string, contentType: string = 'application/pdf'): Blob {
    try {
      // Decode base64 string
      const byteCharacters = atob(base64);
      const byteArrays = [];

      // Process in chunks to handle large PDFs
      const sliceSize = 512;
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: contentType });
    } catch (error) {
      throw new Error('Failed to process PDF data');
    }
  }
  /**
   * get
   * @param options
   */
  public get<Generic>(options: F24RequestOptions) : Observable<Generic> {
    /**
     * create request
     */
    return this.request((options) => this._http.get<Generic>(options.url, options.options), options);
  }
  /**
   * post
   * @param options
   */
  public post<Generic>(options: F24RequestOptions) : Observable<Generic> {
    /**
     * create request
     */
    return this.request((options) => this._http.post<Generic>(options.url, options.body ?? {}, options.options), options);
  }
  /**
   * put
   * @param options
   */
  public put<Generic>(options: F24RequestOptions) : Observable<Generic> {
    /**
     * create request
     */
    return this.request((options) => this._http.put<Generic>(options.url, options.body ?? {}, options.options), options);
  }
  /**
   * patch
   * @param options
   */
  public patch<Generic>(options: F24RequestOptions) : Observable<Generic> {
    /**
     * create request
     */
    return this.request((options) => this._http.patch<Generic>(options.url, options.body ?? {}, options.options), options);
  }
  /**
   * delete
   * @param options
   */
  public delete<Generic>(options: F24RequestOptions) : Observable<Generic> {
    /**
     * create request
     */
    return this.request((options) => this._http.delete<Generic>(options.url, options.options), options);
  }
  /**
   * request
   */
  private request<Generic>(requestFn: (options: F24RequestOptions) => Observable<Generic>, options: F24RequestOptions) : Observable<Generic> {
    /**
     * create safe options
     */
    const safeOptions = this.safeOptions(options);
    /**
     * create index
     */
    const indexFn = () => this.index(requestFn(safeOptions), options);
    /**
     * create cache
     */
    return F24APICache.api(this._cache, options.cache, indexFn);
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
   * url
   */
  private url(options:  F24RequestOptions) : string {
    let newurl = this._url + options.url;
    const paramsurl = this.params(options.params);
    if (paramsurl.length > 0) {
      newurl += `${newurl.includes('?') ? '&' : '?'}${paramsurl}`
    }
    const filtersurl = this.params(options.filters, 'filter_');
    if (filtersurl.length > 0) {
      newurl += `${newurl.includes('?') ? '&' : '?'}${filtersurl}`
    }
    const sortsurl = this.params(options.sorts, 'sort_');
    if (sortsurl.length > 0) {
      newurl += `${newurl.includes('?') ? '&' : '?'}${sortsurl}`
    }
    return newurl;
  }
  /**
   * params
   */
  private params(params?: {}, prefix : string = '') : string {
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
   * parseSafeProperties
   */
  private parseSafeProperties(forms: {[key: string]: any} = {}) : {[key: string] : any} {
    for (const [key, form] of Object.entries(forms)) {
      if (isDate(form)) {
        forms[key] = format(new Date(form), 'yyyy-MM-dd');
      }
    }
    return forms;
  }

  /**
   * body
   * @param options
   */
  private safeBody(options: F24RequestOptions) {
    if (typeof options.body === 'string') {
      return options.body;
    }
    const safeBody = this.parseSafeProperties(options.body);

    const isFormData = Object.values(safeBody).some((value) => value instanceof File);
    if (!isFormData) {
      return safeBody;
    }
    
    const formData = new FormData();
    for (const [key, value] of Object.entries(safeBody)) {
      if (value instanceof Array) {
        for (const item of value) {
          formData.append(`${key}[]`, JSON.stringify(item));
        }
      } else if (value) {
        formData.append(key, value);
      }
    }
    return formData;
  }
  /**
   * 
   */
  private safeOptions(options: F24RequestOptions): F24RequestOptions {
    if (options.url) {
      options.url = this.url(options);
    }
    if (options.params) {
      options.params = this.parseSafeProperties(options.params);
    }
    if (options.filters) {
      options.filters = this.parseSafeProperties(options.filters);
    }
    if (options.body) {
      options.body = this.safeBody(options);
    }
    return options;
  }
}
