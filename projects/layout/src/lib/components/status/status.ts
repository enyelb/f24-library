import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';

/**
 * F24Status
 */
@Component({
  selector: 'f24-status',
  templateUrl: './status.html',
  styleUrl: './status.scss',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatTooltipModule, MtxPopoverModule
  ],
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
  readonly template = input<TemplateRef<any>>();

}
