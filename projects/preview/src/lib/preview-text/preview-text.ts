import { Component, computed, input } from '@angular/core';

import { F24Copy } from "@f24/layout";

/**
 * F24PreviewText
 */
@Component({
  selector: 'f24-preview-text',
  imports: [F24Copy],
  templateUrl: './preview-text.html',
  styleUrl: './preview-text.scss',
  standalone: true
})
export class F24PreviewText {
  /**
   * label
   */
  readonly label = input<string>();
  /**
   * text
   */
  readonly value = input.required<string | undefined | null>();
  /**
   * copy
   */
  readonly copy = input<boolean | string>();
  /**
   * orientation
   */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  /**
   * copyText
   */
  protected readonly copyText = computed(() => {
    const value = this.value();
    const copy = this.copy();
    if (!value || !copy) {
      return undefined;
    }
    return typeof copy === 'string' ? copy : value
  });
}
