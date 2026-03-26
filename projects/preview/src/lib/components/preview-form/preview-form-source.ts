import { effect, signal, untracked } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { combineLatest, map, of, startWith, switchMap } from "rxjs";

import { F24PreviewForm  } from "./preview-form";

/**
 * F24PreviewFormSourceParams
 */
export interface F24PreviewFormSourceParams {
  title?: string;
  description?: string;
  icon?: string;
  type?: "success" | "warning" | "error" | "info" | "none";
  linked?: F24PreviewForm;
  form?: AbstractControl | AbstractControl[];
  auto?: boolean;
  hidden?: boolean;
  clear?: boolean;
  clearAll?: boolean;
  labelNext?: string;
  labelClear?: string;
  checked?: boolean;
  animation?: boolean;
}

/**
 * F24PreviewFormSource
 */
export class F24PreviewFormSource {
  /**
   * titulo para el formulario
   * Nota se una en una alerta: F24Alert
   */
  protected readonly _title = signal<string>('');
  /**
   * descripcion para el formulario
   * Nota se una en una alerta: F24Alert
   */
  protected readonly _description = signal<string>('');
  /**
   * icono para el formulario
   * Nota se una en una alerta: F24Alert
   */
  protected readonly _icon = signal<string>('');
  /**
   * tipo de alerta del formulario
   * Nota se una en una alerta: F24Alert
   */
  protected readonly _type = signal<"success" | "warning" | "error" | "info" | "none">('none');
  /**
   * formulario enlazado
   */
  protected readonly _linked = signal<F24PreviewForm | undefined>(undefined);
  /**
   * formularios
   */
  protected readonly _forms = signal<AbstractControl[]>([]);
  /**
   * si esta marcado se pasa automaticamente al siguiente 
   * Nota: util para los form que son de selecion simple como los check o los radio
   */
  protected readonly _auto = signal<boolean>(true);
  /**
   * si esta marcado se oculta esta formulario y si tiene en enlace se pasa al siguiente
   */
  protected readonly _hidden = signal<boolean>(false);
  /**
   * si esta marcado se limpia el valor del los formularios al pulsar el boton remove
   */
  protected readonly _clear = signal<boolean>(true);
  /**
   * si esta marcado se limpian tambien los formularios enlazados por debajo de el
   */
  protected readonly _clearAll = signal<boolean>(true);
  /**
   * mensaje para el boton de siguiente 
   * Nora: solo se muestra si no es auto
   */
  protected readonly _labelNext = signal<string>('Aceptar');
  /**
   * mensaje para el boton de limpiar
   * Nora: solo se muestra si no es auto
   */
  protected readonly _labelClear = signal<string>('Limpiar todo');
  /**
   * es un signal que tendra el estado de los formularios para saber si son validos
   */
  protected readonly _isValid = toSignal(
    toObservable(this._forms).pipe(
      switchMap(forms => {
        if (forms.length === 0) {
          return of(false);
        }
        const valueChanges$ = forms.map(f =>
          f.valueChanges.pipe(startWith(f.value))
        );
        return combineLatest(valueChanges$).pipe(
          map(() => !forms.some(f => f.invalid))
        );
      })
    ),
    { initialValue: false }
  );
  /**
   * para saber si el formulario esta chequeado
   */
  protected readonly _checked = signal(false);
  /**
   * para saber si el formulario esta visible
   */
  protected readonly _visible = signal(false);
  /**
   * para saber si se este ejecutando la animacion fadeIn o fadeOut 
   */
  protected readonly _animation = signal(false);
  /**
   * index
   * para mostrar el numero de cuando este chequeado
   */
  protected readonly _index = signal(1);
  
  /**
   * constructor
   */
  constructor(params?: F24PreviewFormSourceParams) {
    this.update(params);
    /**
     * efecto para validar si el formulario cambio
     */
    effect(() => {
      const auto = this._auto();
      const hidden = this._hidden();
      const isValid = this._isValid();
      /**
       * ver si todos los campos son validos
       */
      if (!auto && !hidden) {
        return;
      }
      untracked(() => {
        this.update({ checked: isValid });
      });
    });
    /**
     * efecto para saber si es visible
     */
    effect(() => {
      const linked = this._linked();
      if (!linked) {
        this._visible.set(true);
        this._index.set(1);
        return;
      }
      const visible = linked.source().visible();
      const checked = linked.source().checked();
      const animation = linked.source().animation();
      const hidden = linked.source().hidden();

      untracked(() => {
        const index = linked.source()._index();
        if (checked === false && this._clearAll()) {
           this.update({ checked: false });
        }
        this._visible.set((visible && checked && !animation) || (visible && hidden));
        this._index.set(visible && !hidden ? index + 1 : index);
      });
    });
  }
  /**
   * metodo para obtener el titulo
   */
  get title() {
    return this._title.asReadonly();  
  }
  /**
   * metodo para obtener la descripcion
   */
  get description() {
    return this._description.asReadonly();  
  }
  /**
   * metodo para obtener el icono
   */
  get icon() {
    return this._icon.asReadonly();  
  }
  /**
   * metodo para obtener el tipo
   */
  get type() {
    return this._type.asReadonly();  
  }
  /**
   * metodo para obtener el formulario enlazado
   */
  get linked() {
    return this._linked.asReadonly();  
  }
  /**
   * metodo para obtener los formularios
   */
  get forms() {
    return this._forms.asReadonly();  
  }
  /**
   * metodo para saber si esta marcado el auto
   */
  get auto() {
    return this._auto.asReadonly();  
  }
  /**
   * metodo para saber si esta marcado como oculto
   */
  get hidden() {
    return this._hidden.asReadonly();  
  }
  /**
   * metodo para saber si esta marcado como limpiar
   */
  get clear() {
    return this._clear.asReadonly();  
  }
  /**
   * metodo para saber si esta marcado como limpiar todos
   */
  get clearAll() {
    return this._clearAll.asReadonly();  
  }
  /**
   * metodo para obtener el mensaje
   */
  get labelNext() {
    return this._labelNext.asReadonly();  
  }
  /**
   * metodo para obtener el mensaje
   */
  get labelClear() {
    return this._labelClear.asReadonly();  
  }
  /**
   * metodo para obtener si es valido el formulario
   */
  get isValid() {
    return this._isValid;  
  }
  /**
   * metodo para obtener si esta chequeado
   */
  get checked() {
    return this._checked.asReadonly();  
  }
  /**
   * metodo para obtener si esta visible
   */
  get visible() {
    return this._visible.asReadonly();  
  }
  /**
   * metodo para obtener si el formulario se esta animando
   */
  get animation() {
    return this._animation.asReadonly();  
  }
  /**
   * metodo para obtener el index
   */
  get index() {
    return this._index.asReadonly();  
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24PreviewFormSourceParams, params2?: F24PreviewFormSourceParams) {
    untracked(() => {
      /**
       * actualizar el titulo
       */
      const title = params?.title ?? params2?.title;
      if (title !== undefined && this._title() !== title) {
        this._title.set(title);
      }
      /**
       * actualizar la descripcion
       */
      const description = params?.description ?? params2?.description;
      if (description !== undefined && this._description() !== description) {
        this._description.set(description);
      }
      /**
       * actualizar el icono
       */
      const icon = params?.icon ?? params2?.icon;
      if (icon !== undefined && this._icon() !== icon) {
        this._icon.set(icon);
      }
      /**
       * actualizar el tipo
       */
      const type = params?.type ?? params2?.type;
      if (type !== undefined && this._type() !== type) {
        this._type.set(type);
      }
      /**
       * actualizar el formulario enlazado
       */
      const linked = params?.linked ?? params2?.linked;
      if (linked !== undefined && this._linked() !== linked) {
        this._linked.set(linked);
      }
      /**
       * actualizar los formularios
       */
      const form = params?.form ?? params2?.form;
      if (form !== undefined && this._forms() !== form) {
        this._forms.set(Array.isArray(form) ? form : [form]);
      }
      /**
       * actualizar el auto
       */
      const auto = params?.auto ?? params2?.auto;
      if (auto !== undefined && this._auto() !== auto) {
        this._auto.set(auto);
      }
      /**
       * actualizar el hidden
       */
      const hidden = params?.hidden ?? params2?.hidden;
      if (hidden !== undefined && this._hidden() !== hidden) {
        this._hidden.set(hidden);
      }
      /**
       * actualizar el clear
       */
      const clear = params?.clear ?? params2?.clear;
      if (clear !== undefined && this._clear() !== clear) {
        this._clear.set(clear);
      }
      /**
       * actualizar el clearAll
       */ 
      const clearAll = params?.clearAll ?? params2?.clearAll;
      if (clearAll !== undefined && this._clearAll() !== clearAll) {
        this._clearAll.set(clearAll);
      }
      /**
       * actualizar el labelNext
       */
      const labelNext = params?.labelNext ?? params2?.labelNext;
      if (labelNext !== undefined && this._labelNext() !== labelNext) {
        this._labelNext.set(labelNext);
      }
      /**
       * actualizar el labelClear
       */
      const labelClear = params?.labelClear ?? params2?.labelClear;
      if (labelClear !== undefined && this._labelClear() !== labelClear) {
        this._labelClear.set(labelClear);
      }
      /**
       * actualizar el checked
       */
      const checked = params?.checked ?? params2?.checked;
      if (checked !== undefined) {
        this._checked.set(checked && this._isValid());
        if (checked === false && this._clear() && this._auto()) {
          this._forms().forEach(form => form.reset());
        }
      }
      /**
       * actualizar el animation
       */
      const animation = params?.animation ?? params2?.animation;
      if (animation !== undefined && this._animation() !== animation) {
        this._animation.set(animation);
      }
    });
  }
}

/**
 * createPreviewFormSource
 */
export const createPreviewFormSource = (params?: F24PreviewFormSourceParams) => {
  return new F24PreviewFormSource(params);
}
/**
 * createPreviewFormSourceParams
 */
export const createPreviewFormSourceParams = (params?: F24PreviewFormSourceParams) => {
  return params;
}