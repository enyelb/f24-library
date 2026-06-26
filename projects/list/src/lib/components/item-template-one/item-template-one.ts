import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { F24Image, F24Description, F24Currency, F24Icon, F24ItemsOpts, F24IconOpts } from '@f24/layout';

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
 * F24ItemTemplateOne
 */
@Component({
  selector: 'f24-item-template-one',
  imports: [
    NgTemplateOutlet,
    F24Image, F24Description, F24Currency, F24Icon,
    
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
   * price
   */
  readonly ves = input<number>();
  readonly usd = input<number>();
  /**
   * quantity
   */
  readonly quantityLabel = input<string>();
  readonly quantityIcon = input<string>();
  readonly quantity = input<number | string>();
  /**
   * templates
   */
  readonly templatePostImage = input<TemplateRef<any>>();
  readonly templatePostDecription = input<TemplateRef<any>>();

}
