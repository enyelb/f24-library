import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';

import { F24Dialog } from '@f24/notification'

/**
 * F24ImageComponent
 */
@Component({
  selector: 'f24-image',
  standalone: true,
  imports: [F24Dialog],
  templateUrl: './image.html',
  styleUrls: ['./image.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Image {
  /**
   * inputs
   */
  readonly src = input('');
  readonly alt = input('');
  readonly default = input('');
  readonly zoomClick = input(true);
  readonly zoomSize = input<'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'>('s');
  /**
   * services
   */
  readonly dialog = viewChild(F24Dialog);

  /**
   * safeUrl
   */
  protected readonly safeUrl = signal<string | undefined>(undefined);
  protected readonly notFound = signal(false);
  protected readonly notFoundDefault = signal(false)

  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar la url valida
     */
    effect(() => {
      const src = this.src();
      const default2 = this.default();
      this.safeUrl.set(src || default2);
      this.notFound.set(src === '');
      this.notFoundDefault.set(default2 === '');
    });
  }
  /**
   * zoomClick
   */
  public reportError() {
    if (!this.notFound()) {
      this.notFound.set(true);
      this.safeUrl.set(this.default());
      return;
    }
    if (!this.notFoundDefault()) {
      this.notFoundDefault.set(true);
      this.safeUrl.set('');
      return;
    }

  }
  /**
   * open
   */
  public open(): void {
    const dialog = this.dialog();
    const zoomClick = this.zoomClick();
    
    if (!dialog || !zoomClick) {
      return;
    }

    dialog.open();
  }
}
