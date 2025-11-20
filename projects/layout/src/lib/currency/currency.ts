import { Component, Input } from '@angular/core';

import { FunctionsModule  } from '@f24/functions';

/**
 * Currency
 */
@Component({
  selector: 'app-currency',
  templateUrl: './currency.html',
  styleUrl: './currency.scss',
  standalone: true,
  imports: [FunctionsModule],
})
export class Currency {

  /**
   * bs
   */
  @Input() bs!: number;

  /**
   * usd
   */
  @Input() usd!: number;
}
