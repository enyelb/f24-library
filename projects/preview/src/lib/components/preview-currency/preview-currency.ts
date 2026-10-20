import { Component, computed, input } from '@angular/core';

import { F24Copy } from "@f24/layout";
import { F24Currency } from '@f24/layout';

/**
 * F24PreviewCurrency
 */
@Component({
  selector: 'f24-preview-currency',
  imports: [F24Copy, F24Currency],
  templateUrl: './preview-currency.html',
  styleUrl: './preview-currency.scss',
  standalone: true
})
export class F24PreviewCurrency {
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
  /**
   * copy
   */
  readonly copy = input<boolean | string>();
  /**
   * orientation
   */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  /**
   * copyCurrency
   */
  protected readonly copyCurrency = computed(() => {
    const value = `${this.usd() ?? this.ves() ?? ''}`;
    const copy = this.copy();
    if (!value || !copy) {
      return undefined;
    }
    return typeof copy === 'string' ? copy : value
  });
}
