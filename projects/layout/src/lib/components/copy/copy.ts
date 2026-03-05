import { Component, input, signal } from '@angular/core';

import { ClipboardModule } from '@angular/cdk/clipboard';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * F24Copy
 */
@Component({
  selector: 'f24-copy',
  imports: [MatIconModule, MatButtonModule, ClipboardModule],
  templateUrl: './copy.html',
  styleUrl: './copy.scss',
})
export class F24Copy {
  /**
   * copy
   */
  readonly copy = input<string>();
  /**
   * text
   */
  readonly text = input<string>();
  /**
   * copied
   */
  protected readonly copied = signal(false);
  /**
   * copy
   */
  onCopy() {
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 3000);
  }
}
