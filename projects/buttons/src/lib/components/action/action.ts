import { Component, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * F24Action
 */
@Component({
  selector: 'f24-action',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './action.html',
  styleUrl: './action.scss',
})
export class F24Action {

  /**
   * show content actions
   */
  protected readonly show = signal(false);

  /**
   * toggle show content actions
   */
  toggleShow(): void {
    this.show.update(show => !show);
  }
}
