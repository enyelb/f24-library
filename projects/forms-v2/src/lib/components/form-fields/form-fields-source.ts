import { signal, untracked } from "@angular/core";
import { FieldTree } from "@angular/forms/signals";

/**
 * F24FormFieldsSourceParams
 */
export interface F24FormFieldsSourceParams<T> {
  title?: string;
  fields?: FieldTree<T[], string>
  model?: T,
  hideAdd?: boolean;
  hideDelete?: boolean;
}
/**
 * F24FormFieldsSource
 */
export class F24FormFieldsSource<T> {
  /**
   * titulo del formulario
   */
  protected readonly _title = signal<F24FormFieldsSourceParams<T>['title']>(undefined);
  readonly title = this._title.asReadonly();
  /**
   * campos del formulario
   */
  protected readonly _fields = signal<F24FormFieldsSourceParams<T>['fields']>(undefined);
  readonly fields = this._fields.asReadonly();
  /**
   * 
   */
  protected readonly _model = signal<F24FormFieldsSourceParams<T>['model']>(undefined);
  readonly model = this._model.asReadonly();
  /**
   * ocultar el boton para agregar un nuevo item
   */
  protected readonly _hideAdd = signal<F24FormFieldsSourceParams<T>['hideAdd']>(undefined);
  readonly hideAdd = this._hideAdd.asReadonly();
  /**
   * ocultar el boton para eliminar un item
   */
  protected readonly _hideDelete = signal<F24FormFieldsSourceParams<T>['hideDelete']>(undefined);
  readonly hideDelete = this._hideDelete.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24FormFieldsSourceParams<T>) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FormFieldsSourceParams<T>, params2?: F24FormFieldsSourceParams<T>) {
    untracked(() => {
      this._title.set(params?.title ?? params2?.title ?? this._title());
      this._fields.set(params?.fields ?? params2?.fields ?? this._fields());
      this._model.set(params?.model ?? params2?.model ?? this._model());
      this._hideAdd.set(params?.hideAdd ?? params2?.hideAdd ?? this._hideAdd());
      this._hideDelete.set(params?.hideDelete ?? params2?.hideDelete ?? this._hideDelete());
    });
  }
}
/**
 * createFormFieldsSource
 */
export function createFormFieldsSource<T>(params?: F24FormFieldsSourceParams<T>) {
  return new F24FormFieldsSource(params);
}