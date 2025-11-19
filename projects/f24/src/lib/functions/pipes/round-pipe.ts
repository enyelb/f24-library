import { Pipe, PipeTransform } from '@angular/core';
import { round } from '../helpers';

/**
 * F24RoundPipe
 */
@Pipe({
  name: 'f24round',
  standalone: true
})
export class F24RoundPipe implements PipeTransform {

  /**
   * transform
   * @param value 
   * @returns 
   */
  transform(value: number | string | undefined, r: number = 2): number {
    return round(value, r);
  }

}
