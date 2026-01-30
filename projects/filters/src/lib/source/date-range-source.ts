import { signal } from "@angular/core";

import { format, endOfWeek, startOfWeek, subMonths, startOfMonth, endOfMonth, add, addMonths, subWeeks, addWeeks} from "date-fns";

import { F24FilterSourceForms, F24FilterSourceFormsParams } from "./forms-source";

/**
 * F24FilterSourceDateRangeParams
 */
export type F24FilterSourceDateRangeParams = F24FilterSourceFormsParams<string, 'start' | 'end'> & {
  labelCancel?: string
  labelApply?: string
  isTouchUi?: boolean
  default?: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL'
};

/**
 * F24FilterSourceDateRange
 */
export class F24FilterSourceDateRange extends F24FilterSourceForms<string, 'start' | 'end'> {
  /**
   * labelCancel
   */
  protected readonly _labelCancel;
  /**
   * labelApply
   */
  protected readonly _labelApply;
  /**
   * isTouchUi
   */
  protected readonly _isTouchUi;
  /**
   * expectedKeys
   */
  protected readonly _default;
  /**
   * constructor
   */
  constructor(params?: F24FilterSourceDateRangeParams) {
    super(['start', 'end'], params);
    this._labelCancel = signal(params?.labelCancel ?? 'Cancelar');
    this._labelApply = signal(params?.labelApply ?? 'Aplicar');
    this._isTouchUi = signal(params?.isTouchUi ?? false);
    this._default = signal(params?.default ?? 'MONTHLY');
    this.cerateDefault(params?.default ?? 'MONTHLY');
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
   * @param params
   */
  public override update(params?: F24FilterSourceDateRangeParams) {
    super.update(params);
    /**
     * validar si existe labelCancel
     */
    if (params?.labelCancel) {
      this._labelCancel.set(params.labelCancel);
    }
    /**
     * validar si existe labelApply
     */
    if (params?.labelApply) {
      this._labelApply.set(params.labelApply);
    }
    /**
     * validar si existe isTouchUi
     */
    if (params?.isTouchUi) {
      this._isTouchUi.set(params.isTouchUi);
    }
    /**
     * validar si existe default
     */
    if (params?.default || this._default()){
      this.cerateDefault(params?.default ?? this._default());
    }
  }
  /**
   * cerateDefault
   * @param mode
   */
  private cerateDefault(mode: string) {
    const date = new Date();
    const start = this.forms().start.form;
    const end = this.forms().end.form;
    const isSub = true;
    let startDate = date;
    let endDate = date;


    if (['MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL'].includes(mode)) {
      const count = mode === 'BIMONTHLY' ? 1 : mode === 'QUARTERLY' ? 2 : mode === 'SEMIANNUAL' ? 6 : mode === 'ANNUAL' ? 12 : 0;

      startDate = isSub && count > 0 ? subMonths(date, count) : startDate;
      endDate = !isSub && count > 0 ? addMonths(date, count) : endDate;
      startDate = startOfMonth(startDate);
      endDate = endOfMonth(endDate);
    }

    if (['WEEKLY', 'BIWEEKLY'].includes(mode)) {
      const count = mode === 'BIWEEKLY' ? 1 : 0;

      startDate = isSub && count > 0 ? subWeeks(date, count) : startDate;
      endDate = !isSub && count > 0 ? addWeeks(date, count) : endDate;
      startDate = startOfWeek(startDate);
      endDate = endOfWeek(endDate);
    }

    start.setValue(format(startDate, "yyyy-MM-dd"));
    end.setValue(format(endDate, "yyyy-MM-dd"));
  }
}

/**
 * createFilterSourceDateRange
 */
export const createFilterSourceDateRange = (params?: F24FilterSourceDateRangeParams) => {
  return new F24FilterSourceDateRange(params);
}

/**
 * createFilterSourceDateRangeParams
 */
export const createFilterSourceDateRangeParams = (params?: F24FilterSourceDateRangeParams) => {
  return params;
}