import { ChangeDetectionStrategy, Component, contentChild, effect, ElementRef, inject, input, viewChild, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { F24SplideLoader } from '../../services/splide-loader';
import { F24SplideItemDirective } from '../../directives/splide-item';

import { createSplideSource, createSplideSourceParams, F24SplideSourceParams } from './splide-source';

/**
 * F24Splide
 */
@Component({
  selector: 'f24-splide',
  imports: [NgTemplateOutlet],
  templateUrl: './splide.html',
  styleUrl: './splide.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Splide<Item> {
  /**
   * services
   */
  readonly loader = inject(F24SplideLoader);
  /**
   * source 
   */
  readonly params = input(createSplideSourceParams<Item>());
  readonly source = input(createSplideSource<Item>());
  /**
   * inputs
   */
  readonly id = input<F24SplideSourceParams<Item>['id']>();
  readonly items = input<F24SplideSourceParams<Item>['items']>();
  readonly options = input<F24SplideSourceParams<Item>['options']>();
  readonly autoScroll = input<F24SplideSourceParams<Item>['autoScroll']>();
  readonly defaults = input<F24SplideSourceParams<Item>['defaults']>();
  /**
   * elements
   */
  readonly root = viewChild('splideRoot', { read: ElementRef<HTMLElement> });
  readonly template = contentChild.required(F24SplideItemDirective<Item>);
  /**
   * splide
   */
  private splide: any;
  protected trackIdRandom = `splide-${Math.random()}`;
  protected trackIdRandomFn = (index: number) => `${this.trackIdRandom}-${index}`;
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
    // Watch for changes to items, options, or config and reinitialize
    effect(() => {

      const root = this.root();
      if (!root) {
        return;
      }

      // Access signals to create dependency
      const items = this.source().items();
      const options = this.source().options();
      const defaults = this.source().defaults();
      const autoScroll = this.source().autoScroll();

      queueMicrotask(() => {
        // Destroy previous instance
        if (this.splide) {
          this.splide.destroy();
        }
        // Initialize new instance
        this.splide = this.loader.inizialized(root.nativeElement, defaults, options, { autoScroll });
      });
    });
  }
}
