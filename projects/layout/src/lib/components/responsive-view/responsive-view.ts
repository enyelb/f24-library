import { Component, OnDestroy, ElementRef, input, ViewEncapsulation, ChangeDetectionStrategy, viewChildren, computed, signal, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Subject, takeUntil, throttleTime } from 'rxjs';

import { F24LayoutService } from '../../services/layout-service';
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
  icon?: string,
  title?: string,
  only?: boolean,
  post?: F24LazyPost<C>
  inputs?: F24LazyInputs
}
/**
 * ResponsiveView
 */
@Component({
  selector: 'f24-responsive-view',
  imports: [
    MatButtonModule, MatIconModule,
    F24Lazy, F24Loader
  ],
  templateUrl: './responsive-view.html',
  styleUrl: './responsive-view.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24ResponsiveView implements OnDestroy {
  /**
   * services
   */
  protected readonly layout = inject(F24LayoutService);
  protected readonly element = inject(ElementRef);
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
   * currentComponent
   */
  protected readonly isShowOptions = computed(() => {
    const isOnlyCurrentView = this.currentView()?.component?.only;
    const isManual = this.isManual();
    const someComponentNoOnly = this.components().some(component => !component.only && component.icon);
    return (!isOnlyCurrentView || isManual) && someComponentNoOnly;
  }) 

  /**
   *currentView
   */
  protected readonly currentView = signal<{
    component: F24ResponsiveViewComponent<any>,
    loader: F24Lazy<any>,
  } | undefined>(undefined);
  /**
   * size
   */
  protected readonly currentSize = signal<F24ResponsiveViewSize | undefined>(undefined);
  /**
   *isManual
   */
  protected readonly isManual = signal(false);
  /**
   * resizeObserver
   */
  private resizeObserver: ResizeObserver | null = null;
  private destroy$ = new Subject<void>();
  private resizeSubject = new Subject<number>();
  /**
   * constructor
   */
  constructor() {
    this.resizeObserver = new ResizeObserver(entries => {
      const width = entries[0].borderBoxSize[0].inlineSize;
      this.resizeSubject.next(width);
    });
    this.resizeObserver.observe(this.element.nativeElement);

    this.resizeSubject.pipe(
      throttleTime(50, undefined, { leading: false, trailing: true }),
      takeUntil(this.destroy$)
    ).subscribe(width => {
      this.changeWidth(width);
    });
  }
  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.element.nativeElement);
      this.resizeObserver.disconnect();
    }
  }
  /**
   * change
   */
  changeWidth(width: number, manual: boolean = false): void {
    const size = this.layout.widthToSize(width).toLowerCase() as F24ResponsiveViewSize;
    this.changeSize(size, manual);
  }
  /**
   * changeComponent
   */
  changeComponent(component?: F24ResponsiveViewComponent<any>, manual: boolean = false): void {
    if(!component || component.sizes.length === 0) {
      return;
    }
    const size = component.sizes[0];
    this.changeSize(size, manual);
  }
  /**
   * changeComponent
   */
  changeSize(size: F24ResponsiveViewSize, manual: boolean = false): void {
    if (this.currentSize() === size && !manual) {
      return;
    }
    if (!manual) {
      this.currentSize.set(size);
    
    }
    const view = this.views().find(view => view.component.sizes.includes(size));
    this.changeView(view, manual);
  }
  /**
   * changeView
   */
  changeView(view?: { component: F24ResponsiveViewComponent<any>, loader: F24Lazy<any> }, manual: boolean = false): void {
    if (!view) {
      return;
    }
    const component = view.component;
    const currentView = this.currentView();

    this.isManual.set(manual);

    if(currentView && currentView.component.id === component.id) {
      return;
    }

    this.currentView.set(view);

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
