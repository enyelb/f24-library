import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

/**
 * F24LogoSwap
 *
 * Alterna entre dos imagenes (colapsada / expandida) con transicion de opacidad.
 * La imagen no visible queda fuera del layout con display:none (animable via
 * transition-behavior: allow-discrete + @starting-style).
 * Estado expandido cuando:
 * - `expanded()` es true
 * - hay hover sobre un ancestro con la clase `f24-logo-swap-host`
 * - en pantallas <= 768px si `mobileExpanded()` es true (default)
 */
@Component({
  selector: 'f24-logo-swap',
  imports: [],
  templateUrl: './logo-swap.html',
  styleUrl: './logo-swap.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f24-logo-swap',
    '[class.f24-logo-swap-expanded]': 'expanded()',
    '[style.--f24-logo-swap-duration]': 'duration()',
    '[style.--f24-logo-height]': '`${size()}px`',
  },
})
export class F24LogoSwap {
  /**
   * inputs
   */
  readonly expandedSrc = input.required<string>();
  readonly collapsedSrc = input.required<string>();
  readonly alt = input('');
  readonly expanded = input(false);
  readonly duration = input<string>('0.3s');
  readonly size = input<number>(40);
}
