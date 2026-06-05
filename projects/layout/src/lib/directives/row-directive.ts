import { contentChildren, Directive, effect, ElementRef, inject, OnDestroy, OnInit, untracked } from '@angular/core';

import { Subject, takeUntil, throttleTime } from 'rxjs';

import { F24ColDirective } from './col-directive';
import { F24LayoutService } from '../services/layout-service';

/**
 * F24RowDirective
 */
@Directive({
  standalone: true,
  selector: '[row]'
})
export class F24RowDirective implements OnDestroy, OnInit {
  /**
   * layout service
   */
  protected readonly layout = inject(F24LayoutService);
  /**
   * currentSize
   */
  private currentSize: string = '';

  /**
   * resizeObserver
   */
  private resizeObserver: ResizeObserver | null = null;
  private destroy$ = new Subject<void>();
  private resizeSubject = new Subject<number>();
  /**
   * columns
   * Content children of type F24ColDirective
   */
  private columns = contentChildren(F24ColDirective, { descendants: true });

  /**
   * constructor
   * @param el ElementRef
   * @param renderer Renderer2
   */
  constructor(protected el: ElementRef) {
    this.resizeObserver = new ResizeObserver(entries => {
      const width = entries[0].borderBoxSize[0].inlineSize;
      this.resizeSubject.next(width);
    });

    this.resizeSubject.pipe(
      throttleTime(50, undefined, { leading: false, trailing: true }),
      takeUntil(this.destroy$)
    ).subscribe(width => {
      this.checkSize(width);
    });

    effect((onCleanup) => {
      const columns = this.columns();
      if (columns.length > 0) {
        const rafId = requestAnimationFrame(() => {
          untracked(() => {
            this.checkSize(this.el.nativeElement.clientWidth);
          });
        });
        onCleanup(() => cancelAnimationFrame(rafId));
      }
    }, { debugName: 'F24RowDirective' })
  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    const element = this.el.nativeElement;
    
    requestAnimationFrame(() => {
      element.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        padding: calc(var(--global-margin, 20px) / 4);
      `;
    });
    
    if (this.resizeObserver) {
      this.resizeObserver.observe(element);
    }
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.el.nativeElement);
      this.resizeObserver.disconnect();
    }
  }


  /**
   * checkSize
   * @param width Width of the element
   */
  private checkSize(width: number) {

    const newSize = this.layout.widthToSize(width);
    
    if (newSize !== this.currentSize && this.columns().length > 0) {
      this.currentSize = newSize;
      this.columns().forEach(col => {
        col.change(newSize);
      });
    }
  }

  /**
   * checkColumnsNotSize
   * @param width Width of the element
   */
  private checkColumnsNotSize(width: number) {
    const newSize = this.layout.widthToSize(width);

    this.columns().forEach(col => {
      if (!col.isInizialized()) {
        col.change(newSize);
      }
    });
  }

}
