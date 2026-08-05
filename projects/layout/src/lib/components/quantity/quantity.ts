import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

import { MatTooltip } from "@angular/material/tooltip";

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
  imports: [
    MatTooltip,
    F24FunctionsModule, F24Icon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class F24Quantity {
  /**
   * inputs
   */
  readonly label = input<string>();
  readonly quantity = input.required<number | string | undefined>();
  readonly icon = input<string>();
  readonly class = input<string>();
  readonly tooltip = input<string>();
}
