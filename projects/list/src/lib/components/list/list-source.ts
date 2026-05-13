

import { computed, untracked } from '@angular/core';

import { createDataSource, F24DataSource } from '@f24/data';
import { signalSource } from "@f24/core";
import { F24LayoutSizes } from '@f24/layout';

/**
 * F24ListSourceParams
 */
export interface F24ListSourceParams<T> {
  filterKey?: string;
  filterLabel?: string;
  label?: string;
  dataSource?: F24DataSource<T>;
  showHeader?: boolean;
  columns?: F24LayoutSizes<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>
 }
/**
 * F24ListSource
 */
export class F24ListSource<T> {
  /**
   * filterKey para el buscador principal
   */
  protected readonly _filterKey = signalSource('');
  readonly filterKey = this._filterKey.asReadonly();
  /**
   * filterLabel para el buscador principal
   */
  protected readonly _filterLabel = signalSource('Buscar');
  readonly filterLabel = this._filterLabel.asReadonly();
  /**
   * label para el titulo 
   */
  protected readonly _label = signalSource('');
  readonly label = this._label.asReadonly();
  /**
   * dataSource variable para pasar el filtro 
   * al datasource cuando cambie este input 
   */
  protected readonly _dataSource = signalSource<F24DataSource<T>>(createDataSource<T>());
  readonly dataSource = this._dataSource.asReadonly();
  /**
   * showHeader variable para ocultar el header
   */
  protected readonly _showHeader = signalSource(true);
  readonly showHeader = this._showHeader.asReadonly();
  /**
   * columns son la cantidad de columnas que mostrara segun el tamanio de la pantalla
   */
  protected readonly _columns = signalSource<F24LayoutSizes<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>>({
    xs: 1, s: 1, m: 2, l: 3, xl: 4, xxl: 4
  });
  readonly columns = this._columns.asReadonly();
  readonly columnsClass = computed(() => {
    const newSizes: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(this.columns())) {
      newSizes[key] = `f24-list-column-${value}`;
    }
    return newSizes;
  })
  /**
   * constructor
   */
  constructor(params?: F24ListSourceParams<T>) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24ListSourceParams<T>, params2?: F24ListSourceParams<T>) {
    untracked(() => {
      this._filterKey.setExectUndefined(params?.filterKey ?? params2?.filterKey);
      this._filterLabel.setExectUndefined(params?.filterLabel ?? params2?.filterLabel);
      this._label.setExectUndefined(params?.label ?? params2?.label);
      this._dataSource.setExectUndefined(params?.dataSource ?? params2?.dataSource);
      this._showHeader.setExectUndefined(params?.showHeader ?? params2?.showHeader);
      this._columns.setExectUndefined(params?.columns ?? params2?.columns);
    });
  }
}
/**
 * createListSource
 */
export const createListSource = <T>(params?: F24ListSourceParams<T>) => {
  return new F24ListSource(params);
}
/**
 * createListSourceParams
 */
export const createListSourceParams = <T>(params?: F24ListSourceParams<T>) => {
  return params;
}