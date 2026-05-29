import { format as dateFormat, endOfMonth, startOfMonth, differenceInDays, differenceInMonths, addDays, isValid, parseISO, formatDistanceToNow } from "date-fns";
import { es } from 'date-fns/locale';

/**
 * Options
 */
interface Options {
  locale?: any
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  firstWeekContainsDate?: 1 | 4
  useAdditionalWeekYearTokens?: boolean
  useAdditionalDayOfYearTokens?: boolean
}

function transform(
  value: string | Date | undefined, 
  options: Options | undefined, 
  fn: (value: string | Date, options: Options) => string
): string {
  options = options ? options : {};
  options.locale = options.locale ? options.locale: es;
  if (value instanceof Date) {
    return fn(value, options);
  }
  if (value && !['N/A', '0', 0, 'null'].includes(value)) {
    return fn(parseISO(value.replaceAll('/', '-')), options);
  }
  return 'N/A';
}
/**
 * date
 * @param value 
 * @param format 
 * @param options 
 * @returns 
 */
export function date(value: string | Date | undefined, format: string = 'dd/MM/yyyy', options?: Options) : string {
  return transform(value, options, (value, options) => {
    return dateFormat(value, format, options);
  });
}

/**
 * month
 * @param value 
 * @param format 
 * @param type 
 * @param options 
 * @returns 
 */
function month(value: string, format: string = 'yyyy-MM', type: 'end' | 'start', options?: Options) : string {
  if (!value || value == '') {
    return value
  }
  options = options ? options : {};
  options.locale = options.locale ? options.locale: es;
  if (type === 'end') {
    return dateFormat(endOfMonth(parseISO(value)), format, options);
  } else {
    return dateFormat(startOfMonth(parseISO(value)), format, options);
  }
}

/**
 * monthStart
 * @param value 
 * @param format 
 * @param options 
 * @returns 
 */
export function monthStart(value: string, format: string = 'yyyy-MM', options?: Options) : string {
  return month(value, format, 'start', options)
}

/**
 * monthEnd
 * @param value 
 * @param format 
 * @param options 
 * @returns 
 */
export function monthEnd(value: string, format: string = 'yyyy-MM', options?: Options) : string {
  return month(value, format, 'end', options)
}

/**
 * diffDays
 * @param value1 
 * @param value2 
 * @returns 
 */
export function diffDays(value1: string | Date, value2: string | Date) : number {
  return differenceInDays(new Date(value1), new Date(value2))
}

/**
 * diffMonths
 * @param value1 
 * @param value2 
 * @returns 
 */
export function diffMonths(value1: string | Date, value2: string | Date) : number {
  return differenceInMonths(new Date(value1), new Date(value2))
}

/**
 * addDay
 * @param value 
 * @param amount 
 * @returns 
 */
export function addDay(value: string | Date, amount: number) : Date {
  return addDays(new Date(value), amount)
}

/**
 * dateIsValid
 * @param value1 
 * @returns 
 */
export function dateIsValid(value1: string | Date) : boolean {
  return isValid(new Date(value1))
}

/**
 * timeAgo
 * @param value
 */
export function timeAgo(value: string | Date | undefined): string {
  if (value) {
      return formatDistanceToNow(new Date(value), {
        addSuffix: false,
        locale: es
      })
      .replaceAll("menos de un ", "")
      .replaceAll("alrededor de ", "")
      .replaceAll("minutos", "min")
      .replaceAll("minuto", "min")
      //.replaceAll("horas", "hrs")
      //.replaceAll("hora", "hr")
      .replaceAll("segundos", "seg")
      .replaceAll("segundo", "seg");
    }
    return '';
}
