
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek, subMonths, subWeeks } from "date-fns";

/**
 * transformDate
 * @param value valor a transformar
 * @param type tipo de transdormacion
 * @returns Date
 */
export function transformDate(value: Date | string, type: 'STRAT' | 'END' = 'STRAT'): Date {
  /**
   * si es una fecha retornar el valor sin cambiarlo
   */
  if (value instanceof Date) {
    return value;
  }
  /**
   * si el valor es TODAY retornar la fecha actual
   */
  if (['TODAY'].includes(value)) {
    return new Date();
  } 
  /**
   * retornar valores mensuales
   */
  if (['MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL'].includes(value)) {
    const count = value === 'BIMONTHLY' ? 1 : value === 'QUARTERLY' ? 2 : value === 'SEMIANNUAL' ? 6 : value === 'ANNUAL' ? 12 : 0;
    const date = subMonths(new Date(), count);
    return type === 'STRAT' ? startOfMonth(date) : endOfMonth(date);
  }  
  /**
   * retornar valores semanales
   */
  if (['WEEKLY', 'BIWEEKLY'].includes(value)) {
    const count = value === 'BIWEEKLY' ? 1 : 0;
    const date = subWeeks(new Date(), count);
    return type === 'STRAT' ? startOfWeek(date) : endOfWeek(date);
  } 
  /**
   * retornar fecha si es un string
   */
  return new Date(value);
}
/**
 * transformDateStart
 * @param value valor a transformar
 * @returns Date
 */
export function transformDateStart(value: Date | string): Date {
  return transformDate(value, 'STRAT');
}
/**
 * transformDateEnd
 * @param value valor a transformar
 * @returns Date
 */
export function transformDateEnd(value: Date | string): Date {
  return transformDate(value, 'END');
}