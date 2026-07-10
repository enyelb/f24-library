import { Pipe, PipeTransform } from '@angular/core';

import { differenceInDays, format as dateFormat, parseISO } from "date-fns";
import { es } from 'date-fns/locale'


/**
 * F24DatePipe
 */
@Pipe({
  name: 'f24date',
  standalone: true
})
export class F24DatePipe implements PipeTransform {

  /**
   * transform
   * @param value 
   * @param format 
   * @returns 
   */
  transform(value: string | Date | undefined, format: string = 'dd/MM/yyyy'): string {
    if (value) {
      if (value instanceof Date) {
        return dateFormat(value, format, { locale: es });
      } else if (!['N/A', '0', 0, null, 'null'].includes(value)) {
        return dateFormat(parseISO(value.replaceAll('/', '-')), format, { locale: es });
      } else {
        return 'N/A';
      }
    }
    return 'N/A';
  }

}

/**
 * F24DateDifPipe
 */
@Pipe({
  name: 'f24datedif',
  standalone: true
})
export class F24DateDifPipe implements PipeTransform {

  /**
   * transform
   * @param value 
   * @param value2 
   * @returns 
   */
  transform(value: string | undefined, value2: Date | string | undefined = new Date()): number {
    if (value) {
      if (!['N/A'].includes(value)) {
        return differenceInDays(new Date(value2), new Date(value));
      } else {
        return 0;
      }
    }
    return 0;
  }
}
