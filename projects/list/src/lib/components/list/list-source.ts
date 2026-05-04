

import { untracked } from '@angular/core';

import { createDataSource, F24DataSource } from '@f24/data';
import { signalSource } from "@f24/core";

/**
 * F24ListSourceParams
 */
export interface F24ListSourceParams<T> {
  filterKey?: string;
  filterLabel?: string;
  label?: string;
  dataSource?: F24DataSource<T>;
  showHeader?: boolean;
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