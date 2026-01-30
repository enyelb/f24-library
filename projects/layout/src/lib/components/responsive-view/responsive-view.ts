import { Component, OnDestroy, ElementRef, input, ViewEncapsulation, ChangeDetectionStrategy, viewChildren, computed, signal, OnInit } from '@angular/core';

import { debounceTime, Subject, takeUntil } from 'rxjs';

import { F24Lazy, F24LazyId, F24LazyInputs, F24LazyModule, F24LazyPost } from "../lazy/lazy";
import { F24Loader } from '../loader/loader';

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
  imports: [F24Lazy, F24Loader],
  templateUrl: './responsive-view.html',
  styleUrl: './responsive-view.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24ResponsiveView implements OnInit, OnDestroy {
  /**
   * inputs
   */
  readonly components = input.required<F24ResponsiveViewComponent<any>[]>();
  /**
   * viewChild
   */
  readonly loaders = viewChildren(F24Lazy);
  /**
   * views
   */
  protected readonly views = computed(() => {
    return this.components().map((component, index) => {
      const loader = this.loaders()[index];
      if (!loader) {
        return;
      }
      return { component, loader }
    }).filter(component => !!component);
  });
  /**
   *component
   */
  protected readonly current = signal<{
    component: F24ResponsiveViewComponent<any>,
    loader: F24Lazy<any>,
  } | undefined>(undefined);
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
  private destroy$ = new Subject<void>();
  private resizeSubject = new Subject<number>();
  /**
   * constructor
   */
  constructor(protected elementRef: ElementRef) {
    let rafId = 0;
    this.resizeObserver = new ResizeObserver(entries => {
      // Cancelar frame anterior
      if (rafId) cancelAnimationFrame(rafId);
      
      // Procesar en nuevo frame
      rafId = requestAnimationFrame(() => {
        this.resizeSubject.next(entries[0].contentRect.width);
      });
    });

    this.resizeSubject.pipe(
      debounceTime(300), // Espera 300ms después del último cambio
      takeUntil(this.destroy$)
    ).subscribe(width => {
      this.checkSize(width);
    });
  }
  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }
  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    this.resizeObserver.unobserve(this.elementRef.nativeElement);
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
    

    const view = this.views().find(view => view.component.sizes.includes(newSize));
    if (!view) {
      return;
    }
    const component = view.component;
    const current = this.current();
    if(current && current.component.id === component.id) {
      return;
    }

    this.current.set(view);

    const loader = view.loader;
    if (loader.isLodaing() || loader.isLoad()) {
      return;
    }

    loader.loadId(component.id);
    loader.loadPost(component?.post);
    loader.loadInputs(component?.inputs);
    loader.load(component.module);
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
