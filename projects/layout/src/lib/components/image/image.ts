import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, signal } from '@angular/core';

import { MtxPhotoviewerModule } from '@ng-matero/extensions/photoviewer';

/**
 * F24ImageComponent
 */
@Component({
  selector: 'f24-image',
  standalone: true,
  imports: [MtxPhotoviewerModule],
  templateUrl: './image.html',
  styleUrls: ['./image.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Image {
  /**
   * elementRef
   */
  protected readonly elementRef = inject(ElementRef);
  /**
   * inputs
   */
  readonly src = input('');
  readonly alt = input('');
  readonly default = input('');

  /**
   * notfound
   */
  protected notfound: boolean = false;
  /**
   * notfound
   */
  protected notfoundDefault: boolean = false;
  /**
   * classContainer
   */
  protected readonly classContainer = signal('body');
  /**
   * constructor
   */
  constructor() {
   /**
     * efecto para observar el elemento y en el momento que se haga visible asignar el class container
     * para en caso de que el photoviewer este dento de un dialog se muestre correctamente 
     * Nota: esto solo se ejecutara una vez porque dentro del mismo observer se deconecta
     */
    effect(() => {
      const element = this.elementRef?.nativeElement;
      if (!element) {
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Si al menos una parte del componente es visible
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            setTimeout(() => {
              if (this.elementRef.nativeElement.closest('.mat-mdc-dialog-container')) {
                this.classContainer.set('.mat-mdc-dialog-container');
              }
            }, 60);
            observer.disconnect();
          }
        });
      });
      observer.observe(element);
    }); 
  }
   /**
   * error
   */
  error(e: ErrorEvent) {
    this.notfound = true;
  }

  /**
   * error
   */
  errorDefault(e: ErrorEvent) {
    this.notfoundDefault = true;
  }
}
