import { AfterContentInit, ContentChildren, Directive, ElementRef, OnDestroy, OnInit, QueryList } from '@angular/core';
import { F24ColDirective } from './col-directive';
import { Subscription } from 'rxjs';
/**
 * F24RowDirective
 */
@Directive({
  standalone: true,
  selector: '[row]'
})
export class F24RowDirective implements OnDestroy, OnInit, AfterContentInit {

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
  private resizeObserver: ResizeObserver;

  /**
   * columnsSubscription
   */
  private columnsSubscription!: Subscription;

  /**
   * columns
   * Content children of type F24ColDirective
   */
  @ContentChildren(F24ColDirective, { descendants: true }) columns!: QueryList<F24ColDirective>;

  /**
   * constructor
   * @param el ElementRef
   * @param renderer Renderer2
   */
  constructor(protected el: ElementRef) {
    this.resizeObserver = new ResizeObserver(entries => {
      this.checkSize(entries[0].contentRect.width);
    });
  }

  ngAfterContentInit() {
    // Suscribirse a los cambios
    this.columnsSubscription = this.columns.changes.subscribe({
      next: () => {
        console.log(this.columns.length)
        this.checkColumnsNotSize(this.el.nativeElement.clientWidth);
      },
      error: (error) => {
        console.error('Error en columns changes:', error);
      }
    });
  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.el.nativeElement.style.display = 'flex';
    this.el.nativeElement.style.flexWrap = 'wrap';
    this.el.nativeElement.style.alignItems = 'stretch';
    this.el.nativeElement.style.padding = 'calc(var(--margin-global, 20px) / 2)';
   // this.el.nativeElement.style.width = 'calc(100% - (var(--margin-global, 20px) / 2))';
    this.resizeObserver.observe(this.el.nativeElement);
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    this.resizeObserver.unobserve(this.el.nativeElement);
    this.resizeObserver.disconnect();
    if (this.columnsSubscription) {
      this.columnsSubscription.unsubscribe();
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

    if (newSize !== this.currentSize && this.columns.length > 0) {
      this.currentSize = newSize;
      this.columns.forEach(col => {
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

    this.columns.forEach(col => {
      if (!col.isInizialized()) {
        col.change(newSize);
      }
    });
  }

}
