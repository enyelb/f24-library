import { Component, computed, input } from '@angular/core';

import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';

import { F24Container } from '@f24/layout';

import { F24FormSlideToggleSource, F24FormSlideToggleSourceParams } from './form-slide-toggle-source';

/**
 * F24FormSlideToggle
 */
@Component({
  selector: 'f24-form-slide-toggle',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    F24Container
  ],
  templateUrl: './form-slide-toggle.html',
  styleUrl: './form-slide-toggle.scss',
})
export class F24FormSlideToggle {
  /**
   * source 
   */
  readonly source = input<F24FormSlideToggleSource>();
  /**
   * inputs
   */
  readonly label = input<F24FormSlideToggleSourceParams['label']>();
  readonly labelPosition = input<F24FormSlideToggleSourceParams['labelPosition']>();
  readonly disable = input<F24FormSlideToggleSourceParams['disable']>();
  readonly form = input<F24FormSlideToggleSourceParams['form']>();

  /**
   * signals resolved
   */
  readonly resolvedLabel = computed(() => this.source()?.label() ?? this.label() ?? '');
  readonly resolvedLabelPosition = computed(() => this.source()?.labelPosition() ?? this.labelPosition() ?? 'before');
  readonly resolvedDisable = computed(() => this.source()?.disable() ?? this.disable() ?? false);
  readonly resolvedForm = computed(() => this.source()?.form() ?? this.form() ?? null);
  /**
   * onChange
   * @param change 
   * @returns 
   */
  protected onChange(change: MatSlideToggleChange) {
    const form = this.resolvedForm();
    if (!form) {
      return;
    }

    form().controlValue.update((old) => change.checked);
  }
}
