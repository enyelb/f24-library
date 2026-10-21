import { Component, computed, effect, input, output, signal, untracked } from '@angular/core';

import { MatButtonModule, MatButtonAppearance } from '@angular/material/button';

import { F24Icon } from '@f24/layout';

import {
  F24ButtonSwitchChangeEvent,
  F24ButtonSwitchOption,
  F24ButtonSwitchSource,
  F24ButtonSwitchSourceParams,
} from './button-switch-source';

/**
 * F24ButtonSwitch
 * boton con multiples opciones, solo la opcion expandida muestra el texto completo,
 * las demas quedan minimizadas con icono o iniciales, la unica forma de contraer la
 * expandida es hacer hover sobre otra opcion, la expansion se persiste hasta entonces
 */
@Component({
  selector: 'f24-button-switch',
  imports: [MatButtonModule, F24Icon],
  templateUrl: './button-switch.html',
  styleUrl: './button-switch.scss',
})
export class F24ButtonSwitch {
  /**
   * inputs
   */
  readonly source = input<F24ButtonSwitchSource>();
  readonly options = input<F24ButtonSwitchSourceParams['options']>([]);
  readonly selectedIndex = input<F24ButtonSwitchSourceParams['selectedIndex']>(0);
  readonly appearance = input<MatButtonAppearance>();
  readonly iconSize = input<F24ButtonSwitchSourceParams['iconSize']>();
  /**
   * outputs
   */
  readonly selected = output<F24ButtonSwitchChangeEvent>();
  readonly click = output<F24ButtonSwitchChangeEvent>();
  /**
   * signals
   * indice de la opcion expandida (estado interno sincronizado con el input)
   */
  protected readonly expanded = signal<F24ButtonSwitchSourceParams['selectedIndex']>(0);
  /**
   * signals resolved inputs
   */
  readonly resolvedOptions = computed<F24ButtonSwitchOption[]>(() => this.source()?.options() ?? this.options() ?? []);
  readonly resolvedAppearance = computed(() => this.source()?.appearance() ?? this.appearance() ?? 'elevated');
  readonly resolvedIconSize = computed(() => this.source()?.iconSize() ?? this.iconSize() ?? 24);
  readonly resolvedSelectIndex = computed(() => this.source()?.selectedIndex() ?? this.selectedIndex() ?? 0);
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para sincronizar la opcion expandida desde los inputs
     * el input selectedIndex tiene prioridad sobre el estado interno
     */
    effect(() => {
      const index = this.resolvedSelectIndex();
      const options = this.resolvedOptions();
      untracked(() => {
        if (!options?.length) {
          this.expanded.set(0);
          return;
        }
        const next = index !== undefined && index >= 0 && index < options.length ? index : 0;
        if (next !== this.expanded()) {
          this.expanded.set(next);
        }
      });
    });
  }
  /**
   * clicked
   * expande una opcion, emite el cambio y notifica al source
   */
  protected onClick(index: number): void {
    const option = this.resolvedOptions()[index];
    if (!option) {
      return;
    }
    this.expanded.set(index);
    this.click.emit({ index, option });
  }
  /**
   * hover handlers
   * el hover expande la opcion sobre la que esta el cursor y contrae la anterior
   */
  protected onSelected(index: number): void {
    if (this.expanded() === index) {
      return;
    }
    const option = this.resolvedOptions()[index];
    if (!option) {
      return;
    }
    this.expanded.set(index);
    this.selected.emit({ index, option });
  }
  /**
   * initials
   * devuelve las iniciales de la opcion, definidas o derivadas del label (maximo 2)
   */
  protected initials(option: F24ButtonSwitchOption): string {
    if (option.initials) {
      return option.initials;
    }
    return option.label
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }
}
