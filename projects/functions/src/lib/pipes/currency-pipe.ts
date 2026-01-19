import { Pipe, PipeTransform } from '@angular/core';
import { currency } from '../helpers';

/**
 * F24CurrencyPipe
 */
@Pipe({
  name: 'f24currency',
  standalone: true
})
export class F24CurrencyPipe implements PipeTransform {

  /**
   * transform
   * @param value 
   * @param format 
   * @returns 
   */
  transform(value: number | string | undefined): string {
    return currency(value);
  }
}
