import { signal, untracked } from "@angular/core";
import { Field } from "@angular/forms/signals";

/**
 * F24FormInputSourceParams
 */
export interface F24FormInputSourceParams {
  label?: string;
  appearance?: 'fill' | 'outline';
  name?: string;
  icon?: string;
  placeholder?: string;
  form?: Field<any>;
  type?: 'number' | 'text' | 'password';
}
/**
 * F24FormInputSource
 */
export class F24FormInputSource {
  /**
   * label
   * este es el label del mat input
   */
  protected readonly _label = signal<string>('');
  readonly label = this._label.asReadonly();
  /**
   * appearance
   * esta es la apariencia del mat input
   */
  protected readonly _appearance = signal<'fill' | 'outline'>('outline');
  readonly appearance = this._appearance.asReadonly();
  /**
   * name 
   * este nombre se usa para identificar el valor cuando se envia al data source 
   */
  protected readonly _name = signal<string>('');
  readonly name = this._name.asReadonly();
  /**
   * icon
   * este es el icono que se usa para que apareca delante del input
   */
  protected readonly _icon = signal<string>('');
  readonly icon = this._icon.asReadonly();
  /**
   * placeholder
   * este es el placeholder del mat input
   */
  protected readonly _placeholder = signal<string>('');
  readonly placeholder = this._placeholder.asReadonly();
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _form = signal<Field<any> | null>(null);
  readonly form = this._form.asReadonly();
  /**
   * type
   * este es el tipo de input
   */
  protected readonly _type = signal<'number' | 'text' | 'password'>('text');
  readonly type = this._type.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24FormInputSourceParams) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FormInputSourceParams, params2?: F24FormInputSourceParams) {
    untracked(() => {
      this._label.set(params?.label ?? params2?.label ?? this._label());
      this._appearance.set(params?.appearance ?? params2?.appearance ?? this._appearance());
      this._name.set(params?.name ?? params2?.name ?? this._name());
      this._icon.set(params?.icon ?? params2?.icon ?? this._icon());
      this._placeholder.set(params?.placeholder ?? params2?.placeholder ?? this._placeholder());
      this._form.set(params?.form ?? params2?.form ?? this._form());
      this._type.set(params?.type ?? params2?.type ?? this._type());
    });
  }
}
/**
 * createFormInputSource
 */
export const createFormInputSource = (params?: F24FormInputSourceParams) => {
  return new F24FormInputSource(params);
}