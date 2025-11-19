import { Directive, ElementRef, inject, Input } from '@angular/core';

import { F24LayoutService } from '../services';

/**
 * F24ColDirectiveModel
 */

export interface F24ColDirectiveModel {
  xs?: number;    // (max-width: 575.98px)
  s?: number;     // (min-width: 576px) and (max-width: 767.98px)
  m?: number;     // (min-width: 768px) and (max-width: 991.98px)
  l?: number;     // (min-width: 992px) and (max-width: 1199.98px)
  xl?: number;    // (min-width: 1200px) and (max-width: 1399.98px)
  xxl?: number;   // (min-width: 1400px) - Pantallas extra grandes
  // Otros breakpoints útiles para mayor control:
}

/**
 * F24ColDirectiveSizeIt can be used to specify the size of the column in different contexts.
 */
export type F24ColDirectiveSize = 'small' | 'medium' | 'large' | 'width';

/**
 * F24ColDirective
 */
@Directive({
  standalone: true,
  selector: '[col-xs], [col-s], [col-m], [col-l], [col-xl], [col-xxl], [col], [col-base]',
})
export class F24ColDirective {

  /**
   * layout service
   */
  protected readonly layout = inject(F24LayoutService);

  /**
   * inizialized
   */
  inizialized: boolean = false;

  /**
   * col-base
   */
  @Input('col-base') colBase: number = 20;

  /**
   * col
   */
  @Input('col') col!: F24ColDirectiveModel;
  /**
   * constructor
   * @param el
   * @param _latoutServices
   */
  constructor(protected el: ElementRef) {
  }

  /**
   * size
   * @param
   */
  sizes(): Required<F24ColDirectiveModel> {
    const xxl = this.col.xxl !== undefined ? this.col.xxl : 20;
    const xl = this.col.xl !== undefined ? this.col.xl : (xxl || 20);
    const l = this.col.l !== undefined ? this.col.l : (xl || 20);
    const m = this.col.m !== undefined ? this.col.m : (l || 20);
    const s = this.col.s !== undefined ? this.col.s : (m || 20);
    const xs = this.col.xs !== undefined ? this.col.xs : (s || 20);
    return { xxl, xl, l, m, s, xs };
  }

  /**
   * change
   */
  change(SIZE: string): void {
    const sises = this.sizes();

    const width = ((this.layout.values(sises, SIZE) / this.colBase) * 100);
    if (width == 0) {
      this.el.nativeElement.style.display = 'none';
    } else {
      this.el.nativeElement.style.display = 'block';
    }
    this.el.nativeElement.style.width = `${width}%`//`calc(${width}% - (var(--margin-global) / 2))`;
    this.inizialized = true;
  }

  /**
   * isInizialized
   * @returns boolean
   */
  isInizialized(): boolean {
    return this.inizialized;
  }

}
