import { Component, input } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

/**
 * F24Divider
 */
@Component({
  selector: 'f24-divider',
  imports: [MatDividerModule, MatIconModule],
  templateUrl: './divider.html',
  styleUrl: './divider.scss',
})
export class F24Divider {
  /**
   * icon
   */
  readonly icon = input<string>();
  /**
   * title
   */
  readonly title = input<string>();
  /**
   * orientation
   */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
