
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { MatTooltipModule } from '@angular/material/tooltip';

import { F24Icon } from '../icon/icon';
import { F24Status } from '../status/status';

/**
 * F24IconOpts
 */
export interface F24IconOpts {
  name: string;
  tooltip?: string;
  hide?: boolean;
  color?: string;
}

/**
 * F24StatusOpts
 */
export interface F24StatusOpts {
  label: string;
  color?: string;
  background?: string;
  hide?: boolean;
}

/**
 * F24ItemsOpts
 */
export interface F24ItemsOpts {
  icon?: string,
  label?: string, 
  text: string | number,
  tooltip?: string;
  hide?: boolean;
  color?: 'none' | 'primary' | 'accent' | 'warn';
}

/**
 * F24Description
 */
@Component({
  selector: 'f24-description',
  templateUrl: './description.html',
  styleUrl: './description.scss',
  standalone: true,
  imports: [
    MatTooltipModule, 
    F24Icon, F24Status
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class F24Description {
  /**
   * inputs
   */
  readonly title = input.required<string>();
  readonly status = input<F24StatusOpts[]>([]);
  readonly subtitle = input<string>();
  readonly icon = input<F24IconOpts>();
  readonly items = input<F24ItemsOpts[] | F24ItemsOpts[][]>([]);
  /**
   * itemsMap
   */
  readonly itemsMap = computed(() => {
    const items = this.items();

    if (items.length === 0) {
      return [];
    }

    if (Array.isArray(items[0])) {
      return items as F24ItemsOpts[][];
    } else {
      return [items as F24ItemsOpts[]];
    }
    
  });
}
