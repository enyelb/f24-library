import { effect, signal, untracked } from '@angular/core';
import { Directive, ElementRef, inject, input, Input } from '@angular/core';

import { F24LayoutService, F24LayoutSizes } from '../services/layout-service';

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
  readonly col = input<F24LayoutSizes<number>>();

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
    })
  }
  /**
   * change
   */
  change(SIZE: string): void {
    if (SIZE === this.size() && this.inizialized()) {
      return;
    }
    
    const sizes = this.layout.defaultSizes(this.col(), this.base());
    const width = ((this.layout.values(sizes, SIZE) / this.base()) * 100);
    
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
