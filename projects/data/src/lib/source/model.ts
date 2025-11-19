import { Observable } from "rxjs"

import { Page } from "@f24/api"


/**
 * FnRequestAll
 */
export interface FnRequestAll<DataSource> {
  (page: Number, size: Number, filters: {}, sorts: {}): Observable<DataSource[] | Page<DataSource>> | DataSource[]
}

/**
 * FnRequestServerSide
 */
export interface FnRequestServerSide<DataSource> {
  (filters: {}, sorts: {}): Observable<DataSource[]>
}


/**
 * FnRequestServerSidePage
 */
export interface FnRequestServerSidePage<DataSource> {
  (page: Number, size: Number, filters: {}, sorts: {}): Observable<Page<DataSource>>
}

/**
 * FnRequestArray
 */
export interface FnRequestArray<DataSource> {
  (filters: {}, sorts: {}): DataSource[]
}