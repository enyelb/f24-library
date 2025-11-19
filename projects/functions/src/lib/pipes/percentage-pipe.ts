import { Pipe, PipeTransform } from '@angular/core';

import { porcentage } from '../helpers/number';

/**
 * F24ProcentagePipe
 */
@Pipe({
  name: 'f24procentage',
  standalone: true
})
export class F24ProcentagePipe implements PipeTransform {

  /**
   * transform
   * @param value 
   * @param total 
   * @returns 
   */
  transform(value: number | string | undefined, total: number | string | undefined): number {
    return porcentage(value, total);
  }
}
