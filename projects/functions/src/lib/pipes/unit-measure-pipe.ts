import { Pipe, PipeTransform } from '@angular/core';

import { unitMeasure } from '../helpers';

/**
 * F24UnitMeasurePipe
 */
@Pipe({
  name: 'f24UnitMeasure',
  standalone: true
})
export class F24UnitMeasurePipe implements PipeTransform {

  /**
   * transform
   * @param value 
   * @param tasa 
   * @returns 
   */
  transform(value: number | string | undefined,  unit: 'GR' | 'UND' | 'ML'): string {
    return unitMeasure(value, unit);
  }

}