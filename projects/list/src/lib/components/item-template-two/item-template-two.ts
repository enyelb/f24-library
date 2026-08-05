import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { F24Description, F24Currency, F24StatusOpts, F24Quantity, F24ItemsOpts } from '@f24/layout';

/**
 * F24ItemTemplateTwo
 */
@Component({
  selector: 'f24-item-template-two',
  imports: [
    NgTemplateOutlet,
    F24Description, F24Currency, F24Quantity,
  ],
  templateUrl: './item-template-two.html',
  styleUrl: './item-template-two.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24ItemTemplateTwo {
  /**
   * title
   */
  readonly title = input.required<string>();
  /**
   * status
   */
  readonly status = input<F24StatusOpts[]>([]);
  /**
   * items
   */
  readonly items = input<F24ItemsOpts[]>([]);
  /**
   * subtitle
   */
  readonly subtitle = input<string>();
  /**
   * amounts
   */
  readonly amounts = input<{ label?: string, ves?: number, usd?: number }[]>([]);
  /**
   * quantities
   */
  readonly quantities = input<{ label?: string, icon?: string, quantity: string | number}[]>([]);
  /**
   * templates
   */
  readonly templatePostDecription = input<TemplateRef<any>>();
}
