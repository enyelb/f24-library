import { Pipe, PipeTransform } from '@angular/core';

import { abs } from '../helpers';

/**
 * F24AbsPipe
 */
@Pipe({
  name: 'f24abs',
  standalone: true
})
export class F24AbsPipe implements PipeTransform {

  /**
   * transform
   * @param value 
   * @returns 
   */
  transform(value: string | number | undefined): number {
    return abs(value);
  }

}
