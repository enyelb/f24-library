import { contentChildren, Directive, effect, ElementRef, OnDestroy, OnInit, untracked } from '@angular/core';
import { F24ColDirective } from './col-directive';
import { debounceTime, Subject, takeUntil, throttleTime } from 'rxjs';

/**
 * F24RowDirective
 */
@Directive({
  standalone: true,
  selector: '[row]'
})
export class F24RowDirective implements OnDestroy, OnInit {

  /**
   * currentSize
   */
  private currentSize: string = '';

  /**
   * breakpoints
   * Breakpoints for different screen sizes
   * xs: extra small, sm: small, md: medium, lg: large, xl: extra large, xxl: extra extra large
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
  private resizeObserver: ResizeObserver | null = null;
  private destroy$ = new Subject<void>();
  private resizeSubject = new Subject<number>();
  private rafId: number | null = null;
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
      // Cancelar frame anterior
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
      
      // Procesar en nuevo frame
      this.rafId = requestAnimationFrame(() => {
        const width = entries[0].contentRect.width;
        this.resizeSubject.next(width);
      });
      
    });

    this.resizeSubject.pipe(
      throttleTime(50, undefined, { leading: true, trailing: true }),
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
        padding: calc(var(--margin-global, 20px) / 2);
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
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

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
    let newSize = '';

    if (width >= this.breakpoints.xxl) newSize = 'XXL';
    else if (width >= this.breakpoints.xl) newSize = 'XL';
    else if (width >= this.breakpoints.lg) newSize = 'L';
    else if (width >= this.breakpoints.md) newSize = 'M';
    else if (width >= this.breakpoints.sm) newSize = 'S';
    else newSize = 'XS';

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
    let newSize = 'XS';

    if (width >= this.breakpoints.xxl) newSize = 'XXL';
    else if (width >= this.breakpoints.xl) newSize = 'XL';
    else if (width >= this.breakpoints.lg) newSize = 'L';
    else if (width >= this.breakpoints.md) newSize = 'M';
    else if (width >= this.breakpoints.sm) newSize = 'S';

    this.columns().forEach(col => {
      if (!col.isInizialized()) {
        col.change(newSize);
      }
    });
  }

}
