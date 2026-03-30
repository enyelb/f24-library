import { effect, untracked } from "@angular/core";
import { FormControl } from "@angular/forms";

import { takeUntilDestroyed, toObservable, toSignal } from "@angular/core/rxjs-interop";
import { distinctUntilChanged, switchMap } from "rxjs";

import { F24DataSource } from '@f24/data';
import { signalSource, transformDateEnd, transformDateStart } from "@f24/core";
import { FilterStorage } from "../../filter-storage";

/**
 * F24FilterDateRangeFormSourceParams
 */
export interface F24FilterDateRangeFormSourceParams {
  name?: string;
  default?: Date | string;
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
  protected readonly _id = signalSource('');
  readonly id = this._id.asReadonly();
  /**
   * dataSource variable para pasar el filtro 
   * al datasource cuando cambie este input 
   */
  protected readonly _dataSource = signalSource<F24DataSource<any> | undefined>(undefined);
  readonly dataSource = this._dataSource.asReadonly();
  /**
   * label
   * este es el label del mat input
   */
  protected readonly _label = signalSource('Rango de fecha');
  readonly label = this._label.asReadonly();
  /**
   * appearance
   * esta es la apariencia del mat input
   */
  protected readonly _appearance = signalSource<'fill' | 'outline'>('outline');
  readonly appearance = this._appearance.asReadonly();
  /**
   * name 
   * este nombre se usa para identificar el valor cuando se envia al data source 
   */
  protected readonly _fromName = signalSource('from');
  readonly fromName = this._fromName.asReadonly();
  /**
   * dafault
   * este es el valor por defecto que se usa
   */
  protected readonly _fromDefault = signalSource<Date | string | null>(null);
  readonly fromDefault = this._fromDefault.asReadonly();
  /**
   * placeholder
   * este es el placeholder del mat input
   */
  protected readonly _fromPlaceholder = signalSource('Desde');
  readonly fromPlaceholder = this._fromPlaceholder.asReadonly();
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _fromForm = signalSource(new FormControl<Date | string | null>(null));
  readonly fromForm = this._fromForm.asReadonly();
  /**
   * change
   * esta funcion emite los cambios del filtro
   */
  protected readonly _fromChange = signalSource<((value: Date | string | null) => void) | null>(null);
  readonly fromChange = this._fromChange.asReadonly();
  /**
   * es un signalSource que tendra el valor del form
   */
  readonly fromFormValue = toSignal(
    toObservable(this._fromForm.value).pipe(
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
  protected readonly _toName = signalSource('to');
  readonly toName = this._toName.asReadonly();
  /**
   * dafault
   * este es el valor por defecto que se usa
   */
  protected readonly _toDefault = signalSource<Date | string | null>(null);
  readonly toDefault = this._toDefault.asReadonly();
  /**
   * placeholder
   * este es el placeholder del mat input
   */
  protected readonly _toPlaceholder = signalSource('Hasta');
  readonly toPlaceholder = this._toPlaceholder.asReadonly();
  /**
   * form
   * este es el form del mat input
   */
  protected readonly _toForm = signalSource(new FormControl<Date | string | null>(null));
  readonly toForm = this._toForm.asReadonly();
  /**
   * change
   * esta funcion emite los cambios del filtro
   */
  protected readonly _toChange = signalSource<((value: Date | string | null) => void) | null>(null);
  readonly toChange = this._toChange.asReadonly();
  /**
   * es un signalSource que tendra el valor del form
   */
  readonly toFormValue = toSignal(
    toObservable(this._toForm.value).pipe(
      distinctUntilChanged(),
      switchMap(form => form.valueChanges),
      takeUntilDestroyed()
    ),
    { initialValue: null }
  );
  /**
   * labelCancel
   */
  protected readonly _labelCancel = signalSource('Cancelar');
  readonly labelCancel = this._labelCancel.asReadonly();
  /**
   * labelApply
   */
  protected readonly _labelApply = signalSource('Aplicar');
  readonly labelApply = this._labelApply.asReadonly();
  /**
   * isTouchUi
   */
  protected readonly _isTouchUi = signalSource(false);
  readonly isTouchUi = this._isTouchUi.asReadonly();
  /**
   * expectedKeys
   */
  protected readonly _default = signalSource<F24FilterDateRangeSourceParams['default']>('MONTHLY');
  readonly default = this._default.asReadonly();
  /**
   * constructor
   */
  constructor(params?: F24FilterDateRangeSourceParams) {
    this.update(params);
    /**
     * obtener los filtros actuales del datasource
     * para obtener el filtro asociado al este forms
     */
    const dataSource = this.dataSource();
    const filtersOLd = dataSource?.filters();

    const fromName = this.fromName();
    const fromFilterOld = filtersOLd && fromName in filtersOLd ? filtersOLd[fromName] : null;
    const fromLocal = FilterStorage.get(this.id() + 'from');
    const fromForm = this.fromForm();
    fromForm.setValue(fromFilterOld ?? fromLocal, { emitEvent: !fromFilterOld });

    const toName = this.toName();
    const toFilterOld = filtersOLd && toName in filtersOLd ? filtersOLd[toName] : null;
    const toLocal = FilterStorage.get(this.id() + 'to');
    const toForm = this.toForm();
    toForm.setValue(toFilterOld ?? toLocal, { emitEvent: !toFilterOld });
    /**
     * efecto para guardar el filtro y ejecutar el cambio en el data source
     */
    effect(() => {
      const toValue = this.toFormValue();
      const fromValue = this.fromFormValue();

      untracked(() => {
        const toChange = this.toChange();
        const fromChange = this.fromChange();
        if (toChange) {
          toChange(toValue);
        }
        if (fromChange) {
          fromChange(fromValue);
        }
        /**
         * guardar el valor en local storage
         */
        FilterStorage.set(this.id() + 'to', toValue);
        FilterStorage.set(this.id() + 'from', fromValue);
        /**
         * si la variable name y datasource existen, setear el valor del filtro
         */
        const fromName = this.fromName();
        const toName = this.toName();
        const dataSource = this.dataSource();
        if (dataSource && fromName && toName) {
          dataSource.update({
            filters: { 
              [fromName]: fromValue,
              [toName]: toValue
            }
          });
        }
      })
    });
    /**
     * efecto para volver a crear los valores por defecto
     */
    effect(() => {
      const fromForm = this.fromForm();
      const toForm = this.toForm();
      const default2 = this.default();

      untracked(() => {
        fromForm.setValue(transformDateStart(default2 ?? 'MONTHLY'), { emitEvent: false });
        toForm.setValue(transformDateEnd(default2 ?? 'MONTHLY'), { emitEvent: false });
      });
    });
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24FilterDateRangeSourceParams, params2?: F24FilterDateRangeSourceParams) {
    untracked(() => {
      this._id.setExectUndefined(params?.id ?? params2?.id);
      this._dataSource.setExectUndefined(params?.dataSource ?? params2?.dataSource);
      this._label.setExectUndefined(params?.label ?? params2?.label);
      this._appearance.setExectUndefined(params?.appearance ?? params2?.appearance);
      this._fromName.setExectUndefined(params?.from?.name ?? params2?.from?.name);
      this._fromDefault.setExectUndefined(params?.from?.default ?? params2?.from?.default, transformDateStart);
      this._fromPlaceholder.setExectUndefined(params?.from?.placeholder ?? params2?.from?.placeholder);
      this._fromForm.setExectUndefined(params?.from?.form ?? params2?.from?.form);
      this._fromChange.setExectUndefined(params?.from?.change ?? params2?.from?.change);
      this._toName.setExectUndefined(params?.to?.name ?? params2?.to?.name);
      this._toDefault.setExectUndefined(params?.to?.default ?? params2?.to?.default, transformDateEnd);
      this._toPlaceholder.setExectUndefined(params?.to?.placeholder ?? params2?.to?.placeholder);
      this._toForm.setExectUndefined(params?.to?.form ?? params2?.to?.form);
      this._toChange.setExectUndefined(params?.to?.change ?? params2?.to?.change);
      this._labelCancel.setExectUndefined(params?.labelCancel ?? params2?.labelCancel);
      this._labelApply.setExectUndefined(params?.labelApply ?? params2?.labelApply);
      this._isTouchUi.setExectUndefined(params?.isTouchUi ?? params2?.isTouchUi);
      this._default.setExectUndefined(params?.default ?? params2?.default);
    });
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