import { signal } from "@angular/core";
import { FormControl } from "@angular/forms";

import { Subscription } from "rxjs";

import { F24FilterSource, F24FilterSourceParams } from "./filter-source";

import { F24FilterSourceParamForm } from "./form-source";

/**
 * Params
 */
export type F24FilterSourceFormsForms = string | number;
/**
 * F24FilterSourceParamForm
 */
export type F24FilterSourceParamForms<Type, Keys extends string> = {
  [key in Keys]?: F24FilterSourceParamForm<Type>;
}
/**
 * F24FilterSourceFormsParams
 */
export type F24FilterSourceFormsParams<Type, Keys extends string> = F24FilterSourceParams & F24FilterSourceParamForms<Type, Keys>;
/**
 * F24FilterSourceInput
 */
export abstract class F24FilterSourceForms<Type, Keys extends string> extends F24FilterSource {
  /**
   * expectedKeys
   * estas keys se usan para crear los forms por defecto 
   */
  protected expectedKeys: Keys[];
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _forms;
  /**
   * subscriptions
   */
  protected subscriptions: Subscription[] = [];
  /**
   * constructor
   */
  constructor(keys: Keys[], params?: F24FilterSourceFormsParams<Type, Keys>) {
    super(params);
    this.expectedKeys = keys;
    this._forms = signal(this.createForms(params));
  }
  /**
   * metodo para obtener forms
   */
  get forms() {
    return this._forms.asReadonly();  
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public override update(params?: F24FilterSourceFormsParams<Type, Keys>) {
    super.update(params);
    /**
     * validar si existe forms
     */
    if (params) {
      this._forms.set(this.createForms(params, this._forms()));
    }
  }
  /**
   * método para crear forms con valores por defecto
   * Devuelve todas las propiedades como requeridas
   */
  protected createForms(
    forms?: Partial<Record<Keys, F24FilterSourceParamForm<Type>>>,
    formsOld?: Record<Keys, Required<F24FilterSourceParamForm<Type>>>
  ): Record<Keys, Required<F24FilterSourceParamForm<Type>>> {

    const result = {} as Record<Keys, Required<F24FilterSourceParamForm<Type>>>;
      
    for (const key of this.expectedKeys) {
      const params = forms?.[key];
      const formOld = formsOld?.[key] ?? undefined;
      
      result[key as Keys] = {
        name: params?.name ?? formOld?.name ?? '',
        default: params?.default ?? formOld?.default ?? null,
        placeholder: params?.placeholder ?? formOld?.placeholder ?? '',
        form: params?.form ?? formOld?.form ?? new FormControl<Type | null>(params?.default ?? null),
        change: params?.change ?? formOld?.change ?? ((value: Type | null) => {})
      };
    }
    
    return result;
  }
  /**
   * init
   */
  public override init() {
    /**
     * obtener los filtros actuales del datasource
     * para obtener el filtro asociado al este forms
     */
    const dataSource = this._dataSource();;
    const filtersOLd = dataSource?.filters();
    /**
     * destruir las suscripciones anteriores
     */
    this.destroy();
    /**
     * aplicar el init a cada form de las Keys
     */
    for (const key of this.expectedKeys) {
      const options = this._forms()[key];
      const name = options.name;
      const filterOld = filtersOLd && name in filtersOLd ? filtersOLd[name] : null;
      /**
       * buscar en local storage
       */
      const local = this.getStorage(`_${key}`);
      /**
       * usar el valor que tiene el filtro en el data source
       * si el valor no esta usar el de local storage
       */
      const form = options.form;
      form.setValue(filterOld ?? local, { emitEvent: !filterOld });
      /**
       * si el filtro en el data source no existe y el local storage esta
       * actualizar el data source
       */
      if (!filterOld && local) {
        if (dataSource && name) {
          dataSource.update({
            filter: { name, value: local }
          });
        }
      }
      /**
       * suscripcion para ver si el valor de form cambia
       */
      this.subscriptions.push(form.valueChanges.subscribe(value => {
        /**
         * emitir el valor del filtro
         */
        const change = options.change;
        if (change) {
          change(value);
        }
        /**
         * guardar el valor en local storage
         */
        this.setStorage(value, `_${key}`);
        /**
         * si la variable name y datasource existen, setear el valor del filtro
         */
        const name = options.name;
        const dataSource = this._dataSource();
        if (dataSource && name) {
          dataSource.update({
            filter: { name, value }
          });
        }
      }));
    }
  }
  /**
   * destroy
   */
  public override destroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }
}