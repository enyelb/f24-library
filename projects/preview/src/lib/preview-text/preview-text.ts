import { Component, input } from '@angular/core';

@Component({
  selector: 'f24-preview-text',
  imports: [],
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
  readonly value = input.required<string>();
  /**
   * orientation
   */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
