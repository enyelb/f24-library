import { ChangeDetectionStrategy, Component, effect, input, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { F24DatePipe } from '@f24/functions';
import { F24Icon } from '@f24/layout';

import { createTimelineSource, createTimelineSourceParams, F24TimelineSourceParams } from './timeline-source';

/**
 * F24Timeline
 */
@Component({
  selector: 'f24-timeline',
  imports: [NgTemplateOutlet, F24DatePipe, F24Icon],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class F24Timeline {
  /**
   * source 
   */
  readonly params = input(createTimelineSourceParams());
  readonly source = input(createTimelineSource());
  /**
   * inputs
   */
  readonly items = input<F24TimelineSourceParams['items']>();
  readonly direction = input<F24TimelineSourceParams['direction']>();
  readonly color = input<F24TimelineSourceParams['color']>();
  readonly format = input<F24TimelineSourceParams['format']>();
  readonly lineSize = input<F24TimelineSourceParams['lineSize']>();
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
        direction: this.direction(),
        color: this.color(),
        format: this.format(),
        lineSize: this.lineSize(),
      }, this.params());
    });
  }
}
