import { Component, computed, input, output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { F24Icon } from '@f24/layout';

import { F24ButtonIconSource, F24ButtonIconSourceParams } from './button-icon-source';

/**
 * F24ButtonIcon
 */
@Component({
  selector: 'f24-button-icon',
  imports: [MatButtonModule, F24Icon],
  templateUrl: './button-icon.html',
  styleUrl: './button-icon.scss',
})
export class F24ButtonIcon {

  /**
   * inputs
   */
  readonly source = input<F24ButtonIconSource>();
  readonly icon = input<F24ButtonIconSourceParams['icon']>();
  readonly iconSize = input<F24ButtonIconSourceParams['iconSize']>();
  readonly label = input<F24ButtonIconSourceParams['label']>();
  readonly tooltip = input<F24ButtonIconSourceParams['tooltip']>();
  readonly appearance = input<F24ButtonIconSourceParams['appearance']>();
  /**
   * outputs
   */
  readonly click = output();
  /**
   * signals resolved inputs
   */
  readonly resolvedIcon = computed(() => this.source()?.icon() ?? this.icon() ?? '');
  readonly resolvedLabel = computed(() => this.source()?.label() ?? this.label() ?? '');
  readonly resolvedIconSize = computed(() => this.source()?.iconSize() ?? this.iconSize() ?? 24);
  readonly resolvedTooltip = computed(() => this.source()?.tooltip() ?? this.tooltip() ?? '');
  readonly resolvedAppearance = computed(() => this.source()?.appearance() ?? this.appearance() ?? 'filled');
  
  /**
   * signals resolved outputs
   */
  readonly resolvedClick = () => {
    const sourceClick = this.source()?.click();
    if (sourceClick) {
      sourceClick();
    } 
    this.click.emit();
  }
}
