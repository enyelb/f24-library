import { Pipe, PipeTransform } from '@angular/core';
import { toVes } from '../helpers/currency';

/**
 * F24ToBSPipe
 */
@Pipe({
  name: 'f24tobs',
  standalone: true
})
export class F24ToBSPipe implements PipeTransform {

  /**
   * transform
   * @param value 
   * @param tasa 
   * @returns 
   */
  transform(value: number | string | undefined, tasa: number | string = 100): number {
    return toVes(value, tasa);
  }

}
