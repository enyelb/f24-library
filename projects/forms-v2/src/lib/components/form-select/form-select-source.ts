import { signal, untracked } from "@angular/core";
import { Field } from "@angular/forms/signals";

/**
 * F24FormSelectFormatterSourceParams
 */
export type F24FormSelectFormatterSourceParams<Item> = (data: Item) => string;
/**
 * F24FormSelectBindSourceParams
 */
export type F24FormSelectBindSourceParams = string;
/**
 * F24FormSelectSourceParams
 */
export interface F24FormSelectSourceParams<Type, Item> {
  label?: string;
  appearance?: 'fill' | 'outline';
  name?: string;
  icon?: string;
  default?: Type | null;
  placeholder?: string;
  form?: Field<Type | null>;
  type?: 'number' | 'text';
  multiple?: boolean;
  items?: Item[];
  formatter?: F24FormSelectFormatterSourceParams<Item> | {
    label?: F24FormSelectFormatterSourceParams<Item>;
    value?: F24FormSelectFormatterSourceParams<Item>;
  };
  bind?: F24FormSelectBindSourceParams | {
    label?: F24FormSelectBindSourceParams
    value?: F24FormSelectBindSourceParams
  }
}
/**
 * F24FormSelectSource
 */
export class F24FormSelectSource<Type, Item> {
  /**
   * label
   * este es el label del mat form field
   */
  protected readonly _label = signal<string>('');
  readonly label = this._label.asReadonly();
  /**
   * appearance
   * esta es la apariencia del mat form field
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
   * dafault
   * este es el valor por defecto que se usa
   */
  protected readonly _default = signal<Type | null>(null);
  readonly default = this._default.asReadonly();
  /**
   * placeholder
   * este es el placeholder del mat form field
   */
  protected readonly _placeholder = signal<string>('');
  readonly placeholder = this._placeholder.asReadonly();
  /**
   * form
   * este es el field del signal form
   */
  protected readonly _form = signal<Field<Type | null> | null>(null);
  readonly form = this._form.asReadonly();
  /**
   * type
   * este es el tipo de input
   */
  protected readonly _type = signal<'number' | 'text'>('text');
  readonly type = this._type.asReadonly();
  /**
   * multiple
   * esta variable permite seleccion multiple
   */
  protected readonly _multiple = signal<boolean>(false);
  readonly multiple = this._multiple.asReadonly();
  /**
   * items
   * esta variable es la lista de opciones
   */
  protected readonly _items = signal<Item[]>([]);
  readonly items = this._items.asReadonly();
  /**
   * formatterLabel
   * funcion para formatear el item seleccionado y mostrar en la lista
   */
  protected readonly _formatterLabel = signal<(item: Item) => string>((item: Item) => this.formatterDefault(this.bindLabel(), item));
  readonly formatterLabel = this._formatterLabel.asReadonly();
  /**
   * formatterOption
   * funcion para formatear el item seleccionado y mostrar en el input
   */
  protected readonly _formatterOption = signal<(item: Item) => string>((item: Item) => this.formatterDefault(this.bindValue(), item));
  readonly formatterOption = this._formatterOption.asReadonly();
  /**
   * bindLabel
   * variable para enlazar una propiedad del item con el label
   */
  protected readonly _bindLabel = signal<string>('title');
  readonly bindLabel = this._bindLabel.asReadonly();
  /**
   * bindValue
   * variable para enlazar una porpiedad del item con el value
   */
  protected readonly _bindValue = signal<string>('value');
  readonly bindValue = this._bindValue.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24FormSelectSourceParams<Type, Item>) {
    this.update(params);
  }
  /**
   * formatterDefault
   */
  private formatterDefault(bind: string | undefined, data: Item): any {
    if (!bind || !(data instanceof Object)) {
      return '';
    }
    for(const [key, value] of Object.entries(data)) {
      if (key === bind) {
        return value;
      }
    }
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FormSelectSourceParams<Type, Item>, params2?: F24FormSelectSourceParams<Type, Item>) {
    untracked(() => {
      this._label.set(params?.label ?? params2?.label ?? this._label());
      this._appearance.set(params?.appearance ?? params2?.appearance ?? this._appearance());
      this._name.set(params?.name ?? params2?.name ?? this._name());
      this._icon.set(params?.icon ?? params2?.icon ?? this._icon());
      this._default.set(params?.default ?? params2?.default ?? this._default());
      this._placeholder.set(params?.placeholder ?? params2?.placeholder ?? this._placeholder());
      this._form.set(params?.form ?? params2?.form ?? this._form());
      this._type.set(params?.type ?? params2?.type ?? this._type());
      this._multiple.set(params?.multiple ?? params2?.multiple ?? this._multiple());
      this._items.set(params?.items ?? params2?.items ?? this._items());
      this._formatterLabel.set((typeof params?.formatter === 'object' ? params.formatter?.label : params?.formatter) ?? (typeof params2?.formatter === 'object' ? params2.formatter?.label : params2?.formatter) ?? this._formatterLabel());
      this._formatterOption.set((typeof params?.formatter === 'object' ? params.formatter?.value : params?.formatter) ?? (typeof params2?.formatter === 'object' ? params2.formatter?.value : params2?.formatter) ?? this._formatterOption());
      this._bindLabel.set((typeof params?.bind === 'object' ? params.bind?.label : params?.bind) ?? (typeof params2?.bind === 'object' ? params2.bind?.label : params2?.bind) ?? this._bindLabel());
      this._bindValue.set((typeof params?.bind === 'object' ? params.bind?.value : params?.bind) ?? (typeof params2?.bind === 'object' ? params2.bind?.value : params2?.bind) ?? this._bindValue());
    });
  }
}
/**
 * createFormSelectSource
 */
export const createFormSelectSource = <Type, Item>(params?: F24FormSelectSourceParams<Type, Item>) => {
  return new F24FormSelectSource(params);
}
