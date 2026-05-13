import { ChangeDetectionStrategy, Component, effect, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

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
   * inputs
   */
  readonly icon = input.required<string>();
  readonly size = input<number>();
  /**
   * signals
   */
  protected readonly isMaterialIcon = signal(true);
  protected readonly isSVGIcon = signal(false);
  /**
   * injects
   */
  protected readonly icons = inject(MatIconRegistry);
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para validar si es un icon o un svg
     */
    effect(() => {
      this.icons.getNamedSvgIcon(this.icon()).pipe().subscribe({
        next: (icon) => {
          this.isMaterialIcon.set(icon === null);
          this.isSVGIcon.set(icon !== null);
        },
        error: () => {
          this.isMaterialIcon.set(true);
          this.isSVGIcon.set(false);
        }
      });
    });
  }
}
