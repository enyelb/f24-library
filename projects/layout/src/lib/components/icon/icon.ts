import { ChangeDetectionStrategy, Component, effect, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { F24IconService, F24IconType } from '../../services/icon-service';
import { BrowserModule } from '@angular/platform-browser';

/**
 * F24Icon
 */
@Component({
  selector: 'f24-icon',
  imports: [MatIconModule],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class F24Icon {
  /**
   * services
   */
  protected readonly service = inject(F24IconService);
  /**
   * inputs
   */
  readonly icon = input.required<string>();
  readonly size = input<number>(24);
  /**
   * signals
   */
  protected readonly config = signal<F24IconType | undefined>(undefined);
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para validar si es un icon o un svg
     */
    effect(() => {
      const icon = this.icon();
      if (icon) {
        const config = this.service.icon(icon);
        this.config.set(config);
      }
    });
  }
}
