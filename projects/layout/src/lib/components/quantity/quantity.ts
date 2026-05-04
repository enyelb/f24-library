import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

import { F24FunctionsModule  } from '@f24/functions';

import { F24Icon } from '../icon/icon';

/**
 * Quantity
 */
@Component({
  selector: 'f24-quantity',
  templateUrl: './quantity.html',
  styleUrl: './quantity.scss',
  standalone: true,
  imports: [F24FunctionsModule, F24Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class F24Quantity {
  /**
   * label
   */
  readonly label = input<string>();
  /**
   * quantity
   */
  readonly quantity = input.required<number | string | undefined>();
  readonly icon = input<string>();
}
