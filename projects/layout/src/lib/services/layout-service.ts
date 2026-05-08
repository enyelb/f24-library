import { Injectable, signal, computed, inject } from "@angular/core";
import { BreakpointObserver } from '@angular/cdk/layout';

/**
 * F24LayoutSizes
 */

export interface F24LayoutSizes<T> {
  xs?: T;
  s?: T;
  m?: T;
  l?: T;
  xl?: T;
  xxl?: T;
}

/**
 * F24LayoutService
 */
@Injectable({
  providedIn: 'root'
})
export class F24LayoutService {
  /**
   * breakpointObserver
   */
  private readonly breakpointObserver = inject(BreakpointObserver);
  /**
   * Signal que contiene el tamaño actual
   */
  private readonly size = signal<string>('');
  public readonly SIZE = this.size.asReadonly();
  /**
   * TIPOS DE TAMANIOS
   */
  public readonly XSMALL = "XS";
  public readonly SMALL = "S";
  public readonly MEDIUM = "M";
  public readonly LARGE = "L";
  public readonly XLARGE = "XL";
  public readonly XXLARGE = "XXL";
  /**
   * breakpoints names
   */
  private readonly breakpointsNames = [this.XSMALL, this.SMALL, this.MEDIUM, this.LARGE, this.XLARGE, this.XXLARGE];
  /**
   * breakpoints media query
   */
  private readonly breakpointsMediaQuery: string[] = [
    '(max-width: 575.98px)',
    '(min-width: 576px) and (max-width: 767.98px)',
    '(min-width: 768px) and (max-width: 991.98px)',
    '(min-width: 992px) and (max-width: 1199.98px)',
    '(min-width: 1200px) and (max-width: 1399.98px)',
    '(min-width: 1400px)'
  ];
  /**
   * breakpoints width
   */
  private breakpointsWidth = [0, 576, 768, 992, 1200, 1400];
  /**
   * Constructor
   */
  constructor() {
    this.breakpointObserver
      .observe(this.breakpointsMediaQuery)
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.size.set(this.mediaQueryToSize(query));
          }
        }
      });
  }
  /**
   * mediaQueryToSize devuelve el nombre de la media query
   * @param query
   * @returns string
   */
  mediaQueryToSize(query: string): string {
    for (let i = 0; i < this.breakpointsMediaQuery.length; i++) {
      if (query === this.breakpointsMediaQuery[i]) {
        return this.breakpointsNames[i];
      }
    }
    return this.XXLARGE;
  }
  /**
   * widthToSize devuelve el nombre del tamanio
   * @param width 
   * @returns string
   */
  widthToSize(width: number): string {
    for (let i = this.breakpointsWidth.length - 1; i >= 0; i--) {
      if (width >= this.breakpointsWidth[i]) {
        return this.breakpointsNames[i];
      }
    }
    return this.XSMALL;
  }
  /**
   * defaultSizes
   * @param values F24LayoutSizes<T>
   * @param defaultSize T 
   * @returns Required<F24LayoutSizes<T>>
   */
  defaultSizes<T>(values: F24LayoutSizes<T> | undefined, defaultSize: T): Required<F24LayoutSizes<T>> {
    const xxl = values?.xxl || defaultSize;
    const xl = values?.xl || xxl;
    const l = values?.l || xl;
    const m = values?.m || l;
    const s = values?.s || m;
    const xs = values?.xs || s;
    return { xxl, xl, l, m, s, xs };  
  }
  /**
   * values - Retorna valores basados en el tamaño actual
   * @param values Required<F24LayoutSizes<T>>
   * @param SIZE string
   * @return T
   */
  values<T>(values: Required<F24LayoutSizes<T>>, SIZE: string = this.SIZE()): T {
    switch (SIZE) {
      case this.XSMALL:
        return values.xs;
      case this.SMALL:
        return values.s;
      case this.MEDIUM:
        return values.m;
      case this.LARGE:
        return values.l;
      case this.XLARGE:
        return values.xl;
      default:
        return values.xxl;
    }
  }
  /**
   * s - Verifica si el tamaño es de S
   */
  s(SIZE: string = this.SIZE()): boolean {
    return this.SMALL === SIZE;
  }
  /**
   * xs - Verifica si el tamaño es XS
   */
  xs(SIZE: string = this.SIZE()): boolean {
    return this.XSMALL === SIZE;
  }
  /**
   * m - verifica si el tamanio es M
   */
  m(SIZE: string = this.SIZE()): boolean {
    return this.MEDIUM === SIZE;
  }
  /**
   * is - Verifica si el tamaño actual está incluido en los valores proporcionados
   */
  is(values: string[]): boolean {
    return values.map(v => v.toUpperCase()).includes(this.SIZE());
  }
}
