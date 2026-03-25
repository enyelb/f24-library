import { Component, effect, inject, input, signal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

import { catchError, of } from 'rxjs';

/**
 * Note
 */
@Component({
  selector: 'f24-note',
  imports: [MatIconModule],
  templateUrl: './note.html',
  styleUrl: './note.scss',
  standalone: true
})
export class F24Note {
  /**
   * inputs
   */
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly type = input<'success' | 'warning' | 'error' | 'info' | 'none'>('none');
  readonly icon = input<string>('');

  /**
   * injects
   */
  protected readonly icons = inject(MatIconRegistry);

  /**
   * signals
   */
  protected readonly isMaterialIcon = signal(false);
  protected readonly isSVGIcon = signal(false);
  protected readonly defaultIcon = signal('');

  /**
   * constructor
   */
  constructor() {
    effect(() => {
      const icons = { success: 'check_circle', warning: 'warning', error: 'error', info: 'info', none: '' }
      if (this.type() in icons) {
        this.defaultIcon.set(icons[this.type()]);
        this.isMaterialIcon.set(true);
        this.isSVGIcon.set(false);
      }
    }, { debugName: 'F24Note' });
    effect(() => {
      const icon = this.icon();
      if (icon) {
        this.icons.getNamedSvgIcon(icon).pipe(catchError(() =>  of(null))).subscribe((svg) => {
          this.defaultIcon.set(icon);
          this.isMaterialIcon.set(svg === null);
          this.isSVGIcon.set( svg !== null);
        });
      }
    }, { debugName: 'F24Note' })
  }
}
