import { ChangeDetectionStrategy, Component, computed, effect, input, ViewEncapsulation } from '@angular/core';

import { F24Splide } from '../splide/splide';
import { F24SplideItemDirective } from '../../directives/splide-item';

import { createSplideTextSource, createSplideTextSourceParams, F24SplideTextSourceParams } from './splide-text-source';

/**
 * F24SplideText
 */
@Component({
  selector: 'f24-splide-text',
  imports: [F24Splide, F24SplideItemDirective],
  templateUrl: './splide-text.html',
  styleUrl: './splide-text.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24SplideText {
  /**
   * source 
   */
  readonly params = input(createSplideTextSourceParams());
  readonly source = input(createSplideTextSource());
  /**
   * inputs
   */
  readonly id = input<F24SplideTextSourceParams['id']>();
  readonly items = input<F24SplideTextSourceParams['items']>();
  readonly options = input<F24SplideTextSourceParams['options']>();
  readonly autoScroll = input<F24SplideTextSourceParams['autoScroll']>();
  /**
   * defaults
   */
  protected readonly defaults = computed(() => ({
    type: 'loop',
    perPage: 6,
    arrows: false,
    pagination: false,
    gap: '10px',
    autoScroll: this.autoScroll() ? { speed: 0.7, pauseOnHover: true } : undefined, 
    breakpoints: {
      1400: {
        perPage: 5,
        autoScroll: this.autoScroll() ? { speed: .7 } : undefined,
      },
      1200: {
        perPage: 4,
        autoScroll: this.autoScroll() ? { speed: .6 } : undefined,
      },
      1000: {
        perPage: 3,
        autoScroll: this.autoScroll() ? { speed: .6 } : undefined,
      },
      700: {
        perPage: 2,
        autoScroll: this.autoScroll() ? { speed: .5 } : undefined,
      },
      400: {
        perPage: 1,
        autoScroll: this.autoScroll() ? { speed: .5 } : undefined,
      }
    }
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
