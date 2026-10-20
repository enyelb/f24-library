import { signal, untracked } from "@angular/core";
import { form, FormOptions, SchemaOrSchemaFn } from "@angular/forms/signals";

/**
 * F24FormTreeSourceParams
 */
export interface F24FormTreeSourceParams<T extends {}> {
  model: T;
  schema?: SchemaOrSchemaFn<T>
  options?: FormOptions<T>;
}
/**
 * F24FormTreeSource
 */
export class F24FormTreeSource<T extends {}> {
  /**
   * modelo del formulario
   */
  protected readonly _model;
  readonly model;
  /**
   * esquema del formulario
   */
  protected readonly _schema;
  readonly schema;
  /**
   * opciones del formulario
   */
  protected readonly _options;
  readonly options;
  /**
   * formulario calculado
   */
  readonly form;
  /**
   * constructor
   */
  constructor(params: F24FormTreeSourceParams<T>) {

    this._model = signal<F24FormTreeSourceParams<T>['model']>(params.model);
    this.model = this._model.asReadonly();

    this._schema = signal<F24FormTreeSourceParams<T>['schema']>(params.schema);
    this.schema = this._schema.asReadonly();

    this._options = signal<F24FormTreeSourceParams<T>['options']>(params.options);
    this.options = this._options.asReadonly();

    const schema = this._schema();
    const options = this._options();

    if (schema && options) {
      this.form = form<T>(this._model, schema, options);
    } else if (schema) {
      this.form = form<T>(this._model, schema);
    } else if (options) {
      this.form = form<T>(this._model, options);
    } else {
      this.form = form<T>(this._model);
    }

    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: Partial<F24FormTreeSourceParams<T>>, params2?: Partial<F24FormTreeSourceParams<T>>) {
    untracked(() => {
      this._model.set(params?.model ?? params2?.model ?? this._model());
      this._schema.set(params?.schema ?? params2?.schema ?? this._schema());
      this._options.set(params?.options ?? params2?.options ?? this._options());
    });
  }
}
/**
 * createFormTreeSource
 */
export function createFormTreeSource<T extends {}>(params: F24FormTreeSourceParams<T>) {
  return new F24FormTreeSource<T>(params);
}