import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

/**
 * Loader
 */
@Component({
  selector: 'f24-loader',
  styleUrls: ['loader.scss'],
  templateUrl: 'loader.html',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Loader {

  /**
   * isLoading
   */
  readonly isLoading = input(true);
}
