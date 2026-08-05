import { ChangeDetectionStrategy, Component, effect, input, ViewEncapsulation } from '@angular/core';

import { F24DatePipe } from '@f24/functions';
import { F24Icon } from '@f24/layout';

import { createTimelineBasicSource, createTimelineBasicSourceParams, F24TimelineBasicSourceParams } from './timeline-basic-source';

@Component({
  selector: 'f24-timeline-basic',
  imports: [F24DatePipe, F24Icon],
  templateUrl: './timeline-basic.html',
  styleUrl: './timeline-basic.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class F24TimelineBasic {
  /**
   * source 
   */
  readonly params = input(createTimelineBasicSourceParams());
  readonly source = input(createTimelineBasicSource());
  /**
   * inputs
   */
  readonly items = input<F24TimelineBasicSourceParams['items']>();
  readonly color = input<F24TimelineBasicSourceParams['color']>();
  readonly lineSize = input<F24TimelineBasicSourceParams['lineSize']>();
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar params
     */
    effect(() => {
      this.source()?.update({
        items: this.items(),
        color: this.color(),
        lineSize: this.lineSize(),
      }, this.params());
    });
  }
}
