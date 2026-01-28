import { Injectable, signal, computed } from "@angular/core";
import { BreakpointObserver } from '@angular/cdk/layout';

/**
 * F24LayoutService
 */
@Injectable({
  providedIn: 'root'
})
export class F24LayoutService {

  /**
   * changeSize - Signal que contiene el tamaño actual
   */
  private changeSize = signal<string>('');

  /**
   * SIZE - Signal público con el tamaño actual
   */
  public SIZE = computed(() => this.changeSize());

  /**
   * XSMALL
   */
  public readonly XSMALL = "XS";

  /**
   * SMALL
   */
  public readonly SMALL = "S";

  /**
   * MEDIUM
   */
  public readonly MEDIUM = "M";

  /**
   * LARGE
   */
  public readonly LARGE = "L";

  /**
   * XLARGE
   */
  public readonly XLARGE = "XL";

  /**
   * XXLARGE
   */
  public readonly XXLARGE = "XXL";

  /**
   * breakpoints
   */
  private readonly breakpoints: string[] = [
    '(max-width: 575.98px)',
    '(min-width: 576px) and (max-width: 767.98px)',
    '(min-width: 768px) and (max-width: 991.98px)',
    '(min-width: 992px) and (max-width: 1199.98px)',
    '(min-width: 1200px) and (max-width: 1399.98px)',
    '(min-width: 1400px)'
  ];

  /**
   * displayNames
   */
  private readonly displayNames = new Map([
    [this.breakpoints[0], this.XSMALL],
    [this.breakpoints[1], this.SMALL],
    [this.breakpoints[2], this.MEDIUM],
    [this.breakpoints[3], this.LARGE],
    [this.breakpoints[4], this.XLARGE],
    [this.breakpoints[5], this.XXLARGE]
  ]);

  /**
   * Constructor
   */
  constructor(private breakpointObserver: BreakpointObserver) {}

  /**
   * init - Inicializa el observador de breakpoints
   */
  init(): void {
    this.breakpointObserver
      .observe(this.breakpoints)
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            const size = this.displayNames.get(query) ?? 'Unknown';
            this.changeSize.set(size);
          }
        }
      });
  }

  /**
   * values - Retorna valores basados en el tamaño actual
   */
  values<T>(values: { xs: T, s: T, m: T, l: T, xl: T, xxl: T }, SIZE: string = this.SIZE()): T {
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
   * isMobile - Verifica si el tamaño es móvil
   */
  isMobile(SIZE: string = this.SIZE()): boolean {
    return [this.XSMALL, this.SMALL].includes(SIZE);
  }

  /**
   * isXS - Verifica si el tamaño es XS
   */
  isXS(SIZE: string = this.SIZE()): boolean {
    return SIZE === this.XSMALL;
  }

  /**
   * isM - Verifica si el tamaño es M
   */
  isM(SIZE: string = this.SIZE()): boolean {
    return SIZE === this.MEDIUM;
  }

  /**
   * is - Verifica si el tamaño actual está incluido en los valores proporcionados
   */
  is(values: string[]): boolean {
    return values.map(v => v.toUpperCase()).includes(this.SIZE());
  }
}
