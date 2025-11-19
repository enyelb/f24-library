import { Observable } from "rxjs";

/**
 * Page
 */
export interface Page<Data> {
  current_page: number
  data: Data[]
  last_page: number
  per_page: number
  total: number
}

/**
 * PageRequestData
 */
export interface PageRequestData<Model> {
  (pageNumber: Number, pageSize: Number, filters?: {}, sorts?: {}) : Observable<Page<Model>>
};

/**
 * RequestData
 */
export interface RequestData<Model> {
  (filters?: {}, sorts?: {}) : Observable<Model[]>,
};

/**
 * RequestOptions
 */
export interface RequestMessage<Generic> {
  status: number,
  message: string,
  data: Generic
};

/**
 * RequestOptions
 */
export interface RequestOptions {
  params?: {}
  filters?: {}
  sorts?: {}
  options?: {}
  url?: boolean
  cache?: string
  index?: boolean
};
