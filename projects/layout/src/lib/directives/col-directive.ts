import { effect, signal, untracked } from '@angular/core';
import { Directive, ElementRef, inject, input, Input } from '@angular/core';

import { F24LayoutService } from '../services/layout-service';

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
  selector: '[col], [base]',
})
export class F24ColDirective {

  /**
   * layout service
   */
  protected readonly layout = inject(F24LayoutService);

  /**
   * inputs
   */
  readonly base = input(20);
  readonly col = input<F24ColDirectiveModel>();

  /**
   * signals
   */
  protected readonly inizialized = signal(false);
  protected readonly size = signal('XXL');

  /**
   * constructor
   * @param el
   * @param _latoutServices
   */
  constructor(protected el: ElementRef) {

    /**
     * validar si el col cambia para actualizar el tamanio
     */
    effect(() => {
      const col = this.col();
      if (col) {
        untracked(() => {
          this.change(this.size());
        })
        
      }
    }, { debugName: 'F24ColDirective' })
  }

  /**
   * size
   * @param
   */
  sizes(): Required<F24ColDirectiveModel> {
    const xxl = this.col()?.xxl || 20;
    const xl = this.col()?.xl || xxl;
    const l = this.col()?.l || xl;
    const m = this.col()?.m || l;
    const s = this.col()?.s || m;
    const xs = this.col()?.xs || s;
    return { xxl, xl, l, m, s, xs };
  }

  /**
   * change
   */
  change(SIZE: string): void {
    if (SIZE === this.size() && this.inizialized()) {
      return;
    }
    
    const sises = this.sizes();
    const width = ((this.layout.values(sises, SIZE) / this.base()) * 100);
    
    //AGREGAR: Usar classList en lugar de style directo
    const element = this.el.nativeElement;
    
    //PREPARAR: Primero calcular todo
    const shouldHide = width === 0;
    const newWidth = `${width}%`;
    
    //APLICAR: Todo en un batch
    requestAnimationFrame(() => {
      // Solo modificar si realmente cambió
      if (shouldHide !== (element.style.display === 'none')) {
        element.style.display = shouldHide ? 'none' : 'block';
      }
      
      if (element.style.width !== newWidth) {
        element.style.width = newWidth;
      }
      
      this.inizialized.set(true);
      this.size.set(SIZE);
    });
  }

  /**
   * isInizialized
   * @returns boolean
   */
  isInizialized(): boolean {
    return this.inizialized();
  }

}
