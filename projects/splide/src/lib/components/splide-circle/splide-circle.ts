import { Component, computed, effect, ElementRef, inject, input, viewChild } from '@angular/core';

import { F24Splide } from '../../services/splide';
import { F24SplideOptions } from '../../models/splide';

/**
 * F24SplideCircle
 */
@Component({
  selector: 'f24-splide-circle',
  imports: [],
  templateUrl: './splide-circle.html',
  styleUrl: './splide-circle.scss',
})
export class F24SplideCircle {
  /**
   * service
   */
  readonly service = inject(F24Splide);
  /**
   * id
   */
  readonly id = input.required<string>();
  /**
   * items
   */
  readonly items = input<{
    id: string | number;
    image: string;
    name?: string;
  }[]>([]);
  /**
   * options
   */
  readonly options = input<F24SplideOptions>();
  /**
   * autoScroll
   */
  readonly autoScroll = input<boolean>(true);
  /**
   * root
   */
  readonly root = viewChild('splideRoot', { read: ElementRef<HTMLElement> });
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
   * splide
   */
  private splide: any;
  /**
   * 
   */
  constructor() {
    // Watch for changes to items, options, or config and reinitialize
    effect(() => {
      // Access signals to create dependency
      const items = this.items();
      const options = this.options();
      const root = this.root();
      const defaults = this.defaults();
      const autoScroll = this.autoScroll();

      if (!root) {
        return;
      }

      queueMicrotask(() => {
        // Destroy previous instance
        if (this.splide) {
          this.splide.destroy();
        }
        // Initialize new instance
        this.splide = this.service.inizialized(root.nativeElement, defaults, options, { autoScroll });
      });
    });
  }
}
