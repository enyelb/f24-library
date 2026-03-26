import { effect, signal, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, switchMap } from "rxjs";
import { isDate } from "date-fns";

/**
 * F24FormDateSourceParams
 */
export interface F24FormDateSourceParams {
  label?: string;
  appearance?: 'fill' | 'outline';
  name?: string;
  icon?: string;
  default?: Date | string | 'TODAY';
  placeholder?: string;
  form?: FormControl<Date | null>;
  type?: 'number' | 'text';
  minDate?: Date | string | 'TODAY';
  maxDate?: Date | string | 'TODAY';
  change?: (value: Date | null) => void;
}
/**
 * F24FormDateSource
 */
export class F24FormDateSource {
  /**
   * label
   * este es el label del mat input
   */
  protected readonly _label = signal('');
  /**
   * appearance
   * esta es la apariencia del mat input
   */
  protected readonly _appearance = signal<'fill' | 'outline'>('outline');
  /**
   * name 
   * este nombre se usa para identificar el valor cuando se envia al data source 
   */
  protected readonly _name = signal('');
  /**
   * icon
   * este es el icono que se usa para que apareca delante del input
   */
  protected readonly _icon = signal('');
  /**
   * dafault
   * este es el valor por defecto que se usa
   */
  protected readonly _default = signal<Date | null>(null);
  /**
   * placeholder
   * este es el placeholder del mat input
   */
  protected readonly _placeholder = signal('');
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _form = signal(new FormControl<Date | null>(null));
  /**
   * type
   * este es el tipo de input
   */
  protected readonly _type = signal<'number' | 'text'>('text');
  /**
   * change
   * esta funcion emite los cambios del filtro
   */
  protected readonly _change = signal<(value: Date | null) => void>((value: Date | null) => {});
  /**
   * min date
   * fecha minima permitida
   */
  protected readonly _minDate = signal(new Date('1900-01-01'));
  /**
   * max date
   * fecha maxima permitida
   */
  protected readonly _maxDate = signal(new Date('2100-01-01'));
  /**
   * es un signal que tendra el valor del form
   */
  protected readonly _formValue = toSignal(
    toObservable(this._form).pipe(
      distinctUntilChanged(),
      switchMap(form => form.valueChanges),
      takeUntilDestroyed()
    ),
    { initialValue: null }
  );
  /**
   * constructor
   */
  constructor(params?: F24FormDateSourceParams) {
    this.update(params);
    /**
     * efecto ejecutar el cambio en la funcion change
     */
    effect(() => {
      const value = this._formValue();
      untracked(() => {
        const change = this._change();
        if (change) {
          change(value);
        }
      })
    });
  }
  /**
   * metodo para obtener label
   */
  get label() {
    return this._label.asReadonly();  
  }
  /**
   * metodo para obtener appearance
   */
  get appearance() {
    return this._appearance.asReadonly();
  }
  /**
   * metodo para obtener name
   */
  get name() {
    return this._name.asReadonly();  
  }
  /**
   * metodo para obtener icon
   */
  get icon() {
    return this._icon.asReadonly();  
  }
  /**
   * metodo para obtener default
   */
  get default() {
    return this._default.asReadonly();  
  }
  /**
   * metodo para obtener placeholder
   */
  get placeholder() {
    return this._placeholder.asReadonly();  
  }
  /**
   * metodo para obtener form
   */
  get form() {
    return this._form.asReadonly();  
  }
  /**
   * metodo para obtener el tipo
   */
  get type() {
    return this._type.asReadonly();  
  }
  /**
   * metodo para obtener fn change
   */
  get change() {
    return this._change.asReadonly();
  }
  /**
   * metodo para obtener fecha minima
   */
  get minDate() {
    return this._minDate.asReadonly();
  }
  /**
   * metodo para obtener fecha maxima
   */
  get maxDate() {
    return this._maxDate.asReadonly();
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FormDateSourceParams, params2?: F24FormDateSourceParams) {
    untracked(() => {
      /**
       * actualizar el label
       */
      const label = params?.label ?? params2?.label;
      if (label !== undefined && this._label() !== label) {
        this._label.set(label);
      }
      /**
       * actualizar el appearance
       */
      const appearance = params?.appearance ?? params2?.appearance;
      if (appearance !== undefined && this._appearance() !== appearance) {
        this._appearance.set(appearance);
      }
      /**
       * actualizar el nombre
       */
      const name = params?.name ?? params2?.name;
      if (name !== undefined && this._name() !== name) {
        this._name.set(name);
      }
      /**
       * actualizar el icono
       */
      const icon = params?.icon ?? params2?.icon;
      if (icon !== undefined && this._icon() !== icon) {
        this._icon.set(icon);
      }
      /**
       * actualizar el placeholder
       */
      const placeholder = params?.placeholder ?? params2?.placeholder;
      if (placeholder !== undefined && this._placeholder() !== placeholder) {
        this._placeholder.set(placeholder);
      }
      /**
       * actualizar el form
       */
      const form = params?.form ?? params2?.form;
      if (form !== undefined && this._form() !== form) {
        this._form.set(form);
      }
      /**
       * actualizar el default
       */
      const default2 = params?.default ?? params2?.default
      if (default2 !== undefined && this._default() !== default2) {
        if (default2 === 'TODAY') {
          this._default.set(new Date());
        } else if (isDate(default2)) {
          this._default.set(new Date(default2));
        }
        this._form().setValue(this._default());
      }
      /**
       * actualizar el tipo
       */
      const type = params?.type ?? params2?.type;
      if (type !== undefined && this._type() !== type) {
        this._type.set(type);
      }
      /**
       * actualizar el change
       */
      const change = params?.change ?? params2?.change;
      if (change !== undefined && this._change() !== change) {
        this._change.set(change);
      }
      /**
       * actualizar la fecha meinima
       */
      const minDate = params?.minDate ?? params2?.minDate;
      if (minDate !== undefined && this._minDate() !== minDate) {
        if (minDate === 'TODAY') {
          this._minDate.set(new Date());
        } else if (isDate(minDate)) {
          this._minDate.set(new Date(minDate));
        }
      }
      /**
       * actualizar la fecha maxima
       */
      const maxDate = params?.maxDate ?? params2?.maxDate;
      if (maxDate !== undefined && this._maxDate() !== maxDate) {
        if (maxDate === 'TODAY') {
          this._maxDate.set(new Date());
        } else if (isDate(maxDate)) {
          this._maxDate.set(new Date(maxDate));
        }
      }
    });
  }
}
/**
 * createFormDateSource
 */
export const createFormDateSource = (params?: F24FormDateSourceParams) => {
  return new F24FormDateSource(params);
}
/**
 * createFormDateSourceParams
 */
export const createFormDateSourceParams = (params?: F24FormDateSourceParams) => {
  return params;
}