
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatTooltipModule } from '@angular/material/tooltip';

import { F24Icon } from '../icon/icon';

/**
 * F24IconOpts
 */
export interface F24IconOpts {
  name: string;
  tooltip?: string;
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
  imports: [MatTooltipModule, F24Icon],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Description {

  /**
   * inputs
   */
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly icon = input<F24IconOpts>();
  readonly items = input<F24ItemsOpts[]>([]);
}
