
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  icon: string,
  text: string
}

/**
 * F24Description
 */
@Component({
  selector: 'f24-description',
  templateUrl: './description.html',
  styleUrl: './description.scss',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Description {

  /**
   * inputs
   */
  readonly description = input.required<string>();
  readonly icon = input<F24IconOpts>();
  readonly items = input<F24ItemsOpts[]>([]);
}
