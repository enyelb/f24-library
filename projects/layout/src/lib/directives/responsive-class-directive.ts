import { effect, OnDestroy, OnInit, Renderer2, signal, untracked } from '@angular/core';
import { Directive, ElementRef, inject, input } from '@angular/core';

import { Subject, takeUntil, throttleTime } from 'rxjs';

import { F24LayoutService, F24LayoutSizes } from '../services/layout-service';

/**
 * F24ResponsiveClassDirective
 */
@Directive({
  standalone: true,
  selector: '[responsiveClass]',
})
export class F24ResponsiveClassDirective implements OnDestroy {
  /**
   * layout service
   */
  protected readonly layout = inject(F24LayoutService);
  protected readonly element = inject(ElementRef);
  protected readonly renderer = inject(Renderer2);
  /**
   * inputs
   */
  readonly responsiveClass = input<F24LayoutSizes<string>>();
  /**
   * signals
   */
  readonly currentSize = signal('');
  readonly currentClass = signal<string | null>(null);
  readonly currentWidth = signal(0);
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
      this.change(width);
    });
    /**
     * validar si el col cambia para actualizar el tamanio
     */
    effect(() => {
      this.responsiveClass();
      untracked(() => {
        this.resizeSubject.next(this.currentWidth());
      });
    })
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
  change(width: number): void {
    /**
     * buscar nuevo size y valiadar si no es la actual
     */
    const newSize = this.layout.widthToSize(width);
    if (newSize == this.currentSize()) {
      return;  
    }

    this.currentSize.set(newSize);
    this.currentWidth.set(width);

    console.log(width, newSize);
    
    const sises = this.layout.defaultSizes(this.responsiveClass(), '');
    const newClass = this.layout.values(sises, newSize);
    const currentClass = this.currentClass();
    const element = this.element.nativeElement;
    /**
     * quitar la clase anterior
     */
    if (currentClass) {
      this.renderer.removeClass(element, currentClass);
      this.currentClass.set(null);
    }
    /**
     * agregar la nueva clase
     */
    if (newClass) {
      this.renderer.addClass(element, newClass);
      this.currentClass.set(newClass);
    }
  }

}
