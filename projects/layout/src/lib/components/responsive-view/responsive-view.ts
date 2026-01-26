import { Component, OnDestroy, ElementRef, input, viewChild, effect, ViewEncapsulation } from '@angular/core';

import { F24Lazy, F24LazyId, F24LazyInputs, F24LazyModule, F24LazyPost } from "../lazy/lazy";

/**
 * F24ResponsiveViewSize
 */
export type F24ResponsiveViewSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

/**
 * F24ResponsiveViewComponent
 */
export interface F24ResponsiveViewComponent<C> {
  sizes: F24ResponsiveViewSize[]
  id: F24LazyId<C>
  module: F24LazyModule<C>
  post?: F24LazyPost<C>
  inputs?: F24LazyInputs
}


/**
 * ResponsiveView
 */
@Component({
  selector: 'f24-responsive-view',
  imports: [F24Lazy],
  templateUrl: './responsive-view.html',
  styleUrl: './responsive-view.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class F24ResponsiveView implements OnDestroy {

  /**
   * inputs
   */
  readonly components = input.required<F24ResponsiveViewComponent<any>[]>();

  /**
   * viewChild
   */
  readonly lazy = viewChild.required(F24Lazy);
  readonly element = viewChild.required(F24Lazy, { read: ElementRef })

  /**
   * breakpoints
   * Breakpoints for different screen sizes
   */
  private breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
  };

  /**
   * resizeObserver
   */
  private resizeObserver: ResizeObserver;

  /**
   *component
   */
  private component!: F24ResponsiveViewComponent<any>

  /**
   * constructor
   */
  constructor() {
    this.resizeObserver = new ResizeObserver(entries => {
      this.checkSize(entries[0].contentRect.width);
    });
    effect(() => {
      this.resizeObserver.observe(this.element().nativeElement)
    });
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    this.resizeObserver.unobserve(this.element().nativeElement);
    this.resizeObserver.disconnect();
  }

  /**
   * checkSize
   * @param width Width of the element
   */
  private checkSize(width: number) {
    let newSize: F24ResponsiveViewSize = 'xxl';

    if (width >= this.breakpoints.xxl) newSize = 'xxl';
    else if (width >= this.breakpoints.xl) newSize = 'xl';
    else if (width >= this.breakpoints.lg) newSize = 'l';
    else if (width >= this.breakpoints.md) newSize = 'm';
    else if (width >= this.breakpoints.sm) newSize = 's';
    else newSize = 'xs';

    const component = this.components().find(component => component.sizes.includes(newSize));
    if (!component) {
      return;
    }

    if(this.component && this.component.id === component.id) {
      return;
    }

    this.component = component;

    const lazy = this.lazy();

    lazy.loadId(component.id);
    lazy.loadPost(component?.post);
    lazy.loadInputs(component?.inputs);
    lazy.load(component.module);
  }
}

/**
 * createResponsiveViewComponent
 * @param component
 * @returns
 */
export function createResponsiveViewComponent<T>(
  component: F24ResponsiveViewComponent<T>
): F24ResponsiveViewComponent<T> {
  return component;
}
