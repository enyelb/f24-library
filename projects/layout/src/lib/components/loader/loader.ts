import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

import { F24Icon } from '../icon/icon';

/**
 * F24Loader
 */
@Component({
  selector: 'f24-loader',
  styleUrls: ['loader.scss'],
  templateUrl: 'loader.html',
  standalone: true,
  imports: [F24Icon],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Loader {
  /**
   * inputs
   */
  readonly isLoading = input(true);
  readonly icon = input('patricio');
}
