import { Component, OnDestroy, ElementRef, input, viewChild, effect } from '@angular/core';

import { Lazy } from '../lazy';

import { ResponsiveViewComponent, ResponsiveViewSize } from './model';

/**
 * ResponsiveView
 */
@Component({
  selector: 'f24-responsive-view',
  imports: [Lazy],
  templateUrl: './responsive-view.html',
  styleUrl: './responsive-view.scss',
  standalone: true,
})
export class ResponsiveView implements OnDestroy {

  /**
   * inputs
   */
  readonly components = input.required<ResponsiveViewComponent<any>[]>();

  /**
   * viewChild
   */
  readonly lazy = viewChild.required(Lazy);
  readonly element = viewChild.required(Lazy, { read: ElementRef })

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
  private component!: ResponsiveViewComponent<any>

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
    let newSize: ResponsiveViewSize = 'xxl';

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
  component: ResponsiveViewComponent<T>
): ResponsiveViewComponent<T> {
  return component;
}
