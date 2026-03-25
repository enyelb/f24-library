import { effect, signal, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, switchMap } from "rxjs";
import { addMonths, addWeeks, endOfMonth, endOfWeek, format, isDate, startOfMonth, startOfWeek, subMonths, subWeeks } from "date-fns";

import { F24DataSource } from '@f24/data';
import { FilterStorage } from "../../filter-storage";

/**
 * F24FilterDateRangeFormSourceParams
 */
export interface F24FilterDateRangeFormSourceParams {
  name?: string;
  default?: Date | string | null;
  placeholder?: string;
  form?: FormControl<Date | string | null>;
  change?: (value: Date | string | null) => void;
}
/**
 * F24FilterDateRangeSourceParams
 */
export interface F24FilterDateRangeSourceParams {
  id?: string;
  dataSource?: F24DataSource<any>;
  label?: string;
  appearance?: 'fill' | 'outline';
  from?: F24FilterDateRangeFormSourceParams,
  to?: F24FilterDateRangeFormSourceParams
  labelCancel?: string
  labelApply?: string
  isTouchUi?: boolean
  default?: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL'
}
/**
 * F24FilterDateRangeSource
 */
export class F24FilterDateRangeSource {
  /**
   * id para guardar el filtro en local storage
   */
  protected readonly _id = signal('');
  /**
   * dataSource variable para pasar el filtro 
   * al datasource cuando cambie este input 
   */
  protected readonly _dataSource = signal<F24DataSource<any> | undefined>(undefined);
  /**
   * label
   * este es el label del mat input
   */
  protected readonly _label = signal('Rango de fecha');
  /**
   * appearance
   * esta es la apariencia del mat input
   */
  protected readonly _appearance = signal<'fill' | 'outline'>('outline');
  /**
   * name 
   * este nombre se usa para identificar el valor cuando se envia al data source 
   */
  protected readonly _fromName = signal('from');
  /**
   * dafault
   * este es el valor por defecto que se usa
   */
  protected readonly _fromDefault = signal<Date | string | null>(null);
  /**
   * placeholder
   * este es el placeholder del mat input
   */
  protected readonly _fromPlaceholder = signal('Desde');
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _fromForm = signal(new FormControl<Date | string | null>(null));
  /**
   * change
   * esta funcion emite los cambios del filtro
   */
  protected readonly _fromChange = signal<((value: Date | string | null) => void) | null>(null);
  /**
   * es un signal que tendra el valor del form
   */
  protected readonly _fromFormValue = toSignal(
    toObservable(this._fromForm).pipe(
      distinctUntilChanged(),
      switchMap(form => form.valueChanges),
      takeUntilDestroyed()
    ),
    { initialValue: null }
  );
  /**
   * name 
   * este nombre se usa para identificar el valor cuando se envia al data source 
   */
  protected readonly _toName = signal('to');
  /**
   * dafault
   * este es el valor por defecto que se usa
   */
  protected readonly _toDefault = signal<Date | string | null>(null);
  /**
   * placeholder
   * este es el placeholder del mat input
   */
  protected readonly _toPlaceholder = signal('Hasta');
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _toForm = signal(new FormControl<Date | string | null>(null));
  /**
   * change
   * esta funcion emite los cambios del filtro
   */
  protected readonly _toChange = signal<((value: Date | string | null) => void) | null>(null);
  /**
   * es un signal que tendra el valor del form
   */
  protected readonly _toFormValue = toSignal(
    toObservable(this._toForm).pipe(
      distinctUntilChanged(),
      switchMap(form => form.valueChanges),
      takeUntilDestroyed()
    ),
    { initialValue: null }
  );
  /**
   * labelCancel
   */
  protected readonly _labelCancel = signal('Cancelar');
  /**
   * labelApply
   */
  protected readonly _labelApply = signal('Aplicar');
  /**
   * isTouchUi
   */
  protected readonly _isTouchUi = signal(false);
  /**
   * expectedKeys
   */
  protected readonly _default = signal<F24FilterDateRangeSourceParams['default']>('MONTHLY');
  /**
   * constructor
   */
  constructor(params?: F24FilterDateRangeSourceParams) {
    this.update(params);
    /**
     * obtener los filtros actuales del datasource
     * para obtener el filtro asociado al este forms
     */
    const dataSource = this._dataSource();
    const filtersOLd = dataSource?.filters();

    const fromName = this._fromName();
    const fromFilterOld = filtersOLd && fromName in filtersOLd ? filtersOLd[fromName] : null;
    const fromLocal = FilterStorage.get(this._id() + 'from');
    const fromForm = this._fromForm();
    fromForm.setValue(fromFilterOld ?? fromLocal, { emitEvent: !fromFilterOld });

    const toName = this._toName();
    const toFilterOld = filtersOLd && toName in filtersOLd ? filtersOLd[toName] : null;
    const toLocal = FilterStorage.get(this._id() + 'to');
    const toForm = this._toForm();
    toForm.setValue(toFilterOld ?? toLocal, { emitEvent: !toFilterOld });
    /**
     * efecto para guardar el filtro y ejecutar el cambio en el data source
     */
    effect(() => {
      const toValue = this._toFormValue();
      const fromValue = this._fromFormValue();

      untracked(() => {
        const toChange = this._toChange();
        const fromChange = this._fromChange();
        if (toChange) {
          toChange(toValue);
        }
        if (fromChange) {
          fromChange(fromValue);
        }
        /**
         * guardar el valor en local storage
         */
        FilterStorage.set(this._id() + 'to', toValue);
        FilterStorage.set(this._id() + 'from', fromValue);
        /**
         * si la variable name y datasource existen, setear el valor del filtro
         */
        const fromName = this._fromName();
        const toName = this._toName();
        const dataSource = this._dataSource();
        if (dataSource && fromName && toName) {
          dataSource.update({
            filters: { 
              [fromName]: isDate(fromValue) ? format(fromValue, 'yyyy-MM-dd') : fromValue,
              [toName]: isDate(toValue) ? format(toValue, 'yyyy-MM-dd') : toValue
            }
          });
        }
      })
    });
    /**
     * efecto para volver a crear los valores por defecto
     */
    effect(() => {
      const fromForm = this._fromForm();
      const toForm = this._toForm();
      const default2 = this._default();

      untracked(() => {
        this.cerateDefault(default2 ?? 'MONTHLY');
      });
    });

  }
  /**
   * metodo para obtener id
   */
  get id() {
    return this._id.asReadonly();  
  }
  /**
   * metodo para obtener dataSource
   */
  get dataSource() {
    return this._dataSource.asReadonly();  
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
   * metodo para obtener from
   */
  get from() {
    return {
      name: this._fromName.asReadonly(),
      default: this._fromDefault.asReadonly(),
      placeholder: this._fromPlaceholder.asReadonly(),
      form: this._fromForm.asReadonly(),
      change: this._fromChange.asReadonly()
    };  
  }
  /**
   * metodo para obtener to
   */
  get to() {
    return {
      name: this._toName.asReadonly(),
      default: this._toDefault.asReadonly(),
      placeholder: this._toPlaceholder.asReadonly(),
      form: this._toForm.asReadonly(),
      change: this._toChange.asReadonly()
    };  
  }
  /**
   * metodo para obtener labelCancel
   */
  get labelCancel() {
    return this._labelCancel.asReadonly();  
  }
  /**
   * metodo para obtener labelApply
   */
  get labelApply() {
    return this._labelApply.asReadonly();
  }
  /**
   * metodo para obtener isTouchUi
   */
  get isTouchUi() {
    return this._isTouchUi.asReadonly();  
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FilterDateRangeSourceParams, params2?: F24FilterDateRangeSourceParams) {
    untracked(() => {
      /**
       * actualizar el id
       */
      const id = params?.id ?? params2?.id;
      if (id !== undefined && this._id() !== id) {
        this._id.set(id);
      }
      /**
       * actualizar el dataSource
       */
      const dataSource = params?.dataSource ?? params2?.dataSource;
      if (dataSource !== undefined && this._dataSource() !== dataSource) {
        this._dataSource.set(dataSource);
      }
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
       * actualizar el default
       */
      const _default = params?.default ?? params2?.default;
      if (_default !== undefined && this._default() !== _default) {
        this._default.set(_default);
      }
      /**
       * actualizar el nombre
       */
      const fromName = params?.from?.name ?? params2?.from?.name;
      if (fromName !== undefined && this._fromName() !== fromName) {
        this._fromName.set(fromName);
      }
      /**
       * actualizar el default
       */
      const fromDefault = params?.from?.default ?? params2?.from?.default
      if (fromDefault !== undefined && this._fromDefault() !== fromDefault) {
        this._fromDefault.set(fromDefault);
      }
      /**
       * actualizar el placeholder
       */
      const fromPlaceholder = params?.from?.placeholder ?? params2?.from?.placeholder;
      if (fromPlaceholder !== undefined && this._fromPlaceholder() !== fromPlaceholder) {
        this._fromPlaceholder.set(fromPlaceholder);
      }
      /**
       * actualizar el form
       */
      const fromForm = params?.from?.form ?? params2?.from?.form;
      if (fromForm !== undefined && this._fromForm() !== fromForm) {
        this._fromForm.set(fromForm);
      }
      /**
       * actualizar el change
       */
      const fromChange = params?.from?.change ?? params2?.from?.change;
      if (fromChange !== undefined && this._fromChange() !== fromChange) {
        this._fromChange.set(fromChange);
      }
      /**
       * actualizar el nombre
       */
      const toName = params?.to?.name ?? params2?.to?.name;
      if (toName !== undefined && this._toName() !== toName) {
        this._toName.set(toName);
      }
      /**
       * actualizar el default
       */
      const toDefault = params?.to?.default ?? params2?.to?.default
      if (toDefault !== undefined && this._toDefault() !== toDefault) {
        this._toDefault.set(toDefault);
      }
      /**
       * actualizar el placeholder
       */
      const toPlaceholder = params?.to?.placeholder ?? params2?.to?.placeholder;
      if (toPlaceholder !== undefined && this._toPlaceholder() !== toPlaceholder) { 
        this._toPlaceholder.set(toPlaceholder);
      }
      /**
       * actualizar el form
       */
      const toForm = params?.to?.form ?? params2?.to?.form;
      if (toForm !== undefined && this._toForm() !== toForm) {
        this._toForm.set(toForm);
      }
      /**
       * actualizar el change
       */
      const toChange = params?.to?.change ?? params2?.to?.change;
      if (toChange !== undefined && this._toChange() !== toChange) {
        this._toChange.set(toChange);
      }
      /**
       * actualizar el labelCancel
       */
      const labelCancel = params?.labelCancel ?? params2?.labelCancel;
      if (labelCancel !== undefined && this._labelCancel() !== labelCancel) {
        this._labelCancel.set(labelCancel);
      }
      /**
       * actualizar el labelApply
       */
      const labelApply = params?.labelApply ?? params2?.labelApply;
      if (labelApply !== undefined && this._labelApply() !== labelApply) {
        this._labelApply.set(labelApply);
      }
      /**
       * actualizar el isTouchUi
       */
      const isTouchUi = params?.isTouchUi ?? params2?.isTouchUi;
      if (isTouchUi !== undefined && this._isTouchUi() !== isTouchUi) {
        this._isTouchUi.set(isTouchUi);
      }
    });
  }
  /**
   * cerateDefault
   * @param mode
   */
  private cerateDefault(mode: string) {

    const date = new Date();
    const from = this._fromForm();
    const to = this._toForm();
    const isSub = true;
    let fromDate = date;
    let toDate = date;


    if (['MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL'].includes(mode)) {
      const count = mode === 'BIMONTHLY' ? 1 : mode === 'QUARTERLY' ? 2 : mode === 'SEMIANNUAL' ? 6 : mode === 'ANNUAL' ? 12 : 0;

      fromDate = isSub && count > 0 ? subMonths(date, count) : fromDate;
      toDate = !isSub && count > 0 ? addMonths(date, count) : toDate;
      fromDate = startOfMonth(fromDate);
      toDate = endOfMonth(toDate);
    }

    if (['WEEKLY', 'BIWEEKLY'].includes(mode)) {
      const count = mode === 'BIWEEKLY' ? 1 : 0;

      fromDate = isSub && count > 0 ? subWeeks(date, count) : fromDate;
      toDate = !isSub && count > 0 ? addWeeks(date, count) : toDate;
      fromDate = startOfWeek(fromDate);
      toDate = endOfWeek(toDate);
    }

    from.setValue(format(fromDate, "yyyy-MM-dd"));
    to.setValue(format(toDate, "yyyy-MM-dd"));
  }
}
/**
 * createFilterDateRangeSource
 */
export const createFilterDateRangeSource = (params?: F24FilterDateRangeSourceParams) => {
  return new F24FilterDateRangeSource(params);
}
/**
 * createFilterDateRangeSourceParams
 */
export const createFilterDateRangeSourceParams = (params?: F24FilterDateRangeSourceParams) => {
  return params;
}