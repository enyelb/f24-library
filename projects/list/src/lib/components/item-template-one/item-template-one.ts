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
  hide?: boolean,
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
   * inputs
   */
  readonly image = input<string>();
  readonly title = input.required<string>();
  readonly link = input<string>();
  readonly subtitle = input<string>();
  readonly icon = input<F24IconOpts>(); 
  readonly items = input<F24ItemsOptsTemplateOne[] | F24ItemsOptsTemplateOne[][]>([]);
  readonly amounts = input<F24AmountOptsTemplateOne[]>([]);
  readonly amount = input<F24AmountOptsTemplateOne>();
  readonly quantities = input<F24QuantityOptsTemplateOne[]>([]);
  readonly quantity = input<F24QuantityOptsTemplateOne | number | string>();
  readonly templatePreQuantity = input<TemplateRef<any>>();
  readonly templatePostDecription = input<TemplateRef<any>>();

  /**
   * signals
   */
  protected readonly itemsMap = computed<F24ItemsOpts[] | F24ItemsOpts[][]>(() => {

    const fn = (item: F24ItemsOptsTemplateOne): F24ItemsOpts => {
      return {
        ... item, 
        text: typeof item.text === 'number' ? `${item.text}%` : item.text,
        hide: typeof item.text === 'number' ? item.text === 0 : item.text === '' || item.text === null || item.text === undefined,
      }
    }

    return this.items()
      .filter(item => Array.isArray(item) ? item.some(subItem => !subItem.hide) : !item.hide)
      .map((item) => Array.isArray(item) ? item.filter(subItem => !subItem.hide).map(fn) : fn(item)) as F24ItemsOpts[] | F24ItemsOpts[][];
  });

  protected readonly amountArray = computed(() => {
    const amount = this.amount();
    const amounts = this.amounts();

    const values = [...amounts];

    if (amount) {
      values.push(amount);
    }
    return values;
  });

  protected readonly quantityArray = computed(() => {
    const quantity = this.quantity();
    const quantities = this.quantities();

    const values = [...quantities];

    if (quantity) {
      if (typeof quantity === 'string' || typeof quantity === 'number') {
        values.push({ quantity });
      } else {
        values.push(quantity);
      }
    }

    return values;
  }) 

}
