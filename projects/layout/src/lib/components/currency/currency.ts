import { Component, Input } from '@angular/core';

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
   * bs
   */
  @Input() bs!: number;

  /**
   * usd
   */
  @Input() usd!: number;
}
