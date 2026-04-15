import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { F24Image, F24Description, F24Currency, F24Icon, F24ItemsOpts } from '@f24/layout';

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
   * items
   */
  readonly items = input<{ icon?: string, label?: string, text: string | number }[]>([]);
  protected readonly itemsMap = computed<F24ItemsOpts[]>(() => {
    return this.items().map((item) => {
      return {
        icon: item.icon,
        label: item.label,
        text: typeof item.text === 'number' ? `${item.text}%` : item.text,
        hide: typeof item.text === 'number' ? item.text === 0 : item.text === '' || item.text === null || item.text === undefined,
        color: 'primary'
      }
    })
  })
  /**
   * price
   */
  readonly ves = input<number>();
  readonly usd = input<number>();
  /**
   * quantity
   */
  readonly quantityIcon = input<string>('inventory');
  readonly quantity = input<number | string>();
  /**
   * templates
   */
  readonly templatePostImage = input<TemplateRef<any>>();
  readonly templatePostDecription = input<TemplateRef<any>>();

}
