import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { F24Image, F24Description, F24Currency, F24ItemsOpts, F24IconOpts, F24Quantity } from '@f24/layout';

/**
 * F24ItemsOptsTemplateOne
 */
interface F24ItemsOptsTemplateOne { 
  icon?: string, 
  label?: string, 
  text: string | number, 
  color?: 'primary' | 'accent' | 'warn'
}

/**
 * F24QuantityOptsTemplateOne
 */
interface F24QuantityOptsTemplateOne { 
  label?: string, 
  icon?: string, 
  quantity: string | number,
  tooltip?: string,
  class?: string,
}

/**
 * F24AmountOptsTemplateOne
 */
interface F24AmountOptsTemplateOne { 
  label?: string, 
  ves?: number, 
  usd?: number,
}

/**
 * F24ItemTemplateOne
 */
@Component({
  selector: 'f24-item-template-one',
  imports: [
    NgTemplateOutlet,
    F24Image, F24Description, F24Currency, F24Quantity,  
  ],
  templateUrl: './item-template-one.html',
  styleUrl: './item-template-one.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24ItemTemplateOne {
  /**
   * image
   */
  readonly image = input<string>();
  /**
   * title
   */
  readonly title = input.required<string>();
  /**
   * subtitle
   */
  readonly subtitle = input<string>();
  /**
   * icon
   */
  readonly icon = input<F24IconOpts>(); 
  /**
   * items
   */
  readonly items = input<F24ItemsOptsTemplateOne[] | F24ItemsOptsTemplateOne[][]>([]);
  protected readonly itemsMap = computed<F24ItemsOpts[] | F24ItemsOpts[][]>(() => {

    const fn = (item: F24ItemsOptsTemplateOne): F24ItemsOpts => {
      return {
        ... item, 
        text: typeof item.text === 'number' ? `${item.text}%` : item.text,
        hide: typeof item.text === 'number' ? item.text === 0 : item.text === '' || item.text === null || item.text === undefined,
      }
    }

    return this.items().map((item) => Array.isArray(item) ? item.map(fn) : fn(item)) as F24ItemsOpts[] | F24ItemsOpts[][];
  })
  /**
   * amounts
   */
  readonly amounts = input<F24AmountOptsTemplateOne[]>([]);
  readonly amount = input<F24AmountOptsTemplateOne>();
  /**
   * quantities
   */
  readonly quantities = input<F24QuantityOptsTemplateOne[]>([]);
  readonly quantity = input<F24QuantityOptsTemplateOne | number | string>();
  protected readonly quantityArray = computed(() => {
    const quantity = this.quantity();
    const quantities = this.quantities();
    return [...quantities,typeof quantity === 'string' || typeof quantity === 'number' ? { quantity } : quantity]
  }) 
  /**
   * templates
   */
  readonly templatePreQuantity = input<TemplateRef<any>>();
  readonly templatePostDecription = input<TemplateRef<any>>();

}
