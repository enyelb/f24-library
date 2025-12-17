import { Component, input } from '@angular/core';

import { F24FunctionsModule  } from '@f24/functions';

/**
 * Currency
 */
@Component({
  selector: 'f24-currency',
  templateUrl: './currency.html',
  styleUrl: './currency.scss',
  standalone: true,
  imports: [F24FunctionsModule],
})
export class F24Currency {
  /**
   * label
   */
  readonly label = input<string>();
  /**
   * ves
   */
  readonly ves = input.required<number | undefined>();
  /**
   * usd
   */
  readonly usd = input.required<number | undefined>();
}
