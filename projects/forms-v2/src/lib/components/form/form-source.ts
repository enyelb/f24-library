import { signal, untracked } from "@angular/core";

import { F24FormTreeSource } from "./form-tree-source";
import { Observable } from "rxjs";

/**
 * F24FormSourceParams
 */
export interface F24FormSourceParams<T extends {}> {
  title?: string;
  labelSubmit?: string;
  labelCancel?: string;
  defaultErrorMessage?: string;
  defaultSuccessMessage?: string;
  notification?: 'swal' | 'toast' | 'snack';
  tree?: F24FormTreeSource<T>;
  request?: (model: T) => Observable<any>;
  navigateError?: string;
  navigateSuccess?: string;
  lockNavigate?: boolean;
  onError?: (error: any) => void;
  onSuccess?: (response: any) => void;
}
/**
 * F24FormSource
 */
export class F24FormSource<T extends {}> {
  /**
   * titulo del formulario
   */
  protected readonly _title = signal<F24FormSourceParams<T>['title']>(undefined);
  readonly title = this._title.asReadonly();
  /**
   * etiqueta del boton de envio del formulario
   */
  protected readonly _labelSubmit = signal<F24FormSourceParams<T>['labelSubmit']>(undefined);
  readonly labelSubmit = this._labelSubmit.asReadonly();
  /**
   * etiqueta del boton de cancelacion del formulario
   */
  protected readonly _labelCancel = signal<F24FormSourceParams<T>['labelCancel']>(undefined);
  readonly labelCancel = this._labelCancel.asReadonly();
  /**
   * mensaje de error por defecto del formulario
   */
  protected readonly _defaultErrorMessage = signal<F24FormSourceParams<T>['defaultErrorMessage']>(undefined);
  readonly defaultErrorMessage = this._defaultErrorMessage.asReadonly();
  /**
   * mensaje de exito por defecto del formulario
   */
  protected readonly _defaultSuccessMessage = signal<F24FormSourceParams<T>['defaultSuccessMessage']>(undefined);
  readonly defaultSuccessMessage = this._defaultSuccessMessage.asReadonly();
  /**
   * tipo de notificacion del formulario
   */
  protected readonly _notification = signal<F24FormSourceParams<T>['notification']>(undefined);
  readonly notification = this._notification.asReadonly();
  /**
   * arbol del formulario
   */
  protected readonly _tree = signal<F24FormSourceParams<T>['tree']>(undefined);
  readonly tree = this._tree.asReadonly();
  /**
   * request del formulario
   */
  protected readonly _request = signal<F24FormSourceParams<T>['request']>(undefined);
  readonly request = this._request.asReadonly();
  /**
   * navigateError
   */
  protected readonly _navigateError = signal<F24FormSourceParams<T>['navigateError']>(undefined);
  readonly navigateError = this._navigateError.asReadonly();
  /**
   * navigateSuccess
   */
  protected readonly _navigateSuccess = signal<F24FormSourceParams<T>['navigateSuccess']>(undefined);
  readonly navigateSuccess = this._navigateSuccess.asReadonly();
  /**
   * lockNavigate
   */
  protected readonly _lockNavigate = signal<F24FormSourceParams<T>['lockNavigate']>(undefined);
  readonly lockNavigate = this._lockNavigate.asReadonly();
  /**
   * callback de error del formulario
   */
  protected readonly _onError = signal<F24FormSourceParams<T>['onError']>(undefined);
  readonly onError = this._onError.asReadonly();
  /**
   * callback de exito del formulario
   */
  protected readonly _onSuccess = signal<F24FormSourceParams<T>['onSuccess']>(undefined);
  readonly onSuccess = this._onSuccess.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24FormSourceParams<T>) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FormSourceParams<T>, params2?: F24FormSourceParams<T>) {
    untracked(() => {
      this._title.set(params?.title ?? params2?.title ?? this._title());
      this._labelSubmit.set(params?.labelSubmit ?? params2?.labelSubmit ?? this._labelSubmit());
      this._labelCancel.set(params?.labelCancel ?? params2?.labelCancel ?? this._labelCancel());
      this._defaultErrorMessage.set(params?.defaultErrorMessage ?? params2?.defaultErrorMessage ?? this._defaultErrorMessage());
      this._defaultSuccessMessage.set(params?.defaultSuccessMessage ?? params2?.defaultSuccessMessage ?? this._defaultSuccessMessage());
      this._notification.set(params?.notification ?? params2?.notification ?? this._notification());
      this._tree.set(params?.tree ?? params2?.tree ?? this._tree());
      this._request.set(params?.request ?? params2?.request ?? this._request());
      this._navigateError.set(params?.navigateError ?? params2?.navigateError ?? this._navigateError());
      this._navigateSuccess.set(params?.navigateSuccess ?? params2?.navigateSuccess ?? this._navigateSuccess());
      this._lockNavigate.set(params?.lockNavigate ?? params2?.lockNavigate ?? this._lockNavigate());
      this._onError.set(params?.onError ?? params2?.onError ?? this._onError());
      this._onSuccess.set(params?.onSuccess ?? params2?.onSuccess ?? this._onSuccess());
    });
  }
}
/**
 * createFormSource
 */
export const createFormSource = <T extends {}>(params?: F24FormSourceParams<T>) => {
  return new F24FormSource<T>(params);
}