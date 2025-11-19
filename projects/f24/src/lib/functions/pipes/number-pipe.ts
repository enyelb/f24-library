import { Pipe, PipeTransform } from '@angular/core';
import { toNumber } from '../helpers';

/**
 * F24ToNumberPipe
 */
@Pipe({
  name: 'f24tonumber',
  standalone: true
})
export class F24ToNumberPipe implements PipeTransform {

  /**
   * transform
   * @param value 
   * @returns 
   */
  transform(value: number | string | undefined): number {
    return toNumber(value);
  }

}
