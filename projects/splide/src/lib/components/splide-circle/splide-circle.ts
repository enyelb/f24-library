import { ChangeDetectionStrategy, Component, computed, effect, input, ViewEncapsulation } from '@angular/core';

import { F24Splide } from '../splide/splide';
import { F24SplideItemDirective } from '../../directives/splide-item';

import { createSplideCircleSource, createSplideCircleSourceParams, F24SplideCircleSourceParams } from './splide-circle-source';

/**
 * F24SplideCircle
 */
@Component({
  selector: 'f24-splide-circle',
  imports: [F24Splide, F24SplideItemDirective],
  templateUrl: './splide-circle.html',
  styleUrl: './splide-circle.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24SplideCircle {
  /**
   * source 
   */
  readonly params = input(createSplideCircleSourceParams());
  readonly source = input(createSplideCircleSource());
  /**
   * inputs
   */
  readonly id = input<F24SplideCircleSourceParams['id']>();
  readonly items = input<F24SplideCircleSourceParams['items']>();
  readonly options = input<F24SplideCircleSourceParams['options']>();
  readonly autoScroll = input<F24SplideCircleSourceParams['autoScroll']>();
  /**
   * defaults
   */
  protected readonly defaults = computed(() => ({
    type: 'loop',
    perPage: 10,
    arrows: false,
    pagination: false,
    gap: '10px',
    autoScroll: this.autoScroll() ? {
      speed: 1,
      pauseOnHover: true,
    } : undefined, 
  }));

  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar params
     */
    effect(() => {
      this.source()?.update({
        id: this.id(),
        items: this.items(),
        options: this.options(),
        defaults: this.defaults(),
        autoScroll: this.autoScroll()
      }, this.params());
    });
  }
}
