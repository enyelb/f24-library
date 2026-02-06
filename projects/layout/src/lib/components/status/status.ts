import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * F24Status
 */
@Component({
  selector: 'f24-status',
  templateUrl: './status.html',
  styleUrl: './status.scss',
  standalone: true,
  imports: [MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Status {

  /**
   * inputs
   */
  readonly status = input.required<string | number | boolean>();
  readonly color = input('black');
  readonly background = input('white');
  readonly tooltip = input<string | null | undefined>();

}
