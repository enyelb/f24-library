import { Pipe, PipeTransform } from '@angular/core';
import { toUsd } from '../helpers/currency';

//import { PrecioService } from '@services/precio.service';

/**
 * F24ToUSDPipe
 */
@Pipe({
  name: 'f24tousd',
  standalone: true
})
export class F24ToUSDPipe implements PipeTransform {

  /**
   * transform
   * @param value 
   * @param tasa 
   * @returns 
   */
  transform(value: number | string | undefined, tasa: number | string = 100): number {
    return toUsd(value, tasa);
  }
}
